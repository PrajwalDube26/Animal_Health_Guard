const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // value:['farmer','vet','admin','extension_worker'],
        enum: ['farmer', 'vet', 'admin', 'extension_worker'],
        required: true
    },
    phone: {
        type: String,
        // length:10
        match: /^[0-9]{10}$/,
        required: true
    },
    location: String

});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;