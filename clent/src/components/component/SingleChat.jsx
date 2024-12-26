import { Eye, SendHorizontal, Undo2 } from 'lucide-react';
import { ChatState } from '../../Context/ChatProvider';
import React, { useEffect, useState } from 'react'
import { getSender, getSenderFull } from '../../config/ChatLogics'
import ProfileModel from '../miscellaneous/ProfileModel';
import UpdateGroupName from '../miscellaneous/UpdateGroupName';
import Loading from './Loading';
import axios from 'axios';
import { toast } from 'react-toastify';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import './message.css'
const ENDPOINT = "http://localhost:8080";
let socket , selectedChatCompare ;

const SingleChat = ({fetchAgain , setFetchAgain}) => {
    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup" , user);
        socket.on('connected' , () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    },[])

    const {user, selectedChat , notification, setNotification,  setSelectedChat} = ChatState();
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setnewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing ,setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const sendMessage = async (e) => {
        if(newMessage.trim() === '') return;
        socket.emit('stop typing' , selectedChat._id);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                }
            }
            setnewMessage('');
            const {data} = await axios.post(`http://localhost:8080/api/message`, {content: newMessage , chatId: selectedChat._id}, config);
            console.log(data);
            socket.emit("new message" , data)
            setMessage([...message, data]); // Corrected typo from messsage to message
        } catch (error) {
            toast.error('Failed to send message')
        }
   
    }
    const typingHandler = (e) => {
        setnewMessage(e.target.value);
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing" , selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength); // Added timerLength as the second argument to setTimeout
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true);
            const {data} = await axios.get(`http://localhost:8080/api/message/${selectedChat._id}` , config);
            console.log(data); // Log the fetched data
            setMessage(data);
            setLoading(false);
            socket.emit('join chat' , selectedChat._id);
        } catch (error) {
            console.log(`Error: ${error.response.status} - ${error.response.statusText}`); // Log the error status and status text
            toast.error('Failed to fetch messages');
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])

    console.log(notification , "----------------"); // Log the notification

    useEffect(() => {
        socket.on('message received' , (newMessageReceived) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){
                if(!notification.includes(newMessageReceived)){
                    setNotification([ newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessage([...message, newMessageReceived]);
            }
        });
    }, [message])

    useEffect(() => {
        socket.on('typing', (room) => {
            if (room !== selectedChat._id) return;
            setIsTyping(true);
        });
        socket.on('stop typing', (room) => {
            if (room !== selectedChat._id) return;
            setIsTyping(false);
        });
    }, [selectedChat]);
  
  return (
    <>
    {
        selectedChat ? (
            <>
                {
                    <div className='flex flex-col w-full h-full'>
                        <div className="flex justify-between items-center">
                         <p onClick={() => setSelectedChat('')} className='text-red-600 cursor-pointer'><Undo2 /></p>
                     {
                        !selectedChat.isGroupChat ? (
                            <>
                              <h1 className='text-xl md:text-2xl font-semibold'>{getSender(user, selectedChat.users)}</h1>
                              <ProfileModel user={getSenderFull(user, selectedChat.users)}>
                                <Eye />
                              </ProfileModel>
                            </>
                        ) : (
                            <>
                                <h1 className='text-xl md:text-2xl font-semibold'>{selectedChat.chatName.toUpperCase()}</h1>
                                <UpdateGroupName fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}  >
                                    <button className='bg-blue-500 text-white px-4 py-2 rounded'>Update Group Name</button>
                                </UpdateGroupName>
                            </>
                        )
                     }
                        </div>
                        <div className='flex bg-gray-200 rounded-lg w-full overflow-hidden mt-5 min-h-[70vh] p-5 flex-col'>
                            
                     {
                        loading ? (
                                <>
                                <Loading />
                                <Loading />
                                <Loading />
                                <Loading />
                                </>) : (
                                    <div className="flex flex-col relative  overflow-y-auto h-[60vh]">
                                         <ScrollableChat  message={message} />
                                    </div>
                                )}

                            
                           <div className='flex flex-col gap-2 cursor-pointer w-full mt-4'  >
                                {
                                    isTyping ?  (<div className="chat-bubble w-24" >
                                        <div className="typing">
                                          <div className="dot"></div>
                                          <div className="dot"></div>
                                          <div className="dot"></div>
                                        </div>
                                        </div>) : (<> </>)
                                }
                                    <div className="flex flex-grow  ">
                                <input type="text" placeholder='Type a message' className='flex-grow h-10 bg-gray-100 rounded-lg p-2' value={newMessage} onChange={typingHandler} onKeyPress={handleKeyPress} />

                                <button onClick={sendMessage} className='bg-blue-500 hover:bg-blue-600 transition duration-300  text-white  px-4 py-2 rounded'>
                                <SendHorizontal className='' />
                                </button>
                                </div>

                           </div>
                              

                        </div>
                    </div>
                }

            </>
        ) : (
            <> 
            <h1 className='text-2xl md:text-5xl flex flex-col items-center mt-18 justify-center  font-medium font-sans  bg-blue-800 px-5 py-4 rounded-md shadow-lg text-blue-300 cursor-not-allowed'>Click on a user to start Chatting</h1>
            </>
        )
    }
    </>
  )
}

export default SingleChat