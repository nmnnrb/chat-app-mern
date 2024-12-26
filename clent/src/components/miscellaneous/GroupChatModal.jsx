import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import { CircleX, EyeClosed, UsersRound } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import Loading from '../component/Loading';
import UserBadge from './UserBadge';

const GroupChatModal = ({ children}) => { 
    const [isOpen, setIsOpen] = useState(false)
    const [groupChatName , setGroupChatName] = useState('')
    const [selectedUser , setSelectedUser] = useState([])
    const [search , setsearch] = useState('');
    const [searchresults , setSearchResults] = useState([]);
    const [loading , setLoading] = useState(false);
    const onOpen = () => {
        console.log("Opening modal");
        setIsOpen(true);
    }
    const onClose = () => {
        console.log("Closing modal");
        setIsOpen(false);
    }

    const handleSearch = async (e) => {
        setsearch(e);

            if(!e){
                return ;
            }

            try {
                setLoading(true);
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    },
                }
                const {data}  = await axios.get(`https://chat-app-mern-backend-w9ne.onrender.com/api/user?search=${e}`, config);
                console.log(data);
                setSearchResults(data);
                setLoading(false);

            } catch (error) {
                    console.log(error);
                    toast.error('Something went wrong', {
                        position: "top-left",
                        autoClose: 2000,
                    });
            }


    }
    const handleSubmit = async () => {
        if (!groupChatName || selectedUser.length === 0) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            console.log('Creating group chat with name:', groupChatName, 'and users:', selectedUser);
            const { data } = await axios.post('https://chat-app-mern-backend-w9ne.onrender.com/api/chat/group', {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id))
            }, config);

            console.log('Create group chat response:', data);
            setChats([data, ...chats]);
            onClose();
            toast.success('Successfully Group Chat Created');
        } catch (error) {
            console.error('Error creating group chat:', error);
            toast.error('Failed to create group chat');
        }
    }

    const handleGroup = (userToAdd) => {
        if(selectedUser.some(u => u._id === userToAdd._id)){
            toast.warn('User already selected');
            return;
        }
        console.log('Adding user to group:', userToAdd);
        setSelectedUser([...selectedUser, userToAdd]); 
        setSearchResults([]); // Clear search results
        setsearch(''); // Clear search input
        console.log('Selected users:', selectedUser);
    }

    const handleDelete = (userToDelete) => {
        console.log('Removing user from group:', userToDelete);
        setSelectedUser(selectedUser.filter(user => user._id !== userToDelete._id));
        toast.warn('User Deleted');
        console.log('Selected users:', selectedUser);
    }

    const {user, chats,setChats} = ChatState();

    return (
        <>
            {children ? <span onClick={onOpen}>{children}</span> : <EyeClosed className='w-8 mx-auto bg-black' />}
            {isOpen && user && (
                <div className="fixed top-50 h-screen inset-0 z-50 flex items-center justify-center bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl flex gap-1 font-semibold"><UsersRound /> Add Member</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">  <CircleX className='text-red-600 hover:scale-125 hover:text-red-800 transition duration-300 cursor-pointer' /></button>
                        </div> 
                        <div className="flex flex-col items-center mt-4">
                            <img src={user.pic} alt="User" className="w-44 h-44 border-[2px] border-black rounded-full mb-4" />
                            <input onChange={(e) => setGroupChatName(e.target.value)} type="text" placeholder='Chat Name' className=" my-1 border rounded-md  px-1 py-1" ></input>
                            <input onChange={(e) => handleSearch(e.target.value)} type="text" placeholder='Member  Name' className="my-1  border rounded-md  px-1 py-1" ></input>
                            {/* selected users */}
                            <div className="flex w-full gap-2 flex-wrap">
                            {
                                selectedUser.length > 0 && selectedUser.map((u) => (
                                    <UserBadge key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                                ))
                            }
                            </div>
                            {/* render searchuser */}
                            <div className="relative w-full">
                                {loading ? (
                                    <div className="absolute bg-white w-full flex flex-col">
                                        <Loading />
                                        <Loading />
                                    </div>
                                ) : (
                                    <ul className="absolute w-full bg-gray-200 border rounded-md mt-1 z-10 max-h-52 overflow-y-auto">
                                        {searchresults?.map((user) => (
                                            <li key={user._id} onClick={() => handleGroup(user)} className="flex w-full overflow-hidden items-center py-4 px-5 bg-gray-200 my-1 rounded-lg hover:bg-green-300 transition duration-300 cursor-pointer border-b border-gray-300">
                                                <img className='w-6 rounded-full border-[1px] border-black' src={user.pic}></img>
                                                <div className="flex flex-col ">
                                                    <span className="ml-1 text-sm">{user.name}</span>
                                                    <span className="ml-1 text-blue-600 text-xs underline">{user.email}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button className="bg-blue-500 hover:bg-green-500 transition-all duration-500 text-white mt-4 px-4 mx-auto py-2 rounded" onClick={handleSubmit}>Create Room</button>
                        </div>
                        
                    </div>
                </div>
            )}
        </>
    )
}

export default GroupChatModal