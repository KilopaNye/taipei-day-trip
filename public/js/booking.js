function register() {
    let headers = {
        "Content-Type": "application/json",
    };
    let name = document.querySelector('.name-text').value;
    let email = document.querySelector('.email-text').value;
    let password = document.querySelector('.password-text').value;
    if (name && email && password) {
        fetch("/api/user", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: name, email: email, password: password })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["error"] != null) {
                let errorMessage = document.querySelector(".error-message")
                errorMessage.innerHTML = "註冊失敗，重複註冊的Email或其他原因"
                errorMessage.style.color = "red"
            } else {
                let errorMessage = document.querySelector(".error-message")
                errorMessage.innerHTML = "註冊成功，請登入會員帳號!"
                errorMessage.style.color = "#99FF33"
            }
        }).catch(error => {
            console.error("發生錯誤", error);
        });
    } else {
        let errorMessage = document.querySelector(".error-message")
        errorMessage.innerHTML = "註冊失敗，欄位不得為空"
        errorMessage.style.color = "red"
    }
};

function login() {
    let headers = {
        "Content-Type": "application/json",
    };
    let email = document.querySelector('.login-email').value;
    let password = document.querySelector('.login-password').value;
    if (email && password) {
        fetch("/api/user/auth", {
            method: "PUT",
            headers: headers,
            body: JSON.stringify({ email: email, password: password })
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data["error"] != true) {
                let token = data["token"];
                console.log(token);
                window.localStorage.setItem('token', token);
                window.location.href = window.location.pathname;
            } else {
                let message = document.querySelector('.message')
                message.innerHTML = "登入失敗，帳號密碼錯誤或其他原因"
                message.style.color = "red"
            };
        }).catch(error => {
            console.error("發生錯誤", error);
        });
    } else {
        let message = document.querySelector('.message')
        message.innerHTML = "電子信箱、密碼欄位不得為空"
        message.style.color = "red"
    };
};
let WelUsername;
function userLogin() {
    let token = localStorage.getItem('token');
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    fetch("/api/user/auth", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        console.log(data)
        if (data['data'] != null) {
            let logInButton = document.querySelector('.login-button');
            logInButton.style.display = "none"
            let logoutButton = document.querySelector('.logout-button');
            logoutButton.style.display = "block"
            let welName = document.querySelector(".text-title")
            welName.innerHTML = `您好，${ data["data"]["name"] }，待預定的行程如下:`   
            WelUsername = data["data"]["name"]
        } else {
            console.error("尚未登入", error);
        }
    }).catch(error => {
        console.log("尚未登入");
    })
}
userLogin()


let totalCost=0
//抓取資料
function booking() {
    let token = localStorage.getItem('token');
    if(!token){
        window.location.href = "/";
    }
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    fetch("/api/booking", {
        method: "GET",
        headers: headers
    }).then(response => response.json()).then(data => {
        console.log(data)
        if (data['data'] != null) {
            for (let i = 0; i < Object.keys(data["data"]).length; i++) {
                totalCost+=data['data'][i]["price"]
                let tourBox = document.querySelector("#tour-box");
                let tourDiv = document.createElement("div");
                tourDiv.classList.add("bgColor","bg-display-flex", "flex-box"+i);
                tourDiv.style.marginBottom="20px";
                tourBox.appendChild(tourDiv);

                let flexBox = document.querySelector(".flex-box"+i)
                imageBox = document.createElement("img");
                imageBox.src = data['data'][i]["attraction"]["path"];
                imageBox.classList.add("image-box")
                flexBox.appendChild(imageBox);

                let textDiv = document.createElement("div");
                textDiv.classList.add("text-box","text-box"+i);
                flexBox.appendChild(textDiv);

                let delete_icon = document.createElement("img")
                delete_icon.src="/public/images/delete.png"
                delete_icon.classList.add("delete-icon","checkbox"+i)
                delete_icon.setAttribute("onclick","deleteBooking(this)")
                delete_icon.setAttribute("id",data['data'][i]["id"])
                delete_icon.setAttribute("valued","flex-box"+i)
                delete_icon.setAttribute("price",data['data'][i]["price"])
                flexBox.appendChild(delete_icon)

                let textBoxTitle = document.querySelector(".text-box"+i);

                let textBoxTitleDiv = document.createElement("div");
                textBoxTitleDiv.classList.add("text-box-title");
                textBoxTitleDiv.innerHTML = `台北一日遊：${ data['data'][i]["attraction"]["name"]}`;
                textBoxTitleDiv.style.marginTop="10px"
                textBoxTitle.appendChild(textBoxTitleDiv);

                let textBoxText1Div = document.createElement("div");
                textBoxText1Div.classList.add("text-box-text");
                textBoxText1Div.innerHTML = `日期：${ data['data'][i]["date"]}`;
                textBoxTitle.appendChild(textBoxText1Div);
                let textBoxText2Div = document.createElement("div");
                textBoxText2Div.classList.add("text-box-text");
                textBoxText2Div.innerHTML = `時間：${ data['data'][i]["time"]}`;
                textBoxTitle.appendChild(textBoxText2Div);
                let textBoxText3Div = document.createElement("div");
                textBoxText3Div.classList.add("text-box-text");
                textBoxText3Div.innerHTML = `費用：新台幣 ${ data['data'][i]["price"]} 元`;
                textBoxTitle.appendChild(textBoxText3Div);
                let textBoxText4Div = document.createElement("div");
                textBoxText4Div.classList.add("text-box-text");
                textBoxText4Div.innerHTML = `地點：${ data['data'][i]["attraction"]["address"]}`;
                textBoxTitle.appendChild(textBoxText4Div);
            }
            let totalPrice = document.querySelector(".total-cost")
            totalPrice.innerHTML = `新台幣${ totalCost } 元`
            checkNum();

        } else {
            console.error("尚未登入", error);
            window.location.href = "/";
        }
    }).catch(error => {
        console.log("尚未登入");
        window.location.href = "/";
    })
}
booking()

