import { CircleX } from 'lucide-react'
import React from 'react'

const UserBadge = ({user, handleFunction}) => {
  return (
    <div>
        <div className="flex flex-row justify-center bg-red-100 px-2 py-1 rounded-md  items-center">
            {/* <img src={user.pic} alt="User" className="w-10 h-10 rounded-full" /> */}
            <img src={user.pic} alt="User" className="w-3 mx-[2px] h-3 rounded-full border-[1px] border-black" />
            <span className='text-black text-xs'>{user.name.split(' ')[0]}</span>
            <button onClick={() => handleFunction(user)} className=" text-red-600 ml-1 justify-center items-center text-sm rounded"> <CircleX className='w-3 h-4' /></button>
        </div>
    </div>
  )
}

export default UserBadge