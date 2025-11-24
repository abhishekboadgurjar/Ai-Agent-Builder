import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

type IfElseSettingsProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

function IfElseSettings({ selectedNode, updateFormData }: IfElseSettingsProps) {

  const [formData, setFormData] = useState({ ifCondition: '' })

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
      <h2 className='font-bold'>If / Else</h2>
      <p className='text-gray-500 mt-1'>Create conditions to branch</p>
      <div>
        <Label>If</Label>
        <Input
          placeholder='Enter condition e.g output=any condition'
          value={formData.ifCondition}
          className='mt-2'
          onChange={(e) => setFormData({ ifCondition: e.target.value })}
        />
      </div>
      <Button className='w-full mt-5' onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default IfElseSettings;