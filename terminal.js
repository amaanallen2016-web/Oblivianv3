// terminal.js
function renderTerminalApp() {
    return `
        <div class="terminal" id="terminalOutput">
            <div>Oblivian OS Terminal v2.1</div>
            <div>Type <span class="prompt">help</span> for commands</div>
            <div style="margin-top:8px;"><span class="prompt">$</span> <span class="cursor"></span></div>
        </div>
    `;
}

function initTerminalApp() {
    const output = document.getElementById('terminalOutput');
    if (!output) return;
    const commands = {
        help: 'Commands: help, about, whoami, ls, clear, date, echo, games, users, status',
        about: 'Oblivian OS v2.1 — CineOS-style.',
        whoami: state.username || 'guest',
        ls: 'Messages.txt  Games/  Proxy/  Settings/  Terminal/  Music/  OM/  Songs/',
        clear: '__CLEAR__',
        date: new Date().toString(),
        echo: (args) => args.join(' '),
        games: '800,000+ games available',
        users: Object.keys(state.users).join(', '),
        status: `OS: ${state.osType} | Wallpaper: ${state.currentWallpaper}`
    };
    let commandBuffer = '';
    output.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = commandBuffer.trim();
            commandBuffer = '';
            executeCommand(cmd);
        } else if (e.key === 'Backspace') {
            commandBuffer = commandBuffer.slice(0, -1);
        } else if (e.key.length === 1) {
            commandBuffer += e.key;
        }
    });
    function executeCommand(cmd) {
        if (!cmd) return;
        const parts = cmd.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        if (command === 'clear') {
            output.innerHTML = '<div>Oblivian OS Terminal v2.1</div><div>Type <span class="prompt">help</span> for commands</div>';
            return;
        }
        let result = '';
        if (commands[command]) result = typeof commands[command] === 'function' ? commands[command](args) : commands[command];
        else result = 'Command not found: ' + command;
        output.innerHTML += `<div><span class="prompt">$</span> ${cmd}</div><div class="output">${result}</div>`;
        output.innerHTML += `<div><span class="prompt">$</span> <span class="cursor"></span></div>`;
        output.scrollTop = output.scrollHeight;
    }
}
