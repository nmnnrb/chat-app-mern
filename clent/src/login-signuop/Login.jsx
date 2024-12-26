import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email || !password){
      toast.warn('Please enter correct credentials');
      setLoading(false);
      return ;
    }
    setLoading(true); // Set loading to true after validation

    try {
      const config = {
        headers:  {
          "Content-Type": "application/json",
        },
      };
      const {data} = await axios.post(`${import.meta.env.VITE_API_Backend_URL}/api/user/login`, {email, password}, config);
      if(data){
        toast.success('Logged in successfully');
        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        navigate('/chats')
      }else{
        toast.error('Invalid credentials');
        setLoading(false);
      }
      } catch (error) {
        toast.warn('Invalid credentials');
      console.log(error);
      setLoading(false);
    }

  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="mt-1 bg-white block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required 
        />
      </div>
      <div>
        <label className="block text-sm bg-white font-medium text-gray-700">Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="mt-1 text-black bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required 
        />
      </div>
      <button 
        type="submit" 
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm  hover:translate-x-[-10px] transition duration-300  hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={loading} // Disable button when loading
      >
        Login
      </button>

      <a 
        className="w-full text-center py-2 px-4 bg-red-600 text-white font-bold underline rounded-md shadow-sm hover:bg-red-700 hover:translate-x-2 focus:outline-none transition duration-300 focus:ring-2 focus:ring-offset-2 cursor-pointer focus:ring-blue-500"
        onClick={() => {
          setEmail('demo@demo.com');
          setPassword('demo');
        }}
      >
        Get Login Credentials
      </a>
    </form>
    
    
  )
}

export default Login