// Заглушка для будущих модулей (чтобы игра не ломалась при нажатии)
const PlaceholderModule = {
    render() { return `<div class="card" style="text-align:center; padding:50px; color:var(--text-muted);">В разработке... 🛠</div>`; }
};

const Modules = {
    farm: FarmModule,
    mine: MineModule,
    settings: SettingsModule,
    // Заглушки на будущее:
    inventory: PlaceholderModule,
    craft: PlaceholderModule,
    shop: PlaceholderModule,
    merchant: PlaceholderModule,
    battlepass: PlaceholderModule
};

const StateLocal = { uncollected_suns: 0 };

const App = {
    currentTab: 'farm',
    
    async init() {
        // 1. Загружаем визуальные настройки из кэша (если они есть)
        const savedSettings = localStorage.getItem('scrapAppSettings');
        if (savedSettings) State.settings = JSON.parse(savedSettings);
        
        this.applyLayout();
        this.setupProfile(); // <-- Тянем данные из ТГ!

        // 2. Загружаем данные бота
        await API.load();
        
        document.getElementById('loading-overlay').style.opacity = '0';
        setTimeout(() => document.getElementById('loading-overlay').style.display = 'none', 500);

        isGameReady = true;
        this.switchTab('farm');
        this.updateUI();
        
        setInterval(() => this.gameLoop(), 1000);
        setInterval(() => {
            if (needsServerSync && isGameReady) { API.save(); needsServerSync = false; }
        }, 10000);
    },

    // Функция связи с профилем Telegram
    setupProfile() {
        const tg = window.Telegram.WebApp;
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const u = tg.initDataUnsafe.user;
            
            document.getElementById('ui-username').innerText = u.first_name || "Игрок";
            document.getElementById('ui-userid').innerText = "ID: " + u.id;
            
            if (u.photo_url) {
                // Если у юзера есть аватарка, ставим её
                document.getElementById('ui-avatar').innerHTML = `<img src="${u.photo_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            } else {
                // Если нет (скрыта настройками приватности), ставим первую букву имени
                document.getElementById('ui-avatar').innerHTML = `<b style="color:#000;">${(u.first_name || "U")[0]}</b>`;
                document.getElementById('ui-avatar').style.background = "var(--accent)";
            }
        }
    },

    // Применение мобильного/ПК дизайна
    applyLayout() {
        if (State.settings.mobileLayout) {
            document.body.classList.add('mobile-mode');
        } else {
            document.body.classList.remove('mobile-mode');
        }
    },

    saveLocal() {
        needsServerSync = true;
        this.updateUI();
        API.save(); 
    },

    updateUI() {
        if (!isGameReady) return;
        document.getElementById('ui-sun').innerText = Math.floor(State.player.balance);
        document.getElementById('ui-dia').innerText = State.player.diamonds;
    },

    switchTab(tabName) {
        this.currentTab = tabName;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`.nav-btn[data-tab="${tabName}"]`);
        if (btn) btn.classList.add('active');
        
        document.getElementById('main-content').innerHTML = Modules[tabName].render();
    },

    showToast(msg) {
        const container = document.getElementById('toast-container');
        const t = document.createElement('div'); t.className = 'toast'; t.innerText = msg;
        container.appendChild(t);
        setTimeout(() => t.style.opacity = '1', 10);
        setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 2000);
    },

    gameLoop() {
        if (!isGameReady) return;
        
        if (State.player.planted_seeds > 0) {
            StateLocal.uncollected_suns += (State.player.planted_seeds * 0.05);
            const earnEl = document.getElementById('farm-earning');
            if (earnEl) earnEl.innerText = StateLocal.uncollected_suns.toFixed(2);
        }

        if (this.currentTab === 'mine') {
            Modules.mine.updateTimer();
        }
    }
};

window.onload = () => App.init();