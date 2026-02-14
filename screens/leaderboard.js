export function renderLeaderboard(app, gameState) {
    app.innerHTML = `
        <div class="leaderboard-screen">
            <div class="leaderboard-header">
                <div class="leaderboard-title">🏆 Leaderboard 🏆</div>
                <p class="leaderboard-subtitle">Top 15 Champions!</p>
            </div>
            <div class="leaderboard-container">
                ${gameState.leaderboard.length > 0 ? `
                    <div class="leaderboard-entries">
                        ${gameState.leaderboard.map((entry, index) => `
                            <div class="leaderboard-entry ${index < 3 ? 'top' : ''}" style="--rank-color: ${getRankColor(index)}">
                                <div class="entry-rank">
                                    ${index < 3 ? ['🥇', '🥈', '🥉'][index] : index + 1}
                                </div>
                                <div class="entry-name">${entry.name}</div>
                                <div class="entry-time">${formatTime(entry.time)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-leaderboard">
                        <div class="empty-icon">📋</div>
                        <p>No champions yet! Be the first!</p>
                    </div>
                `}
            </div>
            <button class="back-btn-large" onclick="goBack()">
                <span class="btn-icon">🔙</span>
                <span class="btn-text">Back to Menu</span>
            </button>
        </div>
    `;

    window.goBack = () => {
        const { switchScreen } = import('../main.js');
        switchScreen('menu');
    };
}

function getRankColor(index) {
    const colors = ['#ffd700', '#c0c0c0', '#cd7f32', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#2ecc71', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#c0392b'];
    return colors[index] || '#34495e';
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
