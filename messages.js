// messages.js
function renderMessagesApp() {
    if (!state.username) {
        return `
            <div class="msg-username-section">
                <h3>👋 Welcome to Oblivian Messages</h3>
                <p>Set your username to start chatting</p>
                <input class="msg-username-input" id="msgUsernameInput" placeholder="Choose username...">
                <button class="msg-send-btn" id="msgUsernameSubmit">Set Username</button>
            </div>
        `;
    }
    const contacts = Object.keys(state.users).filter(u => u !== state.username);
    const contactList = contacts.map(user => `
        <div class="msg-user-item ${state.selectedChat === user ? 'selected' : ''}" data-user="${user}">
            <div class="msg-avatar">${user[0].toUpperCase()}</div>
            <span>${user}</span>
        </div>
    `).join('');
    const chatArea = state.selectedChat ? renderChatArea(state.selectedChat) : '<div style="text-align:center;color:var(--text3);padding:40px;">Select a user to chat</div>';
    return `
        <div class="messages-app">
            <div class="messages-sidebar">
                <div style="font-size:11px;color:var(--text3);">Signed in as: <strong style="color:var(--accent);">${state.username}</strong></div>
                <input class="msg-search-input" id="msgSearchInput" placeholder="Search usernames..." autocomplete="off">
                <div style="flex:1;overflow-y:auto;" id="msgContactList">${contactList}</div>
            </div>
            <div class="messages-main">
                <div class="msg-chat-area" id="msgChatArea">${chatArea}</div>
                ${state.selectedChat ? `
                    <div class="msg-input-row">
                        <input class="msg-input" id="msgMessageInput" placeholder="Type a message...">
                        <button class="msg-send-btn" id="msgSendBtn">Send</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function renderChatArea(user) {
    const key1 = state.username + '|' + user;
    const key2 = user + '|' + state.username;
    const msgs = state.messages[key1] || state.messages[key2] || [];
    return msgs.map(msg => `
        <div class="msg-bubble ${msg.from === state.username ? 'sent' : 'received'}">
            ${msg.text}
            <span class="msg-timestamp">${msg.time}</span>
        </div>
    `).join('') || '<div style="text-align:center;color:var(--text3);padding:20px;">No messages yet.</div>';
}

function initMessagesApp() {
    const usernameSubmit = document.getElementById('msgUsernameSubmit');
    if (usernameSubmit) {
        usernameSubmit.addEventListener('click', () => {
            const name = document.getElementById('msgUsernameInput')?.value.trim();
            if (name && name.length >= 2) {
                state.username = name;
                localStorage.setItem('oblivian_username', name);
                state.users[name] = { online: true };
                localStorage.setItem('oblivian_users', JSON.stringify(state.users));
                showNotification('Username set!', 'You are now: ' + name);
                refreshWindow('messages');
            }
        });
    }
    const searchInput = document.getElementById('msgSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const list = document.getElementById('msgContactList');
            if (!list) return;
            const allUsers = Object.keys(state.users).filter(u => u !== state.username);
            const filtered = allUsers.filter(u => u.toLowerCase().includes(query));
            list.innerHTML = filtered.map(user => `
                <div class="msg-user-item ${state.selectedChat === user ? 'selected' : ''}" data-user="${user}">
                    <div class="msg-avatar">${user[0].toUpperCase()}</div>
                    <span>${user}</span>
                </div>
            `).join('') || '<div style="color:var(--text3);font-size:12px;padding:20px;">No users found</div>';
            attachContactListeners();
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query && !state.users[query]) {
                    state.users[query] = { online: true };
                    localStorage.setItem('oblivian_users', JSON.stringify(state.users));
                    showNotification('User found!', query + ' is now in your contacts');
                }
                state.selectedChat = query;
                refreshWindow('messages');
            }
        });
    }
    attachContactListeners();
    const sendBtn = document.getElementById('msgSendBtn');
    const msgInput = document.getElementById('msgMessageInput');
    if (sendBtn && msgInput) {
        const sendMessage = () => {
            const text = msgInput.value.trim();
            if (text && state.selectedChat) {
                const key = state.username + '|' + state.selectedChat;
                const altKey = state.selectedChat + '|' + state.username;
                const existingKey = state.messages[key] ? key : (state.messages[altKey] ? altKey : key);
                if (!state.messages[existingKey]) state.messages[existingKey] = [];
                state.messages[existingKey].push({ from: state.username, text, time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
                localStorage.setItem('oblivian_messages', JSON.stringify(state.messages));
                msgInput.value = '';
                refreshWindow('messages');
                setTimeout(() => simulateReply(state.selectedChat), 1500 + Math.random()*2500);
            }
        };
        sendBtn.addEventListener('click', sendMessage);
        msgInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
    }
}

function attachContactListeners() {
    document.querySelectorAll('.msg-user-item').forEach(item => {
        item.addEventListener('click', () => {
            state.selectedChat = item.dataset.user;
            refreshWindow('messages');
        });
    });
}

function simulateReply(user) {
    const key = state.username + '|' + user;
    const altKey = user + '|' + state.username;
    const existingKey = state.messages[key] ? key : (state.messages[altKey] ? altKey : key);
    if (!state.messages[existingKey]) state.messages[existingKey] = [];
    const replies = ['Hey! How are you? 😊', "That's cool!", 'LOL', 'Totally agree!', 'Nice!'];
    state.messages[existingKey].push({ from: user, text: replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) });
    localStorage.setItem('oblivian_messages', JSON.stringify(state.messages));
    refreshWindow('messages');
    showNotification('New message', user + ' sent you a message');
}

function refreshWindow(id) {
    const win = state.openWindows[id];
    if (!win) return;
    const content = win.el.querySelector('.window-content');
    switch(id) {
        case 'messages': content.innerHTML = renderMessagesApp(); initMessagesApp(); break;
        // other cases added by other files
    }
}
