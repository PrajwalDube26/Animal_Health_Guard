import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './component/Navbar/Navbar'
import CreateAlert from './component/Alert/CreateAlert'
import FeatchadminAlert from './component/Alert/FeatchadminAlert'
import CreateTraningModule from './component/TraningModule/CreateTraningModule'
import FeatchadminTraningModule from './component/TraningModule/FeatchadminTraningModule'
import CreateBioAssig from './component/Bio_Assig/CreateBioAssig'
import FeatchadminBioAssig from './component/Bio_Assig/FeatchadminBioAssig'
import Login from './component/Admin/Login'
import Signup from './component/Admin/Signup'
import Profile from './component/Admin/Profile'
import Featchadmin from './component/Admin/Featchadmin'
import Updateadmin from './component/Admin/Updateadmin'
import { AppProvider } from './context/AppProvider'

function App() {
  return (
    <AppProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/fetchadmin" element={<Featchadmin />} />
        <Route path="/updateadmin" element={<Updateadmin />} />
        <Route path="/createalert" element={<CreateAlert />} />
        <Route path="/fetchadminalert" element={<FeatchadminAlert />} />
        <Route path="/alerts" element={<FeatchadminAlert />} />
        <Route path="/createtrainingmodule" element={<CreateTraningModule />} />
        <Route path="/createtraningmodule" element={<CreateTraningModule />} />
        <Route path="/fetchadmintrainingmodule" element={<FeatchadminTraningModule />} />
        <Route path="/fetchadmintraningmodule" element={<FeatchadminTraningModule />} />
        <Route path="/trainingmodules" element={<FeatchadminTraningModule />} />
        <Route path="/createbioassig" element={<CreateBioAssig />} />
        <Route path="/createbioassessment" element={<CreateBioAssig />} />
        <Route path="/fetchadminbioassig" element={<FeatchadminBioAssig />} />
        <Route path="/fetchadminbioassessment" element={<FeatchadminBioAssig />} />
        <Route path="/bioassig" element={<FeatchadminBioAssig />} />
        <Route path="/biosecurity" element={<FeatchadminBioAssig />} />
      </Routes>
    </AppProvider>
  )
}

export default App
