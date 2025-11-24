import { Handle, Position } from '@xyflow/react'
import { Square } from 'lucide-react'
import React from 'react'

function EndNode({data}:any) {
  return (
      <div className='bg-white rounded-2xl p-2 px-4 border'>
        <div className='flex gap-2 items-center'>
            <Square className='p-2 rounded-lg h-8 w-8 '
            style={{
                backgroundColor:data?.bgColor
            }}/>
            <h2>End</h2>
            <Handle type='target' position={Position.Left} />
        </div>
    </div>
  )
}

export default EndNode