module.exports = function(){
    var mongoose = require('mongoose');

    var url = "mongodb://localhost/chatv1";
    mongoose.connect(url,  {useNewUrlParser: true});
    
    var db = mongoose.connection;
    db.once('open', function(){
        console.log('db connect->',url);
    });

    return mongoose;
}

