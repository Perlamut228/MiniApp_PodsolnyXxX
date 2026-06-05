const Modules = {
    farm: FarmModule
};

// Локальные данные, которые сбрасываются при закрытии игры
const StateLocal = {
    uncollected_suns: 0 
};

const App = {
    currentTab: 'farm',
    
    async init() {
        await API.load();
        
        document.getElementById('loading-overlay').style.opacity = '0';
        setTimeout(() => document.getElementById('loading-overlay').style.display = 'none', 500);

        isGameReady = true;
        this.switchTab('farm');
        this.updateUI();
        
        setInterval(() => this.gameLoop(), 1000);
        // Резервное автосохранение
        setInterval(() => {
            if (needsServerSync && isGameReady) { API.save(); needsServerSync = false; }
        }, 10000);
    },

    saveLocal() {
        needsServerSync = true;
        this.updateUI();
        // ВАЖНО: Моментально отправляем на сервер при любом действии!
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
        document.querySelector(`.nav-btn[data-tab="${tabName}"]`).classList.add('active');
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
        if (!isGameReady || State.player.planted_seeds <= 0) return;
        
        // Копим подсолнухи в накопитель урожая
        StateLocal.uncollected_suns += (State.player.planted_seeds * 0.05);

        // Обновляем циферку на экране Сада
        const earnEl = document.getElementById('farm-earning');
        if (earnEl) {
            earnEl.innerText = StateLocal.uncollected_suns.toFixed(2);
        }
    }
};

window.onload = () => App.init();