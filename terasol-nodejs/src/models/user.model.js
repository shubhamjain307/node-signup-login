const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    profile_pic: String,
    otp:String,
    is_active:  { type: Boolean, default: false },
    is_verified:  { type: Boolean, default: false }
    
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);