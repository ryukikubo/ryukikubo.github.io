// --- Web Audio API ---
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const gameBgmAudio = new Audio("./game_bgm.mp3");
        gameBgmAudio.preload = "auto";
        gameBgmAudio.loop = true;
        gameBgmAudio.volume = 0.25;
        let bgmActive = false;
        let bgmMuted = false;

        function updateBgmButton() {
            const label = bgmMuted ? "BGMのミュートを解除" : "BGMをミュート";
            document.querySelectorAll("#btn-bgm, #setup-bgm").forEach(button => {
                button.setAttribute("aria-pressed", String(bgmMuted));
                button.setAttribute("aria-label", label);
                button.title = label;
                button.innerHTML = `<i class="fa-solid ${bgmMuted ? 'fa-volume-xmark' : 'fa-volume-high'}" aria-hidden="true"></i>`;
            });
        }

        function startBgm() {
            bgmActive = true;
            gameBgmAudio.muted = bgmMuted;
            updateBgmButton();
            try {
                if (gameBgmAudio.paused) gameBgmAudio.play().catch(() => {});
            } catch(e){}
        }

        function stopBgm() {
            bgmActive = false;
            gameBgmAudio.pause();
            gameBgmAudio.currentTime = 0;
        }

        function toggleBgmMute() {
            bgmMuted = !bgmMuted;
            gameBgmAudio.muted = bgmMuted;
            if (!bgmMuted && bgmActive) startBgm();
            updateBgmButton();
        }

        const diceRollAudio = new Audio("./dice_roll.mp3");
        diceRollAudio.preload = "auto";
        diceRollAudio.volume = 0.75;

        function playDiceRollSound() {
            const duration = Number.isFinite(diceRollAudio.duration) ? diceRollAudio.duration * 1000 : 915;
            try {
                diceRollAudio.pause();
                diceRollAudio.currentTime = 0;
                diceRollAudio.play().catch(() => {});
            } catch(e){}
            return new Promise(resolve => setTimeout(resolve, duration));
        }

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
                } else if (type === 'buyout') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(392, now);
                    osc.frequency.setValueAtTime(523.25, now + 0.09);
                    osc.frequency.setValueAtTime(659.25, now + 0.18);
                    osc.frequency.setValueAtTime(1046.5, now + 0.27);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.48);
                    osc.start(now); osc.stop(now + 0.48);
                } else if (type === 'casino-win') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(659.25, now);
                    osc.frequency.setValueAtTime(987.77, now + 0.07);
                    osc.frequency.setValueAtTime(1318.51, now + 0.14);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    osc.start(now); osc.stop(now + 0.3);
                } else if (type === 'casino-lose') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(329.63, now);
                    osc.frequency.setValueAtTime(246.94, now + 0.1);
                    osc.frequency.setValueAtTime(164.81, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);
                    osc.start(now); osc.stop(now + 0.36);
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
                } else if (type === 'jail') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.setValueAtTime(220, now + 0.12);
                    osc.frequency.setValueAtTime(110, now + 0.24);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now); osc.stop(now + 0.4);
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
            { id: 2, gridCol: 6, gridRow: 8, name: "カジノ", type: "casino", price: 0, rent: 0 },
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
            { id: 20, gridCol: 8, gridRow: 6, name: "六本木", type: "property", group: 8, price: 280, rent: 56, housePrice: 110, color: "#6366f1" },
            { id: 21, gridCol: 8, gridRow: 1, name: "即収監", type: "gotojail", price: 0, rent: 0 },

            { id: 22, gridCol: 8, gridRow: 2, name: "赤坂", type: "property", group: 6, price: 300, rent: 62, housePrice: 130, color: "#eab308" },
            { id: 23, gridCol: 7, gridRow: 1, name: "麻布十番", type: "property", group: 6, price: 320, rent: 68, housePrice: 130, color: "#eab308" },
            { id: 24, gridCol: 8, gridRow: 4, name: "チャンス", type: "chance", price: 0, rent: 0 },
            { id: 25, gridCol: 8, gridRow: 5, name: "品川", type: "property", group: 7, price: 350, rent: 76, housePrice: 150, color: "#10b981" },
            { id: 26, gridCol: 8, gridRow: 3, name: "丸の内", type: "property", group: 7, price: 380, rent: 84, housePrice: 150, color: "#10b981" },
            { id: 27, gridCol: 8, gridRow: 7, name: "銀座", type: "property", group: 8, price: 420, rent: 100, housePrice: 180, color: "#6366f1" }
        ];

        const MAP_PROPERTY_NAMES = {
            world: ["リオ", "ローマ", "カイロ", "バンコク", "ドバイ", "ベルリン", "台北", "マドリード", "シドニー", "イスタンブール", "ムンバイ", "トロント", "シンガポール", "北京", "ソウル", "パリ", "ロンドン", "ニューヨーク"],
            japan: ["函館", "那覇", "岡山", "新潟", "北九州", "千葉", "さいたま", "仙台", "広島", "川崎", "京都", "神戸", "福岡", "札幌", "名古屋", "横浜", "大阪", "東京"],
            space: ["水星", "金星", "地球", "火星", "木星", "土星", "天王星", "海王星", "ケレス", "冥王星", "ハウメア", "マケマケ", "エリス", "ケプラー22b", "ケプラー62f", "ケプラー186f", "プロキシマb", "トラピスト1e"]
        };

        function applyMapTheme(theme) {
            const names = MAP_PROPERTY_NAMES[theme] || MAP_PROPERTY_NAMES.japan;
            const properties = BOARD_TILES.filter(tile => tile.type === "property");
            if (theme !== "space") properties.sort((first, second) => first.rent - second.rent || first.id - second.id);
            properties.forEach((tile, index) => {
                tile.name = names[index];
            });
        }

        const BOARD_TRACK_COORDINATES = [
            ...Array.from({ length: 8 }, (_, index) => ({ gridCol: 8 - index, gridRow: 8 })),
            ...Array.from({ length: 7 }, (_, index) => ({ gridCol: 1, gridRow: 7 - index })),
            ...Array.from({ length: 7 }, (_, index) => ({ gridCol: 2 + index, gridRow: 1 })),
            ...Array.from({ length: 6 }, (_, index) => ({ gridCol: 8, gridRow: 2 + index }))
        ];
        const BOARD_TRACK_TILES = BOARD_TRACK_COORDINATES.map(({ gridCol, gridRow }) =>
            BOARD_TILES.find(tile => tile.gridCol === gridCol && tile.gridRow === gridRow)
        );
        if (BOARD_TRACK_TILES.some(tile => !tile) || new Set(BOARD_TRACK_TILES.map(tile => tile.id)).size !== BOARD_TILES.length) {
            throw new Error("盤面の外周タイル配置に重複または欠落があります。");
        }
        const NEXT_TRACK_TILE_ID = new Map(BOARD_TRACK_TILES.map((tile, index) => [
            tile.id,
            BOARD_TRACK_TILES[(index + 1) % BOARD_TRACK_TILES.length].id
        ]));
        const LAST_TILE_BEFORE_GO = BOARD_TRACK_TILES[BOARD_TRACK_TILES.length - 1].id;

        const CHANCE_CARDS = [
            { weight: 3, text: "臨時ボーナス！$120を獲得", money: 120 },
            { weight: 3, text: "スピード違反！$50を支払う", money: -50 },
            { weight: 3, text: "臨時収入！$80を獲得", money: 80 },
            { weight: 1, text: "コンテストの賞金！$100を獲得", money: 100 },
            { weight: 1, text: "追徴課税金の支払が発生！$90を支払う", money: -90 },
            { weight: 1, text: "地域活動への協力金！$20を支払う", money: -20 },
            { weight: 2, text: "GOのマスへ直行！サラリー$200を受け取る", moveTo: 0 },
            { weight: 1.55, text: "保釈カードを獲得！収監時に使用できます。", heldCard: "bailPass" },
            { weight: 1, text: "ブラックカードを獲得！敵の賃料を1回免除できます。", heldCard: "black" },
            { weight: 1, text: "砂嵐！都市を1つ選び、3ターンの間賃料を半額にする", effect: "sandstorm" },
            { weight: 0.45, text: "地震！都市を1つ選び、建築物を1段階崩壊させる", effect: "earthquake" }
        ];

        function drawChanceCard() {
            const availableCards = CHANCE_CARDS.filter(card => Number.isFinite(card.weight) && card.weight > 0);
            const totalWeight = availableCards.reduce((total, card) => total + card.weight, 0);
            if (totalWeight === 0) return null;

            let remainingWeight = Math.random() * totalWeight;
            for (const card of availableCards) {
                remainingWeight -= card.weight;
                if (remainingWeight < 0) return card;
            }
            return availableCards[availableCards.length - 1];
        }

        const PLAYER_COLORS = [
            { bg: "bg-red-500", border: "border-red-500", hex: "#ef4444", icon: "fa-user" },
            { bg: "bg-blue-500", border: "border-blue-500", hex: "#3b82f6", icon: "fa-robot" },
            { bg: "bg-emerald-500", border: "border-emerald-500", hex: "#10b981", icon: "fa-user-ninja" },
            { bg: "bg-amber-500", border: "border-amber-500", hex: "#f59e0b", icon: "fa-cat" }
        ];

        const DICE_PIP_POSITIONS = {
            1: [4],
            2: [0, 8],
            3: [0, 4, 8],
            4: [0, 2, 6, 8],
            5: [0, 2, 4, 6, 8],
            6: [0, 2, 3, 5, 6, 8]
        };

        function createDiceFaceMarkup(value) {
            const visiblePips = new Set(DICE_PIP_POSITIONS[value] || []);
            const pips = Array.from({ length: 9 }, (_, index) =>
                `<span class="die-pip${visiblePips.has(index) ? ' is-visible' : ''}"></span>`
            ).join("");
            return `<span class="die-pips die-face-${value}" role="img" aria-label="サイコロ ${value} の目">${pips}</span>`;
        }

        let gameState = {
            players: [],
            currentPlayerIdx: 0,
            properties: {},
            sandstorms: {},
            sandstormTurnPlayers: {},
            bankruptcyOrder: [],
            isRollPhase: true,
            hasExtraRoll: false,
            selectedCount: 2,
            humanCount: 1,
            isBusy: false
        };
        let setupPlayerNames = {};
        let setupPlayerOrder = [];

        let infoModalResolver = null;
        let exchangeModalResolver = null;
        let buildModalResolver = null;
        let liquidationModalResolver = null;
        let buyoutModalResolver = null;
        let pendingBuyout = null;

        let selectedBuildTier = null;
        let pendingBuild = null;
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
            stopBgm();
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
            if (gameState.selectedCount !== count) setupPlayerOrder = [];
            gameState.selectedCount = count;
            gameState.humanCount = Math.min(gameState.humanCount, count);
            document.querySelectorAll('.count-btn').forEach(btn => {
                if (parseInt(btn.dataset.count) === count) {
                    btn.className = 'count-btn p-2 rounded-lg border border-amber-400 bg-amber-500 text-slate-950 font-black text-xs';
                } else {
                    btn.className = 'count-btn p-2 rounded-lg border border-slate-700 bg-slate-900 text-white font-bold text-xs';
                }
            });
            renderHumanCountOptions();
            renderPlayerSetup();
        }

        function renderHumanCountOptions() {
            const container = document.getElementById("human-count-options");
            container.innerHTML = "";

            for (let humanCount = 1; humanCount <= gameState.selectedCount; humanCount++) {
                const cpuCount = gameState.selectedCount - humanCount;
                const button = document.createElement("button");
                const isSelected = humanCount === gameState.humanCount;
                button.type = "button";
                button.className = isSelected
                    ? "mix-btn p-2 rounded-lg border border-emerald-400 bg-emerald-500 text-slate-950 font-black text-[10px]"
                    : "mix-btn p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold text-[10px]";
                button.setAttribute("aria-pressed", String(isSelected));
                button.textContent = cpuCount === 0
                    ? `人間 ${humanCount}人 · CPUなし`
                    : `人間 ${humanCount}人 · CPU ${cpuCount}人`;
                button.addEventListener("click", () => {
                    if (gameState.humanCount !== humanCount) setupPlayerOrder = [];
                    gameState.humanCount = humanCount;
                    renderHumanCountOptions();
                    renderPlayerSetup();
                });
                container.appendChild(button);
            }
        }

        function getSetupPlayerSpecs() {
            const specs = [];
            for (let index = 0; index < gameState.selectedCount; index++) {
                const isAi = index >= gameState.humanCount;
                const roleIndex = isAi ? index - gameState.humanCount : index;
                specs.push({
                    key: isAi ? `cpu-${roleIndex + 1}` : `human-${roleIndex + 1}`,
                    role: isAi ? `CPU ${roleIndex + 1}` : `人間 ${roleIndex + 1}`,
                    defaultName: isAi ? `CPU ${roleIndex + 1}` : `P${roleIndex + 1}`,
                    isAi
                });
            }
            return specs;
        }

        function limitPlayerName(value) {
            let remainingWidth = 12;
            let name = "";
            for (const character of value) {
                const width = /^[\u0020-\u007e\uff61-\uff9f]$/.test(character) ? 1 : 2;
                if (width > remainingWidth) break;
                name += character;
                remainingWidth -= width;
            }
            return name;
        }

        function renderPlayerSetup() {
            const specs = getSetupPlayerSpecs();
            const validKeys = new Set(specs.map(spec => spec.key));
            setupPlayerOrder = setupPlayerOrder.filter(key => validKeys.has(key));
            specs.forEach(spec => {
                if (!setupPlayerOrder.includes(spec.key)) setupPlayerOrder.push(spec.key);
                if (setupPlayerNames[spec.key] === undefined) setupPlayerNames[spec.key] = spec.defaultName;
                setupPlayerNames[spec.key] = limitPlayerName(setupPlayerNames[spec.key]);
            });

            const nameFields = document.getElementById("player-name-fields");
            nameFields.innerHTML = "";
            specs.forEach(spec => {
                const field = document.createElement("label");
                field.className = "setup-name-field";
                const role = document.createElement("span");
                role.textContent = spec.role;
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 12;
                input.value = setupPlayerNames[spec.key];
                input.setAttribute("aria-label", `${spec.role}の名前`);
                const updateName = () => {
                    input.value = limitPlayerName(input.value);
                    setupPlayerNames[spec.key] = input.value;
                    renderPlayerOrder(specs);
                };
                input.addEventListener("input", event => {
                    if (!event.isComposing) updateName();
                });
                input.addEventListener("compositionend", updateName);
                field.append(role, input);
                nameFields.appendChild(field);
            });
            renderPlayerOrder(specs);
        }

        function renderPlayerOrder(specs = getSetupPlayerSpecs()) {
            const orderList = document.getElementById("player-order-list");
            const specsByKey = new Map(specs.map(spec => [spec.key, spec]));
            orderList.innerHTML = "";

            setupPlayerOrder.forEach((key, index) => {
                const spec = specsByKey.get(key);
                if (!spec) return;

                const row = document.createElement("div");
                row.className = "setup-order-row";
                const number = document.createElement("span");
                number.className = "setup-order-number";
                number.textContent = String(index + 1);
                const name = document.createElement("span");
                name.className = "setup-order-name";
                name.textContent = setupPlayerNames[key] || spec.defaultName;
                const role = document.createElement("span");
                role.className = "setup-order-role";
                role.textContent = spec.isAi ? "CPU" : "人間";
                const controls = document.createElement("span");
                controls.className = "setup-order-controls";

                [-1, 1].forEach(direction => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.disabled = index + direction < 0 || index + direction >= setupPlayerOrder.length;
                    button.setAttribute("aria-label", `${name.textContent}を${direction < 0 ? "前" : "後ろ"}へ移動`);
                    button.textContent = direction < 0 ? "↑" : "↓";
                    button.addEventListener("click", () => moveSetupPlayer(key, direction));
                    controls.appendChild(button);
                });

                row.append(number, name, role, controls);
                orderList.appendChild(row);
            });
        }

        function moveSetupPlayer(key, direction) {
            const index = setupPlayerOrder.indexOf(key);
            const target = index + direction;
            if (index < 0 || target < 0 || target >= setupPlayerOrder.length) return;
            [setupPlayerOrder[index], setupPlayerOrder[target]] = [setupPlayerOrder[target], setupPlayerOrder[index]];
            renderPlayerOrder();
        }

        function updateStartMoneyMode() {
            const custom = document.getElementById("start-money").value === "custom";
            const input = document.getElementById("custom-start-money");
            document.getElementById("custom-start-money-field").classList.toggle("hidden", !custom);
            input.disabled = !custom;
            input.required = custom;
            input.setCustomValidity("");
            if (custom) input.focus();
        }

        function startGame() {
            const moneySelect = document.getElementById("start-money");
            const moneyInput = moneySelect.value === "custom" ? document.getElementById("custom-start-money") : moneySelect;
            moneyInput.setCustomValidity("");
            const startMoney = Number(moneyInput.value);
            if (!moneyInput.value.trim() || !Number.isSafeInteger(startMoney) || startMoney < 0) {
                moneyInput.setCustomValidity("所持金は0以上の整数で入力してください。");
                moneyInput.reportValidity();
                return;
            }
            if (!moneyInput.reportValidity()) return;
            applyMapTheme(document.getElementById("map-theme").value);

            const specsByKey = new Map(getSetupPlayerSpecs().map(spec => [spec.key, spec]));
            gameState.players = setupPlayerOrder.map((key, index) => {
                const spec = specsByKey.get(key);
                return {
                    id: index,
                    name: limitPlayerName(setupPlayerNames[key].trim()) || spec.defaultName,
                    isAi: spec.isAi,
                    money: startMoney,
                    position: 0,
                    laps: 0,
                    inJail: false,
                    jailTurns: 0,
                    cards: { bailPass: 0, black: 0 },
                    isBankrupt: false,
                    color: PLAYER_COLORS[index]
                };
            });
            gameState.properties = {};
            gameState.sandstorms = {};
            gameState.sandstormTurnPlayers = {};
            gameState.bankruptcyOrder = [];
            gameState.currentPlayerIdx = 0;
            gameState.isRollPhase = true;
            gameState.hasExtraRoll = false;
            gameState.isBusy = false;

            document.getElementById("setup-modal").classList.add("hidden");
            buildBoardDOM();
            updateUI();
            startBgm();
            addLog("ゲームを開始しました。ダイスを振ってください。");
        }

        function fitPropertyNames() {
            const range = document.createRange();
            document.querySelectorAll(".tile-property-name").forEach(label => {
                label.style.fontSize = "7px";
                const availableWidth = label.clientWidth;
                if (!availableWidth) return;
                range.selectNodeContents(label);
                const textWidth = range.getBoundingClientRect().width;
                if (textWidth > availableWidth) {
                    const fontSize = Math.max(1, Math.floor(7 * (availableWidth - 0.75) / textWidth * 100) / 100);
                    label.style.fontSize = `${fontSize}px`;
                }
            });
        }

        const propertyNameResizeObserver = new ResizeObserver(fitPropertyNames);

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
                        <div class="tile-property-name">${tile.name}</div>
                        <div id="tile-info-${tile.id}" class="tile-info flex flex-col items-center w-full my-auto">
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
                } else if (tile.type === "casino") {
                    bodyHtml = `
                        <div class="text-[6px] font-black text-rose-400 mt-0.5">CASINO</div>
                        <div class="my-auto text-rose-400 text-[9px]"><i class="fa-solid fa-dice"></i></div>
                        <div class="text-[6px] text-rose-300 font-bold">H &amp; L</div>
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
                    <div id="dice-1" class="w-10 h-10 bg-slate-100 rounded-lg text-slate-900 font-black text-lg flex items-center justify-center shadow-md border border-slate-300">
                        ${createDiceFaceMarkup(1)}
                    </div>
                    <div id="dice-2" class="w-10 h-10 bg-slate-100 rounded-lg text-slate-900 font-black text-lg flex items-center justify-center shadow-md border border-slate-300">
                        ${createDiceFaceMarkup(1)}
                    </div>
                </div>
                <div id="dice-total" class="min-h-8 px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-700 text-xs font-extrabold text-amber-300 shadow-inner flex items-center justify-center">ダイスを振ってください</div>

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
            fitPropertyNames();
            propertyNameResizeObserver.observe(board);
            document.fonts.ready.then(fitPropertyNames);
        }

        function hasPropertyMonopoly(ownerId, group) {
            const groupTiles = BOARD_TILES.filter(candidate => candidate.type === "property" && candidate.group === group);
            return groupTiles.length > 0 && groupTiles.every(candidate => gameState.properties[candidate.id]?.owner === ownerId);
        }

        function getActiveExchangeBoost() {
            return BOARD_TILES
                .map(tile => ({ tile, state: gameState.properties[tile.id] }))
                .find(entry => entry.state && entry.state.boostMultiplier > 1) || null;
        }

        function applyExchangeBoost(target) {
            const activeBoost = getActiveExchangeBoost();
            const nextMultiplier = activeBoost
                ? Math.min(activeBoost.state.boostMultiplier + 1, 5)
                : 2;

            if (activeBoost && activeBoost.tile.id !== target.tile.id) {
                activeBoost.state.boostMultiplier = 1;
                addLog(`${activeBoost.tile.name} の取引所倍率が解除されました。`);
            }

            target.state.boostMultiplier = nextMultiplier;
            return nextMultiplier;
        }

        function getRentMultiplier(tile, boostMultiplier = 1) {
            let multiplier = 1;
            const propertyState = gameState.properties[tile.id];
            if (propertyState && hasPropertyMonopoly(propertyState.owner, tile.group)) multiplier *= 2;
            if (boostMultiplier > 1) multiplier *= boostMultiplier;
            if (gameState.sandstorms[tile.id] > 0) multiplier *= 0.5;
            return multiplier;
        }

        function calculateRent(tile, houses, boostMultiplier = 1) {
            const base = Math.floor(tile.rent * (1 + houses * 1.5));
            return Math.floor(base * getRentMultiplier(tile, boostMultiplier));
        }

        function renderTileProperties() {
            BOARD_TILES.forEach(tile => {
                if (tile.type !== "property") return;

                const infoEl = document.getElementById(`tile-info-${tile.id}`);
                const header = document.getElementById(`tile-header-${tile.id}`);
                const tileEl = document.getElementById(`tile-${tile.id}`);
                if (!infoEl) return;

                const propState = gameState.properties[tile.id];

                tileEl.classList.toggle("has-sandstorm", Boolean(propState) && gameState.sandstorms[tile.id] > 0);
                if (propState) {
                    const owner = gameState.players[propState.owner];
                    const currentRent = calculateRent(tile, propState.houses, propState.boostMultiplier);
                    const multiplier = getRentMultiplier(tile, propState.boostMultiplier);
                    const hasMultiplier = multiplier !== 1 || gameState.sandstorms[tile.id] > 0;

                    tileEl.style.borderColor = owner.color.hex;

                    let houseIcons = "";
                    if (propState.houses === 4) {
                        houseIcons = `<div class="tile-building-icons is-hotel font-black" style="color: ${owner.color.hex}"><i class="fa-solid fa-hotel"></i></div>`;
                    } else if (propState.houses > 0) {
                        houseIcons = `<div class="tile-building-icons font-bold" style="color: ${owner.color.hex}" role="img" aria-label="家${propState.houses}軒">${'<i class="fa-solid fa-house" aria-hidden="true"></i>'.repeat(propState.houses)}</div>`;
                    }

                    header.innerHTML = "";
                    infoEl.innerHTML = `
                        ${houseIcons}
                        ${hasMultiplier ? `<span class="rent-multiplier" title="賃料倍率 ×${multiplier}">×${multiplier}</span>` : ""}
                        <div class="rent-tag" aria-label="賃料 $${currentRent}">$${currentRent}</div>
                    `;
                } else {
                    header.innerHTML = "";
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

            const activePlayers = gameState.players.filter(player => !player.isBankrupt);
            if (activePlayers.length <= 1) {
                promptEl.textContent = activePlayers.length === 1 ? `${activePlayers[0].name} の勝利！` : "ゲーム終了";
                return;
            }

            if (curPlayer.isBankrupt) {
                gameState.hasExtraRoll = false;
                handleEndTurn();
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
                btnRoll.disabled = !gameState.hasExtraRoll;
                btnEnd.disabled = gameState.hasExtraRoll;
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
                card.className = `p-1.5 rounded-xl border cursor-pointer ${isCurrent ? 'bg-slate-800 ' + p.color.border : 'bg-slate-900/60 border-slate-800'} ${p.isBankrupt ? 'opacity-30' : ''} transition-all shadow hover:border-amber-400`;
                card.setAttribute("role", "button");
                card.setAttribute("tabindex", "0");
                card.setAttribute("aria-label", `${p.name}の現金と保有物件を表示`);
                card.addEventListener("click", () => showPlayerAssets(p.id));
                card.addEventListener("keydown", event => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        showPlayerAssets(p.id);
                    }
                });

                const ownedCount = Object.values(gameState.properties).filter(prop => prop.owner === p.id).length;
                const heldCards = [
                    p.cards.bailPass ? `保釈 ×${p.cards.bailPass}` : "",
                    p.cards.black ? `ブラック ×${p.cards.black}` : ""
                ].filter(Boolean);

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
                        <span class="text-[9px] text-slate-400 font-bold"><i class="fa-solid fa-city me-0.5"></i>${ownedCount}件 <i class="fa-solid fa-chevron-right ms-1 text-[7px]"></i></span>
                    </div>
                    ${heldCards.length ? `<div class="mt-0.5 text-[8px] font-bold text-violet-300">${heldCards.join(" / ")}</div>` : ""}
                `;
                container.appendChild(card);
            });
        }

        function showPlayerAssets(playerId) {
            const player = gameState.players[playerId];
            if (!player) return;

            document.getElementById("assets-modal-title").textContent = `${player.name} の資産`;
            const summary = document.getElementById("assets-player-summary");
            summary.innerHTML = "";

            const cashRow = document.createElement("div");
            cashRow.className = "assets-cash-row";
            const cashLabel = document.createElement("span");
            cashLabel.textContent = "現金";
            const cashValue = document.createElement("strong");
            cashValue.textContent = `$${player.money.toLocaleString()}`;
            cashRow.append(cashLabel, cashValue);
            summary.appendChild(cashRow);

            const heldCardsRow = document.createElement("div");
            heldCardsRow.className = "assets-cash-row";
            const heldCardsLabel = document.createElement("span");
            heldCardsLabel.textContent = "保持カード";
            const heldCardsValue = document.createElement("strong");
            heldCardsValue.textContent = `保釈 ${player.cards.bailPass}枚 / ブラック ${player.cards.black}枚`;
            heldCardsRow.append(heldCardsLabel, heldCardsValue);
            summary.appendChild(heldCardsRow);

            const ownedProperties = BOARD_TILES.filter(tile => {
                const property = gameState.properties[tile.id];
                return tile.type === "property" && property?.owner === player.id;
            });
            const propertyList = document.getElementById("assets-property-list");
            propertyList.innerHTML = "";

            if (ownedProperties.length === 0) {
                const emptyMessage = document.createElement("p");
                emptyMessage.className = "assets-empty";
                emptyMessage.textContent = "保有物件はありません。";
                propertyList.appendChild(emptyMessage);
            } else {
                ownedProperties.forEach(tile => {
                    const property = gameState.properties[tile.id];
                    const item = document.createElement("div");
                    item.className = "assets-property";

                    const topRow = document.createElement("div");
                    topRow.className = "assets-property-top";
                    const name = document.createElement("strong");
                    name.textContent = tile.name;
                    name.style.borderLeft = `4px solid ${tile.color}`;
                    const group = document.createElement("span");
                    group.textContent = `エリア ${tile.group}`;
                    topRow.append(name, group);

                    const details = document.createElement("div");
                    details.className = "assets-property-details";
                    const rent = document.createElement("span");
                    rent.textContent = `現在の賃料 $${calculateRent(tile, property.houses, property.boostMultiplier).toLocaleString()}`;
                    const buildings = document.createElement("span");
                    buildings.textContent = property.houses === 4 ? "ホテル" : property.houses > 0 ? `家 ${property.houses}軒` : "未増築";
                    details.append(rent, buildings);
                    item.append(topRow, details);

                    const badges = document.createElement("div");
                    badges.className = "assets-badges";
                    if (hasPropertyMonopoly(player.id, tile.group)) {
                        const monopoly = document.createElement("span");
                        monopoly.className = "assets-monopoly-badge";
                        monopoly.textContent = "エリア独占 ×2";
                        badges.appendChild(monopoly);
                    }
                    if (property.boostMultiplier > 1) {
                        const boost = document.createElement("span");
                        boost.className = "assets-boost-badge";
                        boost.textContent = `取引所 ×${property.boostMultiplier}`;
                        badges.appendChild(boost);
                    }
                    if (gameState.sandstorms[tile.id] > 0) {
                        const storm = document.createElement("span");
                        storm.className = "assets-boost-badge";
                        storm.textContent = `砂嵐 半額 / 残り${gameState.sandstorms[tile.id]}ターン`;
                        badges.appendChild(storm);
                    }
                    if (badges.childElementCount > 0) item.appendChild(badges);
                    propertyList.appendChild(item);
                });
            }

            document.getElementById("assets-modal").classList.remove("hidden");
        }

        function closePlayerAssets() {
            document.getElementById("assets-modal").classList.add("hidden");
        }

        document.getElementById("assets-close-icon").addEventListener("click", closePlayerAssets);
        document.getElementById("assets-close-button").addEventListener("click", closePlayerAssets);
        document.getElementById("assets-modal").addEventListener("click", event => {
            if (event.target.id === "assets-modal") closePlayerAssets();
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") closePlayerAssets();
        });

        async function handleRollDice() {
            if ((!gameState.isRollPhase && !gameState.hasExtraRoll) || gameState.isBusy) return;

            gameState.isBusy = true;
            gameState.hasExtraRoll = false;
            document.getElementById("btn-roll").disabled = true;

            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const total = d1 + d2;
            const isDouble = (d1 === d2);

            const dice1El = document.getElementById("dice-1");
            const dice2El = document.getElementById("dice-2");
            const totalEl = document.getElementById("dice-total");

            dice1El.classList.add("rolling");
            dice2El.classList.add("rolling");
            const rollSound = playDiceRollSound();
            totalEl.textContent = "コロコロ...";

            await rollSound;

            dice1El.classList.remove("rolling");
            dice2El.classList.remove("rolling");
            dice1El.innerHTML = createDiceFaceMarkup(d1);
            dice2El.innerHTML = createDiceFaceMarkup(d2);
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
                player.position = NEXT_TRACK_TILE_ID.get(oldPos);

                playSound('dice');

                if (player.position === 0 && oldPos === LAST_TILE_BEFORE_GO) {
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
                        const rent = calculateRent(tile, propState.houses, propState.boostMultiplier);
                        const rentFactors = [];
                        if (hasPropertyMonopoly(owner.id, tile.group)) rentFactors.push("独占2倍");
                        if (propState.boostMultiplier > 1) rentFactors.push(`取引所${propState.boostMultiplier}倍`);
                        if (gameState.sandstorms[tile.id] > 0) rentFactors.push("砂嵐で半額");
                        addLog(`${player.name} は ${owner.name} に賃料 $${rent} の支払いが必要です。${rentFactors.length ? `(${rentFactors.join(" × ")})` : ''}`);
                        const rentPaid = !(player.cards.black > 0 && await askToUseHeldCard(
                            player,
                            "black",
                            "ブラックカードを使いますか？",
                            `【${tile.name}】の賃料 $${rent} を免除します。`
                        ));

                        if (rentPaid) {
                            await payMoney(player, owner, rent);
                        } else {
                            player.cards.black -= 1;
                            addLog(`${player.name} はブラックカードを使い、【${tile.name}】の賃料 $${rent} を免除されました。`);
                            playSound('buy');
                            updatePlayerCards();
                        }

                        if (rentPaid && propState.boostMultiplier > 1) {
                            addLog(`${tile.name} の取引所倍率 ${propState.boostMultiplier}倍が消滅しました。`);
                            propState.boostMultiplier = 1;
                            renderTileProperties();
                        }

                        if (rentPaid) {
                            if (propState.houses >= 4) {
                                addLog(`${tile.name} はビル建設済みのため買収できません。`);
                            } else if (!player.isBankrupt && gameState.properties[tile.id] === propState && player.money >= rent * 2) {
                                await triggerBuyoutOffer(player, owner, tile, rent);
                            }
                        }
                    }
                }
            } else if (tile.type === "exchange") {
                await triggerExchangeModal(player);
            } else if (tile.type === "gotojail") {
                const useBailPass = player.cards.bailPass > 0 && await askToUseHeldCard(
                    player,
                    "bailPass",
                    "保釈カードを使いますか？",
                    "刑務所への移動を免れ、このマスにとどまります。"
                );
                if (useBailPass) {
                    player.cards.bailPass -= 1;
                    addLog(`${player.name} は保釈カードを使い、刑務所への移送を免れました。`);
                    playSound('buy');
                    updatePlayerCards();
                } else {
                    addLog(`${player.name} は即逮捕され刑務所へ！`);
                    playSound('jail');
                    player.position = 7;
                    player.inJail = true;
                    player.jailTurns = 0;
                }
                renderTokens();
            } else if (tile.type === "tax") {
                addLog(`${player.name} は税金 $${tile.rent} の支払いが必要です。`);
                await payTax(player, tile.rent);
            } else if (tile.type === "chance") {
                await triggerChanceCard(player);
            } else if (tile.type === "casino") {
                await triggerCasino(player);
            }
        }

        async function triggerCasino(player) {
            if (player.money < 100) {
                addLog(`${player.name} は所持金が$100未満のため、カジノに参加できません。`);
                return;
            }
            let stake = 100;
            let payout = 100;
            let wins = 0;
            let settled = false;
            let entered = false;
            const updateCash = () => {
                document.getElementById("casino-cash").textContent = `$${player.money.toLocaleString()}`;
            };
            updateCash();
            const enter = () => {
                if (entered) return true;
                if (player.money < stake) return false;
                entered = true;
                player.money -= stake;
                updateCash();
                updatePlayerCards();
                addLog(`${player.name} はカジノに$${stake}を賭けて参加しました。`);
                return true;
            };
            const bet = side => {
                const value = Math.floor(Math.random() * 6) + 1;
                const won = side === "low" ? value <= 3 : value >= 4;
                if (won) {
                    wins += 1;
                    payout *= 2;
                } else {
                    payout = 0;
                }
                addLog(`${player.name} のカジノ：${side === "low" ? "ロー" : "ハイ"}、出目${value}で${won ? `成功！${wins}連勝、配当$${payout}` : "失敗。配当は$0です。"}`);
                return { value, won };
            };
            const settle = (playPayoutSound = true) => {
                if (settled) return;
                settled = true;
                player.money += payout;
                updateCash();
                if (payout > 0) {
                    addLog(`${player.name} はカジノの配当$${payout}を受け取りました。`);
                    if (playPayoutSound) playSound('buy');
                }
                updatePlayerCards();
            };

            return new Promise(resolve => {
                const modal = document.getElementById("casino-modal");
                const lowButton = document.getElementById("casino-low");
                const highButton = document.getElementById("casino-high");
                const claimButton = document.getElementById("casino-claim");
                const die = document.getElementById("casino-die");
                const status = document.getElementById("casino-status");
                const pot = document.getElementById("casino-payout");
                const streak = document.getElementById("casino-streak");
                const stakeOptions = document.getElementById("casino-stakes");
                const stakeInputs = [...stakeOptions.querySelectorAll("input")];
                let rolling = false;
                let finished = false;
                if (player.isAi) {
                    const affordableStakes = [100, 200, 500, 1000].filter(amount => amount <= player.money);
                    stake = affordableStakes[Math.floor(Math.random() * affordableStakes.length)];
                    payout = stake;
                }
                document.getElementById("casino-player").textContent = player.name;
                pot.textContent = `$${payout}`;
                streak.textContent = "0 / 3";
                status.textContent = player.isAi ? "CPUがベットを選択中..." : "ローかハイを選択";
                die.innerHTML = createDiceFaceMarkup(1);
                lowButton.disabled = player.isAi;
                highButton.disabled = player.isAi;
                claimButton.disabled = true;
                claimButton.textContent = "配当を受け取る";
                stakeOptions.disabled = player.isAi;
                stakeInputs.forEach(input => {
                    const amount = Number(input.value);
                    input.disabled = amount > player.money;
                    input.checked = amount === stake;
                    input.onchange = () => {
                        if (player.isAi || entered || !input.checked || amount > player.money) return;
                        stake = amount;
                        payout = amount;
                        pot.textContent = `$${payout}`;
                    };
                });

                const roll = async side => {
                    if (rolling || finished || !enter()) return;
                    stakeOptions.disabled = true;
                    rolling = true;
                    lowButton.disabled = true;
                    highButton.disabled = true;
                    claimButton.disabled = true;
                    const sideName = side === "low" ? "ロー" : "ハイ";
                    status.textContent = `${sideName}で判定中...`;
                    die.classList.add("rolling");
                    const rollSound = playDiceRollSound();
                    const outcome = bet(side);
                    await rollSound;
                    die.classList.remove("rolling");
                    die.innerHTML = createDiceFaceMarkup(outcome.value);
                    playSound(outcome.won ? 'casino-win' : 'casino-lose');
                    rolling = false;
                    pot.textContent = `$${payout}`;
                    streak.textContent = `${wins} / 3`;
                    finished = !outcome.won || wins === 3;
                    status.textContent = `${sideName}：${!outcome.won ? "失敗：配当 $0" : wins === 3 ? `3連勝！$${payout}を獲得` : player.isAi ? "成功！CPUが続行を判断中..." : "成功！受け取りか、もう一度挑戦"}`;
                    claimButton.disabled = player.isAi && !finished;
                    if (finished) {
                        settle(false);
                        claimButton.textContent = "閉じる";
                    } else {
                        lowButton.disabled = player.isAi;
                        highButton.disabled = player.isAi;
                        claimButton.textContent = `$${payout}を受け取る`;
                    }
                };
                lowButton.onclick = () => { if (!player.isAi) return roll("low"); };
                highButton.onclick = () => { if (!player.isAi) return roll("high"); };
                claimButton.onclick = () => {
                    if (rolling || (!finished && (wins === 0 || player.isAi))) return;
                    settle();
                    modal.classList.add("hidden");
                    lowButton.onclick = null;
                    highButton.onclick = null;
                    claimButton.onclick = null;
                    stakeInputs.forEach(input => input.onchange = null);
                    resolve();
                };
                modal.classList.remove("hidden");
                if (player.isAi) {
                    const runAiCasino = async () => {
                        await new Promise(done => setTimeout(done, 600));
                        while (!finished) {
                            await roll(Math.random() < 0.5 ? "low" : "high");
                            if (finished) return;
                            await new Promise(done => setTimeout(done, 700));
                            if (Math.random() < 0.5) {
                                finished = true;
                                settle();
                                status.textContent = `CPUは$${payout}の配当を確定しました。`;
                                claimButton.textContent = "閉じる";
                                claimButton.disabled = false;
                            }
                        }
                    };
                    runAiCasino();
                }
            });
        }

        async function triggerBuyoutOffer(player, owner, tile, rent) {
            const property = gameState.properties[tile.id];
            if (!property || property.houses >= 4 || property.owner !== owner.id) return;
            const price = rent * 2;
            if (player.isAi) {
                                if (player.money >= price) {
                    completeBuyout(player, owner, tile, price);
                }
                return;
            }

            return new Promise(resolve => {
                buyoutModalResolver = resolve;
                pendingBuyout = { player, owner, tile, price };
                document.getElementById("buyout-description").textContent = `賃料 $${rent} を支払いました。【${tile.name}】を所有者 ${owner.name} から買収できます。`;
                document.getElementById("buyout-price").textContent = `$${price}`;
                document.getElementById("buyout-confirm-btn").disabled = player.money < price;
                document.getElementById("buyout-modal").classList.remove("hidden");
            });
        }

        function resolveBuyoutModal(accept) {
            document.getElementById("buyout-modal").classList.add("hidden");
            const offer = pendingBuyout;
            pendingBuyout = null;
            let purchased = false;
            if (accept && offer) {
                purchased = completeBuyout(offer.player, offer.owner, offer.tile, offer.price);
            } else if (offer) {
                addLog(`${offer.player.name} は 【${offer.tile.name}】 の買収を見送りました。`);
            }

            const resolver = buyoutModalResolver;
            buyoutModalResolver = null;
            if (resolver) resolver(purchased);
        }

        function completeBuyout(player, owner, tile, price) {
            const property = gameState.properties[tile.id];
            if (!property || property.houses >= 4 || property.owner !== owner.id || player.money < price) return false;

            player.money -= price;
            owner.money += price;
            property.owner = player.id;
            playSound('buyout');
            addLog(`${player.name} は ${owner.name} に $${price} を支払い、【${tile.name}】を買収しました！`);
            renderTileProperties();
            updatePlayerCards();
            return true;
        }

        function askToUseHeldCard(player, cardType, title, description) {
            if (player.isAi) return Promise.resolve(true);

            return new Promise(resolve => {
                const modal = document.getElementById("card-choice-modal");
                const useButton = document.getElementById("card-use-button");
                const keepButton = document.getElementById("card-keep-button");
                const finish = useCard => {
                    modal.classList.add("hidden");
                    useButton.onclick = null;
                    keepButton.onclick = null;
                    resolve(useCard);
                };

                document.getElementById("card-choice-title").textContent = title;
                document.getElementById("card-choice-description").textContent = description;
                useButton.onclick = () => finish(true);
                keepButton.onclick = () => finish(false);
                modal.classList.remove("hidden");
            });
        }

        function triggerChanceCard(player) {
            return new Promise((resolve) => {
                const card = drawChanceCard();
                if (!card) {
                    addLog("出現可能なチャンスカードが設定されていません。");
                    resolve();
                    return;
                }
                addLog(`チャンス: ${card.text}`);

                infoModalResolver = async () => {
                    if (card.money) {
                        if (card.money > 0) {
                            player.money += card.money;
                            playSound('go');
                        } else {
                            await payTax(player, Math.abs(card.money));
                        }
                    } else if (card.heldCard) {
                        player.cards[card.heldCard] += 1;
                        addLog(`${player.name} は${card.heldCard === "bailPass" ? "保釈カード" : "ブラックカード"}を獲得しました。`);
                        playSound('buy');
                        updatePlayerCards();
                    } else if (card.effect === "sandstorm") {
                        await triggerSandstorm(player);
                    } else if (card.effect === "earthquake") {
                        await triggerEarthquake(player);
                    } else if (card.moveTo !== undefined) {
                        const currentTrackIndex = BOARD_TRACK_TILES.findIndex(tile => tile.id === player.position);
                        const targetTrackIndex = BOARD_TRACK_TILES.findIndex(tile => tile.id === card.moveTo);
                        const steps = (targetTrackIndex - currentTrackIndex + BOARD_TRACK_TILES.length) % BOARD_TRACK_TILES.length;
                        await movePlayerStepByStep(player, steps);
                        addLog(`${player.name} は【${BOARD_TILES[card.moveTo].name}】へ移動しました。`);
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

        function applySandstorm(tile, player) {
            const property = gameState.properties[tile.id];
            if (!property || !gameState.players[property.owner] || gameState.players[property.owner].isBankrupt) return;
            gameState.sandstorms[tile.id] = 3;
            gameState.sandstormTurnPlayers[tile.id] = new Set([player.id]);
            addLog(`【${tile.name}】に砂嵐が発生！全員が1回ずつサイコロを振るまでを1ターンとして、3ターンの間賃料が半額になります。`);
            renderTileProperties();
        }

        function completeSandstormTurn(player) {
            const activePlayerIds = gameState.players.filter(activePlayer => !activePlayer.isBankrupt).map(activePlayer => activePlayer.id);
            Object.keys(gameState.sandstorms).forEach(tileId => {
                const rolledPlayers = gameState.sandstormTurnPlayers[tileId] || new Set();
                rolledPlayers.add(player.id);

                if (!activePlayerIds.every(playerId => rolledPlayers.has(playerId))) {
                    gameState.sandstormTurnPlayers[tileId] = rolledPlayers;
                    return;
                }

                gameState.sandstorms[tileId] -= 1;
                if (gameState.sandstorms[tileId] <= 0) {
                    delete gameState.sandstorms[tileId];
                    delete gameState.sandstormTurnPlayers[tileId];
                    addLog(`【${BOARD_TILES[tileId].name}】の砂嵐が収まり、賃料が元に戻りました。`);
                } else {
                    gameState.sandstormTurnPlayers[tileId] = new Set();
                }
            });
        }

        function triggerSandstorm(player) {
            const cities = BOARD_TILES.filter(tile => {
                const property = gameState.properties[tile.id];
                return tile.type === "property" && property && gameState.players[property.owner] && !gameState.players[property.owner].isBankrupt;
            });
            if (cities.length === 0) {
                addLog("所有者のいる都市がないため、砂嵐は発生しませんでした。");
                return Promise.resolve();
            }
            if (player.isAi) {
                const opponents = cities.filter(tile => {
                    const property = gameState.properties[tile.id];
                    return property && property.owner !== player.id && !gameState.players[property.owner].isBankrupt;
                });
                const candidates = opponents.length ? opponents : cities;
                const rentForCity = tile => {
                    const property = gameState.properties[tile.id];
                    return calculateRent(tile, property?.houses || 0, property?.boostMultiplier || 1);
                };
                candidates.sort((first, second) => opponents.length
                    ? rentForCity(second) - rentForCity(first)
                    : rentForCity(first) - rentForCity(second));
                applySandstorm(candidates[0], player);
                return Promise.resolve();
            }

            return chooseCityForEffect(cities, "砂嵐", tile => {
                const property = gameState.properties[tile.id];
                const rent = calculateRent(tile, property.houses, property.boostMultiplier);
                return `${gameState.players[property.owner].name} / 現在の賃料 $${rent}`;
            }, tile => applySandstorm(tile, player));
        }

        function applyEarthquake(tile) {
            const property = gameState.properties[tile.id];
            if (!property || property.houses <= 0 || !gameState.players[property.owner] || gameState.players[property.owner].isBankrupt) return;
            const previousBuildings = property.houses === 4 ? "ホテル" : `家${property.houses}軒`;
            property.houses -= 1;
            const remainingBuildings = property.houses > 0 ? `家${property.houses}軒` : "建築物なし";
            addLog(`【${tile.name}】で地震が発生！${previousBuildings}から${remainingBuildings}になりました。`);
            renderTileProperties();
        }

        function triggerEarthquake(player) {
            const cities = BOARD_TILES.filter(tile => {
                const property = gameState.properties[tile.id];
                return tile.type === "property" && property?.houses > 0 && gameState.players[property.owner] && !gameState.players[property.owner].isBankrupt;
            });
            if (cities.length === 0) {
                addLog("建築物のある都市がないため、地震の被害はありませんでした。");
                return Promise.resolve();
            }
            if (player.isAi) {
                const opponents = cities.filter(tile => gameState.properties[tile.id].owner !== player.id);
                const candidates = opponents.length ? opponents : cities;
                const rentLoss = tile => {
                    const property = gameState.properties[tile.id];
                    return calculateRent(tile, property.houses, property.boostMultiplier)
                        - calculateRent(tile, property.houses - 1, property.boostMultiplier);
                };
                candidates.sort((first, second) => opponents.length
                    ? rentLoss(second) - rentLoss(first)
                    : rentLoss(first) - rentLoss(second));
                applyEarthquake(candidates[0]);
                return Promise.resolve();
            }
            return chooseCityForEffect(cities, "地震", tile => {
                const property = gameState.properties[tile.id];
                const buildings = property.houses === 4 ? "ホテル → 家3軒" : `家${property.houses}軒 → ${property.houses === 1 ? "建築物なし" : `家${property.houses - 1}軒`}`;
                return `${gameState.players[property.owner].name} / ${buildings}`;
            }, applyEarthquake);
        }

        function chooseCityForEffect(cities, effectName, describeCity, applyEffect) {
            return new Promise(resolve => {
                const modal = document.getElementById("city-effect-modal");
                const list = document.getElementById("city-effect-list");
                document.getElementById("city-effect-title").textContent = `${effectName}：都市を選択`;
                list.innerHTML = "";
                cities.forEach(tile => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "w-full bg-slate-900 border border-slate-700 hover:border-cyan-400 p-2 rounded-lg text-xs text-left";
                    const name = document.createElement("strong");
                    name.className = "block text-white";
                    name.textContent = tile.name;
                    const details = document.createElement("span");
                    details.className = "block text-[10px] text-slate-300";
                    details.textContent = describeCity(tile);
                    button.append(name, details);
                    button.onclick = () => {
                        modal.classList.add("hidden");
                        applyEffect(tile);
                        resolve();
                    };
                    list.appendChild(button);
                });
                modal.classList.remove("hidden");
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

                const activeBoost = getActiveExchangeBoost();
                const nextMultiplier = activeBoost
                    ? Math.min(activeBoost.state.boostMultiplier + 1, 5)
                    : 2;

                if (player.isAi) {
                    const activeOwnedTarget = activeBoost && myProperties.find(p => p.tile.id === activeBoost.tile.id);
                    const target = activeOwnedTarget && activeBoost.state.boostMultiplier < 5
                        ? activeOwnedTarget
                        : myProperties.find(p => !activeBoost || p.tile.id !== activeBoost.tile.id) || activeOwnedTarget || myProperties[0];
                    player.money -= FEE;
                    const multiplier = applyExchangeBoost(target);
                    playSound('boost');
                    addLog(`${player.name} は手数料$100を支払い、【${target.tile.name}】の賃料を${multiplier}倍に強化！`);
                    renderTileProperties();
                    updatePlayerCards();
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
                    const isActiveTarget = activeBoost && activeBoost.tile.id === tile.id;
                    const oldMultiplierText = activeBoost && !isActiveTarget
                        ? ` / ${activeBoost.tile.name}の${activeBoost.state.boostMultiplier}倍は解除`
                        : "";
                    btn.innerHTML = `
                        <div>
                            <span class="font-bold text-white">${tile.name}</span>
                            <span class="text-[10px] text-slate-400 block">現在の賃料: $${calculateRent(tile, state.houses, state.boostMultiplier)}${oldMultiplierText}</span>
                        </div>
                        <span class="text-amber-400 font-bold text-[10px] bg-amber-950 px-2 py-1 rounded">
                            ${isActiveTarget && state.boostMultiplier >= 5 ? '🔥5倍 (MAX)' : `🔥${nextMultiplier}倍に強化`}
                        </span>
                    `;
                    btn.onclick = () => {
                        player.money -= FEE;
                        const multiplier = applyExchangeBoost({ tile, state });
                        playSound('boost');
                        addLog(`${player.name} は手数料$100を支払い、【${tile.name}】の賃料を${multiplier}倍に強化！`);
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

        function completePropertyDevelopment(player, tile, targetLevel) {
            const property = gameState.properties[tile.id];
            if (player.isBankrupt || tile.type !== "property" || !Number.isInteger(targetLevel) || targetLevel < 0 || targetLevel > 4) return false;
            if (property && (property.owner !== player.id || targetLevel <= property.houses)) return false;
            if (targetLevel === 4 && player.laps < 1) return false;
            const currentLevel = property?.houses || 0;
            const totalCost = (property ? 0 : tile.price) + tile.housePrice * (targetLevel - currentLevel);
            if (player.money < totalCost) return false;

            player.money -= totalCost;
            if (property) property.houses = targetLevel;
            else gameState.properties[tile.id] = { owner: player.id, houses: targetLevel, boostMultiplier: 1 };
            const tierName = targetLevel === 0 ? "土地権利書" : targetLevel === 4 ? "ホテル" : `家${targetLevel}軒`;
            playSound('buy');
            addLog(`${player.name} は【${tile.name}】の${tierName}を $${totalCost} で${property ? "増築" : "購入"}しました！`);
            renderTileProperties();
            updatePlayerCards();
            return true;
        }

        function triggerBuildModal(player, tile) {
            return new Promise((resolve) => {
                const propState = gameState.properties[tile.id];
                if (player.isBankrupt || tile.type !== "property" || (propState && (propState.owner !== player.id || propState.houses >= 4))) {
                    resolve(false);
                    return;
                }

                if (player.isAi) {
                    const minimumLevel = propState ? propState.houses + 1 : 0;
                    for (let targetLevel = 4; targetLevel >= minimumLevel; targetLevel--) {
                        if (targetLevel === 4 && player.laps < 1) continue;
                        const cost = (propState ? 0 : tile.price) + tile.housePrice * (targetLevel - (propState?.houses || 0));
                        if (player.money >= cost + 80) {
                            resolve(completePropertyDevelopment(player, tile, targetLevel));
                            return;
                        }
                    }
                    resolve(false);
                    return;
                }

                buildModalResolver = resolve;
                selectedBuildTier = null;
                pendingBuild = { player, tile };
                const confirmButton = document.getElementById("build-confirm-btn");
                confirmButton.disabled = true;
                confirmButton.textContent = propState ? "増築する" : "購入する";

                document.getElementById("build-modal-color").style.backgroundColor = tile.color;
                document.getElementById("build-modal-title").textContent = `【${tile.name}】の${propState ? "増築" : "購入・建築"}`;
                document.getElementById("build-modal-subtitle").textContent = `${propState ? `現在: ${propState.houses === 0 ? "土地権利書のみ" : `家${propState.houses}軒`} / 追加費用` : `土地代 $${tile.price} 込みの総額`} | 所持金: $${player.money.toLocaleString()}`;

                const container = document.getElementById("build-tiers-container");
                container.innerHTML = "";

                const tierNames = ["土地権利書", "家 1軒", "家 2軒", "家 3軒", "ホテル"];
                const willCompleteMonopoly = !propState && BOARD_TILES
                    .filter(candidate => candidate.type === "property" && candidate.group === tile.group)
                    .every(candidate => candidate.id === tile.id || gameState.properties[candidate.id]?.owner === player.id);
                
                for (let level = 0; level <= 4; level++) {
                    const isAlreadyBuilt = propState && propState.houses >= level;
                    const isHotelLocked = (level === 4 && player.laps < 1);
                    const cost = (propState ? 0 : tile.price) + tile.housePrice * (level - (propState?.houses || 0));
                    let rentVal = propState ? calculateRent(tile, level, propState.boostMultiplier) : Math.floor(tile.rent * (1 + level * 1.5)) * (willCompleteMonopoly ? 2 : 1);
                    if (!propState && gameState.sandstorms[tile.id] > 0) rentVal = Math.floor(rentVal / 2);

                    let disabledReason = "";
                    let isDisabled = false;

                    if (isAlreadyBuilt) {
                        isDisabled = true;
                        disabledReason = level === 0 ? "所有済み" : "建築済み";
                    } else if (isHotelLocked) {
                        isDisabled = true;
                        disabledReason = "1周目は建設不可";
                    } else if (player.money < cost) {
                        isDisabled = true;
                        disabledReason = "資金不足";
                    }

                    const row = document.createElement("div");
                    row.className = `p-2 rounded-lg border flex items-center justify-between gap-2 transition ${isDisabled ? 'bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-slate-900 border-slate-700 hover:border-sky-400 cursor-pointer'}`;
                    
                    row.innerHTML = `
                        <div class="flex items-center gap-2 min-w-0">
                            <input type="radio" name="build-tier" value="${level}" aria-label="${tierNames[level]}" ${isDisabled ? 'disabled' : ''} class="accent-sky-500">
                            <div>
                                <span class="font-bold text-xs text-white block"><i class="fa-solid ${level === 0 ? 'fa-file-contract' : level === 4 ? 'fa-hotel' : 'fa-house'} me-1" aria-hidden="true"></i>${tierNames[level]}</span>
                                <span class="text-[9px] text-slate-400">賃料: <b class="text-emerald-400">$${rentVal}</b></span>
                            </div>
                        </div>
                        <div class="text-right shrink-0">
                            <span class="text-xs font-black ${isDisabled ? 'text-slate-500' : 'text-amber-400'}">${isDisabled ? disabledReason : '$' + cost}</span>
                        </div>
                    `;

                    if (!isDisabled) {
                        const selectTier = () => {
                            const radio = row.querySelector("input");
                            radio.checked = true;
                            selectedBuildTier = level;
                            confirmButton.disabled = false;
                        };
                        row.onclick = selectTier;
                        row.querySelector("input").addEventListener("change", selectTier);
                    }

                    container.appendChild(row);
                }

                document.getElementById("build-modal").classList.remove("hidden");
            });
        }

        function confirmBuildSelection() {
            if (selectedBuildTier === null || !pendingBuild) return;
            const { player, tile } = pendingBuild;
            if (completePropertyDevelopment(player, tile, selectedBuildTier)) resolveBuildModal(true);
        }

        function resolveBuildModal(built) {
            document.getElementById("build-modal").classList.add("hidden");
            pendingBuild = null;
            selectedBuildTier = null;
            renderTileProperties();
            updatePlayerCards();
            updateUI();
            if (buildModalResolver) {
                const res = buildModalResolver;
                buildModalResolver = null;
                res(built);
            }
        }

        document.getElementById("buyout-confirm-btn").addEventListener("click", () => resolveBuyoutModal(true));

        document.getElementById("buyout-decline-btn").addEventListener("click", () => resolveBuyoutModal(false));

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

        async function handleBuyProperty() {
            if (gameState.isBusy) return;
            const curPlayer = gameState.players[gameState.currentPlayerIdx];
            const tile = BOARD_TILES[curPlayer.position];

            if (tile.type === "property" && !gameState.properties[tile.id]) {
                if (curPlayer.money >= tile.price) {
                    gameState.isBusy = true;
                    updateUI();
                    await triggerBuildModal(curPlayer, tile);
                    gameState.isBusy = false;
                    updateUI();
                }
            }
        }

        function handleEndTurn() {
            if (gameState.isBusy || gameState.players.filter(player => !player.isBankrupt).length <= 1) return;

            if (gameState.hasExtraRoll) {
                gameState.isRollPhase = true;
                addLog(`${gameState.players[gameState.currentPlayerIdx].name} はゾロ目のため、もう一度サイコロを振ります！`);
                updateUI();
                return;
            }

            const endingPlayer = gameState.players[gameState.currentPlayerIdx];
            if (!endingPlayer.isBankrupt) completeSandstormTurn(endingPlayer);

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

        function requestBankruptcyConfirmation() {
            const debtor = liquidationState.debtor;
            if (!debtor || debtor.isBankrupt || document.getElementById("liquidation-modal").classList.contains("hidden")) return;
            document.getElementById("bankruptcy-confirm-description").textContent = `${debtor.name} は保有物件を失い、このゲームから脱落します。`;
            document.getElementById("liquidation-modal").inert = true;
            document.getElementById("bankruptcy-confirm-modal").classList.remove("hidden");
            document.getElementById("bankruptcy-cancel-btn").focus();
        }

        function resolveBankruptcyConfirmation(accept) {
            const modal = document.getElementById("bankruptcy-confirm-modal");
            if (modal.classList.contains("hidden")) return;
            modal.classList.add("hidden");
            document.getElementById("liquidation-modal").inert = false;
            if (accept) confirmBankruptcy();
            else document.getElementById("liq-bankruptcy-btn").focus();
        }

        function confirmBankruptcy() {
            const debtor = liquidationState.debtor;
            const creditor = liquidationState.creditor;
            if (!debtor || debtor.isBankrupt || document.getElementById("liquidation-modal").classList.contains("hidden")) return;

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
            if (player.isBankrupt) return;
            player.isBankrupt = true;
            gameState.bankruptcyOrder.push(player.id);
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
                stopBgm();
                const finishedPlayers = gameState.players;
                setTimeout(() => {
                    if (gameState.players === finishedPlayers) showGameResults();
                }, 400);
            }
        }

        function getGameResults() {
            return [...gameState.players].sort((first, second) => {
                if (first.isBankrupt !== second.isBankrupt) return first.isBankrupt ? 1 : -1;
                return gameState.bankruptcyOrder.indexOf(second.id) - gameState.bankruptcyOrder.indexOf(first.id);
            }).map((player, index) => {
                const properties = Object.entries(gameState.properties)
                    .filter(([, property]) => property.owner === player.id);
                return {
                    player,
                    rank: index + 1,
                    cash: player.money,
                    totalAssets: calculateTotalAssets(player),
                    propertyCount: properties.length,
                    houses: properties.reduce((total, [, property]) => total + (property.houses < 4 ? property.houses : 0), 0),
                    hotels: properties.filter(([, property]) => property.houses === 4).length
                };
            });
        }

        function showGameResults() {
            const results = getGameResults();
            if (!results.length) return;
            showModal("🏆 ゲームセット！", "");
            document.getElementById("info-modal").classList.add("is-game-results");
            document.getElementById("modal-confirm-btn").textContent = "タイトルに戻る";
            document.getElementById("modal-color-bar").style.backgroundColor = results[0].player.color.hex;
            const body = document.getElementById("modal-body");
            const winner = document.createElement("p");
            winner.className = "text-center text-sm font-extrabold text-amber-300 mb-3 break-words";
            winner.textContent = `${results[0].player.name} の勝利！`;
            body.appendChild(winner);

            const list = document.createElement("ol");
            list.className = "space-y-3";
            results.forEach(result => {
                const item = document.createElement("li");
                item.className = "border-b border-slate-700 pb-3 last:border-0";
                const heading = document.createElement("div");
                heading.className = "flex items-start gap-2 mb-1";
                const rank = document.createElement("strong");
                rank.className = "shrink-0 text-amber-300";
                rank.textContent = `${result.rank}位`;
                const name = document.createElement("strong");
                name.className = "min-w-0 flex-1 break-words";
                name.style.color = result.player.color.hex;
                name.textContent = result.player.name;
                const status = document.createElement("span");
                status.className = "shrink-0 text-[10px] text-slate-400";
                status.textContent = result.player.isBankrupt ? "破産" : "生存";
                heading.append(rank, name, status);

                const assets = document.createElement("div");
                assets.className = "flex flex-wrap justify-between gap-x-3 gap-y-1 text-[11px]";
                const total = document.createElement("strong");
                total.className = "text-emerald-400";
                total.textContent = `総資産（売却評価） $${result.totalAssets.toLocaleString()}`;
                const cash = document.createElement("span");
                cash.textContent = `現金 $${result.cash.toLocaleString()}`;
                assets.append(total, cash);
                const buildings = document.createElement("p");
                buildings.className = "text-[10px] text-slate-300 mt-1";
                buildings.textContent = `物件 ${result.propertyCount}件 / 家 ${result.houses}軒 / ホテル ${result.hotels}棟`;
                const cards = document.createElement("p");
                cards.className = "text-[10px] text-slate-400 mt-1";
                cards.textContent = `保釈カード ${result.player.cards.bailPass}枚 / ブラックカード ${result.player.cards.black}枚`;
                item.append(heading, assets, buildings, cards);
                list.appendChild(item);
            });
            body.appendChild(list);
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
                        await handleBuyProperty();
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
                const rentCurr = propState ? calculateRent(tile, propState.houses, propState.boostMultiplier) : tile.rent;
                const rentFactors = [];
                if (propState && hasPropertyMonopoly(propState.owner, tile.group)) rentFactors.push("独占 ×2");
                if (propState && propState.boostMultiplier > 1) rentFactors.push(`取引所 ×${propState.boostMultiplier}`);
                if (propState && gameState.sandstorms[tileId] > 0) rentFactors.push("砂嵐 ×0.5");
                bodyHtml = `
                    <div class="space-y-1 text-xs">
                        <div class="flex justify-between"><span class="text-slate-400">購入価格:</span> <span class="font-bold text-amber-400">$${tile.price}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">基本賃料:</span> <span class="font-bold text-white">$${tile.rent}</span></div>
                        <div class="flex justify-between items-start gap-2"><span class="text-slate-400 shrink-0">適用倍率:</span> <span class="font-bold text-amber-400 min-w-0 text-right break-words">${rentFactors.length ? rentFactors.join(" / ") : "なし（×1）"}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">現在の賃料:</span> <span class="font-bold text-emerald-400">$${rentCurr}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">増築費用:</span> <span class="font-bold text-white">$${tile.housePrice}</span></div>
                        <div class="flex justify-between pt-1 border-t border-slate-700"><span class="text-slate-400">所有者:</span> <span class="font-bold text-amber-300">${ownerName}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">増築状況:</span> <span class="font-bold text-white">${propState ? (propState.houses === 4 ? 'ホテル' : propState.houses + ' 軒') : 'なし'}</span></div>
                    </div>
                `;
            } else {
                bodyHtml = `
                    <div class="text-center py-2 text-slate-300">
                        【${tile.name}】 マス<br>
                        <span class="text-[10px] text-slate-400">${tile.type === 'exchange' ? '手数料$100で所有物件1つの取引所倍率を上げます (2〜5倍)。別の物件を選ぶと旧倍率は解除され、賃料が徴収されると倍率は消滅します。' : tile.type === 'casino' ? '$100・$200・$500・$1,000からベット額を選んで強制参加。所持金を超える額は選べません。ロー(1〜3)かハイ(4〜6)に賭け、成功ごとに配当が2倍になります。最大3連勝でベット額の8倍。成功後は受け取りか続行を選択でき、失敗すると配当は$0です。所持金$100未満では参加できません。' : '特殊イベントマスです。'}</span>
                    </div>
                `;
            }

            document.getElementById("modal-color-bar").style.backgroundColor = tile.color || "#64748b";
            showModal(tile.name, bodyHtml);
        }

        function showModal(title, contentHtml) {
            document.getElementById("info-modal").classList.remove("is-game-results");
            document.getElementById("modal-confirm-btn").textContent = "OK";
            document.getElementById("modal-title").textContent = title;
            document.getElementById("modal-body").innerHTML = contentHtml;
            document.getElementById("info-modal").classList.remove("hidden");
        }

        function resolveInfoModal() {
            const modal = document.getElementById("info-modal");
            modal.classList.add("hidden");
            if (modal.classList.contains("is-game-results")) {
                modal.classList.remove("is-game-results");
                infoModalResolver = null;
                confirmReturnToTitle();
                return;
            }
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
