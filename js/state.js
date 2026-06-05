const State = {
    settings: { mobileLayout: false },
    player: {
        // --- ОСНОВНАЯ ЭКОНОМИКА БОТА ---
        balance: 0,         // 🌻 Подсолнухи
        diamonds: 0,        // 💎 Алмазы
        seeds: 0,           // 🌱 Семена
        super_seeds: 0,     // 🌱✨ Супер-семена
        
        // --- ИНВЕНТАРЬ И ПРЕДМЕТЫ ---
        keys_wood: 0,       // 🔑 Деревянные ключи
        keys_dia: 0,        // 🔑 Алмазные ключи
        keys_plasma: 0,     // 🔑 Плазменные ключи
        tickets_auto: 0,    // 🎫 Билеты автосбора
        strange_box: 0,     // 📦 Странные коробки
        
        // --- ЭЛИТНОЕ И ИВЕНТЫ ---
        ultra_tokens: 0,    // 🔮 Ультра токены
        prestige_count: 0,  // 👑 Престиж
        bp_xp: 0,           // 🎟 Опыт БП
        event_coins: 0,     // ☀️ Ивентовые монеты
        event_points: 0,    // 🏆 Очки ивента

        // --- МЕХАНИКИ МИНИ-ИГРЫ ---
        planted_seeds: 0,
        field_limit: 5,
        pickaxe_level: 1,
        mine_start: null,
        mana: 0,
        inventory: {}
    }
};

let needsServerSync = false;
let isGameReady = false;