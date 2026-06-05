const API = {
    url: "https://kr1ogenka.pythonanywhere.com/api",
    isSaving: false,

    async load() {
        if (!window.Telegram.WebApp.initData) return;
        try {
            let res = await fetch(`${this.url}/load`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tg_data: window.Telegram.WebApp.initData })
            });
            let data = await res.json();
            
            if (data.status === "success" && data.player) {
                const p = data.player;
                
                // --- РАСЧЕТ ОФФЛАЙН ДОХОДА САДА ---
                if (p.last_harvest && p.planted_seeds > 0) {
                    let passedSec = (Date.now() - p.last_harvest) / 1000;
                    if (passedSec > 0) {
                        StateLocal.uncollected_suns = (p.planted_seeds * 0.05 * passedSec);
                    }
                }
                
                State.player = { ...State.player, ...p };
            }
        } catch (e) { console.error("Ошибка сети:", e); }
    },

    async save() {
        if (!window.Telegram.WebApp.initData || this.isSaving) return;
        this.isSaving = true;
        try {
            await fetch(`${this.url}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tg_data: window.Telegram.WebApp.initData,
                    app_data: State.player
                })
            });
        } catch (e) { console.error(e); } 
        finally { this.isSaving = false; }
    }
};