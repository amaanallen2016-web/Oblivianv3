// main.js – Core OS logic
const state = {
    booted: false,
    osType: null,
    currentWallpaper: 'aesthetic1',
    username: localStorage.getItem('oblivian_username') || null,
    openWindows: {},
    windowZIndex: 100,
    startMenuOpen: false,
    ageVerified: false,
    users: JSON.parse(localStorage.getItem('oblivian_users') || '{}'),
    messages: JSON.parse(localStorage.getItem('oblivian_messages') || '{}'),
    selectedChat: null,
    gamesFilter: 'all',
    gamesSearch: '',
    proxyHistory: [],
    proxyIndex: -1,
    terminalHistory: [],
    currentSong: null,
    omSearchQuery: '',
    omCategory: 'all',
    songsSearchQuery: '',
    songsCategory: 'all',
};

function initOblivian() {
    // Boot sequence
    const bootScreen = document.getElementById('boot-screen');
    const bootLoadingBar = document.getElementById('bootLoadingBar');
    const bootChoice = document.getElementById('bootChoice');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        bootLoadingBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            bootChoice.classList.add('show');
        }
    }, 80);

    document.getElementById('btnLinux').addEventListener('click', () => bootOS('linux'));
    document.getElementById('btnOS').addEventListener('click', () => bootOS('os'));

    // Register default users
    if (!state.users['Nova']) state.users['Nova'] = { online: true };
    if (!state.users['Kai']) state.users['Kai'] = { online: true };
    if (!state.users['Yuki']) state.users['Yuki'] = { online: false };
    localStorage.setItem('oblivian_users', JSON.stringify(state.users));

    // Start clock
    setInterval(updateClock, 1000);
    updateClock();
}

function bootOS(type) {
    state.osType = type;
    document.getElementById('boot-screen').classList.add('hidden');
    document.getElementById('desktop').classList.add('active');
    if (type === 'os') {
        document.getElementById('menu-bar').classList.add('active');
        document.getElementById('taskbar').classList.add('macos-style');
    }
    applyWallpaper(state.currentWallpaper);
    showNotification('Welcome to Oblivian OS', 'Your ' + (type === 'linux' ? 'Linux' : 'OS') + ' desktop is ready.');
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('taskbarClock').textContent = timeStr;
    document.getElementById('menuBarTime2').textContent = timeStr;
}

function applyWallpaper(id) {
    const desktop = document.getElementById('desktop');
    const wallpapers = {
        aesthetic1: 'linear-gradient(135deg, #0a0a2e, #1a0a3e, #2d1b69)',
        aesthetic2: 'linear-gradient(180deg, #000510, #0a1025, #1a0a30)',
        // ... add all from settings
    };
    desktop.style.background = wallpapers[id] || wallpapers.aesthetic1;
    state.currentWallpaper = id;
}

// Window management
function createWindow(id, title, icon, contentHTML) {
    if (state.openWindows[id]) {
        focusWindow(id);
        return;
    }
    const win = document.createElement('div');
    win.className = 'window';
    win.id = 'window-' + id;
    win.dataset.appId = id;
    win.style.zIndex = ++state.windowZIndex;
    win.style.left = 'calc(50% - ' + Math.min(380, window.innerWidth - 40) + 'px / 2)';
    win.style.top = 'calc(50% - 260px)';
    win.style.width = Math.min(380, window.innerWidth - 40) + 'px';
    win.style.height = '400px';
    win.innerHTML = `
        <div class="window-titlebar">
            <span class="window-title">${icon} ${title}</span>
            <div class="window-controls">
                <button class="window-ctrl-btn ctrl-min">─</button>
                <button class="window-ctrl-btn ctrl-max">□</button>
                <button class="window-ctrl-btn ctrl-close">✕</button>
            </div>
        </div>
        <div class="window-content">${contentHTML}</div>
    `;
    document.getElementById('windowContainer').appendChild(win);
    state.openWindows[id] = { el: win, title, icon, minimized: false, maximized: false };

    win.querySelector('.ctrl-close').addEventListener('click', () => closeWindow(id));
    win.querySelector('.ctrl-min').addEventListener('click', () => minimizeWindow(id));
    win.querySelector('.ctrl-max').addEventListener('click', () => toggleMaximizeWindow(id));
    win.addEventListener('mousedown', () => focusWindow(id));

    // Initialize app-specific logic
    if (typeof initAppContent === 'function') initAppContent(id);
    updateTaskbarButtons();
    focusWindow(id);
}

