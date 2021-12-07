// 向量 類別
class Vector {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    add(vec) {
        return new Vector(this.x + vec.x, this.y + vec.y);
    }
    sub(vec) {
        return new Vector(this.x - vec.x, this.y - vec.y);
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
    }
    equal(vec) {
        return this.x === vec.x && this.y === vec.y
    }
    mult(num) {
        return new Vector(this.x * num, this.y * num);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
}
// 蛇 類別
class Snake {
    constructor() {
        this.body = [];
        this.maxLength = 5;
        this.head = new Vector();
        this.speed = new Vector(1, 0);
        this.direction = "Right";
    }
    update() {
        let newHead = this.head.add(this.speed);
        this.body.push(this.head);
        this.head = newHead
        while (this.body.length > this.maxLength) {
            this.body.shift()
        }
    }
    setDirection(dir) {
        let target;
        if (dir === "Up") {
            target = new Vector(0, -1)
        }
        if (dir === "Down") {
            target = new Vector(0, 1)
        }
        if (dir === "Left") {
            target = new Vector(-1, 0)
        }
        if (dir === "Right") {
            target = new Vector(1, 0)
        }
        if (!target.equal(this.speed.mult(-1))) {
            this.speed = target
        }
    }
    checkBoundary(gameWidth) {
        let xInRange = 0 <= this.head.x && this.head.x <= gameWidth;
        let yInRange = 0 <= this.head.y && this.head.y <= gameWidth;
        return xInRange && yInRange;
    }
}
// 遊戲 類別
class Game {
    constructor() {
        this.boxWidth = 12;
        this.boxSpace = 2;
        this.gameWidth = 40;
        this.speed = 30;
        this.snake = new Snake();
        this.food = [];
        this.start = false;
    }
    // 初始化設定
    init() {
        this.canvas = document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.boxWidth * this.gameWidth + (this.gameWidth - 1) * this.boxSpace;
        this.canvas.height = this.canvas.width;
        this.render();
        this.update();
        this.showFood();
        this.showFood();
        this.showFood();
        this.showFood();
    }
    startGame() {
        this.start = true;
        this.snake = new Snake();
        $(".panel").hide();
        this.playSound("C#5", -20);
        this.playSound("E5", -20, 200);
    }
    endGame() {
        this.start = false;
        $("h2").text("Score: " + (this.snake.maxLength - 5) * 10)
        $(".panel").show();
        this.playSound("A3");
        this.playSound("E2", -10, 200);
        this.playSound("A2", -10, 400);
    }
    getPosition(x, y) {
        return new Vector(x * this.boxWidth + (x - 1) * this.boxSpace, y * this.boxWidth + (y - 1) * this.boxSpace);
    }
    drawBlock(v, color) {
        this.ctx.fillStyle = color;
        let pos = this.getPosition(v.x, v.y);
        this.ctx.fillRect(pos.x, pos.y, this.boxWidth, this.boxWidth);
    }
    drawEffect(x, y) {
        let r = 2;
        let pos = this.getPosition(x, y);
        let effect = () => {
            r++;
            this.ctx.strokeStyle = `rgba(255,0,0,${(100 - r) / 100})`;
            this.ctx.beginPath();
            this.ctx.arc(pos.x + this.boxWidth / 2, pos.y + this.boxWidth / 2, r, 0, Math.PI * 2);
            this.ctx.stroke();
            if (r < 100) {
                requestAnimationFrame(effect);
            }
        }
        requestAnimationFrame(effect);
    }
    // 畫面繪製
    render() {
        this.ctx.fillStyle = "rgba(0,0,0,0.3)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (let x = 0; x < this.gameWidth; x++) {
            for (let y = 0; y < this.gameWidth; y++) {
                this.drawBlock(new Vector(x, y), "rgba(255,255,255,0.03)")
            }
        }
        this.snake.body.forEach((sp, i) => {
            this.drawBlock(sp, "white");
        })
        this.food.forEach((p) => {
            this.drawBlock(p, "red");
        })
        requestAnimationFrame(() => {
            this.render();
        })
    }
    showFood() {
        let x = parseInt(Math.random() * this.gameWidth);
        let y = parseInt(Math.random() * this.gameWidth);
        this.food.push(new Vector(x, y));
        this.drawEffect(x, y);
        this.playSound("E5", -30);
        this.playSound("A5", -30, 10);

    }
    update() {
        if (this.start) {
            this.playSound("A2", -50);
            this.snake.update();
            this.food.forEach((food, i) => {
                if (this.snake.head.equal(food)) {
                    this.snake.maxLength++;
                    this.food.splice(i, 1);
                    this.showFood();
                }
            })
            this.snake.body.forEach(bodyPoint => {
                if (this.snake.head.equal(bodyPoint)) {
                    console.log("撞擊");
                    this.endGame();
                }
            })
            if (!this.snake.checkBoundary(this.gameWidth)) {
                this.endGame();
            }
        }
        this.speed = Math.sqrt(this.snake.body.length) + 5
        setTimeout(() => {
            this.update();
        }, 1000 / this.speed)
    }
    playSound(note, volumn, when) {
        setTimeout(() => {
            let synth = new Tone.Synth().toDestination();
            synth.voulmn = volumn || -12;
            synth.triggerAttackRelease(note, "8n");
        }, when || 0)
    }
}

let game = new Game()
game.init();

$(window).keydown(function (evt) {
    console.log(evt.key);
    game.snake.setDirection(evt.key.replace("Arrow", ""));
})