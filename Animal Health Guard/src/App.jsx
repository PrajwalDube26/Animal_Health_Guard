import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppProvider';

import Login from './components/User/Login';
import Signup from "./components/User/Signup";
import Navbar from "./components/Navbar/Navbar";
import FeatchUser from './components/User/Featchuser';
import Profile from './components/User/Profile';
import Addfarm from './components/Farm/Addfarm';
import GetFarm from './components/Farm/GetFarm';
import AddRecord from './components/Record/AddRecord';
import GetRecord from './components/Record/GetRecord';
import ShowAllAlert from './components/Alert/ShowAllAlert';
import GetSingleFarm from './components/Farm/GetSingleFarm';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fetchUser" element={<FeatchUser />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addfarm" element={<Addfarm />} />
        <Route path="/getfarm" element={<GetFarm />} />
        <Route path="/getsinglefarm/:id" element={<GetSingleFarm />} />
        <Route path="/addrecord/:farmId" element={<AddRecord />} />
        <Route path="/getrecord/:farmId" element={<GetRecord />} />
        <Route path="/showallalert" element={<ShowAllAlert />} />
      </Routes>
    </AppProvider>
  )
}

export default App;