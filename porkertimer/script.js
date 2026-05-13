let levels = [];
let currentLevel = 0;
let remainingSeconds = 0;
let totalTimeSeconds = 0;
let timerInterval = null;

$(function () {

    // レベル追加
    $("#add-level").on("click", function () {
        $("#blind-list").append(`
            <div class="blind-row">
                <select class="level-type">
                    <option value="normal">normal</option>
                    <option value="break">break</option>
                </select>

                <input type="number" class="level-min" value="15">

                <input type="number" class="sb" value="0">
                <input type="number" class="bb" value="0">
                <input type="number" class="ante" value="0">
            </div>
        `);
    });

    // スタート
    $("#start").on("click", function () {
        levels = [];

        const title = $("#tournament-name").val();
        $("#tournament-title").text(title || "Poker Tournament");

        $(".blind-row").each(function () {
            const type = $(this).find(".level-type").val();
            const minutes = parseInt($(this).find(".level-min").val(), 10);
            const sb = $(this).find(".sb").val();
            const bb = $(this).find(".bb").val();
            const ante = $(this).find(".ante").val();

            levels.push({ type, minutes, sb, bb, ante });
        });

        currentLevel = 0;
        remainingSeconds = levels[0].minutes * 60;

        $("#setup-screen").hide();
        $("#timer-screen").show();

        updateDisplay();
        startTimer();
    });

    // 一時停止
    $("#pause").on("click", function () {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            $(this).text("Resume");
            $(this).addClass("primary-btn");
        } else {
            startTimer();
            $(this).removeClass("primary-btn");
            $(this).text("Pause");
        }
    });

    // 次のレベルへ
    $("#next-level").on("click", function () {
        nextLevel();
    });
});

function startTimer() {
    timerInterval = setInterval(function () {
        remainingSeconds--;
        totalTimeSeconds++;
        updateTotalTime();

        if (remainingSeconds <= 0) {
            nextLevel();
        }

        updateDisplay();
    }, 1000);
}

function nextLevel() {
    currentLevel++;
    if (currentLevel >= levels.length) {
        alert("Tournament finished");
        clearInterval(timerInterval);
        return;
    }

    remainingSeconds = levels[currentLevel].minutes * 60;
    updateDisplay();
    updateChipStats()
}

function updateDisplay() {
    const level = levels[currentLevel];

    $("#level-title").text(`Level ${currentLevel + 1}`);

    if (level.type === "break") {
        $("#blind-display").text("BREAK");
        $("#timer").css("color", "#35fb5d");
        $("#timer-screen").addClass("break-bg");
    } else {
        $("#blind-display").text(`${level.sb} / ${level.bb} (${level.ante})`);
        $("#timer").css("color", "#fff");
        $("#timer-screen").removeClass("break-bg");
    }

    const min = Math.floor(remainingSeconds / 60);
    const sec = ("0" + (remainingSeconds % 60)).slice(-2);
    $("#timer").text(`${min}:${sec}`);

    const next = levels[currentLevel + 1];
    if (!next) {
        $("#next-level-display").text("Next: --");
    } else if (next.type === "break") {
        $("#next-level-display").text("Next: BREAK");
    } else {
        $("#next-level-display").text(`Next: ${next.sb} / ${next.bb} (${next.ante})`);
    }

    if (remainingSeconds <= 180) {
        $("#timer").css("color", "#ff2020");
    }

    updateNextBreakTime();
}

$(document).on("click", ".plus, .minus", function () {
    const target = $(this).data("target");
    const span = $("#" + target);
    let value = parseInt(span.text(), 10);

    if ($(this).hasClass("plus")) {
        value++;
    } else {
        value = Math.max(0, value - 1);
    }

    span.text(value);
    updateChipStats();
});

function updateChipStats() {
    const players = parseInt($("#players-left").text(), 10);
    const buyins = parseInt($("#buyin-count").text(), 10);
    const buyinValue = parseInt($("#buyin-value").val(), 10);

    const total = (players + buyins) * buyinValue;
    const avg = players > 0 ? Math.floor( total / players) : 0;

    const currentBB = parseInt(levels[currentLevel].bb, 10);
    const totalBB = currentBB > 0 ? Math.floor(total / currentBB) : 0;
    const avgBB = currentBB > 0 ? Math.floor(avg / currentBB) : 0;

    // 表示
    $("#total-chips").text(`${total.toLocaleString()} (${totalBB} BB)`);
    $("#avg-stack").text(`${avg.toLocaleString()} (${avgBB} BB)`);

}

$("#buyin-value").on("input", updateChipStats);

function updateTotalTime() {
    const min = Math.floor(totalTimeSeconds / 60);
    const sec = ("0" + (totalTimeSeconds % 60)).slice(-2);
    $("#total-time").text(`${min}:${sec}`);
}

function updateNextBreakTime() {
    let secondsUntilBreak = 0;

    // 現在レベルの残り時間を足す
    secondsUntilBreak += remainingSeconds;

    // 現在レベルの次から break を探す
    for (let i = currentLevel + 1; i < levels.length; i++) {
        if (levels[i].type === "break") {
            break; // break レベルに到達したら終了
        }
        secondsUntilBreak += levels[i].minutes * 60;
    }

    // break が存在しない場合
    const nextBreakLevel = levels.find(l => l.type === "break");
    if (!nextBreakLevel) {
        $("#next-break").text("--");
        return;
    }

    // 時間表示に変換
    const min = Math.floor(secondsUntilBreak / 60);
    const sec = ("0" + (secondsUntilBreak % 60)).slice(-2);

    $("#next-break").text(`${min}:${sec}`);
}
