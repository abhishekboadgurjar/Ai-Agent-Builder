import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

type WhileSettingsProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

function WhileSettings({ selectedNode, updateFormData }: WhileSettingsProps) {

  const [formData, setFormData] = useState({ whileCondition: '' })

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings)
    }
  }, [selectedNode])

  const onSave = () => {
    updateFormData(formData)
    toast.success('Settings Updated!')
  }

  return (
    <div>
      <h2 className='font-bold'>While</h2>
      <p className='text-gray-500 mt-1'>Loop your logic</p>
      <div>
        <Label>While</Label>
        <Input
          placeholder='Enter condition e.g output=any condition'
          value={formData.whileCondition}
          className='mt-2'
          onChange={(e) => setFormData({ whileCondition: e.target.value })}
        />
      </div>
      <Button className='w-full mt-5' onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default WhileSettings;