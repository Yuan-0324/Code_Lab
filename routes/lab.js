const express = require("express"),
    router = express.Router();

router.get("/", function (req, res, next) {
    // 把 title 傳到 EJS
    const title = "Lab";
    res.locals.title = title;
    res.render("lab");
});

router.get("/timer", function (req, res, next) {
    const title = "Timer";
    res.locals.title = title;
    res.render("project/timer");
});

router.get("/particles", function (req, res, next) {
    const title = "Particles";
    res.locals.title = title;
    res.render("project/particles");
});

router.get("/snake", function (req, res, next) {
    const title = "Snake";
    res.locals.title = title;
    res.render("project/snake");
});


router.get("/block", function (req, res, next) {
    const title = "Block";
    res.locals.title = title;
    res.render("project/block");
});

router.get("/ball", function (req, res, next) {
    const title = "Ball";
    res.locals.title = title;
    res.render("project/ball");
});

router.get("/castle", function (req, res, next) {
    const title = "Castle";
    res.locals.title = title;
    res.render("project/castle");
});

module.exports = router;