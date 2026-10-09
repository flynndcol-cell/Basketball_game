// ================= 全局常量設定 =================
const ATTRIBUTES = ["近距離投籃", "扣籃", "中投", "三分", "罰球", "傳球", "控球", "搶截", "蓋帽", "籃板", "體能"];
const TEAMS = ["洛杉磯湖人", "金州勇士", "波士頓凱爾特人", "芝加哥公牛", "邁阿密熱火", "達拉斯獨行俠", "布魯克林籃網", "丹佛掘金"];

// 🎁 兌換碼資料庫
const REDEEM_CODES = {
    "GOD": { type: "points", value: 350, desc: "神仙禮包：獲得 350 點自由分配點數！" },
    "NBA2026": { type: "points", value: 20, desc: "新手福利：獲得 20 點自由分配點數！" },
    "CHAMPION": { type: "points", value: 50, desc: "冠軍禮包：獲得 50 點自由分配點數！" }
};

// 擴充版 20 個戰術情境庫（帶有 quarter 節次標註）
const SITUATIONS_POOL = [
    {
        quarter: 1,
        desc: "【第一節 10:15】開局首攻！你站在弧頂持球，隊友出來為你做了一個高位擋拆。",
        options: [
            { text: "1. 借助擋拆加速突破上籃", check_attr: "控球", stat: "pts", val: 2 },
            { text: "2. 擋拆後吸引包夾分球給外切隊友", check_attr: "傳球", stat: "ast", val: 1 },
            { text: "3. 利用一步空間直接拔起中投", check_attr: "中投", stat: "pts", val: 2 }
        ]
    },
    {
        quarter: 1,
        desc: "【第一節 07:30】你在右側 45 度角收到隊友傳球，防守者距離你半步距離放你一步。",
        options: [
            { text: "1. 毫不猶豫直接起跳三分出手", check_attr: "三分", stat: "pts", val: 3 },
            { text: "2. 假動作騙飛防守者後切入禁區", check_attr: "控球", stat: "pts", val: 2 },
            { text: "3. 橫移觀察重新傳給弧頂隊友", check_attr: "傳球", stat: "ast", val: 1 }
        ]
    },
    {
        quarter: 1,
        desc: "【第一節 04:20】對方傳球失誤！你完成抄截，一人持球發動前場快攻！",
        options: [
            { text: "1. 全速推進直接飛身暴扣", check_attr: "扣籃", stat: "pts", val: 2 },
            { text: "2. 快攻急停拉桿中投", check_attr: "中投", stat: "pts", val: 2 },
            { text: "3. 吸引對手回防後背傳跟進隊友", check_attr: "傳球", stat: "ast", val: 1 }
        ]
    },
    {
        quarter: 2,
        desc: "【第二節 08:40】對方發底線球，控球後衛運球過半場時出現運球過高的漏洞！",
        options: [
            { text: "1. 果斷上前預判抄截", check_attr: "搶截", stat: "stl", val: 1 },
            { text: "2. 保持壓迫限制對方傳球路線", check_attr: "控球", stat: "none", val: 0 },
            { text: "3. 站穩防守位置卡住切入路線", check_attr: "體能", stat: "none", val: 0 }
        ]
    },
    {
        quarter: 2,
        desc: "【第二節 05:15】隊友遠投不中，籃球高高彈起落向禁區！",
        options: [
            { text: "1. 人群中起跳力壓對方長人搶進攻籃板", check_attr: "籃板", stat: "reb", val: 1 },
            { text: "2. 卡住防守位置讓隊友輕鬆拿球", check_attr: "體能", stat: "none", val: 0 },
            { text: "3. 補籃搶二波得分", check_attr: "近距離投籃", stat: "pts", val: 2 }
        ]
    },
    {
        quarter: 3,
        desc: "【第三節 07:50】你在禁區深位收到球，防守者從背後死死頂住你。",
        options: [
            { text: "1. 轉身背框勾手投籃", check_attr: "近距離投籃", stat: "pts", val: 2 },
            { text: "2. 強行轉身靠體能碰撞硬擠進去扣籃", check_attr: "扣籃", stat: "pts", val: 2 },
            { text: "3. 吸引協防後分球給底角射手", check_attr: "傳球", stat: "ast", val: 1 }
        ]
    },
    {
        quarter: 4,
        desc: "【第四節 10:45】決戰時刻！比分膠著，你在左側底角空檔收到球！",
        options: [
            { text: "1. 底角三分手起刀落", check_attr: "三分", stat: "pts", val: 3 },
            { text: "2. 沿底線切入飛身扣籃", check_attr: "扣籃", stat: "pts", val: 2 },
            { text: "3. 點飛防守者後切入拉桿中投", check_attr: "中投", stat: "pts", val: 2 }
        ]
    },
    {
        quarter: 4,
        desc: "【第四節 00:03】絕殺時刻！落後 1 分，沒有暫停！你在 45 度角接界外球！",
        options: [
            { text: "1. 迎著兩人封蓋頂投三分絕殺！", check_attr: "三分", stat: "pts", val: 3 },
            { text: "2. 強行撕裂防線衝入禁區壓哨上籃！", check_attr: "扣籃", stat: "pts", val: 2 },
            { text: "3. 吸引三人包夾後分球底角大空檔隊友！", check_attr: "傳球", stat: "ast", val: 1 }
        ]
    }
];

