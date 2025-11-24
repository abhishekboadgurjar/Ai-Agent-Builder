"use client"
import { UserDetailContext } from "@/app/context/UserDetailConetxt"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Database, Gem, Headphones, LayoutDashboard, User2Icon, WalletCards } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {usePathname } from "next/navigation"
import { useContext } from "react"
const MenuOptions=[
  {
    title:'Dashboard',
    url:'/dashboard',
    icon:LayoutDashboard
  },
    {
    title:'Ai Agents',
    url:'/ai-agents',
    icon:Headphones
  },
    {
    title:'Data',
    url:'/data',
    icon:Database
  },  {
    title:'Pricing',
    url:'/pricing',
    icon:WalletCards
  },  {
    title:'Profile',
    url:'/profile',
    icon:User2Icon
  }
]
export function AppSidebar() {
  const {open}=useSidebar();
  const {userDetail,setUserDetail}=useContext(UserDetailContext)
  const path=usePathname();
  return (
    <Sidebar collapsible="icon">
      <div className="flex gap-2 items-center m-2">
      <Image src={'/logo.svg'} alt="logo" width={35} height={36}/>
     {open&&  <h2 className="font-bold text-lg">BuildMyAiAgent</h2>}
      </div>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup >
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {
              MenuOptions.map((menu,index)=>(
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size={open?'lg':"default"}  isActive={path==menu.url}>
                 
                    <Link href={menu.url}>
                       <menu.icon/>
                    <span>{menu.title}</span>
                 
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            }
          </SidebarGroupContent>
        </SidebarGroup>
       
      </SidebarContent>
      <SidebarFooter className="mb-10">
        <div className="flex gap-2 item-center">
          <Gem/>
      {open && <h2>Remaining Credits : <span className="font-bold">{userDetail?.token}</span></h2>}
        </div>
       {open &&  <Button>Upgrade to Unlimited</Button>}
      </SidebarFooter>
    </Sidebar>
  )
}