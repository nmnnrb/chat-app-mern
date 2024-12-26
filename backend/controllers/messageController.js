const chatModel = require("../models/chatModel");
const Message = require("../models/messageModel");
const userModel = require("../models/userModel");



const sendMessage = async (req,res) => {
    const { content, chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid Data Passed into request");
        return res.status(400).json({error: 'Invalid Data Passed into request'});
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat : chatId
    }

    try {
        let message = await Message.create(newMessage);
          message = await message.populate("sender" , "name pic")
          message = await message.populate("chat")
          message = await userModel.populate(message, {
            path: 'chat.users',
            select: "name pic email",
          })

          await chatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
          });
          res.status(200).json(message);
    } catch (error) {
        res.status(500).json({error: error.message});
    }

}


const allMessage = async (req,res) => {

    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
        res.json(messages);
    } catch (error) {
        console.error(error.message); // Log the error message
        res.status(500).json({ message: 'Failed to fetch messages' });
    }   


}



module.exports = {sendMessage , allMessage}