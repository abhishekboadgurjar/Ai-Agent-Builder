import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type ApiAgentSettingsProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

const ApiAgentSettings: React.FC<ApiAgentSettingsProps> = ({ selectedNode, updateFormData }) => {
  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    method: 'GET',
    headers: '',
    body: '',
  })

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData((prev) => ({
        ...prev,
        ...selectedNode.data.settings,
      }))
    }
  }, [selectedNode])

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const onSave = () => {
    updateFormData(formData)
    toast.success('API settings updated!')
  }

  return (
    <div>
      <h2 className='font-bold'>API</h2>
      <p className='text-gray-500 mt-1'>Call an external API inside the workflow</p>

      <div className='mt-3 space-y-1'>
        <Label>Name</Label>
        <Input
          placeholder='Step name'
          value={formData.name}
          onChange={(event) => handleChange('name', event.target.value)}
        />
      </div>

      <div className='mt-3 space-y-1'>
        <Label>Endpoint</Label>
        <Input
          placeholder='https://api.example.com'
          value={formData.endpoint}
          onChange={(event) => handleChange('endpoint', event.target.value)}
        />
      </div>

      <div className='mt-3 space-y-1'>
        <Label>Method</Label>
        <Select
          value={formData.method}
          onValueChange={(value) => handleChange('method', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder='GET' />
          </SelectTrigger>
          <SelectContent>
            {httpMethods.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='mt-3 space-y-1'>
        <Label>Headers (JSON)</Label>
        <Textarea
          placeholder='{"Authorization": "Bearer ..."}'
          value={formData.headers}
          onChange={(event) => handleChange('headers', event.target.value)}
          rows={3}
        />
      </div>

      <div className='mt-3 space-y-1'>
        <Label>Body</Label>
        <Textarea
          placeholder='{ "key": "value" }'
          value={formData.body}
          onChange={(event) => handleChange('body', event.target.value)}
          rows={4}
        />
      </div>

      <Button className='w-full mt-5' onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default ApiAgentSettings