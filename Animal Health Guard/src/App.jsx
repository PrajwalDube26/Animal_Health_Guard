import { useState } from 'react';
import {Routes,Route} from 'react-router-dom'
import Login from './components/Login';
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App