function closeWindow(id) {
    const win = state.openWindows[id];
    if (!win) return;
    win.el.style.transition = 'all 0.2s';
    win.el.style.opacity = '0';
    win.el.style.transform = 'scale(0.9)';
    setTimeout(() => {
        win.el.remove();
        delete state.openWindows[id];
        updateTaskbarButtons();
    }, 200);
}

function minimizeWindow(id) {
    const win = state.openWindows[id];
    if (win) { win.minimized = true; win.el.classList.add('minimized'); }
}

function toggleMaximizeWindow(id) {
    const win = state.openWindows[id];
    if (win) { win.maximized = !win.maximized; win.el.classList.toggle('maximized', win.maximized); }
}

function focusWindow(id) {
    const win = state.openWindows[id];
    if (win) { win.minimized = false; win.el.classList.remove('minimized'); win.el.style.zIndex = ++state.windowZIndex; updateTaskbarButtons(); }
}

function updateTaskbarButtons() {
    document.querySelectorAll('.taskbar-btn').forEach(btn => {
        const appId = btn.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
        if (appId && state.openWindows[appId]) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function toggleStartMenu(force) {
    state.startMenuOpen = force !== undefined ? force : !state.startMenuOpen;
    document.getElementById('start-menu').classList.toggle('open', state.startMenuOpen);
}
document.addEventListener('click', (e) => {
    if (state.startMenuOpen && !document.getElementById('start-menu').contains(e.target) && !document.getElementById('startBtn').contains(e.target)) {
        toggleStartMenu(false);
    }
});
document.getElementById('startBtn').addEventListener('click', () => toggleStartMenu());

function openApp(appId) {
    switch (appId) {
        case 'messages': createWindow('messages', 'Messages', '💬', renderMessagesApp()); break;
        case 'games': createWindow('games', 'Games', '🎮', renderGamesApp()); break;
        case 'proxy': createWindow('proxy', 'Proxy Browser', '🌐', renderProxyApp()); break;
        case 'settings': createWindow('settings', 'Settings', '⚙️', renderSettingsApp()); break;
        case 'terminal': createWindow('terminal', 'Terminal', '⌨️', renderTerminalApp()); break;
        case 'music': createWindow('music', 'Music Player', '🎵', renderMusicApp()); break;
        case 'om': createWindow('om', 'OM — Oblivian Movies', '🎬', renderOMApp()); break;
        case 'songs': createWindow('songs', 'Oblivian Songs', '🎧', renderSongsApp()); break;
    }
}

// Notifications
function showNotification(title, body) {
    const container = document.getElementById('notifications-container');
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<strong style="color:var(--accent);">${title}</strong><br><span style="color:var(--text2);font-size:12px;">${body}</span>`;
    container.appendChild(notif);
    notif.addEventListener('click', () => notif.remove());
    setTimeout(() => { if (notif.parentNode) notif.remove(); }, 4000);
}

// Age gate functions (global for settings.js)
function acceptAgeGate() { state.ageVerified = true; document.getElementById('ageGateOverlay').classList.remove('active'); showNotification('Access granted', '18+ wallpapers unlocked.'); }
function declineAgeGate() { document.getElementById('ageGateOverlay').classList.remove('active'); showNotification('Access denied', '18+ content is restricted.'); }
