const homePage = document.getElementById("homePage"),
    labPage = document.getElementById("labPage"),
    commentsPage = document.getElementById("commentsPage"),
    contactPage = document.getElementById("contactPage"),
    navBar = document.getElementById("navBar"),
    leftGate = document.getElementById("leftGate"),
    rightGate = document.getElementById("rightGate"),
    goBackLab = document.getElementById("goBackLab"),
    labGateL = document.getElementById("labGateL"),
    labGateR = document.getElementById("labGateR");

// 開關門
window.addEventListener("load", () => {
    if (leftGate && rightGate) {
        // 也可以不用 IIFE
        (function () {
            setTimeout(() => {
                leftGate.style.left = "-62%";
                rightGate.style.right = "-62%";
            }, 500)
            setTimeout(() => {
                navBar.style.top = "0px";
            }, 1100);
        })()
    }
})

let navBtn = [homePage, labPage, commentsPage, contactPage];

// 因為是共用檔案 所以加入 if 來防止錯誤產生

// 一起加入事件監聽
if (homePage && labPage && commentsPage && contactPage) {
    navBtn.forEach(item => {
        item.addEventListener("click", () => {
            leftGate.style.left = "0%";
            rightGate.style.right = "0%";
            if (item.textContent === "Home") {
                setTimeout(() => {
                    window.location.href = "/";
                }, 700)
            } else if (item.textContent === "Laboratory") {
                setTimeout(() => {
                    window.location.href = "/lab";
                }, 700)
            } else if (item.textContent === "Comments") {
                setTimeout(() => {
                    window.location.href = "/comments";
                }, 700)
            } else if (item.textContent === "Contact") {
                setTimeout(() => {
                    window.location.href = "/contact";
                }, 700)
            }
        });
    });
}

if (labGateL && labGateR) {
    (function () {
        setTimeout(() => {
            labGateL.style.bottom = "-100%";
            labGateL.style.left = "-100%";
            labGateR.style.top = "-100%";
            labGateR.style.right = "-100%";
        }, 500)
    })()
}

// 實驗區的回上一頁

if (goBackLab) {
    goBackLab.addEventListener("click", () => {
        labGateL.style.bottom = "0";
        labGateL.style.left = "0";
        labGateR.style.top = "0";
        labGateR.style.right = "0";
        setTimeout(() => {
            window.location = "/lab"
        }, 1100)
    });
}
