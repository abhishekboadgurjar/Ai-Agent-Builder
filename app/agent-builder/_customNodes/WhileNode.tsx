import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { Repeat } from 'lucide-react'
import React from 'react'

function WhileNode({data}:any) {
  return (
     <div className='bg-white rounded-2xl p-2 px-4 border'>
        <div className='flex gap-2 item-center'>
            <Repeat className='p-2 rounded-lg h-8 w-8 '
            style={{
                backgroundColor:data?.bgColor
            }}
            />
            <h2>While</h2>
        </div>
        <div className='max-w-[140px] flex flex-col gap-2 bg-white mt-2'>
            <Input placeholder='While Condition' className='text-sm bg-white' disabled/>
        </div>
        <Handle type='target' position={Position.Left}/>
        <Handle type='source' position={Position.Right} />
    
    </div>
  )
}

export default WhileNode