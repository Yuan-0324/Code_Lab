const express = require("express"),
    router = express.Router();

router.get("/", function (req, res, next) {
    const title = "Contact";
    res.locals.title = title;
    res.render("contact");
});

module.exports = router;