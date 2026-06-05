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
                State.player = { ...State.player, ...data.player };
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
        } catch (e) {
            console.error("Ошибка сохранения:", e);
        } finally {
            this.isSaving = false;
        }
    }
};