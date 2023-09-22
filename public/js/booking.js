function register(){
    let headers={
        "Content-Type": "application/json",
    };
    let name= document.querySelector('.name-text').value;
    let email =document.querySelector('.email-text').value;
    let password = document.querySelector('.password-text').value;
    if (name && email && password){
    fetch("/api/user", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ name:name, email:email, password:password })
    }).then(response => response.json()).then(data => {
        console.log(data);
        if (data["error"]!=null){
            let errorMessage = document.querySelector(".error-message")
            errorMessage.innerHTML="註冊失敗，重複註冊的Email或其他原因"
            errorMessage.style.color="red"
        }else{
            let errorMessage = document.querySelector(".error-message")
            errorMessage.innerHTML="註冊成功，請登入會員帳號!"
            errorMessage.style.color="#99FF33"
        }
    }).catch(error => {
        console.error("發生錯誤", error);
    });
    }else{
        let errorMessage = document.querySelector(".error-message")
        errorMessage.innerHTML="註冊失敗，欄位不得為空"
        errorMessage.style.color="red"
    }
};

function login(){
    let headers={
        "Content-Type": "application/json",
    };
    let email = document.querySelector('.login-email').value;
    let password = document.querySelector('.login-password').value;
    if (email && password){
        fetch("/api/user/auth", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ email:email, password:password })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["error"]!=true){
                let token = data["token"];
                console.log(token);
                window.localStorage.setItem('token', token);
                window.location.href = window.location.pathname ;
            }else{
                let message = document.querySelector('.message')
                message.innerHTML="登入失敗，帳號密碼錯誤或其他原因"
                message.style.color="red"
            };
        }).catch(error => {
            console.error("發生錯誤", error);
        });
    }else{
        let message = document.querySelector('.message')
        message.innerHTML="電子信箱、密碼欄位不得為空"
        message.style.color="red"
    };
};

function userLogin(){
    let token = localStorage.getItem('token');
    let headers={
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ token }`}
fetch("/api/user/auth", {
    method : "GET",
    headers : headers
}).then(response => response.json()).then(data => {
    console.log(data)
    if (data['data']!=null){
        let logInButton = document.querySelector('.login-button');
        logInButton.style.display="none"
        let logoutButton = document.querySelector('.logout-button');
        logoutButton.style.display="block"
    }else{
        console.error("尚未登入", error);
    }
}).catch( error => {
    console.log("尚未登入");
})}
userLogin()

function GoHome() {
    window.location.href = "/";
};

function loginBlock(){
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display="block";
    loginBox.style.display="block";
}
function logoutBlock(){
    window.localStorage.removeItem('token');
    window.location.href = window.location.pathname;
}


function goRegister(){
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display="none";
    registerBox.style.display="block";
}
function goLogin(){
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display="block";
    registerBox.style.display="none";
}

function closeInput(){
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display="none";
    loginBox.style.display="none";
}
function closeRegister(){
    let loginBg = document.querySelector(".login-class");
    let registerBox = document.querySelector(".register-box");
    loginBg.style.display="none";
    registerBox.style.display="none";
}


let tourBox = document.querySelector("#tour-box");
let tourDiv = document.createElement("div");
tourDiv.classList.add("display-flex","flex-box");
tourBox.appendChild(tourDiv);

let flexBox = document.querySelector(".flex-box")
imageBox = document.createElement("img");
imageBox.src = "";
imageBox.classList.add("image-box")
flexBox.appendChild(imageBox);

let textDiv = document.createElement("div");
textDiv.classList.add("text-box");
flexBox.appendChild(textDiv);

let textBoxTitle = document.querySelector(".text-box");

let textBoxTitleDiv = document.createElement("div");
textBoxTitleDiv.classList.add("text-box-title");
textBoxTitleDiv.innerHTML=`台北一日遊：`;
textBoxTitle.appendChild(textBoxTitleDiv);

let textBoxText1Div = document.createElement("div");
textBoxText1Div.classList.add("text-box-text");
textBoxText1Div.innerHTML=`日期：`;
textBoxTitle.appendChild(textBoxText1Div);
let textBoxText2Div =document.createElement("div");
textBoxText2Div.classList.add("text-box-text");
textBoxText2Div.innerHTML=`時間：`;
textBoxTitle.appendChild(textBoxText2Div);
let textBoxText3Div =document.createElement("div");
textBoxText3Div.classList.add("text-box-text");
textBoxText3Div.innerHTML=`時間：`;
textBoxTitle.appendChild(textBoxText3Div);
let textBoxText4Div = document.createElement("div");
textBoxText4Div.classList.add("text-box-text");
textBoxText4Div.innerHTML=`費用：`;
textBoxTitle.appendChild(textBoxText4Div);
let textBoxText5Div = document.createElement("div");
textBoxText5Div.style.fontWeight=bold;
textBoxText5Div.innerHTML=`費用：`;
textBoxTitle.appendChild(textBoxText5Div);