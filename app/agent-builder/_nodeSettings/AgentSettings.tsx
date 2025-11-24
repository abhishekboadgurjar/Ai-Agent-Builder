import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

type AgentSettingsProps = {
  selectedNode: any
  updateFormData: (data: any) => void
}

function AgentSettings({ selectedNode, updateFormData }: AgentSettingsProps) {

  const [formData, setFormData] = useState({
    name: '',
    instruction: '',
    includeHistory: true,
    model: 'gemini-flash-1.5',
    output: 'Text',
    schema: ''
  })

  useEffect(() => {
    if (selectedNode?.data?.settings) {
      setFormData((prev) => ({
        ...prev,
        ...selectedNode.data.settings,
      }))
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
    toast.success("Settings updated!")
  }

  return (
    <div>
      <h2 className='font-bold'>Agent</h2>
      <p className='text-gray-500 mt-2'>Call the AI model with your instruction</p>

      <div className='mt-3 space-y-1'>
        <Label>Name</Label>
        <Input
          placeholder='Agent Name'
          value={formData.name}
          onChange={(event) => handleChange('name', event.target.value)}
        />
      </div>

      <div className='mt-3 space-y-1'>
        <Label>Instruction</Label>
        <Textarea
          placeholder='Instruction'
          value={formData.instruction}
          onChange={(event) => handleChange('instruction', event.target.value)}
        />
        <h2 className='text-sm p-1 flex gap-2 items-center'>Add Context</h2>
      </div>

      <div className='mt-3 space-y-1 flex justify-between items-center '>
        <Label>Include Chat History</Label>
        <Switch
          checked={formData.includeHistory}
          onCheckedChange={(checked) => handleChange('includeHistory', checked)}
        />
      </div>

      <div className='mt-3 flex justify-between items-center'>
        <Label>Model</Label>
        <Select
          value={formData.model}
          onValueChange={(value) => handleChange('model', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="gemini-flash-1.5" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='gemini-flash-1.5'>
              Gemini Flash 1.5
            </SelectItem>
            <SelectItem value='gemini-pro-1.5'>
              Gemini Pro 1.5
            </SelectItem>
            <SelectItem value='gemini-pro-2.0'>
              Gemini Pro 2.0
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='mt-3 space-y-2'>
        <Label>Output Format</Label>
        <Tabs
          defaultValue={formData.output}
          className="w-[400px]"
          onValueChange={(value) => handleChange('output', value)}
        >
          <TabsList>
            <TabsTrigger value="Text">Text</TabsTrigger>
            <TabsTrigger value="Json">Json</TabsTrigger>
          </TabsList>
          <TabsContent value="Text">
            <h2 className='text-sm text-gray-500'>Output will be Text</h2>
          </TabsContent>
          <TabsContent value="Json">
            <Label className='text-sm text-gray-500'>Enter Json Schema</Label>
            <Textarea
              placeholder='{title:string}'
              value={formData.schema}
              onChange={(event) => handleChange('schema', event.target.value)}
              className='max-w-[300px] mt-1'
            />
          </TabsContent>
        </Tabs>
      </div>

      <Button className='w-full mt-5' onClick={onSave}>
        Save
      </Button>
    </div>
  )
}

export default AgentSettings