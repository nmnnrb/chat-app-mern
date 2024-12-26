import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Signup = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [picture, setPicture] = useState('');
  const [imgurl, setimgUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const randomDetails = () => {
    const randomName = `User${Math.floor(Math.random() * 100000)}`;
    const randomEmail = `${randomName}@example.com`;
    setName(randomName);
    setEmail(randomEmail);
    setPassword(randomName.replace(' ', ''));
    setConfirmPassword(randomName.replace(' ', ''));
    setMessage("select your image , or leave blank for default Avtar")
    setimgUrl('https://www.gravatar.com/avatar/');
  }




  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast.error('Please select an image');
      setLoading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
    const toastId = toast.loading(`Image is being uploaded...`);
  
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chap-app-chap");
      data.append("cloud_name", "dtro0afud");
      fetch("https://api.cloudinary.com/v1_1/dtro0afud/image/upload", {
        method: "post",
        body: data,
      }).then((res) => res.json())
        .then(data => {
          setPicture(data.url.toString());
          console.log( "image url is " , data.url.toString());
          setimgUrl(data.url.toString());
          setLoading(false);
          toast.dismiss(toastId);
          toast.success('Image uploaded successfully');
        }).catch(() => {
          toast.error('Error uploading image');
          setLoading(false);
          toast.dismiss(toastId);
          toast.error("Image not uploaded");
        });
    } else {
      toast.error('Please select a valid image (jpeg or png)');
      setLoading(false);
      toast.error("Image not uploaded");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("pic url is " , picture);
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return; 
    }
    try {
      const config = {
        headers: {
          "Content-type" :  "application/json",
        },
      };
      const {data}  = await axios.post(`http://localhost:8080/api/user`, {name, email, password, pic: picture}, config);
      toast.success('User registered successfully');
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats');
    } catch (error) {
      toast.error('Error registering user');
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col text-black font-bold space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <div className="flex justify-between">
          <div
           className="div">
              <label className="block text-sm font-medium text-gray-700">Upload Picture
              <span className="text-xs text-gray-500"> (jpeg or png format only)</span>
              </label>
           </div>
           <div className="div">
           <img className='w-8 rounded-full ' src={imgurl} ></img>
           </div>
        </div>
      
          
         
           { message.length != 0 && <span className="text-xs text-white bg-red-500 px-2 py-1 rounded-md"> {message}</span> }

        
           

        <input
          type="file"
          accept='image/*'
          onChange={(e) => postDetails(e.target.files[0])}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className={`w-full hover:translate-x-[-10px] transition duration-300 py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Sign Up'}
      </button>

      <a 
        className="w-full text-center cursor-pointer py-2 px-4 bg-red-600 text-white font-bold underline rounded-md shadow-sm hover:bg-red-700 hover:translate-x-2 focus:outline-none transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={() => {
          randomDetails();
        }}
      >
        Get Dummy Credentials
      </a>
    </form>
  )
}

export default Signup