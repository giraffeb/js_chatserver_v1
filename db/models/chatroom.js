var mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema({
    chatroom_title: String,
    reg_date: {type: Date, default: Date.now},
    chat_list: Array,
    current_user_list: Array
});

module.exports = mongoose.model('ChatRoom', chatroomSchema);