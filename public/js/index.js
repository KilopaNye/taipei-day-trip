function rightScroll() {
    let container = document.querySelector(".container");
    let containerWidth = container.offsetWidth;
    container.scrollLeft += containerWidth - 40;
};

function leftScroll() {
    let container = document.querySelector(".container");
    let containerWidth = container.offsetWidth;
    container.scrollLeft -= containerWidth - 40;
};

let page = 0;

function GoBooking(set_id) {
    let id = set_id.querySelector(".hide-id").textContent;
    console.log(id)
    window.location.href = `/attraction/${id}`
}
function GoHome() {
    window.location.href = "/"
}

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

let door = 0;
fetch("/api/attractions").then(response => response.json()).then(data => {
    page = data["nextPage"];

    for (let i = 0; i < 12; i++) {
        //選擇父層
        let firstFa = document.querySelector(".images-box");
        //創建attraction
        let firstDiv = document.createElement("div");
        firstDiv.classList.add("attraction", "box" + i);
        firstFa.appendChild(firstDiv);
        let hidden = document.createElement("div");
        hidden.classList.add("hide-id");
        hidden.textContent = data["data"][i]["id"]
        firstDiv.appendChild(hidden);
        firstDiv.setAttribute("onclick", "GoBooking(this);");
        firstFa.appendChild(firstDiv)
        //創建image
        let image = document.querySelector(".box" + i);
        let imageDiv = document.createElement("img");
        imageDiv.classList.add("image");
        image.appendChild(imageDiv);
        //創建attraction-img
        let attractionImgDiv = document.createElement("img");
        attractionImgDiv.classList.add("attraction-img");
        image.appendChild(attractionImgDiv);
        attractionImgDiv.src = data["data"][i]["images"][0];
        image.appendChild(attractionImgDiv);
        //創建opacity
        let opacityDiv = document.createElement("div");
        opacityDiv.classList.add("opacity")
        image.appendChild(opacityDiv);
        //創建attraction-name
        let attractionNameDiv = document.createElement("div");
        attractionNameDiv.classList.add("attraction-name");
        attractionNameDiv.textContent = data["data"][i]["name"]
        image.appendChild(attractionNameDiv);
        //創建img-bottom
        let imgBottom = document.querySelector(".box" + i);
        let imgBottomDiv = document.createElement("div");
        imgBottomDiv.classList.add("img-bottom");
        imgBottom.appendChild(imgBottomDiv);
        //創建mrt-name
        let mrtNameDiv = document.createElement("div");
        mrtNameDiv.classList.add("mrt-name");
        mrtNameDiv.textContent = data["data"][i]["mrt"];
        imgBottom.appendChild(mrtNameDiv);
        //創建view-class
        let viewClassDiv = document.createElement("div");
        viewClassDiv.classList.add("view-class");
        viewClassDiv.textContent = data["data"][i]["category"]
        imgBottom.appendChild(viewClassDiv);
    }
    door = 1;
}).catch(error => {
    console.error("發生錯誤", error);
});

fetch("/api/mrts").then(response => response.json()).then(mrtdatas => {
    for (let i = 0; i < mrtdatas["data"].length; i++) {
        if (mrtdatas["data"][i] != "None") {
            let mrt = document.querySelector(".container");
            let mrtDiv = document.createElement("div");
            mrtDiv.textContent = mrtdatas["data"][i];
            mrt.appendChild(mrtDiv);
            mrtDiv.setAttribute("onclick", "keywordSearch(this);");
            mrt.appendChild(mrtDiv);
        }
    }

}).catch(error => {
    console.error("發生錯誤", error);
});


