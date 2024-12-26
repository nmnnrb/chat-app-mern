const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, trim: true , required: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, required: true },
    pic: { type: String, default: 'https://www.gravatar.com/avatar/' }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.pic) {
        this.pic = 'https://www.gravatar.com/avatar/';
    }
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);