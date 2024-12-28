import { TriangleAlert } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const BackendMessage = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);   
  useEffect(() => {
    handleShow();
  }, [])
  return (
    <>
      
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-xl  font-semibold flex"><TriangleAlert className='bg-yellow-500  text-black rounded-md p-1' /></h3>
              <button 
                className="text-gray-500 hover:text-gray-700" 
                onClick={handleClose}
              >
                &times;
              </button>
            </div>
            <div className="mt-4 text-md mb-2">
              <h1 className="" >Backend is hosted on Render , it will take 40-60 second to run backend.</h1>
              <br>
              </br>
              <a href="https://chat-app-mern-backend-w9ne.onrender.com" className="btn hover:bg-blue-600 transition duration-300 bg-blue-500 text-white px-3 py-2 rounded-xl btn-primary">Click here to see the backend</a>
            </div>
            <div className="flex justify-end mt-4">
              <button 
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded" 
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BackendMessage;