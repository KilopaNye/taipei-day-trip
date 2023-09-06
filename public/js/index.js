function rightScroll() {
    let container = document.querySelector(".container");
    let containerWidth = container.offsetWidth;
    container.scrollLeft += containerWidth;
};

function leftScroll() {
    let container = document.querySelector(".container");
    let containerWidth = container.offsetWidth;
    container.scrollLeft -= containerWidth;
};

let page = 0;
console.log(page+"wwwwwwwwwwwwwwwwwwwwwwwwww")

fetch("/api/attractions").then(response => response.json()).then(data => {
    console.log("讀取成功", data);
    page = data["nextPage"];
    for (let i = 0; i < 12; i++) {
        //選擇父層
        let firstFa = document.querySelector(".images-box");
        //創建attraction
        let firstDiv = document.createElement("div");
        firstDiv.classList.add("attraction", "box" + i);
        firstFa.appendChild(firstDiv);
        //創建image
        let image = document.querySelector(".box" + i);
        let imageDiv = document.createElement("img");
        imageDiv.classList.add("image", "imagesNum" + i);
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
}).catch(error => {
    console.error("發生錯誤", error);
});

fetch("/api/mrts").then(response => response.json()).then(mrtdatas => {
    console.log("讀取成功", mrtdatas);
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
    pageGet = page;
    if (pageGet != null) {
        let pageNum = pageGet;
        fetch(`/api/attractions?page=${pageNum}&keyword=${keyword}`).then(response => response.json()).then(data => {
            console.log(keyword)
            console.log("讀取成功", data);
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
    }

    else {
        return;
    };
};

document.addEventListener("scrollend", function () {
    // 在元素滾動到頁面底部時，載入更多內容
    if (window.scrollY + window.screen.height >= document.body.scrollHeight) {
        loadMore();
    }
});

//測試load more用按鈕
let next = function () {
    loadMore();
};
//捷運站按鈕
function keywordSearch(key) {
    keyword = key.textContent;
    console.log(keyword)
    let placeholder = document.querySelector(".search")
    placeholder.value = keyword;
    fetch(`/api/attractions?keyword=${keyword}`).then(response => response.json()).then(data => {
        console.log("讀取成功", data);
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
        console.log("讀取成功", searchData);
        if (searchData["data"] != "null") {
            setNum = nextPage * 12;
            nextPage,page = searchData["nextPage"];
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

