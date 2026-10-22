tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        felt: '#0a5c36',
                        feltdark: '#053b22',
                        gold: '#d4af37',
                        golddark: '#aa8c2c',
                        cardbg: '#fcfbf7'
                    },
                    fontFamily: {
                        sans: ['Inter', 'sans-serif']
                    }
                }
            }
        }

$(document).ready(function() {

            // Global State Variables
            const players = ['N', 'E', 'S', 'W'];
            const suitsOrder = ['♣', '♦', '♥', '♠', 'NT'];
            
            let gameState = {
                rule: 'rubber',
                targetScore: 1000,
                dealerIndex: 0,
                currentBidderIndex: 0,
                currentPhase: 'bidding', // 'bidding', 'play'
                vulnerability: { NS: false, EW: false },
                scores: { NS: 0, EW: 0 },
                gamesWon: { NS: 0, EW: 0 },
                bidHistory: [],
                highestBid: null,
                doubleState: 'NONE', // 'NONE', 'DOUBLE', 'REDOUBLE'
                doublePlayer: null,
                consecutivePasses: 0,
                contract: null,
                currentTrick: 1,
                activePlayIndex: 0,
                tricksWon: { NS: 0, EW: 0 },
                history: []
            };

            let selectedBidLevel = null;

            // Start Game Trigger
            $('#btn-start-game').click(function() {
                gameState.rule = $('#setup-rule').val();
                const dSeat = $('#setup-dealer').val();
                gameState.dealerIndex = players.indexOf(dSeat);

                $('#header-match-type').text($('#setup-rule option:selected').text().split(' ')[0]);
                $('#modal-setup').addClass('hidden');

                startNewDeal();
            });

            function startNewDeal() {
                gameState.currentPhase = 'bidding';
                gameState.bidHistory = [];
                gameState.highestBid = null;
                gameState.doubleState = 'NONE';
                gameState.doublePlayer = null;
                gameState.consecutivePasses = 0;
                gameState.contract = null;
                gameState.currentTrick = 1;
                gameState.tricksWon = { NS: 0, EW: 0 };
                selectedBidLevel = null;

                // Set dealer and initial bidder
                gameState.currentBidderIndex = gameState.dealerIndex;

                // Update Vulnerability according to Standard Rotation if Rubber
                updateVulnerabilityUI();

                // UI Reset
                $('.role-indicator').text('');
                $('.last-action').text('-').removeClass('text-emerald-400 text-yellow-300 text-red-400 text-blue-400 font-bold');
                
                $('#panel-bidding').removeClass('hidden');
                $('#panel-play').addClass('hidden');
                $('#trick-counter-container').addClass('hidden');

                $('#table-phase-badge').text('ビッドフェーズ');
                $('#table-center-dealer').html(`親: <span class="text-amber-300 font-bold">${players[gameState.dealerIndex]}</span>`);
                $('#table-center-contract').text('未定');
                $('#table-center-info').text('ビッド進行中');

                $('.btn-bid-level').removeClass('bg-gold text-slate-950 font-black').addClass('bg-emerald-950 text-white');

                updateBiddingBoxUI();
                updateSeatsHighlight();
                updateScoreboardUI();
            }

            function updateVulnerabilityUI() {
                // Update Vulnerability status badges
                const nsVul = gameState.vulnerability.NS;
                const ewVul = gameState.vulnerability.EW;

                $('#vul-badge-N, #vul-badge-S')
                    .text(nsVul ? 'Vul' : 'Non-Vul')
                    .toggleClass('bg-red-900 text-red-200 border border-red-500', nsVul)
                    .toggleClass('bg-slate-800 text-gray-300', !nsVul);

                $('#vul-badge-E, #vul-badge-W')
                    .text(ewVul ? 'Vul' : 'Non-Vul')
                    .toggleClass('bg-red-900 text-red-200 border border-red-500', ewVul)
                    .toggleClass('bg-slate-800 text-gray-300', !ewVul);
            }

            // Quick Matrix Modal Toggles
            $('#btn-toggle-quickmatrix').click(function() {
                renderQuickMatrix();
                $('#modal-quickmatrix').removeClass('hidden');
            });
            $('#btn-close-quickmatrix, #btn-hide-quickmatrix').click(function() {
                $('#modal-quickmatrix').addClass('hidden');
            });

            $('#matrix-vul, #matrix-dbl').on('change', function() {
                renderQuickMatrix();
            });

            function renderQuickMatrix() {
                const isVul = $('#matrix-vul').val() === 'vul';
                const dbl = $('#matrix-dbl').val();
                const tbody = $('#quickmatrix-body');
                tbody.empty();

                const suits = [
                    { name: '♣/♦ (マイナー)', val: '♣', isGameAt: 5 },
                    { name: '♥/♠ (メジャー)', val: '♥', isGameAt: 4 },
                    { name: 'NT (ノー・トランプ)', val: 'NT', isGameAt: 3 }
                ];

                for (let level = 1; level <= 7; level++) {
                    suits.forEach(s => {
                        const c = { level: level, suit: s.val, declarer: 'N', doubleState: dbl, targetTricks: level + 6 };
                        const v = { NS: isVul, EW: isVul };

                        const justPts = calculateBridgeScore(c, level + 6, v).scoreNS;
                        const plus1Pts = level + 7 <= 13 ? calculateBridgeScore(c, level + 7, v).scoreNS : '-';
                        const plus2Pts = level + 8 <= 13 ? calculateBridgeScore(c, level + 8, v).scoreNS : '-';
                        const down1Pts = calculateBridgeScore(c, level + 5, v).scoreEW;

                        const isGame = level >= s.isGameAt;
                        const rowBg = isGame ? 'bg-amber-950/30' : '';

                        tbody.append(`
                            <tr class="${rowBg} hover:bg-white/5">
                                <td class="p-1.5 border-r border-white/10 font-bold text-amber-300 whitespace-nowrap">${level}${s.name.split(' ')[0]}</td>
                                <td class="p-1.5 border-r border-white/10 font-bold ${isGame ? 'text-amber-300' : 'text-emerald-300'} whitespace-nowrap">${justPts}</td>
                                <td class="p-1.5 border-r border-white/10 text-emerald-400 whitespace-nowrap">${plus1Pts}</td>
                                <td class="p-1.5 border-r border-white/10 text-emerald-400 whitespace-nowrap">${plus2Pts}</td>
                                <td class="p-1.5 text-red-400 font-bold whitespace-nowrap">${down1Pts}</td>
                            </tr>
                        `);
                    });
                }
            }

            // Scoreboard Toggles
            $('#btn-toggle-scoreboard').click(function() {
                updateScoreboardUI();
                $('#modal-scoreboard').removeClass('hidden');
            });
            $('#btn-close-scoreboard, #btn-hide-scoreboard').click(function() {
                $('#modal-scoreboard').addClass('hidden');
            });

            // Score Reference Table Modal Toggles & Tab Switching
            $('#btn-toggle-scoretable').click(function() {
                $('#modal-scoretable').removeClass('hidden');
                updateCalcLookup();
            });
            $('#btn-close-scoretable, #btn-hide-scoretable').click(function() {
                $('#modal-scoretable').addClass('hidden');
            });

            $('.score-tab-btn').click(function() {
                $('.score-tab-btn').removeClass('active bg-gold text-slate-950 font-bold').addClass('text-gray-300 hover:text-white');
                $(this).addClass('active bg-gold text-slate-950 font-bold').removeClass('text-gray-300 hover:text-white');

                const targetTab = $(this).data('tab');
                $('.score-tab-content').addClass('hidden');
                $(`#${targetTab}`).removeClass('hidden');
            });

            // Interactive Calculator inside Score Reference Tab
            $('#calc-level, #calc-suit, #calc-dbl, #calc-vul, #calc-tricks').on('input change', function() {
                updateCalcLookup();
            });

            function updateCalcLookup() {
                const level = parseInt($('#calc-level').val());
                const suit = $('#calc-suit').val();
                const dbl = $('#calc-dbl').val();
                const isVul = $('#calc-vul').val() === 'true';
                const tricks = parseInt($('#calc-tricks').val());

                $('#calc-tricks-disp').text(tricks);

                const mockContract = {
                    level: level,
                    suit: suit,
                    declarer: 'N',
                    doubleState: dbl,
                    targetTricks: level + 6
                };

                const mockVul = { NS: isVul, EW: isVul };
                const res = calculateBridgeScore(mockContract, tricks, mockVul);
                
                const pts = res.scoreNS > 0 ? res.scoreNS : res.scoreEW;

                $('#calc-result-pts').text(`${pts} pt`);
                
                if (tricks >= mockContract.targetTricks) {
                    $('#calc-result-detail').text(`ディクレアラー獲得点 | ${res.detail}`).removeClass('text-red-400').addClass('text-emerald-300');
                } else {
                    $('#calc-result-detail').text(`ディフェンダー(相手)獲得点 | ${res.detail}`).removeClass('text-emerald-300').addClass('text-red-400');
                }
            }

            // Level Selection (1-7)
            $('.btn-bid-level').click(function() {
                selectedBidLevel = parseInt($(this).data('level'));
                $('.btn-bid-level').removeClass('bg-gold text-slate-950 font-black').addClass('bg-emerald-950 text-white');
                $(this).removeClass('bg-emerald-950 text-white').addClass('bg-gold text-slate-950 font-black');
                updateBiddingBoxUI();
            });

            // Suit Selection & Bidding Submission
            $('.btn-bid-suit').click(function() {
                if (!selectedBidLevel) {
                    alert("最初にビッドのレベル(1〜7)を選択してください。");
                    return;
                }

                const suit = $(this).data('suit');
                const suitIdx = suitsOrder.indexOf(suit);
                const bidder = players[gameState.currentBidderIndex];

                // Validate legal bid
                if (gameState.highestBid) {
                    const h = gameState.highestBid;
                    if (selectedBidLevel < h.level) {
                        alert("現在のビッドより低いレベルはビッドできません。");
                        return;
                    }
                    if (selectedBidLevel === h.level && suitIdx <= h.suitIdx) {
                        alert("同レベルの場合、より高いスート(♣ < ♦ < ♥ < ♠ < NT)を選択してください。");
                        return;
                    }
                }

                // Execute Bid
                const newBid = {
                    type: 'BID',
                    level: selectedBidLevel,
                    suit: suit,
                    suitIdx: suitIdx,
                    player: bidder
                };

                gameState.highestBid = newBid;
                gameState.doubleState = 'NONE';
                gameState.doublePlayer = null;
                gameState.consecutivePasses = 0;
                gameState.bidHistory.push(newBid);

                $(`#seat-${bidder} .last-action`).text(`${selectedBidLevel}${suit}`).removeClass('text-emerald-400 text-red-400 text-blue-400').addClass('text-yellow-300 font-bold');

                selectedBidLevel = null;
                $('.btn-bid-level').removeClass('bg-gold text-slate-950 font-black').addClass('bg-emerald-950 text-white');

                advanceBidTurn();
            });

            // PASS Button
            $('#btn-bid-pass').click(function() {
                const bidder = players[gameState.currentBidderIndex];
                gameState.bidHistory.push({ type: 'PASS', player: bidder });
                gameState.consecutivePasses++;

                $(`#seat-${bidder} .last-action`).text('PASS').removeClass('text-yellow-300 text-red-400 text-blue-400').addClass('text-emerald-400');

                // Check for Contract End
                if (gameState.highestBid === null && gameState.consecutivePasses === 4) {
                    alert("全員パスのため、ディールは流局となりました。親が移動します。");
                    advanceDealer();
                    startNewDeal();
                    return;
                } else if (gameState.highestBid !== null && gameState.consecutivePasses === 3) {
                    finalizeContract();
                    return;
                }

                advanceBidTurn();
            });

            // DOUBLE Button
            $('#btn-bid-double').click(function() {
                const bidder = players[gameState.currentBidderIndex];
                gameState.doubleState = 'DOUBLE';
                gameState.doublePlayer = bidder;
                gameState.consecutivePasses = 0;
                gameState.bidHistory.push({ type: 'DOUBLE', player: bidder });

                $(`#seat-${bidder} .last-action`).text('DOUBLE').removeClass('text-yellow-300 text-emerald-400 text-blue-400').addClass('text-red-400 font-bold');

                advanceBidTurn();
            });

            // REDOUBLE Button
            $('#btn-bid-redouble').click(function() {
                const bidder = players[gameState.currentBidderIndex];
                gameState.doubleState = 'REDOUBLE';
                gameState.doublePlayer = bidder;
                gameState.consecutivePasses = 0;
                gameState.bidHistory.push({ type: 'REDOUBLE', player: bidder });

                $(`#seat-${bidder} .last-action`).text('REDOUBLE').removeClass('text-yellow-300 text-emerald-400 text-red-400').addClass('text-blue-400 font-bold');

                advanceBidTurn();
            });

            function advanceBidTurn() {
                gameState.currentBidderIndex = (gameState.currentBidderIndex + 1) % 4;
                updateBiddingBoxUI();
                updateSeatsHighlight();
            }

            function updateBiddingBoxUI() {
                const currentBidder = players[gameState.currentBidderIndex];
                $('#current-bidder-name').text(currentBidder);

                if (gameState.highestBid) {
                    let dStr = "";
                    if (gameState.doubleState === 'DOUBLE') dStr = " (X)";
                    if (gameState.doubleState === 'REDOUBLE') dStr = " (XX)";
                    $('#highest-bid-desc').text(`最高: ${gameState.highestBid.level}${gameState.highestBid.suit} by ${gameState.highestBid.player}${dStr}`);
                } else {
                    $('#highest-bid-desc').text(`パス ${gameState.consecutivePasses}回`);
                }

                // Enable/Disable Double & Redouble
                const bidderTeam = (currentBidder === 'N' || currentBidder === 'S') ? 'NS' : 'EW';
                
                if (gameState.highestBid) {
                    const bidTeam = (gameState.highestBid.player === 'N' || gameState.highestBid.player === 'S') ? 'NS' : 'EW';
                    
                    if (bidderTeam !== bidTeam && gameState.doubleState === 'NONE') {
                        $('#btn-bid-double').prop('disabled', false);
                    } else {
                        $('#btn-bid-double').prop('disabled', true);
                    }

                    if (bidderTeam === bidTeam && gameState.doubleState === 'DOUBLE') {
                        $('#btn-bid-redouble').prop('disabled', false);
                    } else {
                        $('#btn-bid-redouble').prop('disabled', true);
                    }
                } else {
                    $('#btn-bid-double').prop('disabled', true);
                    $('#btn-bid-redouble').prop('disabled', true);
                }
            }

            // Finalize Contract & Play Phase Transitions
            function finalizeContract() {
                const hb = gameState.highestBid;
                const teamPartners = (hb.player === 'N' || hb.player === 'S') ? ['N', 'S'] : ['E', 'W'];

                let declarer = hb.player;
                for (let bid of gameState.bidHistory) {
                    if (bid.type === 'BID' && bid.suit === hb.suit && teamPartners.includes(bid.player)) {
                        declarer = bid.player;
                        break;
                    }
                }

                const declarerIdx = players.indexOf(declarer);
                const dummy = players[(declarerIdx + 2) % 4];
                const opener = players[(declarerIdx + 1) % 4];

                gameState.contract = {
                    level: hb.level,
                    suit: hb.suit,
                    declarer: declarer,
                    dummy: dummy,
                    opener: opener,
                    doubleState: gameState.doubleState,
                    targetTricks: hb.level + 6
                };

                $(`#seat-${declarer} .role-indicator`).text('(Dec)');
                $(`#seat-${dummy} .role-indicator`).text('(Dmy)');

                gameState.currentPhase = 'play';
                gameState.activePlayIndex = players.indexOf(opener);

                $('#table-phase-badge').text('プレイ進行中');
                $('#panel-bidding').addClass('hidden');
                $('#panel-play').removeClass('hidden');
                $('#trick-counter-container').removeClass('hidden');

                let dSymbol = "";
                if (gameState.doubleState === 'DOUBLE') dSymbol = " (X)";
                if (gameState.doubleState === 'REDOUBLE') dSymbol = " (XX)";

                $('#table-center-contract').html(`<span class="text-gold font-black">${hb.level}${hb.suit}${dSymbol}</span> by ${declarer}`);

                updatePlayPhaseUI();
            }

            function updateSeatsHighlight() {
                $('.player-seat').removeClass('active-turn');
                let activeP = players[gameState.currentPhase === 'bidding' ? gameState.currentBidderIndex : gameState.activePlayIndex];
                $(`#seat-${activeP}`).addClass('active-turn');
            }

            function updatePlayPhaseUI() {
                const activePlayer = players[gameState.activePlayIndex];
                $('#active-play-player').text(activePlayer);
                $('#trick-current-num').text(gameState.currentTrick);
                $('#tricks-won-ns').text(gameState.tricksWon.NS);
                $('#tricks-won-ew').text(gameState.tricksWon.EW);

                updateSeatsHighlight();
            }

            // Card Play Progression
            let tapCount = 0;
            $('#btn-card-played').click(function() {
                if (gameState.currentPhase !== 'play') return;

                tapCount++;
                gameState.activePlayIndex = (gameState.activePlayIndex + 1) % 4;

                if (tapCount % 4 === 0) {
                    gameState.currentTrick = Math.min(13, gameState.currentTrick + 1);
                    if (tapCount >= 52 || gameState.currentTrick > 13) {
                        openScoreModal();
                        tapCount = 0;
                        return;
                    }
                }
                updatePlayPhaseUI();
            });

            $('#btn-finish-deal').click(function() {
                openScoreModal();
            });

            // Score Modal Operations
            function openScoreModal() {
                const c = gameState.contract;
                let dSymbol = "";
                if (c.doubleState === 'DOUBLE') dSymbol = " Double";
                if (c.doubleState === 'REDOUBLE') dSymbol = " Redouble";

                $('#modal-contract-desc').text(`${c.level}${c.suit}${dSymbol} (宣言: ${c.declarer})`);
                $('#modal-target-tricks').text(`${c.targetTricks} トリック (6 + ${c.level})`);

                $('#input-tricks-range').val(c.targetTricks);
                updateModalTrickCalculation();

                $('#modal-score-entry').removeClass('hidden');
            }

            $('#input-tricks-range').on('input change', function() {
                updateModalTrickCalculation();
            });

            function updateModalTrickCalculation() {
                const taken = parseInt($('#input-tricks-range').val());
                $('#input-tricks-val').text(taken);

                const target = gameState.contract.targetTricks;
                const diff = taken - target;

                if (diff >= 0) {
                    $('#modal-result-status').text(`メイク (+${diff})`).removeClass('text-red-400').addClass('text-emerald-400');
                } else {
                    $('#modal-result-status').text(`ダウン (${diff})`).removeClass('text-emerald-400').addClass('text-red-400');
                }
            }

            // Apply Calculated Scores
            $('#btn-calc-score').click(function() {
                const tricksTaken = parseInt($('#input-tricks-range').val());
                const result = calculateBridgeScore(gameState.contract, tricksTaken, gameState.vulnerability);

                gameState.scores.NS += result.scoreNS;
                gameState.scores.EW += result.scoreEW;

                if (result.isGame) {
                    if (result.declarerTeam === 'NS') gameState.gamesWon.NS++;
                    else gameState.gamesWon.EW++;
                    
                    // Standard Rubber Rule: reset vulnerability after game won
                    if (gameState.rule === 'rubber') {
                        gameState.vulnerability[result.declarerTeam] = true;
                    }
                }

                gameState.history.push({
                    dealNum: gameState.history.length + 1,
                    contractStr: `${gameState.contract.level}${gameState.contract.suit} by ${gameState.contract.declarer}`,
                    scoreNS: result.scoreNS,
                    scoreEW: result.scoreEW,
                    detail: result.detail
                });

                $('#modal-score-entry').addClass('hidden');

                if (checkVictoryCondition()) {
                    return;
                }

                advanceDealer();
                startNewDeal();
            });

            function advanceDealer() {
                gameState.dealerIndex = (gameState.dealerIndex + 1) % 4;
            }

            // BRIDGE SCORING ENGINE
            function calculateBridgeScore(contract, tricksTaken, vulnerability) {
                const level = contract.level;
                const suit = contract.suit;
                const declarerTeam = (contract.declarer === 'N' || contract.declarer === 'S') ? 'NS' : 'EW';
                const isVul = vulnerability[declarerTeam];
                const doubleState = contract.doubleState;

                const targetTricks = 6 + level;
                const diff = tricksTaken - targetTricks;

                let points = 0;
                let isGame = false;

                if (diff >= 0) {
                    let trickBase = 0;

                    if (suit === '♣' || suit === '♦') {
                        trickBase = level * 20;
                    } else if (suit === '♥' || suit === '♠') {
                        trickBase = level * 30;
                    } else if (suit === 'NT') {
                        trickBase = 40 + (level - 1) * 30;
                    }

                    if (doubleState === 'DOUBLE') trickBase *= 2;
                    if (doubleState === 'REDOUBLE') trickBase *= 4;

                    points += trickBase;

                    const overtricks = diff;
                    if (overtricks > 0) {
                        if (doubleState === 'NONE') {
                            const val = (suit === '♣' || suit === '♦') ? 20 : 30;
                            points += overtricks * val;
                        } else if (doubleState === 'DOUBLE') {
                            points += overtricks * (isVul ? 200 : 100);
                        } else if (doubleState === 'REDOUBLE') {
                            points += overtricks * (isVul ? 400 : 200);
                        }
                    }

                    if (doubleState === 'DOUBLE') points += 50;
                    if (doubleState === 'REDOUBLE') points += 100;

                    if (trickBase >= 100) {
                        isGame = true;
                        points += isVul ? 500 : 300;
                    } else {
                        points += 50;
                    }

                    if (level === 6) {
                        points += isVul ? 750 : 500;
                    } else if (level === 7) {
                        points += isVul ? 1500 : 1000;
                    }

                    return {
                        scoreNS: declarerTeam === 'NS' ? points : 0,
                        scoreEW: declarerTeam === 'EW' ? points : 0,
                        declarerTeam: declarerTeam,
                        isGame: isGame,
                        detail: `メイク +${overtricks} (${points}pt)`
                    };

                } else {
                    const undertricks = Math.abs(diff);
                    let penalty = 0;

                    if (doubleState === 'NONE') {
                        penalty = undertricks * (isVul ? 100 : 50);
                    } else if (doubleState === 'DOUBLE') {
                        if (!isVul) {
                            for (let i = 1; i <= undertricks; i++) {
                                if (i === 1) penalty += 100;
                                else if (i === 2 || i === 3) penalty += 200;
                                else penalty += 300;
                            }
                        } else {
                            for (let i = 1; i <= undertricks; i++) {
                                if (i === 1) penalty += 200;
                                else penalty += 300;
                            }
                        }
                    } else if (doubleState === 'REDOUBLE') {
                        let undoublePen = 0;
                        if (!isVul) {
                            for (let i = 1; i <= undertricks; i++) {
                                if (i === 1) undoublePen += 100;
                                else if (i === 2 || i === 3) undoublePen += 200;
                                else undoublePen += 300;
                            }
                        } else {
                            for (let i = 1; i <= undertricks; i++) {
                                if (i === 1) undoublePen += 200;
                                else undoublePen += 300;
                            }
                        }
                        penalty = undoublePen * 2;
                    }

                    const defenderTeam = declarerTeam === 'NS' ? 'EW' : 'NS';
                    return {
                        scoreNS: defenderTeam === 'NS' ? penalty : 0,
                        scoreEW: defenderTeam === 'EW' ? penalty : 0,
                        declarerTeam: declarerTeam,
                        isGame: false,
                        detail: `ダウン -${undertricks} (相手へ +${penalty}pt)`
                    };
                }
            }

            // Scoreboard UI updates
            function updateScoreboardUI() {
                $('#score-total-ns').text(gameState.scores.NS);
                $('#score-total-ew').text(gameState.scores.EW);
                $('#games-ns').text(`${gameState.gamesWon.NS} Game(s)`);
                $('#games-ew').text(`${gameState.gamesWon.EW} Game(s)`);

                const tbody = $('#scoreboard-history-body');
                tbody.empty();

                if (gameState.history.length === 0) {
                    tbody.html('<tr><td colspan="4" class="p-3 text-gray-500 italic">対戦記録はまだありません</td></tr>');
                    return;
                }

                gameState.history.forEach(item => {
                    tbody.append(`
                        <tr class="hover:bg-white/5">
                            <td class="p-2 border-b border-white/5 font-mono whitespace-nowrap">${item.dealNum}</td>
                            <td class="p-2 border-b border-white/5 font-bold text-amber-300 whitespace-nowrap">${item.contractStr}</td>
                            <td class="p-2 border-b border-white/5 text-emerald-400 font-mono whitespace-nowrap">${item.scoreNS > 0 ? '+' + item.scoreNS : '-'}</td>
                            <td class="p-2 border-b border-white/5 text-emerald-400 font-mono whitespace-nowrap">${item.scoreEW > 0 ? '+' + item.scoreEW : '-'}</td>
                        </tr>
                    `);
                });
            }

            function checkVictoryCondition() {
                let winner = null;

                if (gameState.rule === 'rubber') {
                    if (gameState.gamesWon.NS >= 2) winner = 'N - S チーム';
                    if (gameState.gamesWon.EW >= 2) winner = 'E - W チーム';
                } else if (gameState.rule === 'duplicate') {
                    if (gameState.history.length >= 4) {
                        if (gameState.scores.NS > gameState.scores.EW) winner = 'N - S チーム';
                        else if (gameState.scores.EW > gameState.scores.NS) winner = 'E - W チーム';
                        else winner = '引き分け (Draw)';
                    }
                } else if (gameState.rule === 'points') {
                    if (gameState.scores.NS >= gameState.targetScore) winner = 'N - S チーム';
                    if (gameState.scores.EW >= gameState.targetScore) winner = 'E - W チーム';
                }

                if (winner) {
                    $('#victory-team-name').text(winner);
                    $('#vic-score-ns').text(gameState.scores.NS);
                    $('#vic-score-ew').text(gameState.scores.EW);
                    $('#vic-total-deals').text(gameState.history.length);

                    $('#modal-victory').removeClass('hidden');
                    return true;
                }

                return false;
            }

            $('#btn-restart-app').click(function() {
                location.reload();
            });

        });
