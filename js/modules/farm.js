const FarmModule = {
    render() {
        const p = State.player;
        return `
            <h2 class="tab-title">🏡 Мой Сад</h2>
            <div class="card" style="text-align:center; padding: 30px;">
                <div style="font-size: 64px; margin-bottom: 20px;">🌻</div>
                <h3>Растет: ${p.planted_seeds} / ${p.field_limit} 🌱</h3>
                <div class="grid" style="margin-top:20px;">
                    <button class="action-btn" onclick="FarmModule.plant()">Посадить 1 🌱</button>
                    <button class="action-btn" onclick="FarmModule.harvest()" style="background:var(--success);">Собрать урожай</button>
                </div>
            </div>
            
            <h3 style="margin-top:20px;">Склад семян</h3>
            <div class="grid" style="margin-top:10px;">
                <div class="card" style="text-align:center;">Обычные<br><b style="font-size:20px;">${p.seeds} 🌱</b></div>
                <div class="card" style="text-align:center;">Супер<br><b style="font-size:20px; color:#ffdd59;">${p.super_seeds} 🌱✨</b></div>
            </div>
        `;
    },
    plant() {
        if (State.player.planted_seeds >= State.player.field_limit) return App.showToast("Поле заполнено!");
        if (State.player.seeds < 1) return App.showToast("Нет семян!");
        State.player.seeds--; State.player.planted_seeds++;
        App.saveLocal(); App.switchTab('farm');
    },
    harvest() {
        if (State.player.planted_seeds === 0) return App.showToast("В саду пусто!");
        App.showToast("Урожай собран!");
        State.player.planted_seeds = 0; App.saveLocal(); App.switchTab('farm');
    }
};