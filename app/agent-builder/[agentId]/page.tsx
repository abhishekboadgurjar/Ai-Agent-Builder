"use client";
import { useState, useCallback, useContext, useEffect } from "react";
import Header from "../_components/Header";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  MiniMap,
  Controls,
  Panel,
  OnSelectionChangeParams,
  Node,
  Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import StartNode from "../_customNodes/StartNode";
import AgentNode from "../_customNodes/AgentNode";
import AgentToolsPanel from "../_components/AgentToolsPanel";

import { WorkflowContext } from "@/app/context/WorkflowContext";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Agent } from "@/types/AgentType";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import EndNode from "../_customNodes/EndNode";
import IfElseNode from "../_customNodes/IfElseNode";
import WhileNode from "../_customNodes/WhileNode";
import UserApprovalNode from "../_customNodes/UserApprovalNode";
import ApiNode from "../_customNodes/ApiNode";
import SettingPanel from "../_components/SettingPanel";

import { nodeTypes } from "../_components/NodeTypes";

const defaultStartNode: Node = {
  id: 'start',
  position: { x: 0, y: 0 },
  data: { label: 'Start' },
  type: 'StartNode',
};

function AgentBuilder() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const { agentId } = useParams();

  const {
    addedNodes,
    setAddedNodes,
    nodeEdges,
    setNodeEdges,
    selectedNode, setSelectedNode,
  } = useContext(WorkflowContext);

  const convex = useConvex();
  const updateAgentDetail = useMutation(api.agent.UpdateAgentDetail);

  const [agentDetail, setAgentDetail] = useState<Agent | null>(null);

  const ensureStartNode = useCallback(
    (list: Node[]) => {
      if (!list || list.length === 0) {
        return [defaultStartNode];
      }

      const hasStart = list.some((node) => node.type === 'StartNode');
      return hasStart ? list : [defaultStartNode, ...list];
    },
    []
  );

  // ---------------- Fetch Agent Details ----------------
  const GetAgentDetail = async () => {
    const result = await convex.query(api.agent.GetAgentById, {
      agentId: agentId as string,
    });
    setAgentDetail(result);
  };

  useEffect(() => {
    GetAgentDetail();
  }, []);

  // ---------------- Sync From DB → Local State ----------------
  useEffect(() => {
    if (!agentDetail) return;

    const nodesFromDb = ensureStartNode(agentDetail.nodes || []);

    setNodes(nodesFromDb);
    setEdges(agentDetail.edges || []);

    setAddedNodes(nodesFromDb);
    setNodeEdges(agentDetail.edges || []);
  }, [agentDetail, ensureStartNode, setAddedNodes, setNodeEdges]);

  // ---------------- Sync: Context → RF State ----------------
  useEffect(() => {
    if (addedNodes) setNodes(ensureStartNode(addedNodes));
  }, [addedNodes, ensureStartNode]);

  useEffect(() => {
    if (edges) setNodeEdges(edges);
  }, [edges]);

  // ---------------- Saving to Convex ----------------
  const SaveNodesAndEdges = async () => {
    if (!agentDetail?._id) return;

    const result = await updateAgentDetail({
      id: agentDetail._id,
      edges: nodeEdges,
      nodes: addedNodes,
    });

    console.log(result);
    toast.success("Saved");
  };

  // ---------------- React Flow Handlers ----------------
  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((snapshot) => {
        const updated = applyNodeChanges(changes, snapshot);
        setTimeout(() => setAddedNodes(updated), 0);
        return updated;
      }),
    [setAddedNodes]
  );

  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((snapshot) => applyEdgeChanges(changes, snapshot)),
    []
  );

  const onConnect = useCallback(
    (params: any) =>
      setEdges((snapshot) => addEdge(params, snapshot)),
    []
  );

  const onNodeSelect = useCallback(
    ({ nodes }: OnSelectionChangeParams) => {
      setSelectedNode(nodes[0] || null);
    },
    [setSelectedNode]
  )
  return (
    <div>
      <Header
        agentDetail={agentDetail ?? undefined}
        agentId={agentId as string}
        onAgentUpdate={GetAgentDetail}
      />

      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          onSelectionChange={onNodeSelect}
        />

        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        <Panel position="top-left">
          <AgentToolsPanel />
        </Panel>

        <Panel position="top-right">
          <SettingPanel />
        </Panel>

        <Panel position="bottom-center">
          <Button onClick={SaveNodesAndEdges}>
            <Save /> Save
          </Button>
        </Panel>
      </div>
    </div>
  );
}

export default AgentBuilder;