// ================= 存檔管理 (localStorage) =================
function loadSaves() {
    return JSON.parse(localStorage.getItem('nba_career_saves_v4') || '{}');
}

function savePlayer(player) {
    const saves = loadSaves();
    saves[player.slot] = player;
    localStorage.setItem('nba_career_saves_v4', JSON.stringify(saves));
}

function deleteSave(slot) {
    const saves = loadSaves();
    delete saves[slot];
    localStorage.setItem('nba_career_saves_v4', JSON.stringify(saves));
}

// ================= 輔助功能 =================
let currentPlayer = null;

function getOVR(player) {
    const sum = Object.values(player.attrs).reduce((a, b) => a + b, 0);
    return Math.floor(sum / ATTRIBUTES.length);
}

function generateSchedule(playerTeam) {
    const opps = TEAMS.filter(t => t !== playerTeam);
    const schedule = [];
    for (let i = 1; i <= 30; i++) {
        const opp = opps[Math.floor(Math.random() * opps.length)];
        schedule.push({ game_num: i, opponent: opp, home_away: Math.random() > 0.5 ? "主場" : "客場" });
    }
    return schedule;
}

function calculateCaps(h) {
    const caps = {};
    ATTRIBUTES.forEach(a => caps[a] = 99);
    if (h > 205) { caps["三分"] = 82; caps["控球"] = 78; caps["搶截"] = 80; }
    else if (h < 185) { caps["扣籃"] = 80; caps["蓋帽"] = 70; caps["籃板"] = 75; }
    return caps;
}

// ================= 介面渲染與路由 =================
const mainContent = document.getElementById('main-content');
const modalContainer = document.getElementById('modal-container');
const modalContent = document.getElementById('modal-content');

function showMainMenu() {
    mainContent.innerHTML = `
        <div class="space-y-3 text-center my-6">
            <button onclick="showSlotSelection('new')" class="w-full py-3.5 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold text-base shadow-lg transition">🎮 開始新生涯</button>
            <button onclick="showSlotSelection('load')" class="w-full py-3.5 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold text-base shadow-lg transition">📂 載入/管理生涯存檔</button>
            <button onclick="showHelpModal()" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-base shadow-lg transition">📖 玩法介紹</button>
        </div>
    `;
}

function showHelpModal() {
    let html = `
        <h3 class="text-lg font-bold text-orange-400 mb-3 text-center">📖 遊戲玩法說明</h3>
        <div class="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
            <div class="bg-slate-700/50 p-2.5 rounded-lg border border-slate-600">
                <b class="text-amber-300 text-sm block mb-1">1. 數據與能力</b>
                • 每次比賽會紀錄你的【得分 PTS、籃板 REB、助攻 AST、抄截 STL】。<br>
                • 初始擁有 60 點自由分配點數。<br>
                • 每打滿 16 場比賽獲 1 點自由點數 / 2 次訓練獲 1 點自由點數。
            </div>
            <div class="bg-slate-700/50 p-2.5 rounded-lg border border-slate-600">
                <b class="text-amber-300 text-sm block mb-1">2. 比賽與成功率</b>
                • 情境成功率公式：<code class="text-green-400 font-bold">屬性數值 / 1.944532 %</code>。<br>
                • 也可以使用「⚡ 快速模擬」快速模擬個人數據與結果。
            </div>
            <div class="bg-slate-700/50 p-2.5 rounded-lg border border-slate-600">
                <b class="text-amber-300 text-sm block mb-1">3. 聯賽與 BO7 季後賽</b>
                • 例行賽 30 場打完，前 4 名晉級季後賽角逐總冠軍！
            </div>
        </div>
        <button onclick="closeModal()" class="w-full mt-4 p-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-xs font-bold">關閉說明</button>
    `;
    openModal(html);
}

