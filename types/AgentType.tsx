import {Id} from "@/convex/_generated/dataModel"

export type Agent={
    _id:Id<"AgentTable">,
    agentId:string,
    config?:any,
    published:boolean,
    name:string,
    userId:Id<"UserTable">,
    nodes?:any,
    edges?:any,
    _creationTime:number,
    agentToolConfig?:any
}