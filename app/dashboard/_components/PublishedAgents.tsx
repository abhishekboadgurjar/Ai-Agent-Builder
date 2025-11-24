"use client"
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { Globe } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import moment from "moment"
import Link from 'next/link';
import { Agent } from '@/types/AgentType';

function PublishedAgents() {
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const convex = useConvex()

    useEffect(() => {
        GetPublishedAgents()
    }, [])

    const GetPublishedAgents = async () => {
        const result = await convex.query(api.agent.GetPublishedAgents, {})
        console.log(result);
        setAgentList(result || []);
    }

    return (
        <div className='w-full mt-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
                {agentList.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No published agents yet.</p>
                    </div>
                ) : (
                    agentList.map((agent, index) => (
                        <Link 
                            href={`/agent/${agent.agentId}`} 
                            key={index} 
                            className='p-3 border rounded-2xl shadow hover:shadow-lg transition-shadow'
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Globe className='bg-green-100 p-2 rounded-sm text-green-600' />
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    Published
                                </span>
                            </div>
                            <h2 className='mt-3 font-semibold'>{agent.name}</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {moment(agent._creationTime).fromNow()}
                            </p>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}

export default PublishedAgents

