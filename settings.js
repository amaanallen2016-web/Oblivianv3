// settings.js
function renderSettingsApp() {
    return `
        <div class="settings-app">
            <div class="settings-nav">
                <button class="settings-nav-btn active" data-section="wallpapers">Wallpapers</button>
                <button class="settings-nav-btn" data-section="account">Account</button>
                <button class="settings-nav-btn" data-section="system">System</button>
            </div>
            <div class="settings-content" id="settingsContent">${renderWallpaperSettings()}</div>
        </div>
    `;
}

function renderWallpaperSettings() {
    const categories = {
        aesthetic: '✨ Aesthetic',
        anime: '🌸 Anime',
        cars: '🏎️ Cars',
        minecraft: '⛏️ Minecraft',
        nsfw: '🔞 NSFW (18+)'
    };
    let html = '';
    for (const cat in categories) {
        html += `<div class="wallpaper-category-label">${categories[cat]} ${cat==='nsfw'?'<span class="badge">18+ ONLY</span>':''}</div>`;
        html += `<div class="wallpaper-grid">`;
        const wallpapers = {
            aesthetic: [
                { id:'aesthetic1', name:'Neon Synthwave', css:'linear-gradient(135deg, #0a0a2e, #1a0a3e, #2d1b69)' },
                { id:'aesthetic2', name:'Cyber Grid', css:'linear-gradient(180deg, #000510, #0a1025, #1a0a30)' },
            ],
            anime: [
                { id:'anime1', name:'Cherry Blossom', css:'linear-gradient(160deg, #1a0a1e, #3d1a3d, #663366)' },
                { id:'anime2', name:'Neo Tokyo', css:'linear-gradient(140deg, #0a0a1a, #1a0a2e, #2d1b4e)' },
            ],
            cars: [
                { id:'cars1', name:'Night Drift', css:'linear-gradient(150deg, #0a0a0a, #1a1a2e, #0a1a2e)' },
                { id:'cars2', name:'Neon Racing', css:'linear-gradient(180deg, #000510, #0a1025, #1a0a25)' },
            ],
            minecraft: [
                { id:'mc1', name:'Grass Block', css:'repeating-linear-gradient(0deg, #3d8c40 0px, #3d8c40 20px, #4a9e4d 20px, #4a9e4d 22px, #5c3d1a 22px, #5c3d1a 28px)' },
                { id:'mc2', name:'Stone Pattern', css:'repeating-linear-gradient(45deg, #6b6b6b 0px, #6b6b6b 15px, #7a7a7a 15px, #7a7a7a 30px, #5a5a5a 30px, #5a5a5a 40px)' },
            ],
            nsfw: [
                { id:'nsfw1', name:'Anime Silhouette', css:'linear-gradient(150deg, #0a0a0a, #1a0a0a, #2d1a1a)', nsfw:true },
                { id:'nsfw2', name:'Dark Beauty', css:'linear-gradient(170deg, #000000, #0a0a1a, #1a0a1a)', nsfw:true },
            ]
        };
        for (const wp of wallpapers[cat] || []) {
            html += `<div class="wallpaper-item ${state.currentWallpaper===wp.id?'selected':''}" data-wallpaper="${wp.id}" ${wp.nsfw?'data-nsfw="true"':''}>
                <div class="wallpaper-preview" style="background:${wp.css}"></div>
                <div class="wallpaper-name">${wp.name}</div>
            </div>`;
        }
        html += `</div>`;
    }
    return html;
}

function initSettingsApp() {
    document.querySelectorAll('.settings-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.settings-nav-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            const section = btn.dataset.section;
            const content = document.getElementById('settingsContent');
            if (section === 'wallpapers') content.innerHTML = renderWallpaperSettings();
            else if (section === 'account') content.innerHTML = renderAccountSettings();
            else if (section === 'system') content.innerHTML = renderSystemSettings();
            attachWallpaperListeners();
        });
    });
    attachWallpaperListeners();
}

function attachWallpaperListeners() {
    document.querySelectorAll('.wallpaper-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.nsfw === 'true' && !state.ageVerified) {
                document.getElementById('ageGateOverlay').classList.add('active');
                return;
            }
            applyWallpaper(item.dataset.wallpaper);
            document.querySelectorAll('.wallpaper-item').forEach(i=>i.classList.remove('selected'));
            item.classList.add('selected');
            showNotification('Wallpaper changed', 'Applied: ' + item.querySelector('.wallpaper-name').textContent);
        });
    });
}

function renderAccountSettings() {
    return `<div style="padding:8px;"><h3>Account Settings</h3>
        <div style="display:flex;align-items:center;gap:12px;margin-top:12px;">
            <div class="msg-avatar" style="width:48px;height:48px;font-size:20px;">${(state.username||'?')[0].toUpperCase()}</div>
            <div><div style="font-weight:600;">${state.username||'No username set'}</div><div style="color:var(--text3);font-size:12px;">Oblivian User</div></div>
        </div>
        <button class="msg-send-btn" style="margin-top:16px;" onclick="logoutUser()">Log Out</button>
    </div>`;
}

function renderSystemSettings() {
    return `<div style="padding:8px;"><h3>System Settings</h3>
        <div style="font-size:13px;color:var(--text2);margin-top:12px;line-height:1.8;">
            OS Mode: <strong style="color:var(--accent);">${state.osType}</strong><br>
            Wallpaper: <strong style="color:var(--accent);">${state.currentWallpaper}</strong><br>
            Games: <strong style="color:var(--accent);">800,000+</strong><br>
            Open Windows: <strong style="color:var(--accent);">${Object.keys(state.openWindows).length}</strong>
        </div>
    </div>`;
}

function logoutUser() {
    state.username = null;
    localStorage.removeItem('oblivian_username');
    state.selectedChat = null;
    refreshWindow('settings');
    refreshWindow('messages');
    showNotification('Logged out', 'Username cleared');
}
