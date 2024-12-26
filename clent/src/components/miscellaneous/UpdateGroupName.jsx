import { ChatState } from '../../Context/ChatProvider';
import { Eye } from 'lucide-react';
import React, { useState } from 'react';
import UserBadge from './UserBadge';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../component/Loading';

const UpdateGroupName = ({ fetchAgain, setFetchAgain ,fetchMessages }) => {
  const [show, setShow] = useState(false);
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [rename, setRenameLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handelRename = async () => {
    if (!groupChatName) {
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log('Renaming group chat to:', groupChatName);
      const { data } = await axios.put(`http://localhost:8080/api/chat/rename`, { chatId: selectedChat._id, chatName: groupChatName }, config);

      console.log('Rename response:', data);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      toast.success('Rename Successfully');
      handleClose();
    } catch (error) {
      console.error('Error renaming group chat:', error);
      toast.error('Something went wrong');
      setRenameLoading(false);
      setGroupChatName('');
      handleClose();
    }
  };

  const handleSearch = async (e) => {
    setSearch(e);

    if (!e) {
      setShowSearchResults(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://localhost:8080/api/user?search=${e}`, config);
      setSearchResults(data);
      setLoading(false);
      setShowSearchResults(true);
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong', {
        position: 'top-left',
        autoClose: 2000,
      });
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast.error('User already exists in the chat');
        return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
        toast.error('Only admins can add users');
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        console.log('Adding user to group chat:', user1);
        const { data } = await axios.put('http://localhost:8080/api/chat/groupadd', {
            chatId: selectedChat._id,
            userId: user1._id,
        }, config);

        console.log('Add user response:', data);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
        toast.success('User added successfully');
        setShowSearchResults(false);
    } catch (error) {
        console.error('Error adding user to group chat:', error);
        toast.error('Something went wrong with API');
        setLoading(false);
    }
};

const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast.error('You are not authorized to remove this user');
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        console.log('Removing user from group chat:', user1);
        const { data } = await axios.put('http://localhost:8080/api/chat/groupremove', {
            chatId: selectedChat._id,
            userId: user1._id,
        }, config);

        console.log('Remove user response:', data);
        if (user1._id === user._id) {
            setSelectedChat(null);
        } else {
            setSelectedChat(data);
        }
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
        toast.success('User removed successfully');
    } catch (error) {
        console.error('Error removing user from group chat:', error);
        toast.error("Something went wrong, didn't remove");
        setLoading(false);
    }
};

  return (
    <>
      <button className="text-black hover:bg-gray-300 bg-gray-200 px-4 py-2 rounded" onClick={handleShow}>
        <Eye />
      </button>

      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">{selectedChat.chatName.toUpperCase()}</h2>
              <button className="text-gray-500" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="p-4">
              <form>
                <div className="mb-4">
                  <label className="block text-gray-700">Group Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-[30vw] px-3 py-2 border rounded"
                      placeholder="Enter new group name"
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                    />
                    <button className="bg-green-500 hover:bg-green-600 transition-all text-white text-sm rounded" onClick={handelRename}>
                      Update Name
                    </button>
                  </div>

                  <label className="block text-gray-700">Add Members: </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Add Member"
                    onChange={(e) => handleSearch(e.target.value)}
                  />

                  <div className="relative w-full">
                    {loading ? (
                      <div className="absolute bg-white w-full flex flex-col">
                        <Loading />
                        <Loading />
                      </div>
                    ) : (
                      showSearchResults && (
                        <ul className="absolute w-full bg-gray-200 border rounded-md mt-1 z-10 max-h-52 overflow-y-auto">
                          {searchResults?.map((user) => (
                            <li
                              key={user._id}
                              onClick={() => handleAddUser(user)}
                              className="flex w-full overflow-hidden items-center py-4 px-5 bg-gray-200 my-1 rounded-lg hover:bg-green-300 transition duration-300 cursor-pointer border-b border-gray-300"
                            >
                              <img className="w-6 rounded-full border-[1px] border-black" src={user.pic} alt={user.name} />
                              <div className="flex flex-col">
                                <span className="ml-1 text-sm">{user.name}</span>
                                <span className="ml-1 text-blue-600 text-xs underline">{user.email}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )
                    )}
                  </div>
                </div>
              </form>
              <label className="block text-gray-700">Members: </label>
              <div className="flex gap-2 flex-wrap">
                {selectedChat.users.map((u) => (
                  <UserBadge key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                ))}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t">
              <button className="bg-red-600 hover:bg-red-800 transition-all text-white px-4 py-2 rounded mr-2" onClick={() => handleRemove(user)}>
                Leave group
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateGroupName;