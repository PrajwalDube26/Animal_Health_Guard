import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './component/Navbar'
import CreateAlert from './component/CreateAlert'
import { AppProvider } from './context/AppProvider';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/createalert" element={<CreateAlert />} />
      </Routes>
    </AppProvider>
  )
}

export default App
