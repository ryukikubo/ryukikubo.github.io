let levels = [];
let currentLevel = 0;
let remainingSeconds = 0;
let totalTimeSeconds = 0;
let timerInterval = null;

// プリセット一覧
const presets = [
        {
        name: "Super Turbo 5min 100BB(20k stack)",
        levels:[
            { type: "normal", minutes: 5, sb: 100, bb: 200, ante: 0 },
            { type: "normal", minutes: 5, sb: 200, bb: 400, ante: 0 },
            { type: "normal", minutes: 5, sb: 300, bb: 600, ante: 0 },
            { type: "break", minutes: 5, sb: 0, bb: 0, ante: 0 },
            { type: "normal", minutes: 5, sb: 400, bb: 800, ante: 0 },
            { type: "normal", minutes: 5, sb: 500, bb: 1000, ante: 0 },
            { type: "normal", minutes: 5, sb: 600, bb: 1200, ante: 0 },
            { type: "break", minutes: 5, sb: 0, bb:0, ante: 0 },
            { type: "normal", minutes: 5, sb: 700, bb: 1400, ante: 0 },
            { type: "normal", minutes: 5, sb: 800, bb: 1600, ante: 0 },
            { type: "normal", minutes: 5, sb: 900, bb: 1800, ante: 0 },
            { type: "normal", minutes: 5, sb: 1000, bb: 2000, ante: 0 },
            { type: "normal", minutes: 5, sb: 1200, bb: 2400, ante: 0 },
            { type: "normal", minutes: 5, sb: 1500, bb: 3000, ante: 0 },
            { type: "break", minutes: 5, sb: 0, bb:0, ante: 0 },
            { type: "normal", minutes: 5, sb: 2000, bb: 4000, ante: 0 },
            { type: "normal", minutes: 5, sb: 2500, bb: 5000, ante: 0 },
            { type: "normal", minutes: 5, sb: 3000, bb: 6000, ante: 0 },
            { type: "normal", minutes: 5, sb: 3500, bb: 7000, ante: 0 },
            { type: "normal", minutes: 5, sb: 4000, bb: 8000, ante: 0 },
            { type: "break", minutes: 5, sb: 0, bb:0, ante: 0 },
            { type: "normal", minutes: 5, sb: 4500, bb: 9000, ante: 0 },
            { type: "normal", minutes: 5, sb: 5000, bb: 10000, ante: 0 },
            { type: "normal", minutes: 5, sb: 6000, bb: 12000, ante: 0 },
            { type: "normal", minutes: 5, sb: 7000, bb: 14000, ante: 0 },
            { type: "normal", minutes: 5, sb: 8000, bb: 16000, ante: 0 },
            { type: "normal", minutes: 5, sb: 9000, bb: 18000, ante: 0 },
            { type: "normal", minutes: 5, sb: 10000, bb: 20000, ante: 0 },
            { type: "normal", minutes: 5, sb: 15000, bb: 30000, ante: 0 },
            { type: "normal", minutes: 5, sb: 20000, bb: 40000, ante: 0 },
            { type: "normal", minutes: 5, sb: 25000, bb: 50000, ante: 0 },
            { type: "normal", minutes: 5, sb: 30000, bb: 60000, ante: 0 },
            { type: "normal", minutes: 5, sb: 40000, bb: 80000, ante: 0 },
            { type: "normal", minutes: 5, sb: 50000, bb: 100000, ante: 0 },
        ]
    },
    {
        name: "Turbo 10min 100BB(2k stack)",
        levels: [
            { type: "normal", minutes: 10, sb: 10, bb: 20, ante: 0 },
            { type: "normal", minutes: 10, sb: 10, bb: 20, ante: 20 },
            { type: "normal", minutes: 10, sb: 20, bb: 40, ante: 40 },
            { type: "break",  minutes: 5,  sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 10, sb: 30, bb: 60, ante: 60 },
            { type: "normal", minutes: 10, sb: 40, bb: 80, ante: 80 },
            { type: "normal", minutes: 10, sb: 50, bb: 100, ante: 100 },
            { type: "normal", minutes: 10, sb: 60, bb: 120, ante: 120 },
            { type: "normal", minutes: 10, sb: 70, bb: 140, ante: 140 },
            { type: "normal", minutes: 10, sb: 80, bb: 160, ante: 160 },
            { type: "normal", minutes: 10, sb: 90, bb: 180, ante: 180 },
            { type: "normal", minutes: 10, sb: 100, bb: 200, ante: 200 },
            { type: "break",  minutes: 10,  sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 10, sb: 120, bb: 240, ante: 240 },
            { type: "normal", minutes: 10, sb: 150, bb: 300, ante: 300 },
            { type: "normal", minutes: 10, sb: 200, bb: 400, ante: 400 },
            { type: "normal", minutes: 10, sb: 250, bb: 500, ante: 500 },
            { type: "normal", minutes: 10, sb: 300, bb: 600, ante: 600 },
            { type: "normal", minutes: 10, sb: 400, bb: 800, ante: 800 },
            { type: "normal", minutes: 10, sb: 500, bb: 1000, ante: 1000 },
            { type: "break",  minutes: 10,  sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 10, sb: 600, bb: 1200, ante: 1200 },
            { type: "normal", minutes: 10, sb: 700, bb: 1400, ante: 1400 },
            { type: "normal", minutes: 10, sb: 800, bb: 1600, ante: 1600 },
            { type: "normal", minutes: 10, sb: 900, bb: 1800, ante: 1800 },
            { type: "normal", minutes: 10, sb: 1000, bb: 2000, ante: 2000 },
            { type: "break",  minutes: 5,  sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 10, sb: 1500, bb: 3000, ante: 3000 },
            { type: "normal", minutes: 10, sb: 2000, bb: 4000, ante: 4000 },
            { type: "normal", minutes: 10, sb: 2000, bb: 4000, ante: 4000 },
            { type: "normal", minutes: 10, sb: 2500, bb: 5000, ante: 5000 },
            { type: "normal", minutes: 10, sb: 3000, bb: 6000, ante: 6000 },
            { type: "normal", minutes: 10, sb: 3500, bb: 7000, ante: 7000 },
            { type: "break",  minutes: 10,  sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 10, sb: 4000, bb: 8000, ante: 8000 },
            { type: "normal", minutes: 10, sb: 5000, bb: 10000, ante: 10000 },
            { type: "normal", minutes: 10, sb: 6000, bb: 12000, ante: 12000 },
            { type: "normal", minutes: 10, sb: 7000, bb: 14000, ante: 14000 },
            { type: "normal", minutes: 10, sb: 8000, bb: 16000, ante: 16000 },
            { type: "normal", minutes: 10, sb: 9000, bb: 18000, ante: 18000 },
            { type: "normal", minutes: 10, sb: 10000, bb: 20000, ante: 20000 },
        ]
    },
    {
        name: "Standard 15min",
        levels: [
            { type: "normal", minutes: 15, sb: 100, bb: 200, ante: 0 },
            { type: "normal", minutes: 15, sb: 200, bb: 400, ante: 0 },
            { type: "break",  minutes: 10, sb: 0,   bb: 0,   ante: 0 },
            { type: "normal", minutes: 15, sb: 300, bb: 600, ante: 0 }
        ]
    },
];

