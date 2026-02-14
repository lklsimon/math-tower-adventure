export function renderCharacterSelection(app, gameState) {
    app.innerHTML = `
        <div class="character-selection">
            <div class="selection-header">
                <h2 class="selection-title">Choose Your Hero!</h2>
                <p class="selection-subtitle">Select a character to begin your adventure</p>
            </div>
            <div class="character-cards">
                <div class="character-card" data-character="warrior" style="--accent-color: #e74c3c;">
                    <div class="character-emoji">🛡️</div>
                    <div class="character-name">Warrior</div>
                    <div class="character-ability">
                        <div class="ability-icon">💪</div>
                        <div class="ability-text">Wrong answer loses only 0.5 HP</div>
                    </div>
                </div>
                <div class="character-card" data-character="mage" style="--accent-color: #9b59b6;">
                    <div class="character-emoji">🧙</div>
                    <div class="character-name">Mage</div>
                    <div class="character-ability">
                        <div class="ability-icon">⚡</div>
                        <div class="ability-text">Double damage every 3 correct answers! (50% chance lose 2 HP on wrong)</div>
                    </div>
                </div>
                <div class="character-card" data-character="archer" style="--accent-color: #2ecc71;">
                    <div class="character-emoji">🏹</div>
                    <div class="character-name">Archer</div>
                    <div class="character-ability">
                        <div class="ability-icon">🎯</div>
                        <div class="ability-text">5 seconds less per question (50% chance no HP loss on wrong)</div>
                    </div>
                </div>
            </div>
            <div class="selection-footer">
                <button class="back-btn" onclick="goBack()">
                    <span class="btn-icon">🔙</span>
                    <span class="btn-text">Back</span>
                </button>
                <button class="confirm-btn disabled" id="confirmBtn" onclick="confirmCharacter()" disabled>
                    <span class="btn-icon">✓</span>
                    <span class="btn-text">Confirm</span>
                </button>
            </div>
        </div>
    `;

    let selectedCharacter = null;

    // Character selection
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCharacter = card.dataset.character;
            document.getElementById('confirmBtn').disabled = false;
            document.getElementById('confirmBtn').classList.remove('disabled');
        });
    });

    window.goBack = () => {
        const { switchScreen } = import('../main.js');
        switchScreen('menu');
    };

    window.confirmCharacter = () => {
        const { CHARACTERS, switchScreen } = import('../main.js');
        gameState.player.character = CHARACTERS[selectedCharacter];
        gameState.player.currentHP = gameState.player.maxHP;
        gameState.currentLevel = 1;
        gameState.player.correctCount = 0;
        gameState.player.doubleDamageStacks = 0;
        gameState.player.noTimeLimitStacks = 0;
        switchScreen('game');
    };
}
