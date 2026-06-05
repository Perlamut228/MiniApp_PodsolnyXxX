const SettingsModule = {
    render() {
        const isMob = State.settings.mobileLayout;
        
        return `
            <h2 class="tab-title">⚙️ Настройки</h2>
            <div class="card" style="max-width: 400px;">
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
        `;
    },

    toggleMobile() {
        // Меняем состояние
        State.settings.mobileLayout = !State.settings.mobileLayout;
        
        // Сохраняем в локальную память браузера (кэш), а не на сервер бота
        localStorage.setItem('scrapAppSettings', JSON.stringify(State.settings));
        
        // Применяем изменения к дизайну
        App.applyLayout();
        
        // Перерисовываем саму вкладку настроек, чтобы тумблер сдвинулся
        App.switchTab('settings');
    }
};