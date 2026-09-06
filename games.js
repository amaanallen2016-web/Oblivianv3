// games.js
function renderGamesApp() {
    const genres = ['all', ...new Set(window.gamesData.map(g => g.genre))];
    const filtered = window.gamesData.filter(g => 
        (state.gamesFilter === 'all' || g.genre === state.gamesFilter) &&
        (g.title.toLowerCase().includes(state.gamesSearch.toLowerCase()))
    );
    return `
        <div class="games-app">
            <div class="games-header">
                <input class="games-search" id="gamesSearchInput" placeholder="Search 800,000+ games..." value="${state.gamesSearch}">
                <select class="games-filter-select" id="gamesFilterSelect">
                    ${genres.map(g => `<option value="${g}" ${state.gamesFilter===g?'selected':''}>${g==='all'?'All Genres':g}</option>`).join('')}
                </select>
            </div>
            <div class="games-count">Showing ${filtered.length} of 800,000+ games</div>
            <div class="games-grid">
                ${filtered.slice(0, 80).map(g => `
                    <div class="game-card">
                        <div class="game-art">${g.icon}</div>
                        <div class="game-title">${g.title}</div>
                        <div class="game-genre">${g.genre} · ${g.year}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function initGamesApp() {
    const searchInput = document.getElementById('gamesSearchInput');
    const filterSelect = document.getElementById('gamesFilterSelect');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.gamesSearch = searchInput.value;
            refreshWindow('games');
        });
    }
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            state.gamesFilter = filterSelect.value;
            refreshWindow('games');
        });
    }
}
