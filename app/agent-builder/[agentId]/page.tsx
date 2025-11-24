
// "use client"
// import { useState, useCallback, useContext, useEffect } from 'react';
// import Header from '../_components/Header'
// import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Controls, ReactFlowProvider, Panel } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import StartNode from '../_components/StartNode';
// import AgentNode from '../_components/AgentNode';
// import AgentToolsPanel from '../_components/AgentToolsPanel';
// import { WorkflowContext } from '@/app/context/WorkflowContext';
// import { useConvex, useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { useParams } from 'next/navigation';
// import { Agent } from '@/public/AgentType';
// import { Button } from '@/components/ui/button';
// import { Save } from 'lucide-react';
// import { toast } from 'sonner';

// //  const initialNodes = [
// //   { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' },type:'StartNode' },
// //   { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' },type:'AgentNode' },
// // ];
// // const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
// const nodeTypes = {
//   StartNode: StartNode,
//   AgentNode:AgentNode
// };
// function AgentBuilder() {
//      const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//  const {agentId}=useParams();
  
//       const {addedNodes,setAddedNodes,nodeEdges,setNodeEdges}=useContext(WorkflowContext)

// const convex=useConvex();
// const updateAgentDetail=useMutation(api.agent.UpdateAgentDetail)
// const [agentDetail,setAgentDetail]=useState<Agent>();
// useEffect(()=>{
// GetAgentDetail();
// },[])

// const GetAgentDetail=async()=>{
//     const result=await convex.query(api.agent.GetAgentById,{
//         agentId:agentId as string
//     });
//     setAgentDetail(result);
// }

// useEffect(()=>{
//     if(agentDetail){
// setNodes(agentDetail.nodes);
// setEdges(agentDetail.edges);
// setAddedNodes(agentDetail.nodes);
// setNodeEdges(agentDetail.edges);
//     }
// //     else{
// //    addedNodes && setNodes(addedNodes);
// //     nodeEdges&& setEdges(nodeEdges);
// //     }
 
// },[agentDetail])


// useEffect(()=>{
//     addedNodes&& setNodes(addedNodes);
// },[addedNodes])


// useEffect(()=>{
//     edges&&setNodeEdges(edges);
//     edges&&console.log(edges)
// })

// // useEffect(()=>{
// // nodes||nodes && SaveNodesAndEdges()
// // },[nodes,edges])

// const SaveNodesAndEdges=async ()=>{
// const result =await updateAgentDetail({
//     //@ts-ignore
//     id:agentDetail?._id,
//     edges:nodeEdges,
//     nodes:addedNodes
// });
// console.log(result);
// toast.success('Saved')
// }
//   const onNodesChange = useCallback(
//     (changes:any) => setNodes((nodesSnapshot) => 
//         { const updated=applyNodeChanges(changes, nodesSnapshot)
//             setAddedNodes(updated);
//             return updated;
//         }),
//     [setAddedNodes],
//   );
//   const onEdgesChange = useCallback(
//     (changes:any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
//     [],
//   );
//   const onConnect = useCallback(
//     //@ts-ignore
//     (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
//     [],
//   );
//   return (
//     <div><Header agentDetail={agentDetail}/>
//         <div style={{ width: '100vw', height: '100vh' }}>
//             <ReactFlowProvider>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         nodeTypes={nodeTypes}
//       />
//       <MiniMap/>
//       <Controls/>
//         {/* @ts-ignore */}
//     <Background variant='dots' gap={12} size={1}/>
//     <Panel position='top-left'>
//    <AgentToolsPanel/>
//     </Panel>
//     <Panel position="top right">
//         Settings
//     </Panel>
//     <Panel position='bottom-center'>
// <Button onClick={SaveNodesAndEdges}>
//  <Save/>   Save
// </Button>
//     </Panel>
//     </ReactFlowProvider>
//     </div>
// </div>
//   )
// }

// export default AgentBuilder



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

export const nodeTypes = {
  StartNode: StartNode,
  AgentNode: AgentNode,
  EndNode:EndNode,
  IfElseNode:IfElseNode,
  WhileNode:WhileNode,
  UserApprovalNode:UserApprovalNode,
  ApiNode:ApiNode,
};

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
    selectedNode,setSelectedNode,
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

      <div  style={{ width: "100vw", height: "100vh" }}>
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

        <Panel position="right-center">
          <SettingPanel/>
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
