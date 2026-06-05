// Регистрируем все модули здесь
const Modules = {
    farm: FarmModule
    // Сюда будем добавлять shop, mine, inventory и т.д.
};

const App = {
    currentTab: 'farm',
    
    async init() {
        // 1. Загрузка данных
        await API.load();
        
        // 2. Убираем экран загрузки
        document.getElementById('loading-overlay').style.opacity = '0';
        setTimeout(() => document.getElementById('loading-overlay').style.display = 'none', 500);

        // 3. Запуск
        isGameReady = true;
        this.switchTab('farm');
        this.updateUI();
        
        // 4. Циклы
        setInterval(() => this.gameLoop(), 1000);
        setInterval(() => {
            if (needsServerSync && isGameReady) { API.save(); needsServerSync = false; }
        }, 5000);
    },

    saveLocal() {
        needsServerSync = true;
        this.updateUI();
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
        State.player.balance += State.player.planted_seeds * 0.05;
        this.saveLocal();
    }
};

window.onload = () => App.init();