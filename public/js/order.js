TPDirect.setupSDK(137052, 'app_HMgXb7Gf1VPpFjYUWVPQez5o0fVHOVGqYp32OfVL2xE2ldCqzrhotPiC1Jiq', 'sandbox')
// Display ccv field
let fields = {
    number: {
        // css selector
        element: document.getElementById('card-number'),
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: document.getElementById('card-ccv'),
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': 'gray',
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

TPDirect.card.onUpdate(function (update) {
    let submitButton = document.querySelector('#submit')

    if (update.canGetPrime) {
        submitButton.removeAttribute('disabled')
    } else {
        submitButton.setAttribute('disabled', true)
    }
    // console.log(TPDirect.card.getTappayFieldsStatus())
})


function getUserInfo(result) {
    //訂購人資訊
    let prime = result.card.prime
    const orderName = document.querySelector(".order-name").value;
    const orderEmail = document.querySelector(".order-email").value;
    const orderPhone = document.querySelector(".order-phone").value;
    //景點資訊

    if(!orderName){
        alert("姓名不得為空");
    }else if(!orderEmail){
        alert("信箱不得為空");
    }else if(!orderPhone){
        alert("電話不得為空");
    }

    const name = document.querySelectorAll(".attraction_title");
    const date = document.querySelectorAll(".tour-date");
    const time = document.querySelectorAll(".tour-time");
    const price = document.querySelectorAll(".tour-price");
    const site = document.querySelectorAll(".tour-site");
    const imgUrl = document.querySelectorAll(".img-url");

    let attraction=[]
    let totalPrice=0;
    for(let i=0;i<name.length;i++){
        attraction.push({
            name:name[i].textContent.slice(6),
            date:date[i].textContent.slice(3),
            time:time[i].textContent.slice(3),
            price:price[i].textContent.slice(6, -2),
            address:site[i].textContent.slice(3),
            image:imgUrl[i].src,
            id:imgUrl[i].id
        })
        totalPrice+=parseInt(price[i].textContent.slice(6, -2));
    }

    let contact={
        orderName:orderName,
        orderEmail:orderEmail,
        orderPhone:orderPhone
    }
    let total={
        prime:prime,
        order:{
            totalPrice:totalPrice,
            contact,
            trip:{
                attraction:attraction
            }
        }
    }
    return total;
}

function OnSubmit() {
    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            console.error('getPrime error')
            alert("請檢查卡片是否能正常使用，或請填寫正確卡片內容")
            return;
        }
        let token = localStorage.getItem('token');
        let ResuleInfo = getUserInfo(result)
        let headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        fetch("/api/orders", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(ResuleInfo)
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(data["data"]["payment"]["status"]==0){
                let number = data["data"]["number"];
                window.location.href = `/thankyou?number=${number}`;
            }
        }).catch(error => {
            console.log(error);
        })
    })
}