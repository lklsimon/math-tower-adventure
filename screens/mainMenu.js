export function renderMainMenu(app, gameState) {
    app.innerHTML = `
        <div class="menu-screen">
            <div class="menu-content">
                <h1 class="game-title">
                    <span class="title-word">Math</span>
                    <span class="title-word rainbow">Tower</span>
                    <span class="title-word">Adventure</span>
                </h1>
                <div class="menu-decoration">
                    <div class="tower-icon">🏰</div>
                </div>
                <div class="menu-buttons">
                    <button class="menu-btn play-btn" onclick="startGame()">
                        <span class="btn-icon">🎮</span>
                        <span class="btn-text">Start Game</span>
                    </button>
                    <button class="menu-btn leaderboard-btn" onclick="showLeaderboard()">
                        <span class="btn-icon">🏆</span>
                        <span class="btn-text">Leaderboard</span>
                    </button>
                </div>
                <div class="floating-elements">
                    <div class="star star-1">⭐</div>
                    <div class="star star-2">✨</div>
                    <div class="star star-3">⭐</div>
                </div>
            </div>
        </div>
    `;

    // Add floating animation to stars
    document.querySelectorAll('.star').forEach((star, index) => {
        star.style.animationDelay = `${index * 0.5}s`;
    });

    // Global functions
    window.startGame = () => {
        const { switchScreen } = await import('../main.js');
        switchScreen('character');
    };

    window.showLeaderboard = () => {
        const { switchScreen } = await import('../main.js');
        switchScreen('leaderboard');
    };
}
