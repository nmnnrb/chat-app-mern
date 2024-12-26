import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
 

import { ChatProvider } from './context/ChatProvider' // Correct import path for ChatProvider

createRoot(document.getElementById('root')).render(


      <BrowserRouter>
      <ChatProvider>
        <App />
        </ChatProvider>
      </BrowserRouter>


)
