"use client";

import { Button } from '@/components/ui/button'
import { Agent } from '@/types/AgentType'
import { ChevronLeft, Code2, Play, Globe, Globe2, } from 'lucide-react'
import React, { useState } from 'react'
import Link from 'next/link'
import { useMutation, useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

type Props = {
  agentDetail?: Agent,
  previewHeader?: boolean,
  agentId?: string,
  onAgentUpdate?: () => void,
}

function Header({ agentDetail, previewHeader = false, agentId, onAgentUpdate }: Props) {
  const [isPublishing, setIsPublishing] = useState(false)
  const publishAgent = useMutation(api.agent.PublishAgent)
  const convex = useConvex()
  const currentAgentId = agentId || agentDetail?.agentId

  const builderPath = currentAgentId
    ? `/agent-builder/${currentAgentId}`
    : undefined

  const previewPath = currentAgentId
    ? `/agent-builder/${currentAgentId}/preview`
    : undefined

  const handlePublish = async () => {
    if (!agentDetail?._id) {
      toast.error("Agent details not available")
      return
    }

    const newPublishedStatus = !agentDetail.published

    try {
      setIsPublishing(true)
      await publishAgent({
        id: agentDetail._id,
        published: newPublishedStatus
      })

      toast.success(
        newPublishedStatus 
          ? "Agent published successfully!" 
          : "Agent unpublished successfully!"
      )
      
      // Refresh agent details in parent component
      if (onAgentUpdate) {
        onAgentUpdate()
      }
    } catch (error: any) {
      console.error("Error publishing agent:", error)
      toast.error(error.message || "Failed to publish agent")
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="w-full p-3 flex items-center justify-between border-b">
      <div className="flex gap-2 items-center">
        <Link href="/dashboard">
          <ChevronLeft className="h-8 w-8 cursor-pointer hover:opacity-70" />
        </Link>
        <h2 className="text-xl">{agentDetail?.name || "Agent"}</h2>
        {agentDetail?.published && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            Published
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost">
          <Code2 className="h-4 w-4" /> Code
        </Button>

        {!previewHeader ? (
          previewPath ? (
            <Button asChild>
              <Link href={previewPath}>
                <Play className="h-4 w-4" /> Preview
              </Link>
            </Button>
          ) : (
            <Button disabled>
              <Play className="h-4 w-4" /> Preview
            </Button>
          )
        ) : builderPath ? (
          <Button variant="outline" asChild>
            <Link href={builderPath}>
              <Play className="h-4 w-4" /> Close Preview
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <Play className="h-4 w-4" /> Close Preview
          </Button>
        )}

        <Button 
          onClick={handlePublish}
          disabled={isPublishing || !agentDetail?._id}
          variant={agentDetail?.published ? "outline" : "default"}
        >
          {isPublishing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
              {agentDetail?.published ? "Unpublishing..." : "Publishing..."}
            </>
          ) : (
            <>
              {agentDetail?.published ? (
                <>
                  <Globe2 className="h-4 w-4 mr-2" /> Unpublish
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" /> Publish
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default Header
