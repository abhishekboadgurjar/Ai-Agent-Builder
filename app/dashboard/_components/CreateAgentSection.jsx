// "use client"
// import { Button } from '@/components/ui/button'
// import { Loader2Icon, Plus } from 'lucide-react'
// import React, { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from '@/components/ui/input'
// import { useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { v4 as uuidv4 } from "uuid";
// const router=useRouter();
// const [loader,setLoader]=useState(false);s
// const [agentName,setAgentName]=useState()

// export function CreateAgentSection() {
//     setLoader(true);
//     const [openDialog,setOpenDialog]=useState(false);
//     const CreateAgentMutation=useMutation(api.agent.CreateAgent)


// const CreateAgent=async ()=>{
// const agentId=uuidv4();
// const result=await CreateAgentMutation({
//     agentId:agentId,
//     name:agentName??''
// })
// setOpenDialog(false);

// setLoader(false);

// router.push('/agent-builder/'+agentId);

// }

//   return (
//     <div className='space-y-2 flex flex-col justify-center items-center mt-24'>
//         <h2 className='font-bold text-2xl'>Create AI Agent</h2>
//         <p className='text-lg'>Build a A Agent Workflow with custom logic and tools</p>
//  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//   <DialogTrigger asChild>
//      <Button ><Plus onClick={()=>setOpenDialog}/>
//      Create
//      </Button>
//      </DialogTrigger>
//   <DialogContent>
// <DialogHeader>
// <DialogTitle>Enter Agent Name</DialogTitle>
// <DialogDescription>
// <Input placeholder='Agent Name' onChange={(event)=>setAgentName(event.target.value)}/>


// </DialogDescription>
//     </DialogHeader>
//     <DialogFooter>
//         <DialogClose>
//         <Button variant={'ghost'}>Cancel</Button>
//         </DialogClose>
//         <Button onClick={()=>CreateAgent()} disabled={loader} >Create</Button>
//         {loader&& <Loader2Icon className='animate-spin'/>}
//     </DialogFooter>
//   </DialogContent>
// </Dialog>
//     </div>
//   )
// }



"use client";

import { Button } from "@/components/ui/button";
import { Loader2Icon, Plus } from "lucide-react";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { v4 as uuidv4 } from "uuid";
import { UserDetailContext } from "@/app/context/UserDetailConetxt";

export function CreateAgentSection() {
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
const {userDetail,setUserDetail}=useContext(UserDetailContext)
  const CreateAgentMutation = useMutation(api.agent.CreateAgent);

  const CreateAgent = async () => {
    try {
      setLoader(true);

      const agentId = uuidv4();

      await CreateAgentMutation({
        agentId,
        name: agentName ?? "",
        userId:userDetail?._id
      });

      setOpenDialog(false);
      router.push("/agent-builder/" + agentId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="space-y-2 flex flex-col justify-center items-center mt-24">
      <h2 className="font-bold text-2xl">Create AI Agent</h2>
      <p className="text-lg">Build an AI Agent workflow with custom logic and tools</p>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2" />
            Create
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Agent Name</DialogTitle>
            <DialogDescription>
              <Input
                placeholder="Agent Name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>

            <Button onClick={CreateAgent} disabled={loader}>
              {loader ? (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
