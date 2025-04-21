const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    emergencyNo: {
        type: String,
    },
    emergencyEmail: {
        type: String,
    },
    pincode: {
        type: String,
    },
}, { timestamps: true });

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Login', loginSchema);
module.exports = mongoose.model('User', userSchema);
