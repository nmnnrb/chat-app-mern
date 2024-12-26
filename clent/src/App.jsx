import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Chat from "./Pages/Chat"
import { ToastContainer } from "react-toastify"
import NotFound from "./login-signuop/NotFound"
import { ChakraProvider } from "@chakra-ui/react";



function App() {


  return (
 
    <div  style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 2, .20), rgba(1230, 120, 134, 0.41)), url('https://img.freepik.com/free-vector/messages-light-colour-background_78370-2586.jpg?t=st=1734945177~exp=1734948777~hmac=d0b82d73e8d6e01d11a35fc0c6db65069678f5971ae5c551630160f31ce96d63&w=1800')`,
      backgroundSize: 'cover',
      
      }}  className='justify-center  items-center flex md:overflow-y-hidden'>
      <ToastContainer />
      <Routes>
      <Route path='/login' element={<Home/>} />
      <Route path='/' element={<Home/>} />
      <Route path='/chats' element={<Chat/>}/>
      <Route path="*" element={<NotFound />} />
      </Routes>
    </div>

  )
}

export default App
