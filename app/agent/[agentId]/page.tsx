"use client";

import React, { useEffect, useState } from "react";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Agent } from "@/types/AgentType";
import { useParams } from "next/navigation";
import { ChatUi } from "@/app/agent-builder/[agentId]/preview/_components/ChatUi";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PublicAgentPage() {
  const convex = useConvex();
  const { agentId } = useParams();
  const [agentDetail, setAgentDetail] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      try {
        const result = await convex.query(api.agent.GetAgentById, {
          agentId: agentId as string,
        });

        if (!result) {
          setAgentDetail(null);
          return;
        }

        if (!result.published) {
          setAgentDetail(null);
          return;
        }

        setAgentDetail(result);
      } catch (error) {
        console.error("Error loading agent:", error);
        setAgentDetail(null);
      } finally {
        setLoading(false);
      }
    };

    loadAgent();
  }, [convex, agentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent...</p>
        </div>
      </div>
    );
  }

  if (!agentDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Agent Not Found</h1>
          <p className="text-gray-600 mb-4">
            This agent doesn&apos;t exist or hasn&apos;t been published yet.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4 border-b bg-white">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{agentDetail.name}</h1>
              <p className="text-sm text-gray-500">Published Agent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {agentDetail.agentToolConfig ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <ChatUi
              GenerateAgentToolConfig={() => { }}
              loading={false}
              agentDetail={agentDetail}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <p className="text-gray-600">
              This agent is not configured yet. Please contact the agent owner.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

