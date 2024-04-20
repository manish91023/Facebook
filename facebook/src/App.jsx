import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
 const get=async()=>{
  const res=await fetch("http://localhost:0000")
  console.log(res)
 }


  return (
    <>
      <p>manish kumar </p>
    </> 
  )
}

export default App
