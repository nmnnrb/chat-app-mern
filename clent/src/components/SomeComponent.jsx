import React from 'react'
import ProfileModel from './miscellaneous/ProfileModel'

// Example user object
const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  pic: 'https://example.com/john-doe.jpg'
}

const SomeComponent = () => {
  return (
    <div>
      <h1>Welcome to the Chat Application</h1>
      <ProfileModel user={user}>
        <button className="bg-green-500 text-white px-4 py-2 rounded">View Profile</button>
      </ProfileModel>
    </div>
  )
}

export default SomeComponent
