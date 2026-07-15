const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        // length:10
        match: /^[0-9]{10}$/,
        required: true
    },
    location: {
        type: String,
        required: true
    }

});

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;