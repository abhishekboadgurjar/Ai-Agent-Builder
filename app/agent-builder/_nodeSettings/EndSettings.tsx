import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type EndSettingsProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

function EndSettings({ selectedNode, updateFormData }: EndSettingsProps) {
  const [formData, setFormData] = useState({ schema: '' })

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings)
    }
  }, [selectedNode])

  const onSave = () => {
    updateFormData(formData)
    toast.success('Updated')
  }

  return (
    <div>
      <h2 className='font-bold'>End</h2>
      <p className='text-gray-500 mt-1'>Configure the final output schema</p>
      <div className='mt-2 space-y-2'>
        <Label>Output</Label>
        <Textarea
          placeholder='{name:string}'
          value={formData.schema}
          onChange={(e) => setFormData({ schema: e.target.value })}
        />
      </div>
      <Button className='w-full mt-5' onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default EndSettings