// Game State
const gameState = {
    screen: 'menu',
    player: {
        name: '',
        character: null,
        maxHP: 10,
        currentHP: 10,
        correctCount: 0,
        wrongCount: 0,
        doubleDamageStacks: 0,
        noTimeLimitStacks: 0
    },
    currentLevel: 1,
    monster: null,
    currentQuestion: null,
    timer: 30,
    timerInterval: null,
    startTime: null,
    leaderboard: JSON.parse(localStorage.getItem('leaderboard') || '[]')
};

// Monsters data
const MONSTERS = {
    1: { name: 'Slime', hp: 1, emoji: '🟢' },
    2: { name: 'Bat', hp: 2, emoji: '🦇' },
    3: { name: 'Imp', hp: 3, emoji: '👿' },
    4: { name: 'Skeleton Archer', hp: 5, emoji: '💀' },
    5: { type: 'reward' },
    6: { name: 'Skeleton Warrior', hp: 6, emoji: '⚔️' },
    7: { name: 'Giant Slime', hp: 7, emoji: '🟣' },
    8: { name: 'Stone Golem', hp: 7, emoji: '🗿' },
    9: { type: 'reward' },
    10: { name: 'Demon King', hp: 10, emoji: '👹' }
};

// Characters data
const CHARACTERS = {
    warrior: {
        name: 'Warrior',
        emoji: '🛡️',
        ability: 'Answering wrong only loses 0.5 HP',
        color: '#e74c3c'
    },
    mage: {
        name: 'Mage',
        emoji: '🧙',
        ability: 'Double damage every 3 correct answers (50% chance lose 2 HP on wrong answer)',
        color: '#9b59b6'
    },
    archer: {
        name: 'Archer',
        emoji: '🏹',
        ability: '5 seconds less time per question (50% chance no HP loss on wrong answer)',
        color: '#2ecc71'
    }
};

// Rewards
const REWARDS = [
    { name: 'Health Potion', emoji: '🧪', effect: 'heal2', description: 'Heal 2 HP' },
    { name: 'Power Potion', emoji: '⚡', effect: 'doubleDamage3', description: 'Double damage for next 3 questions' },
    { name: 'Hourglass', emoji: '⏳', effect: 'noTimeLimit3', description: 'No time limit for next 3 questions' }
];

// Define all functions first (for HTML onclick handlers)
function startGame() {
    switchScreen('character');
}

function showLeaderboard() {
    switchScreen('leaderboard');
}

function goBack() {
    switchScreen('menu');
}

function confirmCharacter() {
    const selectedCharacter = document.querySelector('.character-card.selected').dataset.character;
    gameState.player.character = CHARACTERS[selectedCharacter];
    gameState.player.currentHP = gameState.player.maxHP;
    gameState.currentLevel = 1;
    gameState.player.correctCount = 0;
    gameState.player.wrongCount = 0;
    gameState.player.doubleDamageStacks = 0;
    gameState.player.noTimeLimitStacks = 0;
    switchScreen('game');
}

function selectAnswer(answer) {
    clearInterval(gameState.timerInterval);
    
    if (answer === gameState.currentQuestion.correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function restartGame() {
    gameState.player.currentHP = gameState.player.maxHP;
    gameState.currentLevel = 1;
    gameState.player.correctCount = 0;
    gameState.player.wrongCount = 0;
    gameState.player.doubleDamageStacks = 0;
    gameState.player.noTimeLimitStacks = 0;
    gameState.monster = null;
    gameState.currentQuestion = null;
    gameState.startTime = null;
    switchScreen('game');
}

function goToMenu() {
    switchScreen('menu');
}

// Assign to window object so onclick handlers can find them
window.startGame = startGame;
window.showLeaderboard = showLeaderboard;
window.goBack = goBack;
window.confirmCharacter = confirmCharacter;
window.selectAnswer = selectAnswer;
window.restartGame = restartGame;
window.goToMenu = goToMenu;

// Switch screen
function switchScreen(screenName) {
    gameState.screen = screenName;
    const app = document.getElementById('app');
    
    switch(screenName) {
        case 'menu':
            renderMainMenu(app);
            break;
        case 'character':
            renderCharacterSelection(app);
            break;
        case 'game':
            renderGameScreen(app);
            break;
        case 'leaderboard':
            renderLeaderboard(app);
            break;
    }
}

// Main Menu
function renderMainMenu(app) {
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

    document.querySelectorAll('.star').forEach((star, index) => {
        star.style.animationDelay = `${index * 0.5}s`;
    });
}

// Character Selection
function renderCharacterSelection(app) {
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

    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.character-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            document.getElementById('confirmBtn').disabled = false;
            document.getElementById('confirmBtn').classList.remove('disabled');
        });
    });
}

