
let url = window.location.pathname;
let length_URL = url.split("/");
let attraction_id = length_URL.pop();

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

function check_top() {
    let check_bottom = document.querySelector("#check-bottom");
    let check_top = document.querySelector("#check-top");
    let money = document.querySelector(".money");
    let check_src=check_top.src.split("/");
    if (check_src.pop() == "radio.png") {
        check_top.src = "/public/images/radio_ok.png";
        check_bottom.src = "/public/images/radio.png";
        money.innerHTML = "新台幣 2000 元";
    } else {
        check_top.src = "/public/images/radio.png";
        money.innerHTML = "尚未選擇行程";
    };
};
function check_bottom() {
    let check_bottom = document.querySelector("#check-bottom");
    let check_top = document.querySelector("#check-top");
    let money = document.querySelector(".money");
    let check_src=check_bottom.src.split("/");
    if (check_src.pop() == "radio.png") {
        check_bottom.src = "/public/images/radio_ok.png";
        check_top.src = "/public/images/radio.png";
        money.innerHTML = "新台幣 2500 元";
    } else {
        check_bottom.src = "/public/images/radio.png";
        money.innerHTML = "尚未選擇行程";
    };
};

fetch(`/api/attraction/${attraction_id}`).then(response => response.json()).then(data => {
    console.log("讀取成功", data);
    let view_title = document.querySelector(".view-title");
    let view_text = document.querySelector(".view-text");
    let infor_text = document.querySelector(".infor-text");
    let point_text = document.querySelector(".point-text");
    let traffic_text = document.querySelector(".traffic-text");
    //創建圖片src
    console.log(data["data"]["images"].length);
    for (let i = 0; i < data["data"]["images"].length; i++) {
        let images_box = document.querySelector(".image-box");
        let image = document.createElement("img");


        let circle = document.querySelector(".circle-flex")
        let circle_img = document.createElement("img")
        if (i > 0) {
            circle_img.src = "/public/images/w_circle.png"
        } else {
            circle_img.src = "/public/images/b_circle.png"
        }
        circle_img.classList.add("circle", "circle-" + i)
        // circle_img.setAttribute("onclick", `changeImg(${ i });`)
        circle.appendChild(circle_img);

        image.classList.add("images", "image-" + i)
        if (i > 0) {
            image.style.display = "none";
        }
        image.src = data["data"]["images"][i];
        images_box.appendChild(image);
    }



    view_title.innerHTML = data["data"]["name"];
    view_text.innerHTML = data["data"]["category"] + "&nbsp;at&nbsp;" + data["data"]["mrt"];
    infor_text.innerHTML = "&emsp;&emsp;" + data["data"]["description"];
    point_text.innerHTML = data["data"]["address"];
    traffic_text.innerHTML = data["data"]["transport"];



}).catch(error => {
    console.error("發生錯誤", error);
});

// ----image-1----|----image-2----|----image-3----|----image-4----|----image-5----|----image-0----|
let start = 0;
let second;
function leftArrow() {
    let firstImg = document.querySelector(".image-0")
    firstImg.style.display = "none";
    let circle_first = document.querySelector(".circle-0")
    circle_first.src = "/public/images/w_circle.png"
    box = document.querySelectorAll(".images").length;
    if (start == 0) {
        start = box - 1;//向左一個id
        second = 0;//這邊先指定為id 0 因為用+1會錯誤 假如box=6 second會變5+1
        let leftImg = document.querySelector(".image-" + start)
        leftImg.style.display = "block";
        let circle_left = document.querySelector(".circle-" + start)
        circle_left.src="/public/images/b_circle.png"
    } else {
        start -= 1;//左邊圖片id
        second = start + 1; //右邊圖片id
        let leftImg = document.querySelector(".image-" + start)
        let rightImg = document.querySelector(".image-" + second)
        leftImg.style.display = "block"; //左邊顯示
        rightImg.style.display = "none";//右邊關閉

        let circle_left = document.querySelector(".circle-" + start)
        circle_left.src = "/public/images/b_circle.png"
        let circle_right = document.querySelector(".circle-" + second)
        circle_right.src = "/public/images/w_circle.png"
    }
};
function rightArrow() {
    let firstImg = document.querySelector(".image-0")
    firstImg.style.display = "none";
    let circle_first = document.querySelector(".circle-0")
    circle_first.src = "/public/images/w_circle.png"
    box = document.querySelectorAll(".images").length;
    if (start == box - 1) {
        //id_0顯示 並重置start為0
        start = 0;
        firstImg.style.display = "block";

        let circle_first = document.querySelector(".circle-0")
        circle_first.src = "/public/images/b_circle.png"

        second = box - 1;
        //將最後一位的顯示清空
        let leftImg = document.querySelector(".image-" + second)
        leftImg.style.display = "none";
        let circle_left = document.querySelector(".circle-" + second)
        circle_left.src="/public/images/w_circle.png"

    } else {
        second = start + 1;
        let leftImg = document.querySelector(".image-" + start)
        let rightImg = document.querySelector(".image-" + second)
        leftImg.style.display = "none";
        rightImg.style.display = "block"

        let circle_left = document.querySelector(".circle-" + start)
        circle_left.src = "/public/images/w_circle.png"
        let circle_right = document.querySelector(".circle-" + second)
        circle_right.src = "/public/images/b_circle.png"
        start += 1;
    }
}

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
        alert("電子信箱、密碼欄位不得為空")
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


// function changeImg(circle_num) {
//     let circle_length=document.querySelectorAll(".circle").length
//     for(let i=0;i<circle_length;i++){
//         let circle = document.querySelector(".circle-"+i)
//         circle.src="/public/images/w_circle.png"
//     }
//     let circleStart = document.querySelector(".circle-"+circle_num)
//     circleStart.src="/public/images/b_circle.png"
    
//     if(circle_num==circle_length-1){
//         start=0
//     }else{
//         start=circle_num
//     }
// }