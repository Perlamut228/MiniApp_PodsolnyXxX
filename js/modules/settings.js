const SettingsModule = {
    render() {
        const isMob = State.settings.mobileLayout;
        
        return `
            <h2 class="tab-title">⚙️ Настройки</h2>
            
            <div class="card" style="max-width: 400px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 0;">
                    <div>
                        <b>📱 Мобильный интерфейс</b>
                        <p style="font-size:12px; color:var(--text-muted); margin-top:3px;">Переместить меню вниз экрана</p>
                    </div>
                    
                    <div onclick="SettingsModule.toggleMobile()" 
                         style="position:relative; width:50px; height:24px; background: ${isMob ? 'var(--accent)' : 'var(--bg-dark)'}; border-radius:12px; cursor:pointer; border:1px solid ${isMob ? 'var(--accent)' : 'var(--border)'}; transition:0.3s;">
                        <div style="position:absolute; top:2px; left:${isMob ? '28px' : '2px'}; width:18px; height:18px; background:${isMob ? '#000' : 'var(--text-muted)'}; border-radius:50%; transition:0.3s;"></div>
                    </div>
                </div>
            </div>

            <div class="card" style="max-width: 400px; border-color: var(--danger);">
                <h3 style="color: var(--danger); margin-bottom: 10px;">⚠️ Инструменты разработчика</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Если выкатил обнову, а игра показывает старую версию — жми сюда.</p>
                <button class="action-btn" style="background:var(--danger); border-color:var(--danger);" onclick="SettingsModule.hardReload()">🗑 Очистить кэш и Обновить</button>
            </div>
        `;
    },

    toggleMobile() {
        State.settings.mobileLayout = !State.settings.mobileLayout;
        localStorage.setItem('scrapAppSettings', JSON.stringify(State.settings));
        App.applyLayout();
        App.switchTab('settings');
    },

    hardReload() {
        if(confirm("Очистить кэш и принудительно обновить страницу?")) {
            localStorage.clear();
            // Магия обхода кэша: добавляем случайное число к ссылке
            window.location.href = window.location.pathname + "?v=" + new Date().getTime();
        }
    }
};