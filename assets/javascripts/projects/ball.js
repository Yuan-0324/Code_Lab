// GameObject Object Constructor

var GameObject = function (position, size, selector) {
    this.$el = $(selector);
    this.position = position;
    this.size = size;
    this.$el.css("position", "absolute");
    this.updateCss()
}
GameObject.prototype.updateCss = function () {
    this.$el.css("left", this.position.x + "px");
    this.$el.css("top", this.position.y + "px");
    this.$el.css("width", this.size.width + "px");
    this.$el.css("height", this.size.height + "px");
}
GameObject.prototype.collide = function (otherObject) {
    let otherPos = otherObject.position
    let isRangeX = otherPos.x + otherObject.size.width >= this.position.x && otherPos.x <= this.position.x + this.size.width;
    let isRangeY = otherPos.y + otherObject.size.height >= this.position.y && otherPos.y <= this.position.y + this.size.height;
    return isRangeX && isRangeY
}

// Ball Object Constructor

var Ball = function () {
    this.size = { width: 15, height: 15 };
    this.position = { x: 250, y: 250 };
    this.velocity = { x: -1, y: 2 };
    GameObject.call(this, this.position, this.size, ".ball");
}
Ball.prototype = Object.create(GameObject.prototype)
Ball.prototype.constructor = Ball;
Ball.prototype.update = function () {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.updateCss();
    if (this.position.x < 0 || this.position.x > 485) {
        this.velocity.x = -this.velocity.x
    }
    if (this.position.y < 0 || this.position.y > 485) {
        this.velocity.y = -this.velocity.y
    }
}
Ball.prototype.init = function () {
    this.position = { x: 250, y: 250 };
    // let speed = 4;
    let angle = Math.random() * Math.PI * 2 // 0 - 360 隨機角度
    this.velocity = { x: 8 * Math.cos(angle), y: 8 * Math.sin(angle) };
    this.update()
}

// Board Object Constructor

var Board = function (position, selector) {
    this.size = { width: 100, height: 15 };
    GameObject.call(this, position, this.size, selector)
}
Board.prototype = Object.create(GameObject.prototype);
Board.prototype.constructor = Board;
Board.prototype.update = function () {
    if (this.position.x < 0) {
        this.position.x = 0
    }
    if (this.position.x + this.size.width > 500) {
        this.position.x = 500 - this.size.width
    }
    this.updateCss()
}

// Game Obect Constructor

var Game = function () {
    this.timer = null;
    this.grade = 0;
    this.control = {}
    this.initControl()
}
Game.prototype.initControl = function () {
    // let that = this
    // 用 bind 做 this 綁定
    $(window).keydown(function (evt) {
        this.control[evt.key] = true;
    }.bind(this))
    // 或用箭頭函數 來讓裡面的 this 綁到外面
    $(window).keyup(evt => {
        this.control[evt.key] = false;
    })
}
Game.prototype.startGame = function () {
    $(".infoText").text("Ready")
    var time = 3;
    ball.init()
    $(".start").hide()
    var timer = setInterval(() => {
        $(".infoText").text(time)
        time--;
        if (time < 0) {
            clearInterval(timer);
            $(".info").hide()
            this.startGameMain();
        }
    }, 1000)
}
Game.prototype.startGameMain = function () {
    // 用箭頭函數 讓 this 綁到外面
    this.timer = setInterval(() => {
        if (boardOne.collide(ball)) {
            // console.log("Hit BoardOne")
            ball.velocity.y = - ball.velocity.y;
            ball.velocity.y *= 1.1;
            ball.velocity.x *= 1.1;
            ball.velocity.x += 0.5 - Math.random();
            ball.velocity.y += 0.5 - Math.random();
        }
        if (boardTwo.collide(ball)) {
            // console.log("Hit BoardTwo")
            ball.velocity.y = - Math.abs(ball.velocity.y);
            this.grade += 10;
        }
        if (ball.position.y < 0) {
            // console.log("board one Lose")
            this.GameEnd("Computer Lose")
        }
        if (ball.position.y > 485) {
            // console.log("board two lose")
            this.GameEnd("You Lose")
        }
        if (this.control["ArrowRight"] || this.control["d"] || this.control["D"]) {
            // console.log("Move Right")
            boardTwo.position.x += 10
        }
        if (this.control["ArrowLeft"] || this.control["a"] || this.control["A"]) {
            // console.log("Move Left")
            boardTwo.position.x -= 10
        }
        boardOne.position.x += boardOne.position.x + boardOne.size.width / 2 < ball.position.x ? 12 : 0
        boardOne.position.x += boardOne.position.x + boardOne.size.width / 2 > ball.position.x ? -12 : 0
        boardOne.update();
        boardTwo.update();
        ball.update()
        $(".grade").text(this.grade);
    }, 30)
}
Game.prototype.GameEnd = function (result) {
    clearInterval(this.timer);
    $(".info").show();
    $(".start").show()
    $(".infoText").html(`Game Over<br>${result} <br>Score: ${this.grade}`);
    this.grade = 0
}


let ball = new Ball()
let boardOne = new Board({ x: 175, y: 30 }, ".b1")
let boardTwo = new Board({ x: 175, y: 455 }, ".b2")
let game = new Game()