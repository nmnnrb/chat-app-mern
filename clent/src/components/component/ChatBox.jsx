import { ChatState } from '../../Context/ChatProvider'
import React from 'react'
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const {selectedChat} = ChatState();
  return (
    <div  className={`{(selectedChat) ? 'block' : 'hidden'} bg-gray-100 max-h-[85vh] min-h-[82vh] py-5 px-5 rounded my-5 overflow-x-hidden overflow-y-auto` }>

    <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox