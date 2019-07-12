module.exports = function(http, User, ChatRoom){    
    var jwt = require('jsonwebtoken');
    //클라이언트와 서버에서 사용하는 동일한 형태.
    function Message(){
        this.chatroom_id;
        this.sender;
        this.send_date = Date.now();
        this.message;
    }


    var io = require('socket.io')(http);

    console.log('socket io started');

    io.on('connection',  function(socket){
        console.log("hello ne world");
        
        socket.on('getUser', async function(data){
            //사용자 정보를 반환 형식을 정해야함.
            //이미 로그인상태로 jwt가 있어야겠지.

            //매번 토큰 인증과정.
            let token = data.jwt;
            let jwt_result = null;
            console.log('temp jwt->', data.jwt);
            try{
                jwt_result = await jwt.verify(token, "hellosecret");
                console.log('jwt_result->', jwt_result);
            }catch(e){
                console.log(e);
            }
            let user_id = jwt_result.user_id;
            let username = jwt_result.username;
            let current_user = await User.findOne({user_id: user_id});
            //에러처리를 하시던지.
            console.log('current_user->', current_user);
            socket.emit('getUser', current_user);
            
        })

        socket.on('getChatRoomList', async function(){
            let chat_room_list = await ChatRoom.find();
            // for(let chatroom of chat_room_list){
            //     socket.join(chatroom._id);
            // }

            socket.emit('getChatRoomList', chat_room_list);
        })

        socket.on('getChatRoom', async function(chatroom_id){
            let currentChatRoom = await ChatRoom.findOne({_id: chatroom_id});
            socket.join(chatroom_id);

            socket.emit('getChatRoom', currentChatRoom);
        });

        socket.on('createChatRoom', async function(chatroom_title){
            let new_chatroom = new ChatRoom();
            new_chatroom.chatroom_title = chatroom_title;

            let res = await new_chatroom.save();

            socket.emit('createChatRoom', res);
        });

        socket.on('signup', async function(userData){
            console.log('signup call it -> ', userData);
            let new_user = new User();
            new_user.user_id = userData.user_id;
            new_user.username = userData.username;

            let res = await new_user.save();
            
            //에러처리하시던지.
            socket.emit('signup', res);
        })

        socket.on('message', async function(data){
            console.log(data);
            let chatroom_id = data.chatroom_id;
            
        
            let currentChatRoom = await ChatRoom.findOne({_id: chatroom_id});
            currentChatRoom.chat_list.push(data);
            let result = await currentChatRoom.save();

            socket.in(chatroom_id).emit('message', data);
            
        })
    });

    return io;
}