const bgs = [
    { title: "Deep Purple", key: "purple" },
    { title: "Neon Pink", key: "neon" },
    { title: "Ocean Blue", key: "ocean" },
    { title: "Sunset Orange", key: "sunset" },
    { title: "Emerald Green", key: "emerald" },
    { title: "Fire Red", key: "fire" },
    { title: "Cyber Blue", key: "cyber" },
    { title: "Gold Shine", key: "gold" },
    { title: "Ice Blue", key: "ice" },
    { title: "Dark Mode", key: "dark" }
];

currentBGIndex = 0;

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
        $("html, body").scrollTop(0);
        updateDisplay();
        $("#pause").text("Start");
        $("#pause").addClass("primary-btn");
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

    function getRealLevelNumber(index) {
        let count = 0;
        for (let i = 0; i <= index; i++) {
            if (levels[i].type !== "break") {
                count++;
            }
        }
        return count;
    }

    function nextLevel() {
        currentLevel++;
        if (currentLevel >= levels.length) {
            alert("Tournament finished");
            clearInterval(timerInterval);
            return;
        }

        if (levels[currentLevel].type === "break") {
            playSE("se-break");
        } else {
            playSE("se-levelup");
        }

        remainingSeconds = levels[currentLevel].minutes * 60;
        updateDisplay();
        updateChipStats()
    }

    function updateDisplay() {
        const level = levels[currentLevel];

        if (level.type === "break") {
            $("#level-title").text("");
        } else {
            const realLevel = getRealLevelNumber(currentLevel);
            $("#level-title").text(`Level ${realLevel}`);
        }

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

    // モーダル開く
    $("#open-preset").on("click", function () {
        $("#preset-modal").css("display", "flex");
    });

    $("#set-bg").on("click",function(){
        $("#bgset-modal").css("display","flex");
    })

    // モーダル閉じる
    $("#close-preset").on("click", function () {
        $("#preset-modal").hide();
    });

    $("#close-bg").on("click",function(){
        $("#bgset-modal").hide();
    })

    presets.forEach((preset, index) => {
        $("#preset-select").append(`
            <option value="${index}">${preset.name}</option>
        `);
    });

    bgs.forEach((bg, index) => {
        $("#bg-select").append(`
            <option value="${index}">${bg.title}</option>
        `);
    });

    // プリセット選択時の処理
    $("#apply-preset").on("click", function () {
        const index = $("#preset-select").val();
        const preset = presets[index];

        // 既存のレベル行をクリア
        $("#blind-list").empty();

        // プリセットのレベルを追加
        preset.levels.forEach(lv => {
            $("#blind-list").append(`
                <div class="blind-row">
                    <select class="level-type">
                        <option value="normal" ${lv.type === "normal" ? "selected" : ""}>normal</option>
                        <option value="break" ${lv.type === "break" ? "selected" : ""}>break</option>
                    </select>

                    <input type="number" class="level-min" value="${lv.minutes}">
                    <input type="number" class="sb" value="${lv.sb}">
                    <input type="number" class="bb" value="${lv.bb}">
                    <input type="number" class="ante" value="${lv.ante}">
                </div>
            `);
        });

        // モーダル閉じる
        $("#preset-modal").hide();

        $("#tournament-name").val(`${preset.name} - preset`);
    });

    $("#apply-bg").on("click", function () {
        const index = $("#bg-select").val();
        const bg = bgs[index];

        // すべての背景クラスを削除
        $("#timer-screen")
            .removeClass("bg-purple bg-neon bg-ocean bg-sunset bg-emerald bg-fire bg-cyber bg-gold bg-ice bg-dark")
            .addClass("bg-" + bg.key);

        $("#bgset-modal").hide();
    });

    $("#back-to-setup").on("click", function () {
        // タイマー停止
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // タイマー画面を隠す
        $("#timer-screen").hide();

        // 設定画面を表示
        $("#setup-screen").show();
    });

    function playSE(id) {
        const audio = document.getElementById(id);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
});