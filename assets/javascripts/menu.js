const upperG = document.getElementById("upperG"),
    downG = document.getElementById("downG"),
    timerLab = document.getElementById("timerLab"),
    particlesLab = document.getElementById("particlesLab"),
    snakeLab = document.getElementById("snakeLab"),
    blockLab = document.getElementById("blockLab"),
    ballLab = document.getElementById("ballLab"),
    castleLab = document.getElementById("castleLab");

// IIFE 練習
// 進場的開門
window.addEventListener("load", () => {
    (function () {
        setTimeout(() => {
            upperG.style.top = "-50vh";
            downG.style.bottom = "-50vh";
        }, 500);
    })();
})

timerLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/timer";
    }, 700)
});

particlesLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/particles";
    }, 700)
});

snakeLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/snake";
    }, 700)
});

blockLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/block";
    }, 700)
});

ballLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/ball";
    }, 700)
});

castleLab.addEventListener("click", () => {
    leftGate.style.left = "0%";
    rightGate.style.right = "0%";
    setTimeout(() => {
        window.location = "/lab/castle";
    }, 700)
});