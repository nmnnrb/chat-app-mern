import { ChatState } from '../../Context/ChatProvider';
import { AlignJustify, Bell, Search, X } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import ProfileModel from '../miscellaneous/ProfileModel'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';
import Loading from './Loading';
import { getSender } from '../../config/ChatLogics';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // New state for drawer
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // New state for notifications
    const {user , setSelectedChat , notification, setNotification,  chats, setChats} = ChatState();
    const navigate = useNavigate();

    const logoutHandle = () => {
        localStorage.removeItem('userInfo') ;
        navigate('/login')
    }

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    }

    const handleSearch = async (e) => {     
        e.preventDefault();
        if(!search){
            toast.error('Please enter a search query' , {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        try {
                setLoading(true);

                const config = {
                    headers: {
                        Authorization:  `Bearer ${user.token}`
                    },
                };

                const {data} = await axios.get(`https://chat-app-mern-backend-w9ne.onrender.com/api/user?search=${search}` ,config);
                setLoading(false);
                setResult(data);


        } catch (error) {
                toast.error(`Something went wrong: ${error.message}`, {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }

    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization:  `Bearer ${user.token}`
                },
            };

            const {data} = await axios.post(`https://chat-app-mern-backend-w9ne.onrender.com/api/chat`, {userId} , config);
            if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
            setLoadingChat(false);
            setSelectedChat(data);
            toggleDrawer();
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        const profileMenuButton = document.getElementById('profileMenuButton');
        const profileMenu = document.getElementById('profileMenu');

        const toggleMenu = () => {
            profileMenu.classList.toggle('hidden');
        };

        const closeMenu = (event) => {
            if (!profileMenuButton.contains(event.target) && !profileMenu.contains(event.target)) {
                profileMenu.classList.add('hidden');
            }
        };

        profileMenuButton.addEventListener('click', toggleMenu);
        document.addEventListener('click', closeMenu);

        return () => {
            profileMenuButton.removeEventListener('click', toggleMenu);
            document.removeEventListener('click', closeMenu);
        };
    }, [user]);
    

  return (
    <>
        <nav className='flex flex-col md:flex-row rounded-xl items-center p-4 shadow-xl bg-cyan-100 text-white' style={{ backgroundImage: "url('https://img.freepik.com/free-photo/futuristic-metaverse-empty-room-product-display-presentation-abstract-technology-scifi-with-neon-light-3d-background_56104-2314.jpg')", backdropFilter: 'blur(10px)' }}>
            <div className="flex flex-col md:flex-row items-center flex-grow">
                <h1 className='text-xl md:text-2xl font-bold'>Welcome, {user ? user.name : 'Guest'}</h1>
                <div className="flex mt-2 md:mt-0 md:ml-4 gap-1 items-center">
                    <input onClick={toggleDrawer} type="text" placeholder='Search' className='p-2 bg-white rounded-md' />
                    <Search onClick={toggleDrawer} className='w-6 h-6 md:w-8 md:h-8 cursor-pointer' fill='white' color='black' />
                </div>
            </div>
            <h1 className='text-xl  md:text-2xl font-bold flex-grow text-center mt-2 md:mt-0'>Let's Connect</h1>
                <button onClick={toggleNotification} className="relative bg-gray-200 mx-6 hover:bg-gray-300 text-black px-4 py-2 rounded-md focus:outline-none flex gap-1 items-center">
                    <Bell className='w-6 h-6' />
                    {notification.length > 0 && (
                        <span 
                            className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1 transform translate-x-2 -translate-y-2"
                        >
                            {notification.length}
                        </span>
                    )}
                </button>
                {isNotificationOpen && (
                    <ul className="absolute right-0 mt-24 mr-24 w-auto bg-white rounded-md shadow-lg py-2 z-20">
                        {notification.length ? (
                            notification.map((notif) => (
                                <li onClick={() => {
                                    setSelectedChat(notif.chat);
                                    setNotification(notification.filter((n) => n !== notif));
                                }} key={notif._id} className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                </li>
                            )) 
                        ) : (
                            <li className="block px-4 py-2 text-gray-800">No New Message</li>
                        )}
                    </ul>
                )}
            <div className="ml-auto relative mt-2 md:mt-0">
                <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md focus:outline-none flex gap-1 items-center" id="profileMenuButton">
                    {user && <img className='w-8 rounded-full border-[1px] border-black' src={user.pic} alt="Profile" />}
                    <AlignJustify />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20 hidden" id="profileMenu">
                   
                    <ProfileModel user={user}>
                        <span className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Profile</span>
                    </ProfileModel>
                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={logoutHandle}>Logout</a>
                </div>
            </div>
        
        </nav> 

        <div className={`fixed top-0 left-0 h-full overflow-auto bg-white shadow-lg z-30 transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} w-full md:w-[30vw] transition-transform duration-300`}>
            <button onClick={toggleDrawer} className="p-4 w-full   flex justify-end">  <X color='white' className='bg-red-600 rounded-lg p-[2px] font-black'  /></button>
            <ul className="p-4">
             <div className="flex mb-6 ">
             <input value={search} onChange={(e) =>{
                 setSearch(e.target.value)
                 }} type='text' placeholder='Search' className='p-2  bg-gray-100 border-black border-[2px]  rounded-lg w-full' /> <button className="bg-gray-100 p-1 rounded-md ml-2" onClick={handleSearch}>GO</button>
             </div>
               {
                loading ? ( <Loading/> ) : (
                    result?.map((user) => (
                        <li key={user._id} onClick={() => accessChat(user._id)} className="flex items-center py-4 px-5 bg-gray-200 my-1 rounded-lg hover:bg-green-300 transition duration-300 cursor-pointer">
                            <img className='w-12 rounded-full border-[1px] border-black' src={user.pic} alt="User" />
                            <div className="flex flex-col ">
                            <span className="ml-4 text-xl">{user.name}</span>
                            <span className="ml-4 text-blue-600 underline">{user.email}</span>
                            </div>
                 
                        </li>
                    ))
                )
               }
            </ul>
        </div>
    </>
  )

  
}

export default SideDrawer