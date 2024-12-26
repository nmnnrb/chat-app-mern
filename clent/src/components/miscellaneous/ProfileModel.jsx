import React, { useState } from 'react'
import { Eye } from 'lucide-react'

const ProfileModel = ({ user, children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onOpen = () => setIsOpen(true)
  const onClose = () => setIsOpen(false)

  return (
    <>
      {children ? <span onClick={onOpen}>{children}</span> : <Eye className='w-8 mx-auto bg-black' />}
      {isOpen && (
        <div className="fixed h-screen inset-0 flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 100000 }}>
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profile</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="flex flex-col items-center mt-4">
              <img src={user.pic} alt="User" className="w-44 h-44 border-[2px] border-black rounded-full mb-4" />
              <h2 className=" md:text-4xl text-black font-bold ">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
            <div className="mt-4">
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileModel