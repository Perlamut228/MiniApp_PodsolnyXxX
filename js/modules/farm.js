const FarmModule = {
    // Цены на улучшение склада (из твоего keyboards.py)
    storageUpgradeCosts: [1, 3, 5, 8, 12, 18, 25, 35, 50, 75, 100],

    // Вычисление цены расширения поля (если у тебя в logic.py другая формула, скажи, я поправлю)
    getExpandCost() {
        const p = State.player;
        if (p.field_limit >= 50) return null;
        // Примерная цена: каждые +1 к полю стоят (текущий лимит / 2) супер-семян. 
        return Math.floor(p.field_limit / 2) || 1; 
    },

    render() {
        const p = State.player;
        
        // Логика кнопок посадки (как в боте)
        let plantBtn = "";
        if (p.planted_seeds >= 50) {
            plantBtn = `<button class="action-btn" disabled>🌱 Поле на максимуме (50)</button>`;
        } else if (p.planted_seeds < 25) {
            plantBtn = `<button class="action-btn" onclick="FarmModule.plant()">🌱 Посадить (1 🌱)</button>`;
        } else {
            plantBtn = `<button class="action-btn" onclick="FarmModule.plant()">🌱 Посадить (1 🌱✨)</button>`;
        }

        // Логика кнопки расширения поля
        let expandCost = this.getExpandCost();
        let expandBtn = expandCost ? 
            `<button class="action-btn" onclick="FarmModule.expandField()">✨ Расширить поле (${expandCost} 🌱✨)</button>` : 
            "";

        // Логика кнопки склада
        let storLvl = p.storage_level || 1;
        let storCost = storLvl <= this.storageUpgradeCosts.length ? this.storageUpgradeCosts[storLvl - 1] : null;
        let storageBtn = storCost ? 
            `<button class="action-btn" onclick="FarmModule.upgradeStorage()">🗄 Улучшить склад (${storCost} 🌱✨)</button>` :
            `<button class="action-btn" disabled>🗄 Склад максимального уровня</button>`;

        return `
            <h2 class="tab-title">🏡 Мой Сад</h2>
            
            <div class="card" style="text-align:center; padding: 30px;">
                <div style="font-size: 64px; margin-bottom: 20px;">🌻</div>
                <h3>Растет: ${p.planted_seeds} / ${p.field_limit} 🌱</h3>
                <p style="color: var(--text-muted); margin: 10px 0;">
                    Текущий доход: <b id="farm-earning" style="color:var(--accent);">${(p.planted_seeds * 0.05).toFixed(2)}</b> 🌻/сек
                </p>
                
                <div class="grid" style="margin-top:20px;">
                    ${plantBtn}
                    <button class="action-btn" onclick="FarmModule.dig()" style="background:var(--danger); border-color:var(--danger);">⛏ Выкопать</button>
                    <button class="action-btn" onclick="FarmModule.harvest()" style="background:var(--success); border-color:var(--success); grid-column: 1 / -1;">🧺 Собрать урожай</button>
                </div>
            </div>

            <h3 style="margin-top:20px; border-bottom: 1px solid #333; padding-bottom:10px;">Прокачка Сада</h3>
            <div class="grid" style="margin-top:10px;">
                <div class="card" style="text-align:center;">
                    <h4>Размер поля</h4>
                    <p style="color:var(--text-muted); font-size:12px; margin-bottom:10px;">Больше семян = больше дохода</p>
                    ${expandBtn}
                </div>
                <div class="card" style="text-align:center;">
                    <h4>Склад (Ур. ${storLvl})</h4>
                    <p style="color:var(--text-muted); font-size:12px; margin-bottom:10px;">Вместимость: ${p.storage_limit || 100} 🌻</p>
                    ${storageBtn}
                </div>
            </div>
            
            <h3 style="margin-top:20px; border-bottom: 1px solid #333; padding-bottom:10px;">Склад семян</h3>
            <div class="grid" style="margin-top:10px;">
                <div class="card" style="text-align:center;">Обычные<br><b style="font-size:20px;">${p.seeds} 🌱</b></div>
                <div class="card" style="text-align:center;">Супер<br><b style="font-size:20px; color:#ffdd59;">${p.super_seeds} 🌱✨</b></div>
            </div>
        `;
    },

    plant() {
        const p = State.player;
        if (p.planted_seeds >= p.field_limit) return App.showToast("❌ Поле заполнено!");
        
        if (p.planted_seeds < 25) {
            // Сажаем за обычные
            if (p.seeds < 1) return App.showToast("❌ Нет обычных семян!");
            p.seeds--;
        } else {
            // Сажаем за супер-семена
            if (p.super_seeds < 1) return App.showToast("❌ Нет супер-семян!");
            p.super_seeds--;
        }

        p.planted_seeds++;
        App.showToast("✅ Посажено!");
        App.saveLocal();
        App.switchTab('farm'); // Перерисовываем интерфейс
    },

    dig() {
        const p = State.player;
        if (p.planted_seeds <= 0) return App.showToast("❌ Сад и так пуст!");
        
        p.planted_seeds--;
        App.showToast("⛏ Вы выкопали 1 растение.");
        App.saveLocal();
        App.switchTab('farm');
    },

    expandField() {
        const p = State.player;
        const cost = this.getExpandCost();
        if (!cost || p.field_limit >= 50) return App.showToast("❌ Поле максимально!");
        
        if (p.super_seeds < cost) return App.showToast(`❌ Нужно ${cost} 🌱✨`);
        
        p.super_seeds -= cost;
        p.field_limit += 1; // Увеличиваем лимит на 1
        App.showToast("✨ Поле расширено!");
        App.saveLocal();
        App.switchTab('farm');
    },

    upgradeStorage() {
        const p = State.player;
        p.storage_level = p.storage_level || 1;
        p.storage_limit = p.storage_limit || 100;

        let cost = this.storageUpgradeCosts[p.storage_level - 1];
        if (!cost) return App.showToast("❌ Максимальный уровень склада!");

        if (p.super_seeds < cost) return App.showToast(`❌ Нужно ${cost} 🌱✨`);

        p.super_seeds -= cost;
        p.storage_level += 1;
        // Настраиваем, сколько вместимости дает уровень (поменяй, если в боте иначе)
        p.storage_limit += 150; 

        App.showToast("🗄 Склад улучшен!");
        App.saveLocal();
        App.switchTab('farm');
    },

    harvest() {
        const p = State.player;
        if (p.planted_seeds === 0) return App.showToast("❌ В саду пусто!");
        
        // В боте сбор урожая сбрасывает planted_seeds? 
        // Если да, раскомментируй строку ниже:
        // p.planted_seeds = 0; 
        
        App.showToast("🧺 Урожай собран!");
        App.saveLocal();
        App.switchTab('farm');
    }
};