const express = require("express"),
    router = express.Router(),
    dateBase = require("../dataBase"),
    labList = require("../model/lab-list");

// console.log 是顯示在後端終端機
router.get("/", async function (req, res, next) {
    const title = "Comments";
    res.locals.title = title;
    // 空陣列 存放 datebase 的資料
    const commentList = [];
    // 用 await 來等待回覆再繼續進行程式
    // 但 需把 function 改成 async function 不然會 crash
    const commentCollection = await dateBase.collection("commentList").orderBy("createdAt", "desc").limit(6).get();
    // 確認是否成功取得 [array]
    // console.log(commentCollection);
    // 用 forEach 取出
    commentCollection.forEach(doc => {
        // data() 方法 可以取出原始資料
        // .id 可以取出 文件Id
        // console.log(doc.data());
        // console.log(doc.id);
        const comment = doc.data(); // 物件
        comment.id = doc.id; // 把 id 加進 comment 物件裡 [其實也可不加，但我想加]
        if (comment.favorite == labList.length){
            comment.emoji = 'fas fa-poo';
            comment.mood = "colorRed";
        } else {
            comment.emoji = 'fas fa-thumbs-up';
            comment.mood = "colorBlue";
        }
        // 幫 favorite 找到對應得名稱 
        const labName = labList.find(item => item.id === comment.favorite);
        // 把 favorite 覆蓋成 lab 名字
        comment.favorite = labName.title;
        // console.log(comment.createdAt);
        // 時間設定
        let createdDate = comment.createdAt.split(" ")[0].split("/")
        let createdTime = comment.createdAt.split(" ")[1].split(":")
        createdDate[1] = createdDate[1].padStart(2,"0");
        createdDate[2] = createdDate[2].padStart(2,"0");
        createdDate = createdDate.join("/");
        createdTime.pop();
        createdTime = createdTime.join(":");
        comment.createdDate = createdDate;
        comment.createdTime = createdTime;
        // push 進陣列裡
        commentList.push(comment);
    })
    // 送去前端 EJS 模板裡 
    // console.log(commentList);
    res.locals.commentList = commentList;
    // 渲染 EJS
    res.render("comments");
});

module.exports = router;