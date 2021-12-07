function numChange(className) {
    $("." + className).click(() => {
        let x = $("." + className + " h1").text();
        x++;
        $("." + className + " h1").text(x);
        if (x > 9) {
            x = 0;
            $("." + className + " h1").text(x);
        }
    });
}

for (let i = 0; i < 3; i++) {
    numChange(`digit${i + 1}`);
}

let timer = null;
let startPause = 0;

$(".start").click(function () {
    startPause++;
    $(".timer").removeClass("red");
    $("[class^=digit]").addClass("jump").addClass("preventClick");
    $(".start").addClass("preventClick");
    $(".pause").removeClass("preventClick");
    let hun = $(".digit1 h1").text() * 100;
    let ten = $(".digit2 h1").text() * 10;
    let sin = $(".digit3 h1").text() * 1;
    sum = hun + ten + sin;
    clearInterval(timer);
    if (sum > 0) {
        timer = setInterval(() => {
            sum--;
            if (sum >= 100) {
                string = sum + "";
            } else if (sum < 100 && sum >= 10) {
                string = "0" + sum;
            } else if (sum < 10) {
                string = "00" + sum;
            }
            for (let i = 0; i < 3; i++) {
                $(`.digit${i + 1} h1`).text(string[`${i}`]);
            }

            if (sum === 0) {
                clearInterval(timer);
                $(".timer").addClass("red");
                $("[class^=digit]").removeClass("jump");
                $("[class^=digit] h1").addClass("alert");
                $("audio.long")[0].play();
            }
        }, 1000);
    } else {
        $(".timer").addClass("red");
        $("[class^=digit]").removeClass("jump");
    }
});

$(".pause").click(function () {
    startPause++;
    clearInterval(timer);
    $("[class^=digit]").removeClass("jump").removeClass("preventClick");
    $(".start").removeClass("preventClick");
});

$(".clear").click(function () {
    startPause = 0;
    clearInterval(timer);
    $(".timer").removeClass("red");
    $("[class^=digit]").removeClass("jump").removeClass("preventClick");
    $(".start").removeClass("preventClick");
    $("[class^=digit] h1").removeClass("alert");
    for (let i = 0; i < 3; i++) {
        $(`.digit${i + 1} h1`).text(0);
    }
});

$(window).keydown(function (evt) {
    let key = evt.key;
    console.log(evt.key);
    if (key === " ") {
        if (startPause % 2 === 0) {
            $(".timer").removeClass("red");
            $("[class^=digit]").addClass("jump").addClass("preventClick");
            $(".start").addClass("preventClick");
            $(".pause").removeClass("preventClick");
            let hun = $(".digit1 h1").text() * 100;
            let ten = $(".digit2 h1").text() * 10;
            let sin = $(".digit3 h1").text() * 1;
            sum = hun + ten + sin;
            clearInterval(timer);
            if (sum > 0) {
                timer = setInterval(() => {
                    sum--;
                    if (sum >= 100) {
                        string = sum + "";
                    } else if (sum < 100 && sum >= 10) {
                        string = "0" + sum;
                    } else if (sum < 10) {
                        string = "00" + sum;
                    }
                    for (let i = 0; i < 3; i++) {
                        $(`.digit${i + 1} h1`).text(string[`${i}`]);
                    }

                    if (sum === 0) {
                        clearInterval(timer);
                        $(".timer").addClass("red");
                        $("[class^=digit]").removeClass("jump");
                        $("[class^=digit] h1").addClass("alert");
                    }
                }, 1000);
            } else {
                $(".timer").addClass("red");
                $("[class^=digit]").removeClass("jump");
            }
            startPause++;
        } else {
            clearInterval(timer);
            $("[class^=digit]").removeClass("jump").removeClass("preventClick");
            $(".start").removeClass("preventClick");
            startPause++;
        }
    }
});

$("audio.long")[0].volume = 0.1;