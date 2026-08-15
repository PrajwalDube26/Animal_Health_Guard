import { useState } from 'react';
import { Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppProvider';

import Login from './components/User/Login';
import Signup from "./components/User/Signup";
import Navbar from "./components/Navbar/Navbar";
import FeatchUser from './components/User/Featchuser';
import Updateuser from './components/User/Updateuser';
import Profile from './components/User/Profile';
import Addfarm from './components/Farm/Addfarm';
import GetFarm from './components/Farm/GetFarm';
import Updatefarm from './components/Farm/Updatefarm';
import AddRecord from './components/Record/AddRecord';
import GetRecord from './components/Record/GetRecord';
import Updaterecord from './components/Record/Updaterecord';
import ShowAllAlert from './components/Alert/ShowAllAlert';
import GetSingleFarm from './components/Farm/GetSingleFarm';
import GetUserAlert from './components/UserAlert/GetUserAlert';
import GetAllTraningModule from './components/TraningModule/GetAllTraningModule';
import GetTraningModuleByID from './components/TraningModule/GetTraningModuleByID';
import GetUserTraning from './components/UserTraning/GetUserTraning';

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fetchUser" element={<FeatchUser />} />
        <Route path="/updateuser" element={<Updateuser show={true} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addfarm" element={<Addfarm />} />
        <Route path="/getfarm" element={<GetFarm />} />
        <Route path="/getsinglefarm/:id" element={<GetSingleFarm />} />
        <Route path="/updatefarm/:id" element={<Updatefarm />} />
        <Route path="/addrecord/:farmId" element={<AddRecord />} />
        <Route path="/getrecord/:farmId" element={<GetRecord />} />
        <Route path="/updaterecord/:farmId/:id" element={<Updaterecord />} />
        <Route path="/showallalert" element={<ShowAllAlert />} />
        <Route path="/useralert" element={<GetUserAlert />} />
        <Route path="/useralerts" element={<GetUserAlert />} />
        <Route path="/usertraining" element={<GetUserTraning />} />
        <Route path="/usertrainings" element={<GetUserTraning />} />
        <Route path="/myusertraining" element={<GetUserTraning />} />
        <Route path="/myusertrainings" element={<GetUserTraning />} />
        <Route path="/getalltrainingmodule" element={<GetAllTraningModule />} />
        <Route path="/getalltrainingmodules" element={<GetAllTraningModule />} />
        <Route path="/trainingmodules" element={<GetAllTraningModule />} />
        <Route path="/trainingmodule/:id" element={<GetTraningModuleByID />} />
        <Route path="/gettraningmodulebyid/:id" element={<GetTraningModuleByID />} />
      </Routes>
    </AppProvider>
  )
}

export default App;