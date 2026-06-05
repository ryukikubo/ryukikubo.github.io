let players = JSON.parse(localStorage.getItem("players")) || [];
let scoreTypes = JSON.parse(localStorage.getItem("scoreTypes")) || ["default"];
let pendingDeleteIndex = null;

const pastelCardColors = [
  ["#ffe7f0", "#f9f1ff"],
  ["#e7f8ff", "#e8f9e8"],
  ["#fff4e7", "#f9f1ff"],
  ["#e7fff9", "#e8f1ff"],
  ["#fff1e9", "#f7e8ff"],
  ["#f4f8ff", "#fef2f5"]
];

function save() {
  localStorage.setItem("players", JSON.stringify(players));
  localStorage.setItem("scoreTypes", JSON.stringify(scoreTypes));
}

/* ===== 描画（内訳表示） ===== */
function render() {
  $("#playerList").empty();

  let total = 0;

  players.forEach(p => {
    const [start, end] = pastelCardColors[Math.floor(Math.random() * pastelCardColors.length)];
    const bgStyle = `background: linear-gradient(145deg, ${start}, ${end});`;

    let detailHtml = "";

    Object.entries(p.scores).forEach(([k, v]) => {
      detailHtml += `<div class="score-detail">${k}: ${v.toLocaleString()}</div>`;
    });
    $("#playerList").append(`
      <li style="${bgStyle}">
        <button class="delete-player-btn" data-index="${players.indexOf(p)}" aria-label="Delete player">×</button>
        <div class="player-card-inner">
          <div><strong>${p.name}</strong></div>
          <div class="score-details">${detailHtml}</div>
        </div>
      </li>
    `);
  });
}

/* ===== Add Player開く時：入力欄生成 ===== */


$("#addPlayerBtn").click(() => {
  $("#scoreInputs").empty();

  // 名前
  $("#scoreInputs").append(`
    <div class="form-group">
      <label>Player Name</label>
      <input type="text" id="playerNameInput">
    </div>
  `);

  // スコア
  scoreTypes.forEach(item => {
    $("#scoreInputs").append(`
      <div class="score-row">
        <label>${item.name}</label>
        <input type="number"
               class="scoreInput"
               data-type="${item.name}"
               value="${item.default}">
      </div>
    `);
  });

  $("#addModal").show();
});



/* ===== Player登録 ===== */
$("#savePlayer").click(() => {
  const name = $("#playerNameInput").val();

  if (!name) return alert("名前入力");

  let scores = {};
  let valid = true;

  $(".scoreInput").each(function(){
    const type = $(this).data("type");
    const val = parseInt($(this).val());

    if (isNaN(val)) valid = false;

    scores[type] = val;
  });

  if (!valid) {
    alert("スコア入力不正");
    return;
  }

  players.push({ name, scores });

  save();
  render();
  $("#addModal").hide();
});

/* ===== Reset Scores ===== */
$("#resetBtn").click(() => {
  if (players.length === 0) {
    alert("No players to reset.");
    return;
  }

  if (!confirm("Reset all player scores to their default values?")) {
    return;
  }

  players = players.map(player => ({
    ...player,
    scores: scoreTypes.reduce((acc, item) => {
      acc[item.name] = item.default;
      return acc;
    }, {})
  }));

  save();
  render();
});

/* ===== Score Set ===== */
$("#scoreSetBtn").click(() => {
  renderScoreTypes();
  $("#scoreSetModal").show();
});

$("#addScoreType").click(() => {
  const val = $("#newScoreType").val().trim();
  if (!val) return;

  scoreTypes.push({
    name: val,
    default: 0   // ★初期値
  });

  $("#newScoreType").val("");
  renderScoreTypes();
});

function renderScoreTypes() {
  $("#scoreTypeList").empty();

  scoreTypes.forEach((item, index) => {
    $("#scoreTypeList").append(`
      <li class="score-type-row">
        <div class="type-left">
          <input type="text" class="type-name" value="${item.name}" data-index="${index}">
          <input type="number" class="type-default" value="${item.default}" data-index="${index}">
        </div>
        <button class="delete-btn" onclick="removeScoreType(${index})">×</button>
      </li>
    `);
  });
}

function removeScoreType(index) {
  scoreTypes.splice(index, 1);
  renderScoreTypes();
}

$("#saveScoreTypes").click(() => {

  let newTypes = [];

  let valid = true;

  $(".type-name").each(function(i){
    const name = $(this).val().trim();
    const def = parseInt($(".type-default").eq(i).val());

    if (!name || isNaN(def)) valid = false;

    newTypes.push({
      name: name,
      default: def
    });
  });

  if (!valid || newTypes.length === 0) {
    alert("入力不正");
    return;
  }

  scoreTypes = newTypes;
  players = []; // ★仕様

  save();
  render();

  $("#scoreSetModal").hide();
});

/* ===== Score Edit ===== */
$("#scoreEditBtn").click(() => {
  $("#scoreEditList").empty();

  // 初期1行
  $("#scoreEditList").append(createScoreRow());

  $("#scoreModal").show();
});

$("#addRowBtn").click(() => {
  $("#scoreEditList").append(createScoreRow());
});

$(document).on("click", ".delete-row", function(){
  $(this).closest(".score-edit-row").remove();
});

$(document).on("click", ".delete-player-btn", function(){
  pendingDeleteIndex = parseInt($(this).data("index"), 10);
  $("#deleteConfirmModal").show();
});

$("#confirmDeleteBtn").click(() => {
  if (pendingDeleteIndex === null) return;

  players.splice(pendingDeleteIndex, 1);
  pendingDeleteIndex = null;
  save();
  render();
  $("#deleteConfirmModal").hide();
});

function updateSelects() {
  $("#fromPlayer, #toPlayer, #scoreTypeSelect").empty();

  players.forEach((p, i) => {
    $("#fromPlayer, #toPlayer").append(
      `<option value="${i}">${p.name}</option>`
    );
  });

  scoreTypes.forEach(item => {
    $("#scoreTypeSelect").append(
      `<option value="${item.name}">${item.name}</option>`
    );
  });
}


$("#applyScore").click(() => {

  let valid = true;

  $(".score-edit-row").each(function(){

    const from = $(this).find(".from").val();
    const to   = $(this).find(".to").val();
    const type = $(this).find(".type").val();
    const amount = parseInt($(this).find(".amount").val());

    if (isNaN(amount)) valid = false;
    if (from === to) valid = false;

    players[from].scores[type] -= amount;
    players[to].scores[type] += amount;
  });

  if (!valid) {
    alert("入力エラー");
    return;
  }

  save();
  render();
  $("#scoreModal").hide();
});


function createScoreRow() {

  let playerOptions = "";
  let typeOptions = "";

  players.forEach((p, i) => {
    playerOptions += `<option value="${i}">${p.name}</option>`;
  });

  scoreTypes.forEach(item => {
    typeOptions += `<option value="${item.name}">${item.name}</option>`;
  });

  return `
    <div class="score-edit-row">

      <div class="score-row-top">
        <select class="from">${playerOptions}</select>
        <span class="arrow">→</span>
        <select class="to">${playerOptions}</select>
      </div>

      <div class="score-row-bottom">
        <select class="type">${typeOptions}</select>

        <input type="number" class="amount" placeholder="0">

        <button class="delete-row">×</button>
      </div>

    </div>
  `;
}


/* ===== 共通 ===== */
$(".close").click(() => $(".modal").hide());

render();
