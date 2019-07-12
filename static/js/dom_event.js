
function createChatRoomElement(chatroom_info){
    /**
     * 채팅방 목록 DOM에 추가할 엘리먼트 생성
     * 채팅방 객체 필요
     */
    let element = document.createElement('li');
    element.setAttribute('value', chatroom_info._id)

    let span = document.createElement('span');
    span.innerHTML = chatroom_info.chatroom_title;

    let hidden = document.createElement('input');
    hidden.setAttribute("type", "hidden");
    hidden.setAttribute("value", chatroom_info._id);

    element.append(span);
    element.append(hidden);
    
    return element;
}

function createMessageElement(message_info){
    /**
     * 채팅창 DOM에 추가할 메시지 엘리먼트를 생성합니다.
     */
    let element = document.createElement('li');
    
    let sender = document.createElement('span');
    sender.innerHTML = message_info.sender;
    
    let date = document.createElement('span');
    let date_format = new Date(message_info.send_date).toTimeString().substr(0,8);
    date.innerHTML = "("+date_format+") : ";
    
    let msg = document.createElement('span');
    msg.innerHTML = message_info.message;

    element.append(sender);
    element.append(date);
    element.append(msg);

    return element;
}

function drawChatRoomList(res){
    /**
     * 서버에서 전체 채팅방 목록을 가져와서
     * 해당 목록을 DOM에 등록합니다.
     */
    let element_list = res.map((chatroom)=>{
        let chatroom_ele = createChatRoomElement(chatroom);
        
        chatroom_ele.addEventListener('click', function(event){
            console.log('chatroom requeset');
            console.log(this.getAttribute('value'));
            let chatroom_id = this.getAttribute('value');
            getChatRoom(chatroom_id);
        });

        return chatroom_ele;
    });
    let target = document.querySelector('.chatroom_list');
    target.innerHTML = "";
    //지우기
    element_list.forEach((ele)=>{
        console.log(ele);
        target.append(ele);
    })
}

function drawChatRoom(chatroom){
    console.log("drawChatRoom");
    let chat_list = document.querySelector('.chat_list');
    chat_list.innerHTML="";//clear
    chatroom.chat_list.forEach((msg)=>{
        console.log(msg);
        let temp = createMessageElement(msg);
        chat_list.append(temp);
    })
    chat_list.scrollTop = chat_list.scrollHeight;

}

function drawMesasge(message){
    console.log('draw Message');
    let chat_list = document.querySelector('.chat_list');
    let temp = createMessageElement(message);
    chat_list.append(temp);
    chat_list.scrollTop = chat_list.scrollHeight;
}