function showRedeemModal() {
    let html = `
        <h3 class="text-lg font-bold text-amber-400 mb-2 text-center">🎁 兌換碼功能</h3>
        <p class="text-xs text-slate-300 mb-3 text-center">請輸入兌換碼以領取專屬獎勵</p>
        <div class="space-y-3 text-xs">
            <input id="redeem-input" type="text" placeholder="請輸入兌換碼" class="w-full p-2.5 bg-slate-700 rounded-lg border border-slate-600 text-center font-mono uppercase tracking-widest text-sm">
            <button onclick="submitRedeemCode()" class="w-full py-2.5 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-xs">確認兌換</button>
            <button onclick="closeModal()" class="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-400">取消</button>
        </div>
    `;
    openModal(html);
}

function submitRedeemCode() {
    const code = document.getElementById('redeem-input').value.trim().toUpperCase();
    const p = currentPlayer;

    if (!code) return alert("請先輸入兌換碼！");
    if (!p.used_codes) p.used_codes = [];
    if (p.used_codes.includes(code)) return alert("⚠️ 你已經使用過這個兌換碼了！");

    if (REDEEM_CODES[code]) {
        const item = REDEEM_CODES[code];
        if (item.type === "points") p.free_points += item.value;
        p.used_codes.push(code);
        savePlayer(p);
        alert(`🎉 兌換成功！\n${item.desc}`);
        closeModal();
        showDashboard();
    } else {
        alert("❌ 無效的兌換碼，請檢查後重新輸入。");
    }
}

function showSlotSelection(mode) {
    const saves = loadSaves();
    let html = `<h2 class="text-xl font-bold mb-4 text-orange-400 text-center">${mode === 'new' ? '選擇存檔位置 (10個檔位)' : '選擇載入/刪除存檔'}</h2><div class="space-y-2">`;

    for (let i = 1; i <= 10; i++) {
        const save = saves[i];
        if (save) {
            html += `
                <div class="flex gap-2">
                    <button onclick="handleSlotClick('${mode}', ${i})" class="flex-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left text-sm flex justify-between items-center">
                        <span>檔位 ${i}: <b>${save.name}</b> (${save.team})</span>
                        <span class="text-xs bg-slate-800 px-2 py-1 rounded">OVR: ${getOVR(save)}</span>
                    </button>
                    <button onclick="confirmDelete(${i})" class="px-3 bg-red-600 hover:bg-red-500 rounded-lg text-xs font-bold">刪除</button>
                </div>
            `;
        } else {
            html += `
                <button onclick="handleSlotClick('${mode}', ${i})" class="w-full p-3 bg-slate-800 border border-dashed border-slate-600 hover:bg-slate-700 rounded-lg text-slate-400 text-sm text-left">
                    檔位 ${i}: 【空存檔位】
                </button>
            `;
        }
    }
    html += `</div><button onclick="showMainMenu()" class="w-full mt-4 p-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm">返回主選單</button>`;
    mainContent.innerHTML = html;
}

function handleSlotClick(mode, slot) {
    const saves = loadSaves();
    if (mode === 'new') {
        if (saves[slot] && !confirm(`檔位 ${slot} 已有資料，確定要覆蓋嗎？`)) return;
        showCreateCharacter(slot);
    } else {
        if (saves[slot]) {
            currentPlayer = saves[slot];
            showDashboard();
        }
    }
}

function confirmDelete(slot) {
    if (confirm(`確定刪除檔位 ${slot} 的存檔嗎？此動作無法復原！`)) {
        deleteSave(slot);
        showSlotSelection('load');
    }
}

