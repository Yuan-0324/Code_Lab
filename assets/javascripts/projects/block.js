let blockData = [
    { selector: ".block1", name: "1", pitch: "1" },
    { selector: ".block2", name: "2", pitch: "2" },
    { selector: ".block3", name: "3", pitch: "3" },
    { selector: ".block4", name: "4", pitch: "4" },
    { selector: ".block5", name: "5", pitch: "5" },
    { selector: ".block6", name: "6", pitch: "6" },
    { selector: ".block7", name: "7", pitch: "7" },
    { selector: ".block8", name: "8", pitch: "8" },
    { selector: ".block9", name: "9", pitch: "4.5" },
]
let soundSetData = [
    { name: "correct", set: [1, 3, 5, 8] },
    { name: "inCorrect", set: [2, 4, 5.5, 7] }
]
let levelData = [
    "11123 33345 56543 55231",
    "22 3259 22 3265 22 27593 117565",
    "165165 123533212 5536531 23651",
    "5552332 77665 555 555 5555555 5552332 77665",
    "333 333 35123 4444433 322325 333 333 35123 4444433 55421",
    "53453455665 321321 66115 611551 22123 53453455665 66532122551"
]
const Blocks = function (blockAssign, setAssign) {
    this.allOn = false;
    this.blocks = blockAssign.map((data, index) => ({
        name: data.name,
        element: $(data.selector),
        audio: this.getAudioObject(data.pitch)
    }))
    this.soundSets = setAssign.map((data, index) => ({
        name: data.name,
        set: data.set.map(pitch => this.getAudioObject(pitch))
    }))
}
Blocks.prototype.getAudioObject = function (pitch) {
    return new Audio(`https://awiclass.monoame.com/pianosound/set/${pitch}.wav`);
}
Blocks.prototype.playSound = function (type) {
    let sounds = this.soundSets.find(set => set.name === type).set;
    sounds.forEach((play, index) => {
        play.currentTime = 0;
        let soundDely = (index + 1) * 100;
        console.log(index);
        setTimeout(() => {
            play.play();
        }, soundDely)
    })
}
Blocks.prototype.flash = function (note) {
    let block = this.blocks.find(d => d.name === note);
    if (block) {
        block.audio.currentTime = 0;
        block.audio.play();
        block.element.addClass("active");
        setTimeout(() => {
            if (!this.allOn) {
                block.element.removeClass("active");
            }
        }, 100)
    }
}
Blocks.prototype.turnAllOn = function () {
    this.allOn = true;
    this.blocks.forEach(block => {
        block.element.addClass("active");
    })
}
Blocks.prototype.turnAllOff = function () {
    this.allOn = false;
    this.blocks.forEach(block => {
        block.element.removeClass("active");
    })
}

const Game = function () {
    this.blocks = new Blocks(blockData, soundSetData);
    this.levels = levelData;
    this.currentLevel = 0;
    this.playInterval = 500;
    this.mode = "waiting";
    this.deg = 0;
}
// Game.prototype.getLevels = function() {
//   let that = this;
//   $.ajax({
//     url: "https://2017.awiclass.monoame.com/api/demo/memorygame/leveldata",
//     success: (res)=>{
//       this.levels = res;
//     }
//   })
// }
Game.prototype.startLevel = function () {
    $(".start").hide();
    this.showMessage("Level " + this.currentLevel);
    let level = this.levels[this.currentLevel];
    this.gameStart(level);
}
Game.prototype.showMessage = function (mes) {
    console.log(mes);
    $(".status").text(mes);
}
Game.prototype.gameStart = function (answer) {
    this.mode = "gamePlay";
    this.answer = answer.split(" ").join("");
    let note = answer.split("");
    this.blocks.turnAllOff();
    this.showStatus("");
    this.timer = setInterval(() => {
        let char = note.shift();
        this.playNote(char);
        if (!note.length) {
            clearInterval(this.timer);
            $(".blocks").velocity({
                transform: [`rotate(${this.deg + 90}deg)`, "linear", `rotate(${this.deg}deg)`]
            }, {
                duration: 200,
                delay: 500
            })
            $(".block").velocity({
                transform: [`rotate(${this.deg + 90}deg)`, "linear", `rotate(${this.deg}deg)`]
            }, {
                duration: 200,
                delay: 500
            })
            this.deg += 90;
            this.startUserInput();
        }
    }, this.playInterval);
}
Game.prototype.playNote = function (note) {
    this.blocks.flash(note);
}
Game.prototype.startUserInput = function () {
    this.input = "";
    this.mode = "userInput";
}
Game.prototype.userSendInput = function (inputChar) {
    if (this.mode === "userInput") {
        let tempString = this.input + inputChar;
        this.playNote(inputChar)
        this.showStatus(tempString);
        if (this.answer.indexOf(tempString) === 0) {
            console.log("GOOD");
            if (this.answer === tempString) {
                this.showMessage("CORRECT");
                this.currentLevel += 1;
                this.mode = "waiting";
                setTimeout(() => {
                    this.startLevel();
                }, 2000)
            }
        } else {
            this.showMessage("WRONG");
            this.currentLevel = 0;
            this.deg = 0;
            this.mode = "waiting";
            $(".start").show();
        }
        this.input += inputChar;
        console.log(tempString);
    }
}
Game.prototype.showStatus = function (tempString) {
    $(".inputStatus").html("");
    this.answer.split("").forEach((data, index) => {
        let circle = $("<div class='circle'></div>");
        $(".inputStatus").append(circle);
        if (index < tempString.length) {
            circle.addClass("correct");
        }
        if (tempString === this.answer) {
            $(".inputStatus").addClass("correct");
            setTimeout(() => {
                this.blocks.playSound("correct");
                this.blocks.turnAllOn();
            }, 300);
        } else {
            $(".inputStatus").removeClass("correct");
        }
        if (this.answer.indexOf(tempString) != 0) {
            $(".inputStatus").addClass("wrong");
            setTimeout(() => {
                this.blocks.playSound("inCorrect");
                this.blocks.turnAllOn();
            }, 300)
        } else {
            $(".inputStatus").removeClass("wrong");
        }
    })
}


const game = new Game();