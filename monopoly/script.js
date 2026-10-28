// --- Web Audio API ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        function playSound(type) {
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume();
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                const now = audioCtx.currentTime;

                if (type === 'dice') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(140, now);
                    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                    osc.start(now); osc.stop(now + 0.08);
                } else if (type === 'buy') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.setValueAtTime(880, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now); osc.stop(now + 0.2);
                } else if (type === 'boost') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now); osc.stop(now + 0.25);
                } else if (type === 'pay') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now); osc.stop(now + 0.15);
                } else if (type === 'go') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(659.25, now + 0.08);
                    osc.frequency.setValueAtTime(783.99, now + 0.16);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now); osc.stop(now + 0.3);
                } else if (type === 'double') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, now);
                    osc.frequency.setValueAtTime(880, now + 0.12);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now); osc.stop(now + 0.3);
                } else if (type === 'sell') {
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(200, now);
                    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now); osc.stop(now + 0.2);
                }
            } catch(e){}
        }

        // --- 外周全28マス定義 ---
        const BOARD_TILES = [
            { id: 0, gridCol: 8, gridRow: 8, name: "START", type: "go", price: 0, rent: 0 },
            { id: 1, gridCol: 7, gridRow: 8, name: "浅草", type: "property", group: 1, price: 60, rent: 10, housePrice: 50, color: "#955251" },
            { id: 2, gridCol: 6, gridRow: 8, name: "チャンス", type: "chance", price: 0, rent: 0 },
            { id: 3, gridCol: 5, gridRow: 8, name: "上野", type: "property", group: 1, price: 80, rent: 14, housePrice: 50, color: "#955251" },
            { id: 4, gridCol: 4, gridRow: 8, name: "所得税", type: "tax", price: 0, rent: 60 },
            { id: 5, gridCol: 3, gridRow: 8, name: "秋葉原", type: "property", group: 2, price: 100, rent: 18, housePrice: 60, color: "#38bdf8" },
            { id: 6, gridCol: 2, gridRow: 8, name: "神田", type: "property", group: 2, price: 120, rent: 22, housePrice: 60, color: "#38bdf8" },
            { id: 7, gridCol: 1, gridRow: 8, name: "刑務所", type: "jail", price: 0, rent: 0 },

            { id: 8, gridCol: 1, gridRow: 7, name: "池袋", type: "property", group: 3, price: 140, rent: 26, housePrice: 70, color: "#ec4899" },
            { id: 9, gridCol: 1, gridRow: 6, name: "チャンス", type: "chance", price: 0, rent: 0 },
            { id: 10, gridCol: 1, gridRow: 5, name: "高田馬場", type: "property", group: 3, price: 150, rent: 28, housePrice: 70, color: "#ec4899" },
            { id: 11, gridCol: 1, gridRow: 4, name: "新宿", type: "property", group: 3, price: 160, rent: 32, housePrice: 70, color: "#ec4899" },
            { id: 12, gridCol: 1, gridRow: 3, name: "原宿", type: "property", group: 4, price: 180, rent: 36, housePrice: 90, color: "#f97316" },
            { id: 13, gridCol: 1, gridRow: 2, name: "表参道", type: "property", group: 4, price: 200, rent: 40, housePrice: 90, color: "#f97316" },
            { id: 14, gridCol: 1, gridRow: 1, name: "不動産取引所", type: "exchange", price: 0, rent: 0 },

            { id: 15, gridCol: 2, gridRow: 1, name: "渋谷", type: "property", group: 4, price: 220, rent: 44, housePrice: 90, color: "#f97316" },
            { id: 16, gridCol: 3, gridRow: 1, name: "チャンス", type: "chance", price: 0, rent: 0 },
            { id: 17, gridCol: 4, gridRow: 1, name: "恵比寿", type: "property", group: 5, price: 240, rent: 48, housePrice: 110, color: "#ef4444" },
            { id: 18, gridCol: 5, gridRow: 1, name: "代官山", type: "property", group: 5, price: 260, rent: 52, housePrice: 110, color: "#ef4444" },
            { id: 19, gridCol: 6, gridRow: 1, name: "特別税", type: "tax", price: 0, rent: 100 },
            { id: 20, gridCol: 7, gridRow: 1, name: "六本木", type: "property", group: 5, price: 280, rent: 56, housePrice: 110, color: "#ef4444" },
            { id: 21, gridCol: 8, gridRow: 1, name: "即収監", type: "gotojail", price: 0, rent: 0 },

            { id: 22, gridCol: 8, gridRow: 2, name: "赤坂", type: "property", group: 6, price: 300, rent: 62, housePrice: 130, color: "#eab308" },
            { id: 23, gridCol: 8, gridRow: 3, name: "麻布十番", type: "property", group: 6, price: 320, rent: 68, housePrice: 130, color: "#eab308" },
            { id: 24, gridCol: 8, gridRow: 4, name: "チャンス", type: "chance", price: 0, rent: 0 },
            { id: 25, gridCol: 8, gridRow: 5, name: "品川", type: "property", group: 7, price: 350, rent: 76, housePrice: 150, color: "#10b981" },
            { id: 26, gridCol: 8, gridRow: 6, name: "丸の内", type: "property", group: 7, price: 380, rent: 84, housePrice: 150, color: "#10b981" },
            { id: 27, gridCol: 8, gridRow: 7, name: "銀座", type: "property", group: 8, price: 420, rent: 100, housePrice: 180, color: "#6366f1" }
        ];

        const CHANCE_CARDS = [
            { text: "臨時ボーナス！$120を獲得", money: 120 },
            { text: "スピード違反！$50を支払う", money: -50 },
            { text: "臨時収入！$80を獲得", money: 80 },
            { text: "GOのマスへ直行！", moveTo: 0 }
        ];

        const PLAYER_COLORS = [
            { bg: "bg-red-500", border: "border-red-500", hex: "#ef4444", icon: "fa-user" },
            { bg: "bg-blue-500", border: "border-blue-500", hex: "#3b82f6", icon: "fa-robot" },
            { bg: "bg-emerald-500", border: "border-emerald-500", hex: "#10b981", icon: "fa-user-ninja" },
            { bg: "bg-amber-500", border: "border-amber-500", hex: "#f59e0b", icon: "fa-cat" }
        ];

        const DICE_ICONS = ["", "fa-dice-one", "fa-dice-two", "fa-dice-three", "fa-dice-four", "fa-dice-five", "fa-dice-six"];

        let gameState = {
            players: [],
            currentPlayerIdx: 0,
            properties: {},
            isRollPhase: true,
            hasExtraRoll: false,
            isAiGame: true,
            selectedCount: 2,
            isBusy: false
        };

        let infoModalResolver = null;
        let exchangeModalResolver = null;
        let buildModalResolver = null;
        let liquidationModalResolver = null;

        let selectedBuildTier = null;
        let liquidationState = {
            debtAmount: 0,
            creditor: null, // null for tax/bank
            debtor: null,
            selectedPropertySales: [], // tileIds to sell full land
            selectedBuildingReductions: {} // tileId -> number of house levels to reduce
        };

        // --- タイトル画面へ戻る処理 (NEW) ---
        function requestReturnToTitle() {
            // 設定モーダルが開いたまま(ゲーム未開始)の場合は何もしない
            if (!document.getElementById("setup-modal").classList.contains("hidden")) {
                return;
            }
            // プレイ中なら確認モーダルを表示
            document.getElementById("confirm-modal").classList.remove("hidden");
        }

        function confirmReturnToTitle() {
            document.getElementById("confirm-modal").classList.add("hidden");
            // 設定モーダル（タイトル画面）を表示
            document.getElementById("setup-modal").classList.remove("hidden");
            gameState.isBusy = false;
            addLog("タイトル画面に戻りました。");
        }

        function cancelReturnToTitle() {
            document.getElementById("confirm-modal").classList.add("hidden");
        }

        function selectPlayerCount(count) {
            gameState.selectedCount = count;
            document.querySelectorAll('.count-btn').forEach(btn => {
                if (parseInt(btn.dataset.count) === count) {
                    btn.className = 'count-btn p-2 rounded-lg border border-amber-400 bg-amber-500 text-slate-950 font-black text-xs';
                } else {
                    btn.className = 'count-btn p-2 rounded-lg border border-slate-700 bg-slate-900 text-white font-bold text-xs';
                }
            });
        }

        function startGame() {
            const mode = document.getElementById("game-mode").value;
            const startMoney = parseInt(document.getElementById("start-money").value);

            gameState.isAiGame = (mode === "ai");
            gameState.players = [];
            gameState.properties = {};
            gameState.currentPlayerIdx = 0;
            gameState.isRollPhase = true;
            gameState.hasExtraRoll = false;
            gameState.isBusy = false;

            for (let i = 0; i < gameState.selectedCount; i++) {
                gameState.players.push({
                    id: i,
                    name: (i === 0) ? "あなた (P1)" : (gameState.isAiGame ? `CPU ${i}` : `P${i+1}`),
                    isAi: (i > 0 && gameState.isAiGame),
                    money: startMoney,
                    position: 0,
                    laps: 0,
                    inJail: false,
                    jailTurns: 0,
                    isBankrupt: false,
                    color: PLAYER_COLORS[i]
                });
            }

            document.getElementById("setup-modal").classList.add("hidden");
            buildBoardDOM();
            updateUI();
            addLog("ゲームを開始しました。ダイスを振ってください。");
        }

        function buildBoardDOM() {
            const board = document.getElementById("board");
            board.innerHTML = "";

            BOARD_TILES.forEach(tile => {
                const tileEl = document.createElement("div");
                tileEl.className = "tile";
                tileEl.id = `tile-${tile.id}`;
                tileEl.style.gridColumn = tile.gridCol;
                tileEl.style.gridRow = tile.gridRow;
                tileEl.onclick = () => showTileDetails(tile.id);

                let headerHtml = "";
                let bodyHtml = "";

                if (tile.type === "property") {
                    headerHtml = `<div class="tile-header" id="tile-header-${tile.id}" style="background-color: ${tile.color};"></div>`;
                    bodyHtml = `
                        <div class="text-[7px] font-bold truncate w-full leading-tight text-slate-200">${tile.name}</div>
                        <div id="tile-info-${tile.id}" class="flex flex-col items-center w-full my-auto">
                            <span class="text-[6px] text-slate-400 font-bold">$${tile.price}</span>
                        </div>
                    `;
                } else if (tile.type === "go") {
                    bodyHtml = `
                        <div class="text-[7px] font-black text-emerald-400 mt-0.5">START</div>
                        <div class="my-auto text-emerald-400 text-[9px]"><i class="fa-solid fa-flag-checkered"></i></div>
                        <div class="text-[6px] text-slate-400 font-bold">+$200</div>
                    `;
                } else if (tile.type === "jail") {
                    bodyHtml = `
                        <div class="text-[7px] font-black text-slate-400 mt-0.5">JAIL</div>
                        <div class="my-auto text-slate-400 text-[9px]"><i class="fa-solid fa-lock"></i></div>
                        <div class="text-[6px] text-slate-400 font-bold">刑務所</div>
                    `;
                } else if (tile.type === "exchange") {
                    bodyHtml = `
                        <div class="text-[6px] font-black text-amber-400 mt-0.5">取引所</div>
                        <div class="my-auto text-amber-400 text-[9px]"><i class="fa-solid fa-handshake-simple"></i></div>
                        <div class="text-[6px] text-amber-300 font-bold">手数料$100</div>
                    `;
                } else if (tile.type === "gotojail") {
                    bodyHtml = `
                        <div class="text-[6px] font-black text-red-500 mt-0.5">GOTO JAIL</div>
                        <div class="my-auto text-red-500 text-[9px]"><i class="fa-solid fa-handcuffs"></i></div>
                        <div class="text-[6px] text-red-400 font-bold">即収監</div>
                    `;
                } else if (tile.type === "chance") {
                    bodyHtml = `
                        <div class="text-[6px] font-black text-purple-400 mt-0.5">CHANCE</div>
                        <div class="my-auto text-purple-400 text-[9px]"><i class="fa-solid fa-question"></i></div>
                        <div class="text-[6px] text-purple-300 font-bold">チャンス</div>
                    `;
                } else if (tile.type === "tax") {
                    bodyHtml = `
                        <div class="text-[7px] font-black text-amber-500 mt-0.5">TAX</div>
                        <div class="my-auto text-amber-500 text-[9px]"><i class="fa-solid fa-sack-dollar"></i></div>
                        <div class="text-[6px] text-amber-400 font-bold">$${tile.rent}</div>
                    `;
                }

                tileEl.innerHTML = `
                    ${headerHtml}
                    ${bodyHtml}
                    <div class="tokens-container" id="tokens-${tile.id}"></div>
                `;
                board.appendChild(tileEl);
            });

            const centerArea = document.createElement("div");
            centerArea.className = "col-start-2 col-end-8 row-start-2 row-end-8 bg-slate-900/95 rounded-xl p-2 flex flex-col justify-between items-center text-center border border-slate-700/80 relative overflow-hidden my-auto h-full gap-1 shadow-inner";
            centerArea.innerHTML = `
                <div class="flex gap-2 items-center justify-center pt-1">
                    <div id="dice-1" class="w-8 h-8 bg-slate-100 rounded-lg text-slate-900 font-black text-base flex items-center justify-center shadow-md border border-slate-300">
                        <i class="fa-solid fa-dice-one"></i>
                    </div>
                    <div id="dice-2" class="w-8 h-8 bg-slate-100 rounded-lg text-slate-900 font-black text-base flex items-center justify-center shadow-md border border-slate-300">
                        <i class="fa-solid fa-dice-one"></i>
                    </div>
                </div>
                <div id="dice-total" class="text-[10px] font-bold text-amber-400">ダイスを振ってください</div>

                <div class="w-full flex flex-col gap-1">
                    <button id="btn-roll" onclick="handleRollDice()" class="w-full bg-gradient-to-r from-amber-500 to-amber-600 disabled:opacity-40 text-slate-950 font-extrabold py-2 rounded-lg text-xs shadow transition active:scale-95 flex items-center justify-center gap-1">
                        <i class="fa-solid fa-dice"></i> サイコロを振る
                    </button>
                    <div class="grid grid-cols-2 gap-1">
                        <button id="btn-buy" onclick="handleBuyProperty()" disabled class="bg-emerald-600 disabled:opacity-30 text-white font-bold py-1.5 rounded-lg text-[10px] shadow transition active:scale-95">
                            <i class="fa-solid fa-cart-shopping"></i> 購入
                        </button>
                        <button id="btn-build" onclick="handleBuildHouse()" disabled class="bg-sky-600 disabled:opacity-30 text-white font-bold py-1.5 rounded-lg text-[10px] shadow transition active:scale-95">
                            <i class="fa-solid fa-house"></i> 増築
                        </button>
                    </div>
                    <button id="btn-end" onclick="handleEndTurn()" disabled class="w-full bg-slate-700 disabled:opacity-30 text-white font-bold py-1.5 rounded-lg text-[10px] shadow transition active:scale-95">
                        ターン終了 <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
            board.appendChild(centerArea);
        }

        function calculateRent(tile, houses, boostTurns = 0) {
            let base = Math.floor(tile.rent * (1 + houses * 1.5));
            if (boostTurns > 0) base *= 2;
            return base;
        }

        function renderTileProperties() {
            BOARD_TILES.forEach(tile => {
                if (tile.type !== "property") return;

                const infoEl = document.getElementById(`tile-info-${tile.id}`);
                const header = document.getElementById(`tile-header-${tile.id}`);
                const tileEl = document.getElementById(`tile-${tile.id}`);
                if (!infoEl) return;

                const propState = gameState.properties[tile.id];

                if (propState) {
                    const owner = gameState.players[propState.owner];
                    const currentRent = calculateRent(tile, propState.houses, propState.boostTurns);

                    header.style.backgroundColor = owner.color.hex;
                    tileEl.style.borderColor = owner.color.hex;

                    let houseIcons = "";
                    if (propState.houses === 4) {
                        houseIcons = `<div class="text-[6px] text-amber-400 font-black"><i class="fa-solid fa-hotel"></i></div>`;
                    } else if (propState.houses > 0) {
                        houseIcons = `<div class="text-[6px] text-amber-400 font-bold"><i class="fa-solid fa-house"></i>×${propState.houses}</div>`;
                    }

                    let boostHtml = propState.boostTurns > 0 ? `<div class="boost-tag">🔥2倍 [${propState.boostTurns}]</div>` : "";

                    infoEl.innerHTML = `
                        <div class="owner-badge ${owner.color.bg} mb-0.5">P${owner.id + 1}</div>
                        ${houseIcons}
                        ${boostHtml}
                        <div class="rent-tag">賃料:$${currentRent}</div>
                    `;
                } else {
                    header.style.backgroundColor = tile.color;
                    tileEl.style.borderColor = "#334155";
                    infoEl.innerHTML = `<span class="text-[6px] text-slate-400 font-bold">$${tile.price}</span>`;
                }
            });
        }

        function renderTokens() {
            BOARD_TILES.forEach(tile => {
                const container = document.getElementById(`tokens-${tile.id}`);
                if (container) container.innerHTML = "";
            });

            gameState.players.forEach(player => {
                if (player.isBankrupt) return;
                const container = document.getElementById(`tokens-${player.position}`);
                if (container) {
                    const token = document.createElement("div");
                    token.className = `token ${player.color.bg}`;
                    token.innerHTML = `<i class="fa-solid ${player.color.icon}"></i>`;
                    container.appendChild(token);
                }
            });
        }

        function updateUI() {
            renderTokens();
            renderTileProperties();
            updatePlayerCards();

            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            document.getElementById("turn-player-name").textContent = `${curPlayer.name} の番`;
            document.getElementById("turn-indicator-dot").className = `w-2 h-2 rounded-full ${curPlayer.color.bg}`;

            const btnRoll = document.getElementById("btn-roll");
            const btnBuy = document.getElementById("btn-buy");
            const btnBuild = document.getElementById("btn-build");
            const btnEnd = document.getElementById("btn-end");
            const promptEl = document.getElementById("action-prompt");

            btnRoll.disabled = true;
            btnBuy.disabled = true;
            btnBuild.disabled = true;
            btnEnd.disabled = true;

            if (gameState.isBusy) {
                promptEl.textContent = "処理中...";
                return;
            }

            if (curPlayer.isAi) {
                promptEl.textContent = `${curPlayer.name} (CPU) 思考中...`;
                setTimeout(handleAiTurn, 600);
                return;
            }

            if (gameState.isRollPhase) {
                btnRoll.disabled = false;
                if (gameState.hasExtraRoll) {
                    promptEl.textContent = "🎉 ゾロ目！もう一度サイコロを振れます";
                } else {
                    promptEl.textContent = curPlayer.inJail ? "刑務所中 (ゾロ目で釈放)" : "サイコロを振ってください";
                }
            } else {
                btnEnd.disabled = false;
                const currentTile = BOARD_TILES[curPlayer.position];

                if (currentTile.type === "property") {
                    const propState = gameState.properties[currentTile.id];
                    if (!propState) {
                        if (curPlayer.money >= currentTile.price) {
                            btnBuy.disabled = false;
                            promptEl.textContent = `${currentTile.name} を購入可能 ($${currentTile.price})`;
                        } else {
                            promptEl.textContent = "資金不足で購入不可";
                        }
                    } else if (propState.owner === curPlayer.id) {
                        if (propState.houses < 4) {
                            btnBuild.disabled = false;
                            promptEl.textContent = `増築可能 (費用: $${currentTile.housePrice})`;
                        } else {
                            promptEl.textContent = "最高ランク(ホテル)建設済み";
                        }
                    } else {
                        promptEl.textContent = gameState.hasExtraRoll ? "ゾロ目ボーナスで再ロール可能！" : "ターンを終了してください";
                    }
                } else {
                    promptEl.textContent = gameState.hasExtraRoll ? "ゾロ目ボーナスで再ロール可能！" : "ターンを終了してください";
                }
            }
        }

        function updatePlayerCards() {
            const container = document.getElementById("players-status");
            container.innerHTML = "";

            gameState.players.forEach((p, idx) => {
                const isCurrent = (idx === gameState.currentPlayerIdx);
                const card = document.createElement("div");
                card.className = `p-1.5 rounded-xl border ${isCurrent ? 'bg-slate-800 ' + p.color.border : 'bg-slate-900/60 border-slate-800'} ${p.isBankrupt ? 'opacity-30' : ''} transition-all shadow`;

                const ownedCount = Object.values(gameState.properties).filter(prop => prop.owner === p.id).length;

                card.innerHTML = `
                    <div class="flex items-center justify-between mb-0.5">
                        <div class="flex items-center gap-1 truncate">
                            <span class="w-2 h-2 rounded-full ${p.color.bg}"></span>
                            <span class="text-[10px] font-bold text-white truncate">${p.name}</span>
                        </div>
                        ${p.inJail ? '<span class="text-[7px] bg-slate-900 text-slate-400 px-1 py-0.2 rounded border border-slate-700">収監</span>' : ''}
                        ${p.isBankrupt ? '<span class="text-[7px] bg-red-900 text-red-300 px-1 py-0.2 rounded">破産</span>' : ''}
                    </div>
                    <div class="flex justify-between items-baseline">
                        <span class="text-xs font-black ${p.money < 100 ? 'text-red-400' : 'text-emerald-400'}">$${p.money}</span>
                        <span class="text-[9px] text-slate-400 font-bold"><i class="fa-solid fa-city me-0.5"></i>${ownedCount}件</span>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        async function handleRollDice() {
            if (!gameState.isRollPhase || gameState.isBusy) return;

            gameState.isBusy = true;
            gameState.hasExtraRoll = false;
            document.getElementById("btn-roll").disabled = true;
            playSound('dice');

            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const total = d1 + d2;
            const isDouble = (d1 === d2);

            const dice1El = document.getElementById("dice-1");
            const dice2El = document.getElementById("dice-2");
            const totalEl = document.getElementById("dice-total");

            dice1El.classList.add("rolling");
            dice2El.classList.add("rolling");
            totalEl.textContent = "コロコロ...";

            await new Promise(res => setTimeout(res, 400));

            dice1El.classList.remove("rolling");
            dice2El.classList.remove("rolling");
            dice1El.innerHTML = `<i class="fa-solid ${DICE_ICONS[d1]}"></i>`;
            dice2El.innerHTML = `<i class="fa-solid ${DICE_ICONS[d2]}"></i>`;
            totalEl.textContent = `出目: ${d1} + ${d2} = ${total} ${isDouble ? '(🎲ゾロ目!)' : ''}`;

            const curPlayer = gameState.players[gameState.currentPlayerIdx];

            if (isDouble) {
                playSound('double');
                addLog(`🎲 ${curPlayer.name} は ${d1} と ${d2} のゾロ目を出しました！(もう一度振れます)`);
            } else {
                addLog(`${curPlayer.name} は ${d1} と ${d2} (${total}) を出しました。`);
            }

            if (curPlayer.inJail) {
                if (isDouble) {
                    curPlayer.inJail = false;
                    curPlayer.jailTurns = 0;
                    addLog(`${curPlayer.name} はゾロ目で刑務所から脱出！`);
                    await movePlayerStepByStep(curPlayer, total);
                    await onPlayerLanded(curPlayer);
                    gameState.hasExtraRoll = true;
                } else {
                    curPlayer.jailTurns++;
                    if (curPlayer.jailTurns >= 2) {
                        curPlayer.inJail = false;
                        curPlayer.jailTurns = 0;
                        addLog(`${curPlayer.name} は保釈金$50の支払いが必要です。`);
                        await payMoney(curPlayer, null, 50);
                        if (!curPlayer.isBankrupt) {
                            await movePlayerStepByStep(curPlayer, total);
                            await onPlayerLanded(curPlayer);
                        }
                    } else {
                        addLog(`${curPlayer.name} は刑務所から出られませんでした。`);
                        gameState.isRollPhase = false;
                    }
                }
            } else {
                await movePlayerStepByStep(curPlayer, total);
                await onPlayerLanded(curPlayer);

                if (isDouble) {
                    gameState.hasExtraRoll = true;
                }
            }

            gameState.isBusy = false;
            updateUI();
        }

        async function movePlayerStepByStep(player, steps) {
            for (let i = 0; i < steps; i++) {
                const oldPos = player.position;
                player.position = (player.position + 1) % BOARD_TILES.length;

                playSound('dice');

                if (player.position === 0 && oldPos === (BOARD_TILES.length - 1)) {
                    player.laps += 1;
                    player.money += 200;
                    playSound('go');
                    addLog(`${player.name} はGOを通過(${player.laps}周目クリア)し、$200を獲得！`);
                    updatePlayerCards();
                }

                renderTokens();
                await new Promise(res => setTimeout(res, 160));
            }
            gameState.isRollPhase = false;
        }

        async function onPlayerLanded(player) {
            if (player.isBankrupt) return;

            const tile = BOARD_TILES[player.position];
            addLog(`${player.name} は 【${tile.name}】 に着地。`);

            if (tile.type === "property") {
                const propState = gameState.properties[tile.id];
                if (propState && propState.owner !== player.id) {
                    const owner = gameState.players[propState.owner];
                    if (!owner.isBankrupt) {
                        const rent = calculateRent(tile, propState.houses, propState.boostTurns);
                        addLog(`${player.name} は ${owner.name} に賃料 $${rent} の支払いが必要です。${propState.boostTurns > 0 ? '(🔥2倍)' : ''}`);
                        if (propState.boostTurns > 0) propState.boostTurns -= 1;
                        await payMoney(player, owner, rent);
                    }
                }
            } else if (tile.type === "exchange") {
                await triggerExchangeModal(player);
            } else if (tile.type === "gotojail") {
                addLog(`${player.name} は即逮捕され刑務所へ！`);
                player.position = 7;
                player.inJail = true;
                player.jailTurns = 0;
                renderTokens();
            } else if (tile.type === "tax") {
                addLog(`${player.name} は税金 $${tile.rent} の支払いが必要です。`);
                await payTax(player, tile.rent);
            } else if (tile.type === "chance") {
                await triggerChanceCard(player);
            }
        }

        function triggerChanceCard(player) {
            return new Promise((resolve) => {
                const card = CHANCE_CARDS[Math.floor(Math.random() * CHANCE_CARDS.length)];
                addLog(`チャンス: ${card.text}`);

                infoModalResolver = async () => {
                    if (card.money) {
                        if (card.money > 0) {
                            player.money += card.money;
                            playSound('go');
                        } else {
                            await payTax(player, Math.abs(card.money));
                        }
                    } else if (card.moveTo !== undefined) {
                        player.position = card.moveTo;
                        renderTokens();
                        addLog(`${player.name} はGOマスへワープしました。`);
                    }
                    resolve();
                };

                document.getElementById("modal-color-bar").style.backgroundColor = "#c084fc";
                showModal("❓ チャンスカード", `
                    <div class="text-center py-2 space-y-2">
                        <div class="text-2xl text-purple-400"><i class="fa-solid fa-gift"></i></div>
                        <div class="font-bold text-sm text-white">${card.text}</div>
                    </div>
                `);
            });
        }

        function triggerExchangeModal(player) {
            return new Promise((resolve) => {
                const FEE = 100;
                const myProperties = Object.keys(gameState.properties)
                    .filter(tileId => gameState.properties[tileId].owner === player.id)
                    .map(tileId => ({ tile: BOARD_TILES[tileId], state: gameState.properties[tileId] }));

                if (myProperties.length === 0) {
                    addLog(`${player.name} は不動産取引所に到着しましたが、所有物件がありません。`);
                    resolve();
                    return;
                }

                if (player.money < FEE) {
                    addLog(`${player.name} は不動産取引所に到着しましたが、手数料 $${FEE} が不足しています。`);
                    resolve();
                    return;
                }

                if (player.isAi) {
                    const target = myProperties.find(p => p.state.boostTurns === 0);
                    if (target) {
                        player.money -= FEE;
                        target.state.boostTurns = 3;
                        playSound('boost');
                        addLog(`${player.name} は手数料$100を支払い、【${target.tile.name}】の賃料を🔥2倍(3回分)に強化！`);
                        renderTileProperties();
                        updatePlayerCards();
                    }
                    resolve();
                    return;
                }

                exchangeModalResolver = resolve;
                const listEl = document.getElementById("exchange-property-list");
                document.getElementById("exchange-fee-info").textContent = `手数料: $${FEE} (現在の所持金: $${player.money})`;
                listEl.innerHTML = "";

                myProperties.forEach(({ tile, state }) => {
                    const btn = document.createElement("button");
                    btn.className = "w-full bg-slate-900 border border-slate-700 hover:border-amber-400 p-2 rounded-lg flex justify-between items-center text-xs text-left transition";
                    btn.innerHTML = `
                        <div>
                            <span class="font-bold text-white">${tile.name}</span>
                            <span class="text-[10px] text-slate-400 block">現在の賃料: $${calculateRent(tile, state.houses, state.boostTurns)}</span>
                        </div>
                        <span class="text-amber-400 font-bold text-[10px] bg-amber-950 px-2 py-1 rounded">
                            ${state.boostTurns > 0 ? `🔥2倍中 (${state.boostTurns})` : '2倍に強化'}
                        </span>
                    `;
                    btn.onclick = () => {
                        player.money -= FEE;
                        state.boostTurns = 3;
                        playSound('boost');
                        addLog(`${player.name} は手数料$100を支払い、【${tile.name}】の賃料を🔥2倍(3回分)に強化！`);
                        resolveExchangeModal(true);
                    };
                    listEl.appendChild(btn);
                });

                document.getElementById("exchange-modal").classList.remove("hidden");
            });
        }

        function resolveExchangeModal(selected) {
            document.getElementById("exchange-modal").classList.add("hidden");
            renderTileProperties();
            updatePlayerCards();
            if (exchangeModalResolver) {
                const res = exchangeModalResolver;
                exchangeModalResolver = null;
                res();
            }
        }

        function triggerBuildModal(player, tile) {
            return new Promise((resolve) => {
                const propState = gameState.properties[tile.id];
                if (!propState || propState.owner !== player.id || propState.houses >= 4) {
                    resolve(false);
                    return;
                }

                if (player.isAi) {
                    for (let targetLevel = 4; targetLevel > propState.houses; targetLevel--) {
                        if (targetLevel === 4 && player.laps < 1) continue;
                        const cost = tile.housePrice * (targetLevel - propState.houses);
                        if (player.money >= cost + 80) {
                            player.money -= cost;
                            propState.houses = targetLevel;
                            playSound('buy');
                            addLog(`${player.name} は 【${tile.name}】 を ${targetLevel === 4 ? 'ホテル' : '家' + targetLevel + '軒'} に一括増築！`);
                            renderTileProperties();
                            updatePlayerCards();
                            resolve(true);
                            return;
                        }
                    }
                    resolve(false);
                    return;
                }

                buildModalResolver = resolve;
                selectedBuildTier = null;

                document.getElementById("build-modal-color").style.backgroundColor = tile.color;
                document.getElementById("build-modal-title").textContent = `【${tile.name}】 の増築選択`;
                document.getElementById("build-modal-subtitle").textContent = `現在: ${propState.houses === 0 ? '未建築' : propState.houses + '軒'} | 所持金: $${player.money}`;

                const container = document.getElementById("build-tiers-container");
                container.innerHTML = "";

                const tierNames = ["家 1軒目", "家 2軒目", "家 3軒目", "🏨 ビル (ホテル)"];
                
                for (let level = 1; level <= 4; level++) {
                    const isAlreadyBuilt = propState.houses >= level;
                    const isHotelLocked = (level === 4 && player.laps < 1);
                    const cost = tile.housePrice * (level - propState.houses);
                    const rentVal = calculateRent(tile, level, propState.boostTurns);

                    let disabledReason = "";
                    let isDisabled = false;

                    if (isAlreadyBuilt) {
                        isDisabled = true;
                        disabledReason = "建築済み";
                    } else if (isHotelLocked) {
                        isDisabled = true;
                        disabledReason = "1周目は建設不可";
                    } else if (player.money < cost) {
                        isDisabled = true;
                        disabledReason = "資金不足";
                    }

                    const row = document.createElement("div");
                    row.className = `p-2 rounded-xl border flex items-center justify-between transition ${isDisabled ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-900 border-slate-700 hover:border-sky-400 cursor-pointer'}`;
                    
                    row.innerHTML = `
                        <div class="flex items-center gap-2">
                            <input type="radio" name="build-tier" value="${level}" ${isDisabled ? 'disabled' : ''} class="accent-sky-500">
                            <div>
                                <span class="font-bold text-xs text-white block">${tierNames[level-1]}</span>
                                <span class="text-[9px] text-slate-400">賃料: <b class="text-emerald-400">$${rentVal}</b></span>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-xs font-black ${isDisabled ? 'text-slate-500' : 'text-amber-400'}">${isDisabled ? disabledReason : '$' + cost}</span>
                        </div>
                    `;

                    if (!isDisabled) {
                        row.onclick = () => {
                            const radio = row.querySelector("input");
                            radio.checked = true;
                            selectedBuildTier = level;
                        };
                    }

                    container.appendChild(row);
                }

                document.getElementById("build-modal").classList.remove("hidden");
            });
        }

        function confirmBuildSelection() {
            if (!selectedBuildTier) return;

            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            const tile = BOARD_TILES[curPlayer.position];
            const propState = gameState.properties[tile.id];

            const diffLevels = selectedBuildTier - propState.houses;
            const totalCost = tile.housePrice * diffLevels;

            if (curPlayer.money >= totalCost) {
                curPlayer.money -= totalCost;
                propState.houses = selectedBuildTier;
                playSound('buy');
                const tierName = selectedBuildTier === 4 ? 'ビル (ホテル)' : `家${selectedBuildTier}軒`;
                addLog(`${curPlayer.name} は 【${tile.name}】 を ${tierName} まで一括増築しました！`);
            }

            resolveBuildModal(true);
        }

        function resolveBuildModal(built) {
            document.getElementById("build-modal").classList.add("hidden");
            renderTileProperties();
            updatePlayerCards();
            updateUI();
            if (buildModalResolver) {
                const res = buildModalResolver;
                buildModalResolver = null;
                res(built);
            }
        }

        async function handleBuildHouse() {
            if (gameState.isBusy) return;

            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            const tile = BOARD_TILES[curPlayer.position];

            if (tile.type === "property") {
                gameState.isBusy = true;
                await triggerBuildModal(curPlayer, tile);
                gameState.isBusy = false;
                updateUI();
            }
        }

        function handleBuyProperty() {
            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            const tile = BOARD_TILES[curPlayer.position];

            if (tile.type === "property" && !gameState.properties[tile.id]) {
                if (curPlayer.money >= tile.price) {
                    curPlayer.money -= tile.price;
                    gameState.properties[tile.id] = { owner: curPlayer.id, houses: 0, boostTurns: 0 };
                    playSound('buy');
                    addLog(`${curPlayer.name} は ${tile.name} を $${tile.price} で購入！`);
                    updateUI();
                }
            }
        }

        function handleEndTurn() {
            if (gameState.isBusy) return;

            if (gameState.hasExtraRoll) {
                gameState.isRollPhase = true;
                addLog(`${gameState.players[gameState.currentPlayerIdx].name} はゾロ目のため、もう一度サイコロを振ります！`);
                updateUI();
                return;
            }

            let nextIdx = (gameState.currentPlayerIdx + 1) % gameState.players.length;
            while (gameState.players[nextIdx].isBankrupt) {
                nextIdx = (nextIdx + 1) % gameState.players.length;
            }

            gameState.currentPlayerIdx = nextIdx;
            gameState.isRollPhase = true;
            gameState.hasExtraRoll = false;
            document.getElementById("dice-total").textContent = "ダイスを振ってください";
            updateUI();
        }

        // --- 債務清算・資産売却・破産処理システム (NEW) ---

        async function payMoney(fromPlayer, toPlayer, amount) {
            playSound('pay');
            if (fromPlayer.money >= amount) {
                fromPlayer.money -= amount;
                if (toPlayer) toPlayer.money += amount;
            } else {
                // キャッシュ不足：資産清算モーダルの実行
                await handleLiquidation(fromPlayer, toPlayer, amount);
            }
            updatePlayerCards();
        }

        async function payTax(player, amount) {
            await payMoney(player, null, amount);
        }

        function calculateTotalAssets(player) {
            let total = player.money;
            Object.keys(gameState.properties).forEach(tileId => {
                const propState = gameState.properties[tileId];
                if (propState.owner === player.id) {
                    const tile = BOARD_TILES[tileId];
                    // 土地の半額売却価値
                    total += Math.floor(tile.price / 2);
                    // 建てた家・ホテルの半額売却価値
                    total += Math.floor((tile.housePrice * propState.houses) / 2);
                }
            });
            return total;
        }

        async function handleLiquidation(debtor, creditor, debtAmount) {
            const totalAssets = calculateTotalAssets(debtor);

            // 総資産（キャッシュ＋全売却額）すら不足している場合は即破産
            if (totalAssets < debtAmount) {
                addLog(`【破産】${debtor.name} は総資産($${totalAssets})を含めても負債($${debtAmount})を返済できません！`);
                // 所有キャッシュと売却可能額の全額を債権者に引き渡して破産
                if (creditor) creditor.money += Math.max(0, debtor.money);
                debtor.money = 0;
                handleBankruptcy(debtor);
                return;
            }

            // CPUの場合は自動で建物を優先して解体・売却
            if (debtor.isAi) {
                executeAiLiquidation(debtor, creditor, debtAmount);
                return;
            }

            // 人間プレイヤーの場合は売却用UIモーダルを表示
            return new Promise((resolve) => {
                liquidationModalResolver = resolve;
                liquidationState = {
                    debtAmount: debtAmount,
                    creditor: creditor,
                    debtor: debtor,
                    selectedPropertySales: [],
                    selectedBuildingReductions: {}
                };

                document.getElementById("liq-required-amount").textContent = `$${debtAmount}`;
                document.getElementById("liq-current-cash").textContent = `$${debtor.money}`;
                
                renderLiquidationItemsList();
                updateLiquidationSummary();

                document.getElementById("liquidation-modal").classList.remove("hidden");
            });
        }

        function renderLiquidationItemsList() {
            const container = document.getElementById("liq-items-list");
            container.innerHTML = "";

            const debtor = liquidationState.debtor;
            const myProps = Object.keys(gameState.properties)
                .filter(id => gameState.properties[id].owner === debtor.id)
                .map(id => ({ tile: BOARD_TILES[id], state: gameState.properties[id] }));

            if (myProps.length === 0) {
                container.innerHTML = `<div class="text-center text-xs text-slate-400 py-2">売却可能な不動産資産がありません。</div>`;
                return;
            }

            myProps.forEach(({ tile, state }) => {
                const isLandSold = liquidationState.selectedPropertySales.includes(tile.id);
                const reducedLevel = liquidationState.selectedBuildingReductions[tile.id] || 0;
                const activeHouses = state.houses - reducedLevel;

                const itemCard = document.createElement("div");
                itemCard.className = "bg-slate-900 border border-slate-700 p-2 rounded-xl flex flex-col gap-1.5 text-xs";

                const landSaleValue = Math.floor(tile.price / 2);
                const houseSaleValue = Math.floor(tile.housePrice / 2);

                itemCard.innerHTML = `
                    <div class="flex justify-between items-center border-b border-slate-800 pb-1">
                        <div>
                            <span class="font-bold text-white">${tile.name}</span>
                            <span class="text-[9px] text-slate-400 block">${state.houses === 4 ? '🏨 ホテル' : '🏠 家 ' + state.houses + '軒'}</span>
                        </div>
                        <button onclick="toggleSellLand(${tile.id})" ${activeHouses > 0 ? 'disabled' : ''} class="px-2 py-1 rounded text-[10px] font-bold ${isLandSold ? 'bg-red-600 text-white' : (activeHouses > 0 ? 'bg-slate-800 text-slate-500 opacity-50' : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700')}">
                            ${isLandSold ? '土地売却を解除' : `土地売却 (+$${landSaleValue})`}
                        </button>
                    </div>

                    ${state.houses > 0 ? `
                        <div class="flex justify-between items-center text-[11px]">
                            <span class="text-slate-300">建物の解体/売却 (1軒: +$${houseSaleValue}):</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="changeBuildingReduction(${tile.id}, -1)" ${reducedLevel <= 0 || isLandSold ? 'disabled' : ''} class="w-5 h-5 bg-slate-800 border border-slate-700 rounded flex items-center justify-center font-black text-slate-300 disabled:opacity-30">-</button>
                                <span class="font-bold text-amber-400">${reducedLevel} / ${state.houses}軒</span>
                                <button onclick="changeBuildingReduction(${tile.id}, 1)" ${reducedLevel >= state.houses || isLandSold ? 'disabled' : ''} class="w-5 h-5 bg-slate-800 border border-slate-700 rounded flex items-center justify-center font-black text-slate-300 disabled:opacity-30">+</button>
                            </div>
                        </div>
                    ` : ''}
                `;

                container.appendChild(itemCard);
            });
        }

        function toggleSellLand(tileId) {
            const idx = liquidationState.selectedPropertySales.indexOf(tileId);
            if (idx >= 0) {
                liquidationState.selectedPropertySales.splice(idx, 1);
            } else {
                liquidationState.selectedPropertySales.push(tileId);
            }
            playSound('sell');
            renderLiquidationItemsList();
            updateLiquidationSummary();
        }

        function changeBuildingReduction(tileId, delta) {
            const current = liquidationState.selectedBuildingReductions[tileId] || 0;
            const propState = gameState.properties[tileId];
            const next = Math.max(0, Math.min(propState.houses, current + delta));
            
            liquidationState.selectedBuildingReductions[tileId] = next;
            playSound('sell');
            renderLiquidationItemsList();
            updateLiquidationSummary();
        }

        function updateLiquidationSummary() {
            const debtor = liquidationState.debtor;
            let gainedCash = 0;

            // 建物減築によるキャッシュ
            Object.keys(liquidationState.selectedBuildingReductions).forEach(tileId => {
                const count = liquidationState.selectedBuildingReductions[tileId];
                const tile = BOARD_TILES[tileId];
                gainedCash += count * Math.floor(tile.housePrice / 2);
            });

            // 土地売却によるキャッシュ
            liquidationState.selectedPropertySales.forEach(tileId => {
                const tile = BOARD_TILES[tileId];
                gainedCash += Math.floor(tile.price / 2);
            });

            const totalAvailable = debtor.money + gainedCash;
            const remainingDeficit = Math.max(0, liquidationState.debtAmount - totalAvailable);

            document.getElementById("liq-gained-cash").textContent = `+$${gainedCash}`;
            document.getElementById("liq-remaining-deficit").textContent = `$${remainingDeficit}`;

            const confirmBtn = document.getElementById("liq-confirm-btn");
            if (remainingDeficit === 0) {
                confirmBtn.disabled = false;
                confirmBtn.className = "flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2 rounded-xl text-xs shadow transition active:scale-95";
            } else {
                confirmBtn.disabled = true;
                confirmBtn.className = "flex-1 bg-emerald-600 opacity-30 text-white font-black py-2 rounded-xl text-xs shadow cursor-not-allowed";
            }
        }

        function confirmLiquidation() {
            const debtor = liquidationState.debtor;
            const creditor = liquidationState.creditor;
            const debtAmount = liquidationState.debtAmount;

            // 売却処理の実行
            Object.keys(liquidationState.selectedBuildingReductions).forEach(tileId => {
                const count = liquidationState.selectedBuildingReductions[tileId];
                if (count > 0) {
                    const tile = BOARD_TILES[tileId];
                    const refund = count * Math.floor(tile.housePrice / 2);
                    gameState.properties[tileId].houses -= count;
                    debtor.money += refund;
                    addLog(`${debtor.name} は 【${tile.name}】 の建物を ${count} 階層解体・売却し +$${refund} を獲得。`);
                }
            });

            liquidationState.selectedPropertySales.forEach(tileId => {
                const tile = BOARD_TILES[tileId];
                const refund = Math.floor(tile.price / 2);
                delete gameState.properties[tileId];
                debtor.money += refund;
                addLog(`${debtor.name} は 【${tile.name}】 の土地を売却し +$${refund} を獲得。`);
            });

            // 債務の支払いを完了
            debtor.money -= debtAmount;
            if (creditor) creditor.money += debtAmount;

            addLog(`${debtor.name} は資産を清算して $${debtAmount} の支払いを完了しました。`);

            document.getElementById("liquidation-modal").classList.add("hidden");
            renderTileProperties();
            updatePlayerCards();

            if (liquidationModalResolver) {
                const res = liquidationModalResolver;
                liquidationModalResolver = null;
                res();
            }
        }

        function confirmBankruptcy() {
            const debtor = liquidationState.debtor;
            const creditor = liquidationState.creditor;

            document.getElementById("liquidation-modal").classList.add("hidden");

            if (creditor) creditor.money += Math.max(0, debtor.money);
            debtor.money = 0;

            handleBankruptcy(debtor);

            if (liquidationModalResolver) {
                const res = liquidationModalResolver;
                liquidationModalResolver = null;
                res();
            }
        }

        function executeAiLiquidation(debtor, creditor, debtAmount) {
            let needed = debtAmount - debtor.money;

            // 1. 建てた家/ホテルを解体・売却
            for (let tileId in gameState.properties) {
                const propState = gameState.properties[tileId];
                if (propState.owner === debtor.id && propState.houses > 0) {
                    const tile = BOARD_TILES[tileId];
                    const houseRefund = Math.floor(tile.housePrice / 2);

                    while (propState.houses > 0 && needed > 0) {
                        propState.houses -= 1;
                        debtor.money += houseRefund;
                        needed -= houseRefund;
                        addLog(`${debtor.name} (CPU) は 【${tile.name}】 の建物を解体して +$${houseRefund} を獲得。`);
                    }
                }
                if (needed <= 0) break;
            }

            // 2. それでも足りなければ土地を売却
            if (needed > 0) {
                for (let tileId in gameState.properties) {
                    const propState = gameState.properties[tileId];
                    if (propState.owner === debtor.id && propState.houses === 0) {
                        const tile = BOARD_TILES[tileId];
                        const landRefund = Math.floor(tile.price / 2);

                        delete gameState.properties[tileId];
                        debtor.money += landRefund;
                        needed -= landRefund;
                        addLog(`${debtor.name} (CPU) は 【${tile.name}】 の土地を売却して +$${landRefund} を獲得。`);

                        if (needed <= 0) break;
                    }
                }
            }

            if (debtor.money >= debtAmount) {
                debtor.money -= debtAmount;
                if (creditor) creditor.money += debtAmount;
                addLog(`${debtor.name} (CPU) は資産を売却して $${debtAmount} の支払いを完了。`);
            } else {
                if (creditor) creditor.money += Math.max(0, debtor.money);
                debtor.money = 0;
                handleBankruptcy(debtor);
            }

            renderTileProperties();
            updatePlayerCards();
        }

        function handleBankruptcy(player) {
            player.isBankrupt = true;
            addLog(`【破産】${player.name} は資金切れで破産しました！`);

            Object.keys(gameState.properties).forEach(tileId => {
                if (gameState.properties[tileId].owner === player.id) {
                    delete gameState.properties[tileId];
                }
            });

            renderTokens();
            renderTileProperties();

            const activePlayers = gameState.players.filter(p => !p.isBankrupt);
            if (activePlayers.length === 1) {
                setTimeout(() => {
                    showModal("🏆 ゲームセット！", `
                        <div class="text-center py-2 space-y-2">
                            <div class="text-3xl text-amber-400"><i class="fa-solid fa-trophy"></i></div>
                            <div class="font-extrabold text-sm text-white">${activePlayers[0].name} の勝利！</div>
                            <p class="text-[11px] text-slate-400">破産せずに最後まで残りました！</p>
                        </div>
                    `);
                }, 400);
            }
        }

        async function handleAiTurn() {
            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            if (!curPlayer.isAi || curPlayer.isBankrupt || gameState.isBusy) return;

            if (gameState.isRollPhase) {
                await handleRollDice();
            } else {
                const currentTile = BOARD_TILES[curPlayer.position];

                if (currentTile.type === "property") {
                    const propState = gameState.properties[currentTile.id];
                    if (!propState && curPlayer.money - currentTile.price > 80) {
                        handleBuyProperty();
                    } else if (propState && propState.owner === curPlayer.id) {
                        await triggerBuildModal(curPlayer, currentTile);
                    }
                }

                await new Promise(res => setTimeout(res, 400));
                handleEndTurn();
            }
        }

        function showTileDetails(tileId) {
            const tile = BOARD_TILES[tileId];
            const propState = gameState.properties[tileId];
            let ownerName = "未所有";
            if (propState) ownerName = gameState.players[propState.owner].name;

            let bodyHtml = "";
            if (tile.type === "property") {
                const rentCurr = propState ? calculateRent(tile, propState.houses, propState.boostTurns) : tile.rent;
                bodyHtml = `
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between"><span class="text-slate-400">購入価格:</span> <span class="font-bold text-amber-400">$${tile.price}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">基本賃料:</span> <span class="font-bold text-white">$${tile.rent}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">現在の賃料:</span> <span class="font-bold text-emerald-400">$${rentCurr}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">増築費用:</span> <span class="font-bold text-white">$${tile.housePrice}</span></div>
                        <div class="flex justify-between pt-1 border-t border-slate-700"><span class="text-slate-400">所有者:</span> <span class="font-bold text-amber-300">${ownerName}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">増築状況:</span> <span class="font-bold text-white">${propState ? (propState.houses === 4 ? 'ホテル' : propState.houses + ' 軒') : 'なし'}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">賃料2倍ブースト:</span> <span class="font-bold text-amber-400">${propState && propState.boostTurns > 0 ? `🔥適用中 (残り${propState.boostTurns}回)` : 'なし'}</span></div>
                    </div>
                `;
            } else {
                bodyHtml = `
                    <div class="text-center py-2 text-slate-300">
                        【${tile.name}】 マス<br>
                        <span class="text-[10px] text-slate-400">${tile.type === 'exchange' ? '手数料$100で自分の所有土地を1つ「🔥2倍」に強化できます。' : '特殊イベントマスです。'}</span>
                    </div>
                `;
            }

            document.getElementById("modal-color-bar").style.backgroundColor = tile.color || "#64748b";
            showModal(tile.name, bodyHtml);
        }

        function showModal(title, contentHtml) {
            document.getElementById("modal-title").textContent = title;
            document.getElementById("modal-body").innerHTML = contentHtml;
            document.getElementById("info-modal").classList.remove("hidden");
        }

        function resolveInfoModal() {
            document.getElementById("info-modal").classList.add("hidden");
            if (infoModalResolver) {
                const res = infoModalResolver;
                infoModalResolver = null;
                res();
            }
        }

        function addLog(msg) {
            const logEl = document.getElementById("game-log");
            const entry = document.createElement("div");
            entry.textContent = `• ${msg}`;
            logEl.prepend(entry);
        }

        window.onload = () => {
            selectPlayerCount(2);
        };