function showCreateCharacter(slot) {
    mainContent.innerHTML = `
        <h2 class="text-xl font-bold mb-4 text-orange-400 text-center">🏀 球員基本資料設定</h2>
        <div class="space-y-3 text-sm">
            <div>
                <label class="block text-slate-400 mb-1">球員姓名</label>
                <input id="create-name" type="text" value="新星球員" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-slate-400 mb-1">場上位置</label>
                    <select id="create-pos" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
                        <option>PG</option><option>SG</option><option>SF</option><option>PF</option><option>C</option>
                    </select>
                </div>
                <div>
                    <label class="block text-slate-400 mb-1">選秀加盟球隊</label>
                    <select id="create-team" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
                        ${TEAMS.map(t => `<option>${t}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="block text-slate-400 mb-1">身高 (cm)</label>
                    <input id="create-h" type="number" value="191" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
                </div>
                <div>
                    <label class="block text-slate-400 mb-1">體重 (kg)</label>
                    <input id="create-w" type="number" value="88" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
                </div>
            </div>
            <button onclick="initNewPlayer(${slot})" class="w-full py-3 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-base mt-4">下一步：自由配點 (60點)</button>
        </div>
    `;
}

function initNewPlayer(slot) {
    const name = document.getElementById('create-name').value.trim() || "新秀球員";
    const pos = document.getElementById('create-pos').value;
    const team = document.getElementById('create-team').value;
    const h = parseInt(document.getElementById('create-h').value) || 190;
    const w = parseInt(document.getElementById('create-w').value) || 85;

    const attrs = {};
    ATTRIBUTES.forEach(a => attrs[a] = 50);

    const standings = {};
    TEAMS.forEach(t => standings[t] = { W: 0, L: 0 });

    currentPlayer = {
        slot, name, position: pos, team, height: h, weight: w,
        max_attrs: calculateCaps(h),
        age: 19, season: 1, attrs, free_points: 60, trainings_available: 0, training_counter: 0,
        total_games_played: 0, season_games_played: 0, wins: 0, losses: 0,
        // 生涯個人數據統計
        stats: { total_pts: 0, total_reb: 0, total_ast: 0, total_stl: 0 },
        league_standings: standings, schedule: generateSchedule(team),
        in_playoffs: false, playoff_round: "", playoff_opponent: "", playoff_my_wins: 0, playoff_opp_wins: 0, playoff_championships: 0,
        current_salary: 500, contract_years_left: 1, career_earnings: 500, used_codes: []
    };

    savePlayer(currentPlayer);
    showAllocationView();
}

function showAllocationView() {
    let pts = currentPlayer.free_points;
    let tempAttrs = { ...currentPlayer.attrs };

    function renderAllocation() {
        mainContent.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h2 class="text-lg font-bold text-orange-400">⭐ 屬性加點面板</h2>
                <span class="text-sm font-bold text-blue-400">剩餘自由點數: ${pts}</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs mb-4">
                ${ATTRIBUTES.map(a => `
                    <div class="bg-slate-700 p-2 rounded flex justify-between items-center">
                        <span>${a} (上限:${currentPlayer.max_attrs[a]}): <b class="text-amber-300">${tempAttrs[a]}</b></span>
                        <div class="flex gap-1">
                            <button onclick="changePt('${a}', -1)" class="w-6 h-6 bg-slate-600 hover:bg-slate-500 rounded font-bold">-</button>
                            <button onclick="changePt('${a}', 1)" class="w-6 h-6 bg-orange-600 hover:bg-orange-500 rounded font-bold">+</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button onclick="saveAllocation()" class="w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-sm">儲存配點並返回主介面</button>
        `;
    }

    window.changePt = (attr, delta) => {
        if (delta > 0 && pts > 0 && tempAttrs[attr] < currentPlayer.max_attrs[attr]) {
            tempAttrs[attr]++;
            pts--;
        } else if (delta < 0 && tempAttrs[attr] > currentPlayer.attrs[attr]) {
            tempAttrs[attr]--;
            pts++;
        }
        renderAllocation();
    };

    window.saveAllocation = () => {
        currentPlayer.attrs = tempAttrs;
        currentPlayer.free_points = pts;
        savePlayer(currentPlayer);
        showDashboard();
    };

    renderAllocation();
}

function showDashboard() {
    const p = currentPlayer;
    const gCount = p.total_games_played || 1;
    const ppg = (p.stats.total_pts / gCount).toFixed(1);
    const rpg = (p.stats.total_reb / gCount).toFixed(1);
    const apg = (p.stats.total_ast / gCount).toFixed(1);

    const nextGame = p.schedule[p.season_games_played];
    const nextOppStr = p.in_playoffs ? 
        `🔥 季後賽 [${p.playoff_round === 'SEMI' ? '準決賽' : '總決賽'} BO7] vs ${p.playoff_opponent} (${p.playoff_my_wins}-${p.playoff_opp_wins})` : 
        (nextGame ? `第 ${nextGame.game_num} 場 [${nextGame.home_away}] vs ${nextGame.opponent}` : "例行賽已結束，等待休賽期/季後賽");

    mainContent.innerHTML = `
        <div class="bg-slate-700/50 p-3 rounded-xl mb-3 text-xs space-y-1 border border-slate-600">
            <div class="flex justify-between font-bold text-sm text-amber-300">
                <span>${p.name} (${p.position}) - ${p.team}</span>
                <span>OVR: ${getOVR(p)} | 🏆x${p.playoff_championships}</span>
            </div>
            <div class="text-emerald-400 font-bold bg-slate-800/80 p-1.5 rounded flex justify-between">
                <span>🔥 場均數據：</span>
                <span>${ppg} 分 | ${rpg} 板 | ${apg} 助</span>
            </div>
            <div>年齡: ${p.age} 歲 | 第 ${p.season} 賽季 | 合約剩餘: ${p.contract_years_left} 年 ($${p.current_salary}萬/年)</div>
            <div>例行賽進度: ${p.season_games_played}/30 場 (${p.wins}勝 ${p.losses}敗) | 可用訓練: ${p.trainings_available} 次</div>
            <div class="text-orange-400 font-bold">👉 當前目標：${nextOppStr}</div>
        </div>

        <div class="grid grid-cols-4 gap-1.5 text-xs text-center mb-3 bg-slate-900/50 p-2 rounded-xl">
            ${ATTRIBUTES.map(a => `<div class="bg-slate-800 p-1 rounded"><span class="text-slate-400 block text-[10px]">${a}</span><b class="text-amber-200">${p.attrs[a]}</b></div>`).join('')}
        </div>

        <div class="space-y-2">
            ${(p.in_playoffs || p.season_games_played < 30) ? `
                <div class="grid grid-cols-2 gap-2">
                    <button onclick="playMatch()" class="py-2.5 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold text-xs">🏀 親自上陣打球</button>
                    <button onclick="simMatch()" class="py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-xs">⚡ 快速模擬此場</button>
                </div>
            ` : ''}

            <button onclick="showAllocationView()" class="w-full py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold text-xs">⭐ 屬性加點 (剩餘可分配點數: ${p.free_points} 點)</button>
            
            ${p.trainings_available > 0 ? `
                <button onclick="doTraining()" class="w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold text-xs">🏋️ 自主訓練 (剩餘 ${p.trainings_available} 次)</button>
            ` : ''}

            <div class="grid grid-cols-2 gap-2">
                <button onclick="showStandingsModal()" class="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs">📊 查看聯盟戰績表</button>
                <button onclick="showScheduleModal()" class="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs">📅 查看賽季賽程表</button>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <button onclick="showHelpModal()" class="py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-xs">📖 玩法介紹</button>
                <button onclick="showRedeemModal()" class="py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs">🎁 兌換碼</button>
            </div>

            ${p.contract_years_left <= 0 && p.season_games_played >= 30 && !p.in_playoffs ? `
                <button onclick="startNegotiationModal()" class="w-full py-2.5 bg-green-600 hover:bg-green-500 rounded-lg font-bold text-xs">💼 開始自由市場合約談判</button>
            ` : ''}

            <button onclick="showMainMenu()" class="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-400">🚪 返回主選單</button>
        </div>
    `;
}

// ================= 自主訓練 =================
function doTraining() {
    const p = currentPlayer;
    if (p.trainings_available <= 0) return;
    p.trainings_available--;
    p.training_counter++;
    let msg = `完成一次自主訓練！(累積訓練次數: ${p.training_counter})`;
    if (p.training_counter % 2 === 0) {
        p.free_points++;
        msg += "\n🎉 累積完成 2 次訓練，獲得了 1 點自由分配點數！";
    }
    alert(msg);
    savePlayer(p);
    showDashboard();
}

// ================= 比賽與得分數據系統 =================
let currentMatchSits = [];
let currentSitIndex = 0;
let currentMatchSuccesses = 0;
let singleGameStats = { pts: 0, reb: 0, ast: 0, stl: 0 };

function playMatch() {
    const p = currentPlayer;
    const opp = p.in_playoffs ? p.playoff_opponent : p.schedule[p.season_games_played].opponent;
    
    const count = Math.floor(Math.random() * 3) + 3;
    const shuffled = [...SITUATIONS_POOL].sort(() => 0.5 - Math.random()).slice(0, count);
    currentMatchSits = shuffled.sort((a, b) => a.quarter - b.quarter);
    
    currentSitIndex = 0;
    currentMatchSuccesses = 0;
    // 基礎隨機數據 + 決策數據
    singleGameStats = {
        pts: Math.floor(Math.random() * 8) + 10,
        reb: Math.floor(Math.random() * 4) + 1,
        ast: Math.floor(Math.random() * 4) + 1,
        stl: Math.floor(Math.random() * 2)
    };

    renderMatchSituation(opp);
}

function renderMatchSituation(opp) {
    const sit = currentMatchSits[currentSitIndex];
    const p = currentPlayer;

    let html = `
        <h3 class="text-base font-bold text-orange-400 mb-1">🏀 vs ${opp} (情境 ${currentSitIndex + 1}/${currentMatchSits.length})</h3>
        <p class="text-sm text-slate-200 mb-3 bg-slate-700/50 p-2.5 rounded-lg border border-slate-600">${sit.desc}</p>
        <div class="space-y-2">
    `;

    sit.options.forEach((opt, idx) => {
        const val = p.attrs[opt.check_attr] || 50;
        const prob = (val / 1.944532).toFixed(1);
        html += `
            <button onclick="resolveOption(${val}, '${opt.stat}', ${opt.val})" class="w-full p-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-left transition flex justify-between items-center">
                <span>${opt.text}</span>
                <span class="text-[11px] text-amber-300 font-bold bg-slate-800 px-2 py-1 rounded">判定:${opt.check_attr} ${val} | 機率:${prob}%</span>
            </button>
        `;
    });

    html += `</div>`;
    openModal(html);
}

function resolveOption(attrVal, statType, statVal) {
    closeModal();
    const prob = (attrVal / 1.944532) / 100;
    const isSuccess = Math.random() < prob;

    if (isSuccess) {
        currentMatchSuccesses++;
        if (statType !== "none") singleGameStats[statType] += statVal;
    }
    alert(isSuccess ? "🎉 【成功！】戰術執行完美！數據加成成功！" : "💔 【失敗…】未能成功突破防線。");

    currentSitIndex++;
    const p = currentPlayer;
    const opp = p.in_playoffs ? p.playoff_opponent : p.schedule[p.season_games_played].opponent;

    if (currentSitIndex < currentMatchSits.length) {
        renderMatchSituation(opp);
    } else {
        const isMatchWin = currentMatchSuccesses >= (currentMatchSits.length / 2);
        finishMatchGame(isMatchWin, opp, singleGameStats);
    }
}

function simMatch() {
    const p = currentPlayer;
    const opp = p.in_playoffs ? p.playoff_opponent : p.schedule[p.season_games_played].opponent;
    const ovr = getOVR(p);
    const winProb = Math.min(0.85, Math.max(0.15, 0.50 + (ovr - 70) * 0.015));
    const isWin = Math.random() < winProb;

    // 模擬個人表現數據
    const simStats = {
        pts: Math.floor(ovr * 0.35 + Math.random() * 12),
        reb: Math.floor((p.attrs["籃板"] || 50) * 0.10 + Math.random() * 4),
        ast: Math.floor((p.attrs["傳球"] || 50) * 0.12 + Math.random() * 4),
        stl: Math.floor(Math.random() * 3)
    };

    finishMatchGame(isWin, opp, simStats);
}

function finishMatchGame(isWin, opp, matchStats) {
    const p = currentPlayer;
    p.total_games_played++;

    // 累加生涯總數據
    if (!p.stats) p.stats = { total_pts: 0, total_reb: 0, total_ast: 0, total_stl: 0 };
    p.stats.total_pts += matchStats.pts;
    p.stats.total_reb += matchStats.reb;
    p.stats.total_ast += matchStats.ast;
    p.stats.total_stl += matchStats.stl;

    const resTitle = isWin ? "🎉 比賽勝利！" : "💔 比賽遺憾失利";
    alert(`${resTitle}\n\n📊 本場個人數據統計（Box Score）：\n👉 得分 (PTS): ${matchStats.pts}\n👉 籃板 (REB): ${matchStats.reb}\n👉 助攻 (AST): ${matchStats.ast}\n👉 抄截 (STL): ${matchStats.stl}`);

    if (p.total_games_played % 16 === 0) p.free_points++;
    if (p.total_games_played % 3 === 0) p.trainings_available++;

    if (p.in_playoffs) {
        if (isWin) p.playoff_my_wins++; else p.playoff_opp_wins++;

        if (p.playoff_my_wins >= 4) {
            if (p.playoff_round === "SEMI") {
                alert(`🎉 BO7 擊敗 ${p.playoff_opponent}，成功晉級 NBA 總決賽！`);
                p.playoff_round = "FINALS";
                p.playoff_opponent = TEAMS.filter(t => t !== p.team && t !== p.playoff_opponent)[0];
                p.playoff_my_wins = 0; p.playoff_opp_wins = 0;
            } else {
                p.playoff_championships++;
                alert(`👑 歷史性時刻！你帶領 ${p.team} 捧起總冠軍獎盃！本賽季奪得 NBA 總冠軍！`);
                p.in_playoffs = false;
                enterOffseason();
            }
        } else if (p.playoff_opp_wins >= 4) {
            alert(`💔 BO7 比分 ${p.playoff_my_wins}-${p.playoff_opp_wins}，止步季後賽。`);
            p.in_playoffs = false;
            enterOffseason();
        }
    } else {
        p.season_games_played++;
        if (isWin) { p.wins++; p.league_standings[p.team].W++; p.league_standings[opp].L++; }
        else { p.losses++; p.league_standings[p.team].L++; p.league_standings[opp].W++; }

        const others = TEAMS.filter(t => t !== p.team && t !== opp).sort(() => 0.5 - Math.random());
        for (let i = 0; i < others.length - 1; i += 2) {
            if (Math.random() > 0.5) { p.league_standings[others[i]].W++; p.league_standings[others[i+1]].L++; }
            else { p.league_standings[others[i]].L++; p.league_standings[others[i+1]].W++; }
        }

        if (p.season_games_played >= 30) {
            checkPlayoffsEligibility();
        }
    }

    savePlayer(p);
    showDashboard();
}

function checkPlayoffsEligibility() {
    const p = currentPlayer;
    const sorted = Object.keys(p.league_standings).map(t => ({
        team: t, W: p.league_standings[t].W, L: p.league_standings[t].L,
        pct: (p.league_standings[t].W + p.league_standings[t].L) > 0 ? p.league_standings[t].W / (p.league_standings[t].W + p.league_standings[t].L) : 0
    })).sort((a, b) => b.pct - a.pct || b.W - a.W);

    const top4 = sorted.slice(0, 4).map(x => x.team);
    if (top4.includes(p.team)) {
        const rank = top4.indexOf(p.team) + 1;
        const opp = top4[3 - (rank - 1)];
        p.in_playoffs = true;
        p.playoff_round = "SEMI";
        p.playoff_opponent = opp;
        p.playoff_my_wins = 0; p.playoff_opp_wins = 0;
        alert(`🎉 恭喜！以例行賽第 ${rank} 名晉級季後賽！準決賽 (BO7) 對陣【${opp}】！`);
    } else {
        alert(`💔 例行賽戰績未能進入前 4 名，無緣季後賽。直接進入休賽期。`);
        enterOffseason();
    }
}

function enterOffseason() {
    const p = currentPlayer;
    p.season++;
    p.age++;
    p.contract_years_left--;
    p.career_earnings += p.current_salary;

    if (p.age >= 41) {
        alert(`你已滿 41 歲，達到 NBA 強制退休年齡！感謝你傳奇的職業生涯！`);
        return;
    }

    if (p.contract_years_left <= 0) {
        alert(`合約已到期！即將進入自由市場進行討價還價談判！`);
        startNegotiationModal();
    } else {
        alert(`休賽期結束，已為你生成下一個賽季的 30 場賽程！`);
        p.season_games_played = 0; p.wins = 0; p.losses = 0;
        TEAMS.forEach(t => p.league_standings[t] = { W: 0, L: 0 });
        p.schedule = generateSchedule(p.team);
    }
}

// ================= 雙方討價還價合約談判系統 =================
function startNegotiationModal() {
    const p = currentPlayer;
    const ovr = getOVR(p);
    const baseSalary = Math.max(300, Math.floor(Math.pow(ovr - 50, 1.8) * 15 + 200));

    const potentialTeams = [p.team, ...TEAMS.filter(t => t !== p.team).sort(() => 0.5 - Math.random()).slice(0, 2)];
    const offers = {};
    potentialTeams.forEach(t => {
        offers[t] = {
            salary: Math.max(200, baseSalary + Math.floor(Math.random() * 250 - 100)),
            years: Math.floor(Math.random() * 4) + 1
        };
    });

    let html = `<h3 class="text-lg font-bold text-orange-400 mb-3 text-center">💼 自由球員合約談判市場</h3><div class="space-y-2">`;
    Object.keys(offers).forEach(t => {
        const off = offers[t];
        html += `
            <div class="p-3 bg-slate-700 rounded-lg flex justify-between items-center text-xs">
                <div>
                    <div class="font-bold text-amber-300 text-sm">${t}</div>
                    <div>報價: $${off.salary} 萬美元/年 (${off.years}年)</div>
                </div>
                <button onclick="openNegotiateDialog('${t}', ${off.salary}, ${off.years})" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded font-bold">討價還價</button>
            </div>
        `;
    });
    html += `</div>`;
    openModal(html);
}

function openNegotiateDialog(team, initSalary, initYears) {
    let html = `
        <h3 class="text-base font-bold text-orange-400 mb-2">與 【${team}】 進行談判</h3>
        <p class="text-xs text-slate-300 mb-3">球隊初始報價：$${initSalary} 萬美元/年 (${initYears}年)</p>
        <div class="space-y-3 text-xs">
            <div>
                <label class="block mb-1 text-slate-400">你要求的年薪 (萬美元)</label>
                <input id="req-sal" type="number" value="${initSalary}" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
            </div>
            <div>
                <label class="block mb-1 text-slate-400">你要求的合約年數</label>
                <input id="req-yr" type="number" value="${initYears}" class="w-full p-2 bg-slate-700 rounded border border-slate-600">
            </div>
            <button onclick="submitNegotiation('${team}', ${initSalary}, ${initYears})" class="w-full py-2.5 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold">遞交我的條件</button>
        </div>
    `;
    openModal(html);
}

function submitNegotiation(team, initSalary, initYears) {
    const reqS = parseInt(document.getElementById('req-sal').value) || initSalary;
    const reqY = parseInt(document.getElementById('req-yr').value) || initYears;
    const diffPct = (reqS - initSalary) / initSalary;

    if (diffPct <= 0.10) {
        alert(`🎉 ${team} 欣然接受了你的條件！以 $${reqS} 萬/年 成功簽約 ${reqY} 年！`);
        finalizeContract(team, reqS, reqY);
    } else if (diffPct > 0.40) {
        alert(`💔 ${team} 認為你的要求太離譜，終止了談判！請選擇其他球隊。`);
        startNegotiationModal();
    } else {
        const counterS = Math.floor(initSalary + (reqS - initSalary) * 0.4);
        if (confirm(`${team} 拒絕了你的要求，但提出折中方案：$${counterS} 萬美元/年 (${reqY}年)。你是否接受？`)) {
            finalizeContract(team, counterS, reqY);
        } else {
            startNegotiationModal();
        }
    }
}

function finalizeContract(team, salary, years) {
    closeModal();
    const p = currentPlayer;
    p.team = team;
    p.current_salary = salary;
    p.contract_years_left = years;
    p.season_games_played = 0; p.wins = 0; p.losses = 0;
    TEAMS.forEach(t => p.league_standings[t] = { W: 0, L: 0 });
    p.schedule = generateSchedule(team);
    savePlayer(p);
    showDashboard();
}

// ================= 戰績與賽程表視窗 =================
function showStandingsModal() {
    const p = currentPlayer;
    const sorted = Object.keys(p.league_standings).map(t => ({
        team: t, W: p.league_standings[t].W, L: p.league_standings[t].L,
        pct: (p.league_standings[t].W + p.league_standings[t].L) > 0 ? (p.league_standings[t].W / (p.league_standings[t].W + p.league_standings[t].L)).toFixed(3) : "0.000"
    })).sort((a, b) => b.pct - a.pct || b.W - a.W);

    let html = `<h3 class="text-base font-bold text-orange-400 mb-2 text-center">🏆 聯盟戰績表 (8隊)</h3><div class="space-y-1 text-xs">`;
    sorted.forEach((item, idx) => {
        html += `<div class="flex justify-between p-2 bg-slate-700 rounded"><span>${idx+1}. ${item.team} ${item.team === p.team ? '⭐' : ''}</span><span>${item.W}勝 ${item.L}敗 (勝率:${item.pct})</span></div>`;
    });
    html += `</div><button onclick="closeModal()" class="w-full mt-3 p-2 bg-slate-600 rounded text-xs">關閉</button>`;
    openModal(html);
}

function showScheduleModal() {
    const p = currentPlayer;
    let html = `<h3 class="text-base font-bold text-orange-400 mb-2 text-center">📅 賽季完整賽程表 (30場)</h3><div class="max-h-60 overflow-y-auto space-y-1 text-xs">`;
    p.schedule.forEach(g => {
        const status = g.game_num <= p.season_games_played ? "已完賽" : (g.game_num === p.season_games_played + 1 ? "🔥 下一場" : "未進行");
        html += `<div class="flex justify-between p-2 bg-slate-700 rounded"><span>第 ${g.game_num} 場 [${g.home_away}] vs ${g.opponent}</span><span class="text-amber-300 font-bold">${status}</span></div>`;
    });
    html += `</div><button onclick="closeModal()" class="w-full mt-3 p-2 bg-slate-600 rounded text-xs">關閉</button>`;
    openModal(html);
}

function openModal(html) { modalContent.innerHTML = html; modalContainer.classList.remove('hidden'); }
function closeModal() { modalContainer.classList.add('hidden'); }

// 初始化進入主選單
showMainMenu();