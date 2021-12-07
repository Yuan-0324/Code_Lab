const msgShow = document.getElementById("msgShow"),
    msgLeave = document.getElementById("msgLeave"),
    toLeaveMsg = document.getElementById("toLeaveMsg"),
    toShowMsg = document.getElementById("toShowMsg"),
    selectLab = document.getElementById("selectLab"),
    sendComment = document.getElementById("sendComment"),
    msgName = document.getElementById("msgName"),
    ufoMove = document.getElementById("ufoMove");

// 轉換留言
toLeaveMsg.addEventListener("click", () => {
    msgShow.style.animation = "flyOut 1s both";
    setTimeout(() => {
        msgLeave.style.transform = "scale(1)";
        msgLeave.style.animation = "fadeIn 1s both"
    }, 800)
});
toShowMsg.addEventListener("click", () => {
    msgLeave.style.animation = "flyOut 1s both";
    setTimeout(() => {
        msgShow.style.animation = "fadeIn 1s both"
    }, 800)
});

// 用 axios 取得 api
axios.get("/api/lab-list")
    .then(res => {
        // 抓取陣列
        console.log(res.data.labList);
        let labList = res.data.labList;
        labList.forEach(lab => {
            const opt = `<option value="${lab.id}">${lab.title}</option>`;
            selectLab.innerHTML += opt;
        });
    })
    .catch(err => {
        console.log(err);
    });

// 表單送出
sendComment.addEventListener("submit", (evt) => {
    evt.preventDefault();
    // console.log("Submit 成功");
    const comment = {
        name: commentName.value,
        favorite: selectLab.value,
        text: commentText.value,
        createdAt: new Date().toLocaleString()
    }
    // 用 axios post 送到後端
    axios.post("/api/lab/comment", comment)
        .then(res => {
            ufoMove.style.animation = "flyDown 4s";
            setTimeout(()=>{
                msgLeave.style.clipPath = "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)";
            },2000)
            setTimeout(()=>{
                alert("收到您的留言囉！")
                window.location = "/lab";
            },4000);
        })
        .catch(err => {
            console.log("err", err);
        });
});