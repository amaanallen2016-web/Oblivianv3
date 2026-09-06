// om.js
function renderOMApp() {
    const categories = {
        all: 'All',
        movie: 'Movies',
        tv: 'TV Shows',
        anime: 'Anime'
    };
    const filtered = window.moviesData.filter(m => 
        (state.omCategory === 'all' || m.type.toLowerCase() === state.omCategory) &&
        m.title.toLowerCase().includes(state.omSearchQuery.toLowerCase())
    );
    // Group by genre for rows
    const rows = {};
    filtered.forEach(m => {
        if (!rows[m.genre]) rows[m.genre] = [];
        rows[m.genre].push(m);
    });
    let rowsHTML = '';
    for (const genre in rows) {
        rowsHTML += `
            <div class="om-row">
                <div class="om-row-title">${genre}</div>
                <div class="om-row-scroll">
                    ${rows[genre].map(m => `
                        <div class="om-card">
                            <div class="om-card-img">${m.img}</div>
                            <div class="om-card-title">${m.title}</div>
                            <div class="om-card-type">${m.type} · ${m.year}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    return `
        <div class="om-app">
            <div class="om-nav">
                <div class="om-logo">OM</div>
                <div class="om-nav-links">
                    <a href="#" onclick="event.preventDefault(); setOMCategory('all')">Home</a>
                    <a href="#" onclick="event.preventDefault(); setOMCategory('movie')">Movies</a>
                    <a href="#" onclick="event.preventDefault(); setOMCategory('tv')">TV Shows</a>
                    <a href="#" onclick="event.preventDefault(); setOMCategory('anime')">Anime</a>
                </div>
                <input class="om-search" id="omSearchInput" placeholder="Search every show, movie, anime..." value="${state.omSearchQuery}">
            </div>
            <div style="padding:20px; overflow-y:auto;">
                ${rowsHTML || '<div style="color:var(--text3);text-align:center;padding:40px;">No results found</div>'}
            </div>
        </div>
    `;
}

function setOMCategory(cat) {
    state.omCategory = cat;
    refreshWindow('om');
}

function initOMApp() {
    const searchInput = document.getElementById('omSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            state.omSearchQuery = searchInput.value;
            refreshWindow('om');
        });
    }
    document.querySelectorAll('.om-card').forEach(card => {
        card.addEventListener('click', () => {
            showNotification('Now Playing', card.querySelector('.om-card-title').textContent);
        });
    });
}
