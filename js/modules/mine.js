const MineModule = {
    // Цены на уровни: 1->2 (5), 2->3 (10), 3->4 (20), 4->5 (50)
    upgradeCosts: [0, 5, 10, 20, 50],
    pickaxeNames: ["Деревянная", "Железная", "Золотая", "Алмазная", "Космическая"],

    getHoursNeeded() {
        // Формула из твоего бота: max(2, 10 - (pickaxe * 2))
        return Math.max(2, 10 - (State.player.pickaxe_level * 2));
    },

    render() {
        const p = State.player;
        let level = p.pickaxe_level || 1;
        let pName = level <= 5 ? this.pickaxeNames[level - 1] : "Максимальная";
        
        let actionHtml = '';
        // Если есть отметка времени старта — значит рабочий в шахте
        if (p.mine_start) {
            actionHtml = `
                <p style="color:var(--accent); font-weight:bold;">👷 Рабочий в шахте!</p>
                <div class="progress-bar"><div class="progress-fill" id="mine-progress"></div></div>
                <p id="mine-timer" style="margin-top:5px; font-family:monospace; font-size:16px;">Вычисляем...</p>
                <button class="action-btn" id="btn-collect-mine" onclick="MineModule.collect()" disabled>Забрать добычу</button>
            `;
        } else {
            actionHtml = `<button class="action-btn" onclick="MineModule.sendWorker()">⛏ Отправить в шахту</button>`;
        }

        let upgCost = level < 5 ? this.upgradeCosts[level] : null;
        let upgBtn = upgCost ? 
            `<button class="action-btn" onclick="MineModule.upgradePickaxe()">✨ Улучшить кирку (${upgCost} 💎)</button>` : 
            `<button class="action-btn" disabled>Кирка максимального уровня</button>`;

        return `
            <h2 class="tab-title">🤫 Глубокая Шахта</h2>
            <div class="grid">
                <div class="card">
                    <h3>Ваша кирка: ${pName} (Ур. ${level})</h3>
                    <p style="color: var(--text-muted); font-size:14px; margin-top:5px;">
                        Время добычи: <b>${this.getHoursNeeded()} ч.</b>
                    </p>
                    <hr style="border:0; border-top:1px solid var(--border); margin:15px 0;">
                    ${actionHtml}
                    <hr style="border:0; border-top:1px solid var(--border); margin:15px 0;">
                    ${upgBtn}
                </div>
                
                <div class="card" style="text-align:center; display:flex; flex-direction:column; justify-content:center;">
                    <div style="font-size: 64px;">💎</div>
                    <h3>Алмазов на складе</h3>
                    <h2 style="color:var(--dia); font-size: 32px;">${p.diamonds}</h2>
                </div>
            </div>
        `;
    },

    sendWorker() {
        State.player.mine_start = Date.now();
        App.saveLocal();
        App.switchTab('mine');
        App.showToast("👷 Рабочий ушел в шахту!");
    },

    updateTimer() {
        if (!State.player.mine_start) return;
        const elTimer = document.getElementById('mine-timer');
        const elProg = document.getElementById('mine-progress');
        const btn = document.getElementById('btn-collect-mine');
        if (!elTimer) return;

        const now = Date.now();
        const neededMs = this.getHoursNeeded() * 3600 * 1000; // Часы в миллисекунды
        const passedMs = now - State.player.mine_start;
        
        if (passedMs >= neededMs) {
            elTimer.innerText = "Готово к сбору!";
            elTimer.style.color = "var(--success)";
            elProg.style.width = "100%";
            if (btn) { 
                btn.disabled = false; 
                btn.style.background = "var(--success)"; 
                btn.style.borderColor = "var(--success)";
            }
        } else {
            const left = neededMs - passedMs;
            const h = Math.floor(left / 3600000);
            const m = Math.floor((left % 3600000) / 60000);
            const s = Math.floor((left % 60000) / 1000);
            elTimer.innerText = `Осталось: ${h}ч ${m}м ${s}с`;
            elProg.style.width = (passedMs / neededMs * 100) + "%";
        }
    },

    collect() {
        State.player.mine_start = null;
        State.player.diamonds += 1;
        App.saveLocal();
        App.switchTab('mine');
        App.showToast("💎 Добыт 1 Алмаз!");
    },

    upgradePickaxe() {
        const p = State.player;
        let level = p.pickaxe_level || 1;
        
        if (level >= 5) return App.showToast("❌ Кирка максимального уровня!");
        
        let cost = this.upgradeCosts[level];
        if (p.diamonds < cost) return App.showToast(`❌ Нужно ${cost} 💎`);
        
        p.diamonds -= cost;
        p.pickaxe_level = level + 1;
        App.saveLocal();
        App.switchTab('mine');
        App.showToast(`✨ Кирка улучшена до Ур. ${level + 1}!`);
    }
};