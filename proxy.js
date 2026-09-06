// proxy.js
function renderProxyApp() {
    const currentUrl = state.proxyHistory[state.proxyIndex] || 'https://www.google.com';
    return `
        <div class="proxy-app">
            <div class="proxy-url-bar">
                <button class="proxy-btn" id="proxyBackBtn">←</button>
                <button class="proxy-btn" id="proxyFwdBtn">→</button>
                <input class="proxy-url-input" id="proxyUrlInput" placeholder="Enter URL or search..." value="${currentUrl}">
                <button class="proxy-btn" id="proxyGoBtn">GO</button>
            </div>
            <div class="proxy-frame"><iframe id="proxyIframe" src="${currentUrl}" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe></div>
            <div class="proxy-hint">🌐 Oblivian Proxy — Browse freely. All sites unblocked.</div>
        </div>
    `;
}

function initProxyApp() {
    const urlInput = document.getElementById('proxyUrlInput');
    const goBtn = document.getElementById('proxyGoBtn');
    const backBtn = document.getElementById('proxyBackBtn');
    const fwdBtn = document.getElementById('proxyFwdBtn');
    const iframe = document.getElementById('proxyIframe');
    const navigate = () => {
        let url = urlInput.value.trim();
        if (!url) return;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (url.includes('.') && !url.includes(' ')) url = 'https://' + url;
            else url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }
        iframe.src = url;
        state.proxyHistory.push(url);
        state.proxyIndex = state.proxyHistory.length - 1;
        urlInput.value = url;
    };
    goBtn?.addEventListener('click', navigate);
    urlInput?.addEventListener('keydown', e => { if(e.key==='Enter') navigate(); });
    backBtn?.addEventListener('click', () => {
        if (state.proxyIndex > 0) { state.proxyIndex--; urlInput.value = state.proxyHistory[state.proxyIndex]; iframe.src = state.proxyHistory[state.proxyIndex]; }
    });
    fwdBtn?.addEventListener('click', () => {
        if (state.proxyIndex < state.proxyHistory.length - 1) { state.proxyIndex++; urlInput.value = state.proxyHistory[state.proxyIndex]; iframe.src = state.proxyHistory[state.proxyIndex]; }
    });
}
