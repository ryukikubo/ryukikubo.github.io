let levels = [];
let currentLevel = 0;
let remainingSeconds = 0;
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
        } else {
            startTimer();
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
}

function updateDisplay() {
    const level = levels[currentLevel];

    $("#level-title").text(`Level ${currentLevel + 1}`);

    if (level.type === "break") {
        $("#blind-display").text("BREAK");
        $("#timer").css("color", "#00bfff");
    } else {
        $("#blind-display").text(`${level.sb} / ${level.bb} (${level.ante})`);
        $("#timer").css("color", "#fff");
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
        $("#timer").css("color", "#ff4444");
    } else {
        // 通常レベルなら白、ブレイクなら緑
        if (level.type === "break") {
            $("#timer").css("color", "#4df658");
        } else {
            $("#timer").css("color", "#ffffff");
        }
    }

}
