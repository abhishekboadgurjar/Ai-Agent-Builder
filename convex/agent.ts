import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { query } from "./_generated/server";


export const CreateAgent=mutation({
    args:{
        name:v.string(),
        agentId:v.string(),
        userId:v.id('UserTable')
    },
    handler:async(ctx,args)=>{
const result =await ctx.db.insert('AgentTable',{
    name:args.name,
    agentId:args.agentId,
    published:false,
    userId:args.userId,
})
return result
    }
})

export const GetUserAgents=query({
    args:{
        userId:v.id('UserTable')
    },
    handler:async(ctx,args)=>{
        const result=await  ctx.db.query('AgentTable')
        .filter(q=>q.eq(q.field('userId'),args.userId))
    .order('desc')
    .collect()
return result;
    
    }
})

export const GetAgentById=query({
    args:{
        agentId: v.string(),
    },
    handler:async(ctx,args)=>{
               const result=await  ctx.db.query('AgentTable')
        .filter(q=>q.eq(q.field('agentId'),args.agentId))
    .order('desc')
    .collect()
return result[0];
    }
})


export const UpdateAgentDetail=mutation({
    args:{
        id:v.id('AgentTable'),
        nodes:v.any(),
        edges:v.any()
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            edges:args.edges,
            nodes:args.nodes
        });
    },
});


export const UpdateAgentToolConfig=mutation({
    args:{
        id:v.id('AgentTable'),
        agentToolConfig:v.any()
    },
    handler:async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            agentToolConfig:args.agentToolConfig
        })
    }
})

export const PublishAgent=mutation({
    args:{
        id:v.id('AgentTable'),
        published:v.boolean()
    },
    handler:async(ctx,args)=>{
        const agent=await ctx.db.get(args.id);
        if(!agent){
            throw new Error("Agent not found");
        }
        
        // Check if agent has required configuration before publishing
        if(args.published && !agent.agentToolConfig){
            throw new Error("Cannot publish agent without tool configuration. Please generate agent tool config first.");
        }
        
        await ctx.db.patch(args.id,{
            published:args.published
        });
        
        return {success:true, published:args.published};
    }
})

export const GetPublishedAgents=query({
    args:{},
    handler:async(ctx)=>{
        const result=await ctx.db.query('AgentTable')
            .filter(q=>q.eq(q.field('published'),true))
            .order('desc')
            .collect()
        return result;
    }
})