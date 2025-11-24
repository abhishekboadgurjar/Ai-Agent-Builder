import React, { useContext } from 'react'
import { WorkflowContext } from '@/app/context/WorkflowContext'
import AgentSettings from '../_nodeSettings/AgentSettings'
import EndSettings from '../_nodeSettings/EndSettings'
import WhileSettings from '../_nodeSettings/WhileSettings'
import UserApproval from '../_nodeSettings/UserApproval'
import ApiAgentSettings from '../_nodeSettings/ApiSettings'
import IfElseSettings from '../_nodeSettings/IfElseSettings'

function SettingPanel() {
  const { selectedNode, setAddedNodes } = useContext(WorkflowContext)

  const onUpdateNodeData = (formData: any) => {
    if (!selectedNode) return
    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode.data,
        label: formData.name ?? selectedNode.data?.label,
        settings: formData,
      },
    }

    setAddedNodes((prevNodes: any) =>
      prevNodes.map((node: any) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    )
  }

  let content: React.ReactNode = <p className="text-gray-500 text-sm">Select a node to configure its settings.</p>

  switch (selectedNode?.type) {
    case 'AgentNode':
      content = (
        <AgentSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
    case 'EndNode':
      content = (
        <EndSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
    case 'IfElseNode':
      content = (
        <IfElseSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
    case 'WhileNode':
      content = (
        <WhileSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
    case 'UserApprovalNode':
      content = (
        <UserApproval
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
    case 'ApiNode':
      content = (
        <ApiAgentSettings
          selectedNode={selectedNode}
          updateFormData={onUpdateNodeData}
        />
      )
      break
  }

  return (
    <div className="p-5 bg-white  rounded-2xl w-[350px] shadow">
      {content}
    </div>
  )
}

export default SettingPanel;
