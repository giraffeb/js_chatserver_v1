 //login 이벤트 부분이 입니다.
 async function requestLoginAPI(){
    console.log('requestLoginAPI');

    let login_form = document.getElementById('login_form');
    let test_login_form =  new FormData(login_form);
    let data = new URLSearchParams();

    for(pair of test_login_form){
        data.append(pair[0], pair[1]);
    }

    let res = await fetch('/login',{
        method: "POST",
        body: data});
    let jwt = await res.json();
    console.log(jwt);
    sessionStorage.setItem("jwt", jwt);
    
    let login_stauts = document.querySelector('.login_status');
    login_stauts.innerHTML = "LOGIN -> OK";
    
    window.open('/',"_self");

    getUserInfo();
    getChatRoomList();
}

let login_form = document.querySelector('#login_form');

login_form.addEventListener('submit', async function(e){
    e.preventDefault();
    requestLoginAPI();
})


//회원 가입 요청하기.
function signup(user_id, username){
    let user = {user_id: user_id, username: username};
    socket.emit('signup', user);
}

//회원가입 요청 후 리턴
socket.on('signup', function(res){
    console.log('signup status->', res);
});