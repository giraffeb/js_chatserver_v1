//메시지 형식 만들기.
function Message(){
    this.chatroom_id;
    this.sender;
    this.send_date = Date.now();
    this.message;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawUserInfo(){
    let area = document.querySelector(".user_info_area");
    let user_info = sessionStorage.getItem('currentUser');

    let ele = user_info;
    area.append(ele);
}

//로그인 후 jwt를 발급받은 상태에서 서버로 부터 사용자 정보를 요청합니다.
function getUserInfo(){
    let jwt = sessionStorage.getItem('jwt');
    let data = {jwt: jwt};
    socket.emit('getUser', data);
    
}

//채팅창 메시지 입력 후 엔터를 누르면 발생하는 이벤트.
var chat_input_textarea = document.querySelector("body>article>section.chat_area>.chatinput_area>textarea");
chat_input_textarea.addEventListener("keyup", (event)=>{
    event.preventDefault();
    if(event.key === "Enter"){
        let value = event.srcElement.value;
        value = value.trim();
        value = value.replace('\n','');
        if(value.length == 0){
            return;
        }
        console.log("MESSAGE->#"+value+"#");

        //클라이언트에 저장된 현재 유저 정보 가져오기.
        let current_user = JSON.parse(sessionStorage.getItem('currentUser'));

        //클라이언트에 저장된 현재 채팅방 정보 가져오기
        let current_chatroom = JSON.parse(sessionStorage.getItem('currentChatRoom'));

        console.log('current_chatroom->', current_chatroom);
        //메시지 생성하기.
        let new_message = new Message();
        new_message.sender = current_user.user_id;
        new_message.chatroom_id = current_chatroom._id;
        new_message.message = value;
        event.srcElement.value ="";

        let chat_list = document.querySelector(".chat_list");
        let message_element = createMessageElement(new_message);

        socket.emit('message', new_message);
        chat_list.append(message_element);
        
        chat_list.scrollTop = chat_list.scrollHeight;
        
    }
});

//서버로 부터 채팅방 리스트 요청하기
function getChatRoomList(){
    socket.emit('getChatRoomList');
}

//채팅방 만들기
function createChatRoom(chatroom_title){
    socket.emit('createChatRoom', chatroom_title);
}

//채팅방정보 가져오기
//최근 채팅 내용은 가져올 필요는 없고
//입장이라는 개념을 도입할라면 다른 사용자가 있다 없다 정도만 만들면 될 거 같은데.
//그리고 입장해야지.
function getChatRoom(chatroom_id){
    socket.emit('getChatRoom', chatroom_id);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//#이벤트 수신 부분입니다. 잘 나눠 놓도록 하겠습니다.

//유저 정보 요청 후 결과 반환이벤트 수신
socket.on('getUser', function(res){
    console.log('getUser->',res);
    //세션 스토리지에 저장합니다.
    sessionStorage.setItem('currentUser', JSON.stringify(res));
})


//채팅방 요청 이벤트 결과 반환받기.
socket.on('getChatRoom', function(res){
    console.log('getChatRoom');
    console.log('chatroom->',res);

    //겨로가받은 정보를 세션 스토리지에 저장.
    sessionStorage.setItem('currentChatRoom', JSON.stringify(res));
    
    //이벤트 수신 수 채팅 창에 뿌려주기.
    drawChatRoom(res);
});

//채팅방 리스트 결과물 받기.
socket.on('getChatRoomList', function(res){
    console.log(res);
    //받은 채팅방 리스트를 html로 그려내기
    drawChatRoomList(res);
});

//채팅만 만들기 결과물 받기
socket.on('createChatRoom', function(res){
    let chatroom_id = res.chatroom_id;
    //만든 채팅방을 세션스토리지에 저장.
    sessionStorage.setItem('currentChatRoom', chatroom_id);
    getChatRoomList();
});

//메시지 수신 이벤트 처리.
socket.on('message', function(message){
    console.log('receive message->', message);
    drawMesasge(message);
})