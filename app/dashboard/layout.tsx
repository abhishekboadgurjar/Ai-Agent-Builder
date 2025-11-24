import React from 'react'
import DashboardProvider from './Provider'

function DashboardLayout({children}:any) {
  return (
    <DashboardProvider>
    <div>{children}</div>
 </DashboardProvider>

  )
}

export default DashboardLayout