// Game Screen
function renderGameScreen(app) {
    if (MONSTERS[gameState.currentLevel].type === 'reward') {
        renderRewardLevel(app);
        return;
    }

    const monster = MONSTERS[gameState.currentLevel];
    const isBoss = gameState.currentLevel === 10;
    
    if (!gameState.monster || gameState.monster.name !== monster.name) {
        gameState.monster = { name: monster.name, hp: monster.hp, maxHP: monster.hp, emoji: monster.emoji };
    }

    if (!gameState.currentQuestion) {
        gameState.currentQuestion = generateQuestion();
        gameState.startTime = gameState.startTime || Date.now();
    }

    const question = gameState.currentQuestion;
    const timeLimit = gameState.player.noTimeLimitStacks > 0 ? Infinity : 
        (gameState.player.character.name === 'Archer' ? 25 : 30);
    gameState.timer = timeLimit;


    app.innerHTML = `
        <div class="game-screen">
            <div class="game-header">
                <div class="level-indicator">
                    <span class="level-text">Level</span>
                    <span class="level-number">${gameState.currentLevel}</span>
                    ${isBoss ? '<span class="boss-badge">BOSS!</span>' : ''}
                </div>
            </div>

            <div class="battle-area">
                <div class="player-character">
                    <div class="character-sprite">${gameState.player.character.emoji}</div>
                    <div class="character-label">You</div>
                    <div class="hp-bar player-hp-bar">
                        <div class="hp-bar-inner" style="width: ${(gameState.player.currentHP / gameState.player.maxHP) * 100}%"></div>
                    </div>
                    <div class="hp-text">${gameState.player.currentHP}/${gameState.player.maxHP}</div>
                </div>

                <div class="vs-section">
                    <div class="level-badge">${gameState.currentLevel}</div>
                    <div class="vs-badge">⚔️</div>
                </div>

                <div class="monster ${isBoss ? 'boss' : ''}">
                    <div class="monster-sprite">${gameState.monster.emoji}</div>
                    <div class="monster-name">${gameState.monster.name}</div>
                    <div class="monster-hp-bar">
                        <div class="monster-hp-inner" style="width: ${(gameState.monster.hp / gameState.monster.maxHP) * 100}%"></div>
                    </div>
                    <div class="monster-hp-text">${gameState.monster.hp}/${gameState.monster.maxHP}</div>
                </div>
            </div>

            <div class="question-area">
                <div class="timer-container ${gameState.player.noTimeLimitStacks > 0 ? 'no-limit' : ''}">
                    <div class="timer-icon">⏱️</div>
                    <div class="timer-bar">
                        <div class="timer-bar-inner" id="timerBar" style="width: 100%"></div>
                    </div>
                    <div class="timer-text" id="timerText">${gameState.player.noTimeLimitStacks > 0 ? '∞' : '30'}</div>
                </div>

                <div class="question-box">
                    <div class="question-text">${question.question}</div>
                </div>

                <div class="answers-grid">
                    ${question.options.map((option) => `
                        <button class="answer-btn" onclick="selectAnswer(${option})" data-index="${option}">
                            ${option}
                        </button>
                    `).join('')}
                </div>

                <div class="active-effects">
                    ${gameState.player.doubleDamageStacks > 0 ? `
                        <div class="effect-badge damage">⚡ x${gameState.player.doubleDamageStacks}</div>
                    ` : ''}
                    ${gameState.player.noTimeLimitStacks > 0 ? `
                        <div class="effect-badge time">⏳ x${gameState.player.noTimeLimitStacks}</div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    startTimer();
}

function generateQuestion() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, correctAnswer;

    switch(operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            correctAnswer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 10;
            num2 = Math.floor(Math.random() * num1);
            correctAnswer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 9) + 1;
            num2 = Math.floor(Math.random() * 9) + 1;
            correctAnswer = num1 * num2;
            break;
    }

    const questionText = `${num1} ${operation === '*' ? '×' : operation} ${num2} = ?`;
    
    let options = [correctAnswer];
    while (options.length < 4) {
        let wrongAnswer = correctAnswer + (Math.floor(Math.random() * 21) - 10);
        if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
            options.push(wrongAnswer);
        }
    }
    
    options = options.sort(() => Math.random() - 0.5);

    return { question: questionText, options, correctAnswer };
}

