// songs.js
function renderSongsApp() {
    const filtered = window.songsData.filter(s => 
        s.title.toLowerCase().includes(state.songsSearchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(state.songsSearchQuery.toLowerCase())
    );
    return `
        <div class="songs-app">
            <div class="songs-sidebar">
                <div class="songs-logo">Oblivian Songs</div>
                <div class="songs-nav">
                    <div class="songs-nav-item active">Home</div>
                    <div class="songs-nav-item">Search</div>
                    <div class="songs-nav-item">Your Library</div>
                </div>
            </div>
            <div class="songs-main">
                <div class="songs-header">
                    <input class="songs-search" id="songsSearchInput" placeholder="Search for any song, artist..." value="${state.songsSearchQuery}">
                </div>
                <div class="songs-grid">
                    ${filtered.slice(0, 80).map(song => `
                        <div class="song-card">
                            <div class="song-art">${song.img}</div>
                            <div class="song-title">${song.title}</div>
                            <div class="song-artist">${song.artist}</div>
                            <div class="song-play-btn">▶</div>
                        </div>
                    `).join('')}
                </div>
                ${filtered.length > 80 ? `<div style="text-align:center;color:var(--text3);padding:20px;">Showing 80 of ${filtered.length} results</div>` : ''}
            </div>
        </div>
    `;
}

function initSongsApp() {
    const searchInput = document.getElementById('songsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.songsSearchQuery = searchInput.value;
            refreshWindow('songs');
        });
    }
    document.querySelectorAll('.song-card').forEach(card => {
        card.addEventListener('click', () => {
            showNotification('Now Playing', card.querySelector('.song-title').textContent + ' - ' + card.querySelector('.song-artist').textContent);
        });
    });
}
