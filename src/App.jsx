import { useState } from 'react';
import Login from './components/Login';
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Signup/>
    </>
  )
}

export default App
