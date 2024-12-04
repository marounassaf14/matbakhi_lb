const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Ensure this field is defined and required
});

const USER = mongoose.model('User', userSchema);

module.exports = USER;