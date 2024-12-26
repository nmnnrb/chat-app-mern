const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const path = require('path'); 
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/user', userRoutes);
app.use('/api/chat' , chatRoutes)
app.use('/api/message' , messageRoutes);



const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`.green.bold);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:5173',
  },
});

io.on("connection" , (socket) => {
  console.log("connection to socket.io started");

  socket.on('setup' , (userData) => {
    socket.join(userData._id);
    console.log(userData._id )
    socket.emit("connected");
  })

  socket.on('typing', (room) => socket.in(room).emit("typing") );
  socket.on('stop typing', (room) => socket.in(room).emit("stop typing") );

  socket.on('join chat' , (room) => {
    socket.join(room);
    console.log("user Joined Room " , room)
  })
  socket.on('new message' , (newMessageReceived) => {
    let chat = newMessageReceived.chat;

    if(!chat.users) return console.log("users not defined");

    chat.users.forEach(user => {
      if(user._id === newMessageReceived.sender._id) return;
      console.log("emitting to user " , user._id)
      socket.in(user._id).emit('message received' , newMessageReceived);
    })
  })

  socket.off("setup" , () => {
    console.log("connection to socket.io ended");
    socket.leave(userData._id);
  })
})