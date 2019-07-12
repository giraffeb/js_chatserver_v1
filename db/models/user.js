var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    reg_date: {type: Date, default: Date.now}
});


module.exports = mongoose.model('User', userSchema);