function startTimer() {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    
    const timeLimit = gameState.player.noTimeLimitStacks > 0 ? Infinity : 
        (gameState.player.character.name === 'Archer' ? 25 : 30);
    
    if (timeLimit === Infinity) return;

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        
        const timerBar = document.getElementById('timerBar');
        const timerText = document.getElementById('timerText');
        
        if (timerBar && timerText) {
            const percentage = (gameState.timer / timeLimit) * 100;
            timerBar.style.width = `${percentage}%`;
            timerText.textContent = gameState.timer;
            
            if (gameState.timer <= 10) {
                timerBar.style.backgroundColor = '#e74c3c';
            } else if (gameState.timer <= 20) {
                timerBar.style.backgroundColor = '#f39c12';
            }
        }

        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            handleWrongAnswer();
        }
    }, 1000);
}

function handleCorrectAnswer() {
    gameState.player.correctCount++;
    
    let damage = 1;
    
    if (gameState.player.character.name === 'Mage' && gameState.player.correctCount % 3 === 0) {
        damage = 2;
    }
    
    if (gameState.player.doubleDamageStacks > 0) {
        damage *= 2;
        gameState.player.doubleDamageStacks--;
    }
    
    // Decrement noTimeLimitStacks (hourglass effect) on correct answer
    if (gameState.player.noTimeLimitStacks > 0) {
        gameState.player.noTimeLimitStacks--;
    }
    
    gameState.monster.hp -= damage;
    
    showDamageEffect(damage);
    
    gameState.currentQuestion = null;
    
    if (gameState.monster.hp <= 0) {
        setTimeout(() => {
            if (gameState.currentLevel === 10) {
                showVictory();
            } else {
                gameState.currentLevel++;
                renderGameScreen(document.getElementById('app'));
            }
        }, 500);
    } else {
        setTimeout(() => {
            renderGameScreen(document.getElementById('app'));
        }, 500);
    }
}

function handleWrongAnswer() {
    let damage = 1;
    
    if (gameState.player.character.name === 'Warrior') {
        damage = 0.5;
    }
    
    if (gameState.player.character.name === 'Mage') {
        if (Math.random() < 0.5) {
            damage = 2;
        }
    }
    
    if (gameState.player.character.name === 'Archer') {
        if (Math.random() < 0.5) {
            damage = 0;
        }
    }
    
    gameState.player.currentHP -= damage;
    gameState.player.wrongCount++;
    
    if (gameState.player.currentHP <= 0) {
        showGameOver();
        return;
    }
    
    gameState.currentQuestion = null;
    setTimeout(() => {
        renderGameScreen(document.getElementById('app'));
    }, 500);
}

function showDamageEffect(damage) {
    const damageText = document.createElement('div');
    damageText.className = 'damage-popup';
    damageText.textContent = damage === 1 ? '-1 HP' : `-${damage} HP`;
    damageText.style.position = 'fixed';
    damageText.style.left = '50%';
    damageText.style.top = '40%';
    damageText.style.transform = 'translateX(-50%)';
    damageText.style.fontSize = '2rem';
    damageText.style.fontWeight = 'bold';
    damageText.style.color = '#ff6b6b';
    damageText.style.zIndex = '1000';
    damageText.style.animation = 'floatUp 1s forwards';
    document.body.appendChild(damageText);
    
    setTimeout(() => damageText.remove(), 1000);
}

