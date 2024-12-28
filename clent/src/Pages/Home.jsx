import React, { useEffect, useState } from 'react'
import Login from '../login-signuop/Login'
import Signup from '../login-signuop/Signup'
import { useNavigate } from 'react-router-dom';
import BackendMessage from './BackendMessage';
const Home = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

     useEffect(() => {
           const userInfo =  JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo){
            navigate("/chats");
        }
        }, [navigate])


  return (
    <div style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, .510), rgba(1230, 120, 134, 0.301)), url('https://img.freepik.com/free-vector/messages-light-colour-background_78370-2586.jpg?t=st=1734945177~exp=1734948777~hmac=d0b82d73e8d6e01d11a35fc0c6db65069678f5971ae5c551630160f31ce96d63&w=1800')`,
      backgroundSize: 'cover',
      }} className='w-full h-screen flex flex-col justify-center items-center'>
       
          <h1 className='md:text-7xl drop-shadow-xl rounded-lg  bg-white px-8 py-4 font-extrabold text-blue-600'>Let's Connect</h1>
        <BackendMessage />
      {/* login signup swtch  */}
        <div className="mt-8 p-4 bg-white rounded-md shadow-xl w-96">
          <div className="flex justify-around mb-4">
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-500'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`px-4 py-2 rounded ${activeTab === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-500'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
          <div>
            {activeTab === 'login' && (
              <div>
                {/* Login component will be rendered here */}
                <Login />
              </div>
            )}
            {activeTab === 'signup' && (
              <div>
                {/* Sign Up component will be rendered here */}
                <Signup />
              </div>
            )}
          </div>
        </div>
        
        </div>
  )
}

export default Home