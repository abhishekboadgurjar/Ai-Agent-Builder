import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAi";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface Agent {
  id: string;
  name: string;
  model: string;
  instruction: string;
  tools?: string[];
  includeHistory?: boolean;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  method: "GET" | "POST";
  url: string;
  parameters?: Record<string, any>;
  apiKey?: string;
  includeApiKey?: boolean;
}

interface AgentToolConfig {
  systemPrompt?: string;
  primaryAgentName?: string;
  agents: Agent[];
  tools: Tool[];
}

// Execute a tool call
async function executeTool(tool: Tool, parameters: Record<string, any>): Promise<any> {
  try {
    const url = new URL(tool.url);
    
    // Replace URL parameters if needed
    Object.keys(parameters).forEach(key => {
      url.pathname = url.pathname.replace(`:${key}`, parameters[key]);
      url.searchParams.set(key, parameters[key]);
    });

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (tool.includeApiKey && tool.apiKey) {
      headers["Authorization"] = `Bearer ${tool.apiKey}`;
    }

    const options: RequestInit = {
      method: tool.method,
      headers,
    };

    if (tool.method === "POST" && parameters) {
      options.body = JSON.stringify(parameters);
    }

    const response = await fetch(url.toString(), options);
    return await response.json();
  } catch (error) {
    console.error(`Error executing tool ${tool.name}:`, error);
    return { error: `Failed to execute tool: ${error}` };
  }
}

// Execute agent workflow
async function executeAgentWorkflow(
  config: AgentToolConfig,
  input: string,
  conversationHistory: Message[] = []
): Promise<string> {
  const primaryAgent = config.agents.find(
    (a) => a.name === config.primaryAgentName || a.id === config.agents[0]?.id
  );

  if (!primaryAgent) {
    throw new Error("Primary agent not found");
  }

  // Build messages for the agent
  const messages: Message[] = [];

  if (config.systemPrompt) {
    messages.push({
      role: "system",
      content: config.systemPrompt,
    });
  }

  if (primaryAgent.instruction) {
    messages.push({
      role: "system",
      content: primaryAgent.instruction,
    });
  }

  // Include conversation history if enabled
  if (primaryAgent.includeHistory && conversationHistory.length > 0) {
    messages.push(...conversationHistory);
  }

  // Add current user input
  messages.push({
    role: "user",
    content: input,
  });

  // Get available tools for this agent
  const availableTools = config.tools.filter(
    (tool) => !primaryAgent.tools || primaryAgent.tools.includes(tool.id)
  );

  // Prepare function definitions for OpenAI
  const functions = availableTools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "object",
        properties: Object.entries(tool.parameters || {}).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              type: typeof value === "string" ? "string" : typeof value,
              description: `Parameter ${key}`,
            };
            return acc;
          },
          {} as Record<string, any>
        ),
        required: [],
      },
    },
  }));

  const openAiKey = process.env.OPENAI_API_KEY;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!openAiKey && !openRouterKey) {
    return "API key not configured. Please set OPENAI_API_KEY or OPENROUTER_API_KEY.";
  }

  let response: any;
  const toolCalls: any[] = [];

  // Make initial API call
  if (openAiKey) {
    response = await openai.chat.completions.create({
      model: primaryAgent.model || "gpt-4o-mini",
      messages: messages as any,
      tools: functions.length > 0 ? functions : undefined,
      tool_choice: functions.length > 0 ? "auto" : undefined,
    });
  } else if (openRouterKey) {
    const res = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterKey}`,
      },
      body: JSON.stringify({
        model: primaryAgent.model || "openai/gpt-4o-mini",
        messages: messages as any,
        tools: functions.length > 0 ? functions : undefined,
        tool_choice: functions.length > 0 ? "auto" : undefined,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenRouter request failed: ${errorText}`);
    }

    response = await res.json();
  }

  const assistantMessage = response.choices?.[0]?.message;
  let finalResponse = assistantMessage?.content || "";

  // Handle tool calls if any
  if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
    const toolCallMessages: any[] = [
      {
        role: "assistant",
        content: assistantMessage.content || "",
        tool_calls: assistantMessage.tool_calls,
      },
    ];

    // Execute all tool calls
    for (const toolCall of assistantMessage.tool_calls) {
      const tool = availableTools.find((t) => t.name === toolCall.function.name);
      if (tool) {
        const parameters = JSON.parse(toolCall.function.arguments || "{}");
        const toolResult = await executeTool(tool, parameters);

        toolCallMessages.push({
          role: "tool",
          content: JSON.stringify(toolResult),
          tool_call_id: toolCall.id,
        });
      }
    }

    // Get final response after tool execution
    const finalMessages = [...messages, ...toolCallMessages];

    if (openAiKey) {
      const finalResponseData = await openai.chat.completions.create({
        model: primaryAgent.model || "gpt-4o-mini",
        messages: finalMessages as any,
      });
      finalResponse = finalResponseData.choices[0]?.message?.content || finalResponse;
    } else if (openRouterKey) {
      const finalRes = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({
          model: primaryAgent.model || "openai/gpt-4o-mini",
          messages: finalMessages as any,
        }),
      });

      if (finalRes.ok) {
        const finalData = await finalRes.json();
        finalResponse = finalData.choices[0]?.message?.content || finalResponse;
      }
    }
  }

  return finalResponse;
}

export async function POST(req: NextRequest) {
  try {
    const { input, tools, agents, conversationId, agentToolConfig } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    if (!agentToolConfig) {
      return NextResponse.json(
        { error: "Agent tool configuration is required" },
        { status: 400 }
      );
    }

    // Execute the agent workflow
    const response = await executeAgentWorkflow(agentToolConfig, input);

    return NextResponse.json({
      response,
      conversationId: conversationId || `conv_${Date.now()}`,
    });
  } catch (error: any) {
    console.error("Error in agent chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process chat request" },
      { status: 500 }
    );
  }
}