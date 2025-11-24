import { Handle, Position } from '@xyflow/react'
import {  MousePointer2 } from 'lucide-react'
import React from 'react'

function AgentNode({data}:any) {
  return (
    <div className='bg-white rounded-2xl p-2 px-4 border'>
        <div className='flex gap-2 items-center'>
            <MousePointer2 className='p-2 rounded-lg h-8 w-8 bg-green-100'/>
           <div className='flex flex-col'>  <h2>{data?.label}</h2>
            <p className='text-xs text-gray-500'>Agent</p></div>
            <Handle type='target' position={Position.Left}/>
            <Handle type='source' position={Position.Right} />
        </div>
    </div>
  )
}

export default AgentNode