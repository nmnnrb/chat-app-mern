import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { UserPlus } from 'lucide-react';
import Loading from './Loading';
import { getPic, getSender } from '../../config/ChatLogics';
import GroupChatModal from '../miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
    const [loggedUser, setLoggedUser] = useState();

    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get('http://localhost:8080/api/chat', config);
            setChats(data);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        setLoggedUser(userInfo);

        fetchChats();
    }, [fetchAgain]);

    return (
        <div className="flex flex-col md:flex-row flex-wrap max-h-[85vh] gap-2 overflow-hidden md:overflow-auto">
            <div className="bg-white w-full md:min-w-[40vw] p-5 my-5 rounded-md shadow-md">
                <div className="flex justify-between">
                    <span className="text-2xl md:text-5xl font-light">My Chats</span>
                    <GroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                        <button className="ml-auto bg-gray-200 px-2 md:px-4 py-2 rounded text-lg md:text-2xl flex gap-1 justify-center items-center text-gray-700 hover:text-gray-800">
                            <UserPlus />Group Chat
                        </button>
                    </GroupChatModal>
                </div>
                <div className="flex flex-col overflow-y-auto">
                    {chats ? (
                        chats.map((chat) => (
                            <div key={chat._id} className={`flex gap-2 p-2 my-2 rounded-md cursor-pointer ${selectedChat?._id === chat._id ? 'bg-green-200 text-blue-500' : 'bg-gray-200'}`} onClick={() => setSelectedChat(chat)}>
                                <img src={getPic(loggedUser, chat.users)} alt="profile" className="h-12 w-12 md:h-16 md:w-16 rounded-full" />
                                <div>
                                    <span className="text-lg md:text-xl font-bold">{!chat.isGroupChat ? (
                                        getSender(loggedUser, chat.users)
                                    ) : (chat.chatName)}</span>
                                    <span className="text-sm md:text-lg font-light">{chat.lastMessage}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col">
                            <Loading />
                            <Loading />
                            <Loading />
                            <Loading />
                            <Loading />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyChats;