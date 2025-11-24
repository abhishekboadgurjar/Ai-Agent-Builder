import { NextResponse } from "next/server";
import { openai } from "@/config/OpenAi";

const PROMPT = `from this flow, Generate a agent instruction prompt with all details along with
tools with all setting info in JSON format. Do not add any extra text just written JSON data. make sure to mentioned paramters depends on Get or post reuqest. 
 only:{ systemPrompt:'',primaryAgentName:'', "agents": [ { "id": "agent-id", "name": "", "model": "", "includeHistory": true|false, 
 "output": "", "tools": ["toold-id"], "instruction": "" }, ],
  "tools": [ { "id": "id", "name": "", "description": "", "method": "GET"|'POST',
   "url": "", "includeApiKey": true, "apiKey": "", "parameters": { "key": "dataType" }, "usage": [ ], "assignedAgent": "" } ]}`;

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const { jsonConfig } = await request.json();

    if (!jsonConfig) {
      return NextResponse.json(
        { error: "Missing jsonConfig payload" },
        { status: 400 }
      );
    }

    const openAiKey = process.env.OPENAI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!openAiKey && !openRouterKey) {
      return NextResponse.json(
        {
          warning:
            "No model provider API key set. Returning mock agent tool configuration.",
          mock: true,
          config: jsonConfig,
        },
        { status: 200 }
      );
    }

    let outputText = "";

    if (openAiKey) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: JSON.stringify(jsonConfig) + PROMPT,
          },
        ],
      });
      outputText = response.choices[0]?.message?.content ?? "";
    } else if (openRouterKey) {
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openRouterKey}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: JSON.stringify(jsonConfig) + PROMPT,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { error: "OpenRouter request failed", details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      outputText = data.choices?.[0]?.message?.content ?? "";
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(
        outputText.replace("```json", "").replace("```", "")
      );
    } catch (err) {
      console.error("Failed to parse JSON from OpenAI response", err, outputText);
      return NextResponse.json(
        { error: "Failed to parse JSON from AI response" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedJson);
  } catch (error) {
    console.error("Failed to generate agent tool config", error);
    return NextResponse.json(
      { error: "Failed to generate agent tool config" },
      { status: 500 }
    );
  }
}