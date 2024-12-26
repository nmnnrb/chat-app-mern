import { User } from 'lucide-react'
import { getSender, isLastMessage, isSameSender, isSameSenderMargin } from '../../config/ChatLogics'
import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { ChatState } from '../../Context/ChatProvider'
import { Tooltip } from '@chakra-ui/react'

const ScrollableChat = ( { message  } ) => {
    const {user} = ChatState();
  return (
    <div className="overflow-y-auto h-full p-2 md:p-4">
      <ScrollableFeed>
          {
              message && message.map((m,i) => (
                  <div  key={i} className="flex items-center mb-2 md:mb-4">
                      {
                        ( ( isSameSender(message, m, i , m.sender._id) || isLastMessage(message, i, user._id)) && m.sender._id !== user._id
                      ) && (
                              <img className='w-6 h-6 md:w-8 md:h-8 rounded-full border-[1px] border-black object-cover mr-2 md:mr-4' src={m.sender.pic}></img>
                      )}
                      <span className='px-2 py-1' style={{
                          backgroundColor: `${m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'}`,
                          borderRadius: '10px',
                          
                          maxWidth: '75%',
                          marginLeft: isSameSenderMargin(message, m, i , user._id) ,
                       }}>
                           {m.content}
                       </span>
                  </div>
              ))
          }
      </ScrollableFeed>
    </div>
  )
}

export default ScrollableChat