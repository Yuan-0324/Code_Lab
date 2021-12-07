const { response } = require("express");

const express = require("express"),
    axios = require("axios"),
    router = express.Router(),
    dateBase = require("../dataBase"),
    labList = require("../model/lab-list");


// 開 api 給前端使用
router.get('/lab-list', function (req, res, next) {
    // 回傳資料給前端
    res.status(200).json({
        labList
        // 等於 labList: labList
    })
});

router.post("/lab/comment", function (req, res, next) {
    console.log("[留言新增]");
    console.log("[留言內容]", req.body)
    const comment = req.body;
    dateBase
        .collection("commentList")
        .add(comment)
        .then(response => {
            // 回應前端成功
            res.status(200).json({
                msg: `${comment.name}的留言收到囉`,
                data: comment,
                response: response
            })
        })
        .catch(error => {
            // 回應前端失敗
            res.status(500).json(error);
        })
});

module.exports = router;