function deleteBooking(id){
    
    let token = localStorage.getItem('token');
    document.querySelector(".checkbox")
    if(!token){
        window.location.href = "/";
    }
    let headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
    fetch("/api/booking", {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify({ id:id.id })
    }).then(response => response.json()).then(data => {
        console.log("delete"+data)
        let deleteDiv = document.querySelector(`.${ id.getAttribute("valued") }`)
        let total = document.querySelector(".total-cost")
        totalCost-=id.getAttribute("price")
        total.innerHTML=totalCost
        deleteDiv.innerHTML=""
        deleteDiv.style.display="none";
        checkNum();
    }).catch(error => {
        console.log("尚未登入");
        // window.location.href = "/";
    });
};
function checkNum(){
    if(totalCost==0){
        let box = document.querySelector(".main-flex");
        
        box.innerHTML="";
        let boxDiv = document.createElement("div");
        boxDiv.classList.add("display-flex","boxDiv");
        boxDiv.style.maxWidth="1000px";
        boxDiv.style.marginBottom="30px";
        box.appendChild(boxDiv);

        let textDiv = document.querySelector(".boxDiv");
        textDiv.style.display="block";
        let text = document.createElement("div");
        text.classList.add("text-title");
        text.innerHTML=`您好，${ WelUsername }，待預定的行程如下:`
        textDiv.appendChild(text);
        
        let boxText = document.createElement("div")
        boxText.classList.add("text-box-text")
        boxText.style.marginTop="30px"
        boxText.innerHTML="目前沒有任何待預訂的行程"
        textDiv.appendChild(boxText);
    }else{
        return;
    }
}

function GoHome() {
    window.location.href = "/";
};

function loginBlock() {
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display = "block";
    loginBox.style.display = "block";
}
function logoutBlock() {
    window.localStorage.removeItem('token');
    window.location.href = window.location.href="/";
}


function goRegister() {
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display = "none";
    registerBox.style.display = "block";
}
function goLogin() {
    let loginBox = document.querySelector(".login-box");
    let registerBox = document.querySelector(".register-box");
    loginBox.style.display = "block";
    registerBox.style.display = "none";
}

function closeInput() {
    let loginBg = document.querySelector(".login-class");
    let loginBox = document.querySelector(".login-box");
    loginBg.style.display = "none";
    loginBox.style.display = "none";
}
function closeRegister() {
    let loginBg = document.querySelector(".login-class");
    let registerBox = document.querySelector(".register-box");
    loginBg.style.display = "none";
    registerBox.style.display = "none";
}

function GoBookingCheck(){
    let token = localStorage.getItem('token');
    if(token){
        window.location.href="/booking"
    }else{
        loginBlock();
    }
}