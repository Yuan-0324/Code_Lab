const enteryBtn = document.getElementById("enteryBtn"),
    enteryHead = document.getElementById("enteryHead"),
    fallingStar = document.getElementById("fallingStar"),
    startBtn = document.getElementById("startBtn"),
    sectionGate = document.getElementById("sectiongate"),
    upperGate = document.getElementById("upperGate"),
    downGate = document.getElementById("downGate");

(function () {
    setTimeout(() => {
        upperGate.style.top = "-50.5vh";
        downGate.style.bottom = "-50.5vh";
    }, 600)
})()

enteryBtn.addEventListener("click", () => {
    enteryHead.classList.add("shrink");
    setTimeout(() => {
        fallingStar.classList.add("falling");
    }, 500)
});

startBtn.addEventListener("click", () => {
    console.log("click");
    upperGate.style.top = "0"
    downGate.style.bottom = "0"
    downGate.style.animation = "downBounce 1.7s 0.4s";
    upperGate.style.animation = "upBounce 1.7s 0.4s";
    setTimeout(() => {
        window.location.href = "/lab"
    }, 2150)
})