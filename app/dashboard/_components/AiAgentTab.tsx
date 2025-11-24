import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyAgents from './MyAgents'
import PublishedAgents from './PublishedAgents'

function AiAgentTab() {
  return (
    <div className='px-10 md:px-24 lg:px-32 mt-14'>
        <Tabs defaultValue="myagent" className="w-full">
  <TabsList>
    <TabsTrigger value="myagent">My Agents</TabsTrigger>
    <TabsTrigger value="published">Published Agents</TabsTrigger>
    <TabsTrigger value="template">Templates</TabsTrigger>
  </TabsList>
  <TabsContent value="myagent"><MyAgents/></TabsContent>
  <TabsContent value="published"><PublishedAgents/></TabsContent>
  <TabsContent value="template">Templates</TabsContent>
</Tabs>
    </div>
  )
}

export default AiAgentTab