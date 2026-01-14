import React from 'react'
import Navbar from './components/navbar/Navbar'
import Dashboard from './components/main/Dashboard'
import Workspace from './components/editorAndQuestion/Workspace'

export default function App() {
  return (
    <>
    <Navbar />
    <Dashboard />
    <Workspace />
    </>
  )
}
