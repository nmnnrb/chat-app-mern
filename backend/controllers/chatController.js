const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("Please provide userId");
        return res.status(400).json({ error: "Please provide userId" });
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } }, // Fix: req.userId to userId
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: "name pic email",
    });

    if (isChat.length > 0) {
        return res.status(200).send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            users: [req.user._id, userId],
            isGroupChat: false,
        };
        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findById({ _id: createdChat._id }).populate("users", "-password"); // Fix: FullChat to fullChat
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400).json({ error: "Internal server error" });
        }
    }
};



const fetchChats = (req, res) => {

    try {
        Chat.find({users: {$elemMatch : {$eq: req.user._id}}}).populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage")
        .sort({updatedAt: -1}).then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage,].sender",
                select: "name pic email",
            })
            res.status(200).send(results);
        })
    } catch (error) {
            res.status(400).send(error);
    }
}

const createGroupChat = async (req, res) => {

        if(!req.body.users || !req.body.name){
            return res.status(400).json('Please provide users and name');
        }

        let users = JSON.parse(req.body.users);
        
        if(users.length < 2){
            return res.status(400).json('Please Select more than 2 user to form Group chat');
        }
         
        users.push(req.user);
        try {
            const groupChat =  await Chat.create({
                chatName: req.body.name,
                users: users,
                isGroupChat: true,
                groupAdmin: req.user,
            })

            const fullGroupChat = await Chat.findOne({_id: groupChat._id}).populate("users" , "-password").populate("groupAdmin" , "-password");

            res.status(200).send(fullGroupChat);
        } catch (error) {
            res.status(400).json({error: "Internal server error"});
        }
}

const renameGroup = async (req, res) => {
    
    const {chatId, chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId, {
            chatName,
        }, {
            new: true,
        }
    ) .populate("users", "-password").populate("groupAdmin", "-password")

    if(!updatedChat){
        res.status(404).json({error: "Chat not found"});
    }else{
        res.status(200).send(updatedChat);
    }

}

const addToGroup = async (req, res) => {
 
    const {chatId, users} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: users},
            
        },
        {new : true}
    ).populate("users", "-password").populate("groupAdmin", "-password");

        if(!added){
            res.status(404).json({error: "Chat not found"});
        }else{
            res.status(200).json(added);
        }
}


const removeFromGroup = async (req, res) => {
    const {chatId, users} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: users},
            
        },
        {new : true}
    ).populate("users", "-password").populate("groupAdmin", "-password");

        if(!removed){
            res.status(404).json({error: "Chat not found"});
        }else{
            res.status(200).json(removed);
        }
}   

module.exports = { accessChat ,fetchChats , createGroupChat , renameGroup ,addToGroup, removeFromGroup };