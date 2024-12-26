import MyChats from '../components/component/MyChats';
import ChatBox from '../components/component/ChatBox';
import SideDrawer from '../components/component/SideDrawer';
import { ChatState } from '../Context/ChatProvider'
import { useState } from 'react';



const Chat = () => {
     const {user} = ChatState();
     const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div className='w-full h-screen py-2 px-6 flex flex-col text-black font-medium  '>

    
          <SideDrawer/>

          <div className="flex flex-col md:flex-row gap-3">
          { user &&   <MyChats  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
            <div className="flex-grow">
              {/* Chat component will be rendered here */}
              {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </div>
          </div>
    </div>
  )
}

export default Chat