let keyword = "";
let loadMore = function () {
    if (door === 1) {
        door = 0;
        if (page != null) {
            let pageNum = page;
            fetch(`/api/attractions?page=${pageNum}&keyword=${keyword}`).then(response => response.json()).then(data => {
                setNum = page * 12;
                page = data["nextPage"];
                dataLength = data["data"].length;
                for (let x = 0; x < dataLength; x++) {
                    i = x + setNum;
                    //選擇父層
                    let firstFa = document.querySelector(".images-box");
                    //創建attraction
                    let firstDiv = document.createElement("div");
                    firstDiv.classList.add("attraction", "box" + i);
                    firstFa.appendChild(firstDiv);
                    let hidden = document.createElement("div");
                    hidden.classList.add("hide-id");
                    hidden.textContent = data["data"][x]["id"]
                    firstDiv.appendChild(hidden);
                    firstDiv.setAttribute("onclick", "GoBooking(this);");
                    firstFa.appendChild(firstDiv)
                    //創建image
                    let image = document.querySelector(".box" + i);
                    let imageDiv = document.createElement("img");
                    imageDiv.classList.add("image", "imagesNum" + i)
                    image.appendChild(imageDiv);
                    //創建attraction-img
                    let attractionImgDiv = document.createElement("img");
                    attractionImgDiv.classList.add("attraction-img");
                    image.appendChild(attractionImgDiv);
                    attractionImgDiv.src = data["data"][x]["images"][0];
                    image.appendChild(attractionImgDiv);
                    //創建opacity
                    let opacityDiv = document.createElement("div");
                    opacityDiv.classList.add("opacity");
                    image.appendChild(opacityDiv);
                    //創建attraction-name
                    let attractionNameDiv = document.createElement("div");
                    attractionNameDiv.classList.add("attraction-name");
                    attractionNameDiv.textContent = data["data"][x]["name"];
                    image.appendChild(attractionNameDiv);
                    //創建img-bottom
                    let imgBottom = document.querySelector(".box" + i);
                    let imgBottomDiv = document.createElement("div");
                    imgBottomDiv.classList.add("img-bottom");
                    imgBottom.appendChild(imgBottomDiv);
                    //創建mrt-name
                    let mrtNameDiv = document.createElement("div");
                    mrtNameDiv.classList.add("mrt-name")
                    mrtNameDiv.textContent = data["data"][x]["mrt"]
                    imgBottom.appendChild(mrtNameDiv);
                    //創建view-class
                    let viewClassDiv = document.createElement("div");
                    viewClassDiv.classList.add("view-class");
                    viewClassDiv.textContent = data["data"][x]["category"]
                    imgBottom.appendChild(viewClassDiv);
                }
            door = 1;
            }).catch(error => {
                console.error("發生錯誤", error);
            });
        }
        else {
            return;
        };
    }
};
document.addEventListener("scrollend", function () {
    // 在元素滾動到頁面底部時，載入更多內容
    if (window.scrollY + window.screen.height >= document.body.scrollHeight) {
        loadMore();
    };
});

//測試load more用按鈕
let next = function () {
    loadMore();
};
//捷運站按鈕
function keywordSearch(key) {
    keyword = key.textContent;
    console.log(keyword);
    let placeholder = document.querySelector(".search")
    placeholder.value = keyword;
    fetch(`/api/attractions?keyword=${keyword}`).then(response => response.json()).then(data => {
        page = data["nextPage"];
        mrtPage = data["nextPage"];
        setNum = page * 12;
        dataLength = data["data"].length;
        let photoBox = document.querySelector(".images-box");
        photoBox.innerHTML = "";
        for (let x = 0; x < dataLength; x++) {
            i = x + setNum;
            //選擇父層
            let firstFa = document.querySelector(".images-box");
            //創建attraction
            let firstDiv = document.createElement("div");
            firstDiv.classList.add("attraction", "box" + i);
            firstFa.appendChild(firstDiv);
            let hidden = document.createElement("div");
            hidden.classList.add("hide-id");
            hidden.textContent = data["data"][i]["id"]
            firstDiv.appendChild(hidden);
            firstDiv.setAttribute("onclick", "GoBooking(this);");
            firstFa.appendChild(firstDiv)
            //創建image
            let image = document.querySelector(".box" + i);
            let imageDiv = document.createElement("img");
            imageDiv.classList.add("image", "imagesNum" + i)
            image.appendChild(imageDiv);
            //創建attraction-img
            let attractionImgDiv = document.createElement("img");
            attractionImgDiv.classList.add("attraction-img");
            image.appendChild(attractionImgDiv);
            attractionImgDiv.src = data["data"][x]["images"][0];
            image.appendChild(attractionImgDiv);
            //創建opacity
            let opacityDiv = document.createElement("div");
            opacityDiv.classList.add("opacity");
            image.appendChild(opacityDiv);
            //創建attraction-name
            let attractionNameDiv = document.createElement("div");
            attractionNameDiv.classList.add("attraction-name");
            attractionNameDiv.textContent = data["data"][x]["name"];
            image.appendChild(attractionNameDiv);
            //創建img-bottom
            let imgBottom = document.querySelector(".box" + i);
            let imgBottomDiv = document.createElement("div");
            imgBottomDiv.classList.add("img-bottom");
            imgBottom.appendChild(imgBottomDiv);
            //創建mrt-name
            let mrtNameDiv = document.createElement("div");
            mrtNameDiv.classList.add("mrt-name")
            mrtNameDiv.textContent = data["data"][x]["mrt"]
            imgBottom.appendChild(mrtNameDiv);
            //創建view-class
            let viewClassDiv = document.createElement("div");
            viewClassDiv.classList.add("view-class");
            viewClassDiv.textContent = data["data"][x]["category"]
            imgBottom.appendChild(viewClassDiv);
        }
    }).catch(error => {
        console.error("發生錯誤", error);
    });
};

