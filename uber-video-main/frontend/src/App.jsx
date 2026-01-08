import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Start from './pages/Start';
import UserLogin from './pages/UserLogin';
import UserSignup from './pages/UserSignup';
import Captainlogin from './pages/Captainlogin';
import CaptainSignup from './pages/CaptainSignup';
import Home from './pages/Home';
import UserLogout from './pages/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainLogout from './pages/CaptainLogout';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
import 'remixicon/fonts/remixicon.css';

// ✅ Fixed UserProtectWrapper - no infinite loops
const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (!token) {
    window.location.href = '/login';
    return <div>Redirecting...</div>;
  }
  
  return children;
};

// ✅ Fixed CaptainProtectWrapper
const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  
  if (!token) {
    window.location.href = '/captain-login';
    return <div>Redirecting...</div>;
  }
  
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/captain-login" element={<Captainlogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/riding" element={<Riding />} />
          <Route path="/captain-riding" element={<CaptainRiding />} />

          {/* Protected User Routes */}
          <Route 
            path="/home" 
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            } 
          />
          <Route 
            path="/user/logout" 
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            } 
          />

          {/* Protected Captain Routes */}
          <Route 
            path="/captain-home" 
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            } 
          />
          <Route 
            path="/captain/logout" 
            element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            } 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
