const generateToken = require('../config/generateToken');
const User = require('../models/userModel');

const registerUser = async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json('Please fill all fields');
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        return res.status(400).json('User already registered');
    }

    try {
        const user = await User.create({
            name, email, password, pic
        });

        if (user) {
            return res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                pic: user.pic,
                token: generateToken(user._id)
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Server Error'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Please fill all fields');
    }

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            return res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });
        } else {
            return res.status(400).json('Invalid email or password');
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


const allUser =  async (req,res) => {
    const keywords =  req.query.search ? {
        $or: [
            {name: {$regex: req.query.search, $options: 'i'}},
            {email: { $regex: req.query.search, $options: 'i'}}
        ]
    } : {};

    const user = await User.find(keywords).find({_id: {$ne: req.user._id}});

    res.send(user);
}

module.exports = { registerUser, authUser , allUser }