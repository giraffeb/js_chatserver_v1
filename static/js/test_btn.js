 //test buttons event

 let get_user_info_btn = document.querySelector(".getUserInfo");
 let get_chatroom_list_btn = document.querySelector(".getChatRoomList");
 let draw_chatroom_btn = document.querySelector(".drawChatRoom");
 let create_chatroom_btn = document.querySelector(".createChatRoom");

 get_user_info_btn.addEventListener("click", function(event){
     getUserInfo();
 });

 get_chatroom_list_btn.addEventListener("click", function(event){
     getChatRoomList();
 });

 draw_chatroom_btn.addEventListener("click", function(event){
     let chatroom_id = JSON.parse(sessionStorage.getItem("currentChatRoom"))._id;
     getChatRoom(chatroom_id);
     
 });

 create_chatroom_btn.addEventListener("click", function(event){
    let title = prompt('input chatroom title');
    createChatRoom(title);
    
});