//搜尋欄
let nextPage = 0;
function keywords() {
    let keywords = document.querySelector(".search").value;
    keyword = keywords
    console.log(keywords)
    fetch(`/api/attractions?keyword=${keywords}`).then(response => response.json()).then(searchData => {
        if (searchData["data"] != "null") {
            setNum = nextPage * 12;
            nextPage, page = searchData["nextPage"];
            dataLength = searchData["data"].length;
            let photoBox = document.querySelector(".images-box");
            photoBox.innerHTML = "";
            for (let x = 0; x < dataLength; x++) {
                i = x + setNum;
                //選擇父層
                let firstFa = document.querySelector(".images-box");
                //創建attraction
                let firstDiv = document.createElement("div");
                firstDiv.classList.add("attraction", "box" + i);
                firstFa.appendChild(firstDiv);
                let hidden = document.createElement("div");
                hidden.classList.add("hide-id");
                hidden.textContent = searchData["data"][x]["id"]
                firstDiv.appendChild(hidden);
                firstDiv.setAttribute("onclick", "GoBooking(this);");
                firstFa.appendChild(firstDiv)
                //創建image
                let image = document.querySelector(".box" + i);
                let imageDiv = document.createElement("img");
                imageDiv.classList.add("image", "imagesNum" + i)
                image.appendChild(imageDiv);
                //創建attraction-img
                let attractionImgDiv = document.createElement("img");
                attractionImgDiv.classList.add("attraction-img");
                image.appendChild(attractionImgDiv);
                attractionImgDiv.src = searchData["data"][x]["images"][0];
                image.appendChild(attractionImgDiv);
                //創建opacity
                let opacityDiv = document.createElement("div");
                opacityDiv.classList.add("opacity");
                image.appendChild(opacityDiv);
                //創建attraction-name
                let attractionNameDiv = document.createElement("div");
                attractionNameDiv.classList.add("attraction-name");
                attractionNameDiv.textContent = searchData["data"][x]["name"];
                image.appendChild(attractionNameDiv);
                //創建img-bottom
                let imgBottom = document.querySelector(".box" + i);
                let imgBottomDiv = document.createElement("div");
                imgBottomDiv.classList.add("img-bottom");
                imgBottom.appendChild(imgBottomDiv);
                //創建mrt-name
                let mrtNameDiv = document.createElement("div");
                mrtNameDiv.classList.add("mrt-name")
                mrtNameDiv.textContent = searchData["data"][x]["mrt"]
                imgBottom.appendChild(mrtNameDiv);
                //創建view-class
                let viewClassDiv = document.createElement("div");
                viewClassDiv.classList.add("view-class");
                viewClassDiv.textContent = searchData["data"][x]["category"]
                imgBottom.appendChild(viewClassDiv);
            }
        } else {
            alert("查無資料");
        }
    }).catch(error => {
        console.error("發生錯誤", error);
    });
};
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