function renderRewardLevel(app) {
    // Fixed positions: left = heal, middle = doubleDamage, right = noTimeLimit
    app.innerHTML = `
        <div class="reward-screen">
            <div class="reward-header">
                <h2 class="reward-title">🎉 Reward Level! 🎉</h2>
                <p class="reward-subtitle">Choose a special reward!</p>
            </div>
            <div class="reward-cards fixed-positions">
                <div class="reward-card left" data-reward="heal2">
                    <div class="reward-emoji">${REWARDS[0].emoji}</div>
                    <div class="reward-name">${REWARDS[0].name}</div>
                    <div class="reward-desc">${REWARDS[0].description}</div>
                </div>
                <div class="reward-card middle" data-reward="doubleDamage3">
                    <div class="reward-emoji">${REWARDS[1].emoji}</div>
                    <div class="reward-name">${REWARDS[1].name}</div>
                    <div class="reward-desc">${REWARDS[1].description}</div>
                </div>
                <div class="reward-card right" data-reward="noTimeLimit3">
                    <div class="reward-emoji">${REWARDS[2].emoji}</div>
                    <div class="reward-name">${REWARDS[2].name}</div>
                    <div class="reward-desc">${REWARDS[2].description}</div>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('.reward-card').forEach(card => {
        card.addEventListener('click', () => {
            applyReward(card.dataset.reward);
        });
    });
}

function applyReward(effect) {
    switch(effect) {
        case 'heal2':
            gameState.player.currentHP = Math.min(gameState.player.currentHP + 2, gameState.player.maxHP);
            break;
        case 'doubleDamage3':
            gameState.player.doubleDamageStacks += 3;
            break;
        case 'noTimeLimit3':
            gameState.player.noTimeLimitStacks += 3;
            break;
    }
    
    gameState.currentLevel++;
    gameState.monster = null;
    renderGameScreen(document.getElementById('app'));
}

function showVictory() {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000);
    const totalQuestions = gameState.player.correctCount + gameState.player.wrongCount;
    const accuracy = totalQuestions > 0 ? Math.round((gameState.player.correctCount / totalQuestions) * 100) : 0;
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="victory-screen">
            <div class="victory-content">
                <div class="victory-emoji">🎊</div>
                <h1 class="victory-title">YOU WIN!</h1>
                <p class="victory-message">Congratulations! You defeated the Demon King!</p>
                <div class="stats-display">
                    <div class="time-display">
                        <div class="time-label">Total Time</div>
                        <div class="time-value">${formatTime(totalTime)}</div>
                    </div>
                    <div class="hp-display">
                        <div class="hp-label">Final HP</div>
                        <div class="hp-value">${gameState.player.currentHP}/${gameState.player.maxHP}</div>
                    </div>
                    <div class="accuracy-display">
                        <div class="accuracy-label">Accuracy</div>
                        <div class="accuracy-value">${accuracy}%</div>
                    </div>
                    <div class="character-display">
                        <div class="character-label">Character</div>
                        <div class="character-value">${gameState.player.character.emoji} ${gameState.player.character.name}</div>
                    </div>
                </div>
                <div class="name-input-container">
                    <input type="text" id="playerName" class="name-input" placeholder="Enter your name" maxlength="20">
                </div>
                <button class="submit-btn" onclick="submitScore(${totalTime}, ${accuracy})">
                    <span class="btn-text">Submit Score</span>
                </button>
            </div>
        </div>
    `;

    window.submitScore = (time, accuracy) => {
        const name = document.getElementById('playerName').value.trim() || 'Anonymous';
        
        const newScore = { 
            name, 
            time, 
            character: gameState.player.character.name,
            characterEmoji: gameState.player.character.emoji,
            finalHP: gameState.player.currentHP,
            maxHP: gameState.player.maxHP,
            accuracy: accuracy,
            correctCount: gameState.player.correctCount,
            wrongCount: gameState.player.wrongCount,
            date: new Date().toLocaleDateString() 
        };
        gameState.leaderboard.push(newScore);
        gameState.leaderboard.sort((a, b) => a.time - b.time);
        gameState.leaderboard = gameState.leaderboard.slice(0, 15);
        
        localStorage.setItem('leaderboard', JSON.stringify(gameState.leaderboard));
        
        switchScreen('leaderboard');
    };
}

function showGameOver() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="gameover-screen">
            <div class="gameover-content">
                <div class="gameover-emoji">💀</div>
                <h1 class="gameover-title">GAME OVER</h1>
                <p class="gameover-message">You reached Level ${gameState.currentLevel}</p>
                <div class="gameover-buttons">
                    <button class="restart-btn" onclick="restartGame()">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">Try Again</span>
                    </button>
                    <button class="menu-btn-small" onclick="goToMenu()">
                        <span class="btn-icon">🏠</span>
                        <span class="btn-text">Main Menu</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Leaderboard
function renderLeaderboard(app) {
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
                                <div class="entry-character">${entry.characterEmoji} ${entry.character}</div>
                                <div class="entry-stats">
                                    <div class="stat-item hp-stat">❤️ ${entry.finalHP}/${entry.maxHP}</div>
                                    <div class="stat-item accuracy-stat">🎯 ${entry.accuracy}%</div>
                                </div>
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
            <button class="back-btn-large" onclick="goToMenu()">
                <span class="btn-icon">🔙</span>
                <span class="btn-text">Back to Menu</span>
            </button>
        </div>
    `;
}

function getRankColor(index) {
    const colors = ['#ffd700', '#c0c0c0', '#cd7f32', '#3498db', '#9b59b6', '#e74c3c', '#f39c12', '#1abc9c', '#2ecc71', '#34495e', '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#c0392b'];
    return colors[index] || '#34495e';
}

// Initialize
switchScreen('menu');
