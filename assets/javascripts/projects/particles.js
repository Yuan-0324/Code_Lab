// 環境變數 ------------------------------------------------------------------

let updateFPS = 30,
    showMouse = true,
    time = 0,
    bgColor = "#222";

// 控制 ---------------------------------------------------------------------
// data.gui 套件
let controls = {
    gCount: 3,
    gravity: 0.6,
    shrink: 0.97,
    spread: 10,
    red: 50,
    green: 255,
    blue: 255,
    forceField: 100,
    clearForce: function () {
        forceFields = [];
    }
}
let gui = new dat.GUI();
gui.add(controls, "gCount", 0, 15).step(1)
gui.add(controls, "gravity", -1, 1).step(0.01)
gui.add(controls, "shrink", 0, 0.99).step(0.01)
gui.add(controls, "spread", 0, 30).step(0.1)
gui.add(controls, "red", 0, 255).step(1)
gui.add(controls, "green", 0, 255).step(1)
gui.add(controls, "blue", 0, 255).step(1)
gui.add(controls, "forceField", -500, 500).step(1)
gui.add(controls, "clearForce")


// Vector ------------------------------------------------------------------

class Vec2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }
    // 重設
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    // 移動
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    // 相加
    add(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
    }
    // 相減
    sub(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
    }
    // 乘某數
    mult(num) {
        return new Vec2(this.x * num, this.y * num);
    }
    // 複製到
    clone() {
        return new Vec2(this.x, this.y);
    }
    // 更改名字 讓他不會顯示 object object
    toString() {
        return `( ${this.x}, ${this.y} )`;
    }
    // 檢查是否等於
    equal(v) {
        return this.x === v.x && this.y === v.y;
    }
    // 取得角度 
    get angle() {
        return Math.atan2(this.y, this.x);
    }
    get unit() {
        return this.mult(1 / this.length);
    }
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set length(nv) {
        let temp = this.unit.mult(nv);
        this.set(temp.x, temp.y);
    }
}

// Particle --------------------------------------------------------------
// 建立類別
class Particle {
    constructor(args) {
        let def = {
            position: new Vec2(),
            velocity: new Vec2(1, 0),
            acceleration: new Vec2(),
            r: 10,
            color: "#fff"
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.arc(0, 0, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.position = this.position.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration);
        this.velocity.move(0, controls.gravity);
        this.velocity = this.velocity.mult(0.99);
        this.r *= controls.shrink;

        // boundary check
        if (this.position.y + this.r > wh) {
            this.velocity.y = -Math.abs(this.velocity.y)
        }
        if (this.position.x + this.r > ww) {
            this.velocity.x = -Math.abs(this.velocity.x)
        }
        if (this.position.y + this.r < 0) {
            this.velocity.y = Math.abs(this.velocity.y)
        }
        if (this.position.x + this.r < 0) {
            this.velocity.x = Math.abs(this.velocity.x)
        }
    }
}

// Forcefield ------------------------------------------------------------

class ForceField {
    constructor(args) {
        let def = {
            position: new Vec2(),
            value: controls.forceField
        }
        Object.assign(def, args);
        Object.assign(this, def);
    }
    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.arc(0, 0, Math.sqrt(Math.abs(this.value)), 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.restore();
    }
    affect(particle) {
        let delta = particle.position.sub(this.position),
            len = this.value / (1 + delta.length),
            force = delta.unit.mult(len);
        particle.velocity.move(force.x, force.y);
    }
}

// Canvas ----------------------------------------------------------------

let canvas = document.getElementById("myCanvas"),
    ctx = canvas.getContext("2d");

function initCanvas() {
    ww = canvas.width = window.innerWidth;
    wh = canvas.height = window.innerHeight;
}
initCanvas();

// 繪製輔助 ---------------------------------

ctx.circle = function (v, r) {
    this.arc(v.x, v.y, r, 0, Math.PI * 2);
}
ctx.line = function (v1, v2) {
    this.moveTo(v1.x, v1.y);
    this.lineTo(v2.x, v2.y);
}

// 邏輯初始化 ------------------------------------------------------------------

let particles = [],
    forceFields = [];
function init() {

}

// 邏輯更新 ------------------------------------------------------------------

function update() {
    time++;
    particles = particles.concat(Array.from({ length: controls.gCount }, (d, i) => {
        return new Particle({
            position: mousePos.clone(),
            velocity: new Vec2(Math.random() * controls.spread - controls.spread / 2, Math.random() * controls.spread - controls.spread / 2),
            r: Math.random() * 30,
            color: `rgb(${parseInt(Math.random() * controls.red)},${parseInt(Math.random() * controls.green)},${controls.blue}`
        })
    }))
    particles.forEach(p => {
        p.update();
    })
    // clean particles

    // if (particles.length > 1600){
    //  delete particles.splice(0, controls.gCount)
    // }

    let sp = particles.slice();
    sp.forEach((p, i) => {
        forceFields.forEach(f => {
            f.affect(p)
            if (f.position.sub(p.position).length < Math.sqrt(Math.abs(f.value))) {
                if (p.r < Math.sqrt(Math.abs(f.value))) {
                    delete sp.splice(i, 1);
                }
            }
        })
        if (p.r < 0.3) {
            delete sp.splice(i, 1);
        }
    })
    particles = sp
}

// 畫面更新 ------------------------------------------------------------------

function draw() {
    // 清空背景 ---

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, ww, wh);

    // 繪製 ---

    particles.forEach(p => {
        p.draw();
    })
    forceFields.forEach(f => {
        f.draw();
    })
    // 滑鼠 ---

    // 紅色圓點
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.circle(mousePos, 3);
    ctx.fill();
    // 十字游標
    ctx.save();
    ctx.beginPath();
    ctx.translate(mousePos.x, mousePos.y);
    ctx.fillText(mousePos, 10, -10);
    ctx.strokeStyle = "red";
    let len = 20;
    ctx.line(new Vec2(-len, 0), new Vec2(len, 0));
    ctx.rotate(Math.PI / 2);
    ctx.line(new Vec2(-len, 0), new Vec2(len, 0));
    ctx.stroke();
    ctx.restore();
    // 重複執行
    requestAnimationFrame(draw);
}

// 讀取後執行 --------------------------------------------------------------

function loaded() {
    initCanvas();
    init();
    requestAnimationFrame(draw);
    setInterval(update, 1000 / updateFPS)
}

window.addEventListener("load", loaded)

// 畫面大小更新 ------------------------------------------------------------

window.addEventListener("resize", initCanvas)

// mouse Events ----------------------------------------------------------

let mousePos = new Vec2(0, 0),
    mouseDownPos = new Vec2(0, 0),
    mouseUpPos = new Vec2(0, 0);

window.addEventListener("mousemove", mouseMove);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);

function mouseMove(evt) {
    mousePos.set(evt.x, evt.y);
    // console.log(mousePos);
}
function mouseDown(evt) {
    mouseDownPos.set(evt.x, evt.y);;
    // console.log(mouseDownPos)
}
function mouseUp(evt) {
    mouseUpPos.set(evt.x, evt.y)
    // console.log(mouseUpPos)
}

window.addEventListener("dblclick", function (evt) {
    forceFields.push(new ForceField({
        position: new Vec2(evt.x, evt.y)
    }))
});