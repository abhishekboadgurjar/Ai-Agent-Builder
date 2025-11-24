import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type UserApprovalProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

function UserApproval({ selectedNode, updateFormData }: UserApprovalProps) {

  const [formData, setFormData] = useState({ name: '', message: '' })

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData(selectedNode.data.settings)
    }
  }, [selectedNode])

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const onSave = () => {
    updateFormData(formData)
    toast.success('Settings Updated!')
  }

  return (
    <div>
      <h2 className='font-bold'>User Approval</h2>
      <p className='text-gray-500 mt-1'>Pause for a human to approve or reject a step</p>
      <div>
        <div className='mt-3 space-y-1'>
          <Label>Name</Label>
          <Input
            placeholder='Agent Name'
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
          />
        </div>
        <div className='mt-3 space-y-1'>
          <Label>Message</Label>
          <Textarea
            value={formData.message}
            placeholder='Describe the message to show to the user'
            onChange={(event) => handleChange('message', event.target.value)}
          />
          <h2 className='text-sm p-1 flex gap-2 items-center'>Add Context</h2>
        </div>
        <button
          className='w-full mt-5 bg-primary text-white rounded-md py-2 text-sm'
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default UserApproval