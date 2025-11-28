"use client";

import React, { useEffect, useState } from "react";
import Header from "../../_components/Header";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentType";
import { useParams } from "next/navigation";
import { ReactFlow, Background, BackgroundVariant } from "@xyflow/react";
import { nodeTypes } from "../../_components/NodeTypes";
import "@xyflow/react/dist/style.css";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { toast } from "sonner";
import { ChatUi } from "./_components/ChatUi";
export default function PreviewAgent() {
  const convex = useConvex();
  const { agentId } = useParams();
  const [agentDetail, setAgentDetail] = useState<Agent | null>(null);
  const [flowConfig, setFlowConfig] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const updateAgentToolConfig = useMutation(api.agent.UpdateAgentToolConfig)


  useEffect(() => {
    const load = async () => {
      const result = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string,
      });
      setAgentDetail(result);
    };
    load();
  }, [convex, agentId]);


  useEffect(() => {
    if (agentDetail) {
      GenerateWorkflow();
    }
  }, [agentDetail])

  const GenerateWorkflow = () => {
    // 🧩 Build Edge Map (for quick lookup)
    const edgeMap = agentDetail?.edges?.reduce((acc: any, edge: any) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge);
      return acc;
    }, {});

    // 🔄 Build Flow Configuration
    const flow = agentDetail?.nodes?.map((node: any) => {
      const connectedEdges = edgeMap[node.id] || [];
      let next: any = null;

      switch (node.type) {
        // 🧭 Conditional branching
        case "IfElseNode": {
          const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
          const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");

          next = {
            if: ifEdge?.target || null,
            else: elseEdge?.target || null,
          };
          break;
        }

        // 🧠 Agent or AI Node
        case "AgentNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }

        // 🔗 API Call Node
        case "ApiNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // ✅ User Approval Node (manual checkpoint)
        case "UserApprovalNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 🚀 Start Node
        case "StartNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        // 🏁 End Node
        case "EndNode": {
          next = null; // No next node
          break;
        }

        // 🔧 Default handling
        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }
      }

      return {
        id: node.id,
        type: node.type,
        label: node.data?.label || node.type,
        settings: node.data?.settings || {},
        next,
      };
    });

    // 🎯 Identify Start Node
    const startNode = agentDetail?.nodes?.find((n: any) => n.type === "StartNode");

    // 🧱 Final Config
    const config = {
      startNode: startNode?.id || null,
      flow,
    };

    setFlowConfig(config)

    console.log("✅ Generated Workflow Config:", JSON.stringify(config));
    // setConfig(config);

  }

  const GenerateAgentToolConfig = async () => {
    if (!flowConfig) {
      toast.error("Flow configuration is not ready yet.");
      return;
    }
    if (!agentDetail?._id) {
      toast.error("Agent details missing.");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post('/api/generate-agent-tool-config', {
        jsonConfig: flowConfig
      });

      await updateAgentToolConfig({
        id: agentDetail?._id as any,
        agentToolConfig: result.data
      });

      const updatedAgent = await convex.query(api.agent.GetAgentById, {
        agentId: agentId as string,
      });
      setAgentDetail(updatedAgent);

      toast.success("Agent tool configuration generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate agent tool config.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        previewHeader={true}
        agentDetail={agentDetail ?? undefined}
        agentId={agentId as string}
        onAgentUpdate={async () => {
          const result = await convex.query(api.agent.GetAgentById, {
            agentId: agentId as string,
          });
          setAgentDetail(result);
        }}
      />
      <div className="grid grid-cols-4 ">
        <div className="col-span-3 p-5 border rounded-2xl m-5">
          <h2>Preview</h2>
          <div style={{ width: "100%", height: "100vh" }}>
            <ReactFlow
              nodes={agentDetail?.nodes || []}
              edges={agentDetail?.edges || []}
              fitView
              nodeTypes={nodeTypes}
              draggable={false}
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
        <div className="col-span-1 border rounded-2xl m-5">
          {agentDetail?.agentToolConfig ? (
            <ChatUi
              GenerateAgentToolConfig={GenerateAgentToolConfig}
              loading={loading}
              agentDetail={agentDetail}
            />
          ) : (
            <div className="flex flex-col gap-6 items-center justify-center h-full p-4 text-center">
              <Button
                className={loading ? "animate-pulse" : ""}
                onClick={GenerateAgentToolConfig}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCwIcon className="animate-spin mr-2" />
                ) : (
                  <RefreshCwIcon className="mr-2" />
                )}
                Reboot Agent
              </Button>
              <p className="text-sm text-gray-500">
                Generate agent tool configuration to start chatting
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
