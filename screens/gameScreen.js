import { MONSTERS, CHARACTERS, REWARDS } from '../main.js';

export function renderGameScreen(app, gameState) {
    if (MONSTERS[gameState.currentLevel].type === 'reward') {
        renderRewardLevel(app, gameState);
        return;
    }

    const monster = MONSTERS[gameState.currentLevel];
    const isBoss = gameState.currentLevel === 10;
    
    // Initialize monster state
    if (!gameState.monster || gameState.monster.name !== monster.name) {
        gameState.monster = { name: monster.name, hp: monster.hp, maxHP: monster.hp, emoji: monster.emoji };
    }

    // Generate question if not exists
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
                <div class="player-info">
                    <div class="player-icon">${gameState.player.character.emoji}</div>
                    <div class="hp-bar">
                        <div class="hp-bar-inner" style="width: ${(gameState.player.currentHP / gameState.player.maxHP) * 100}%"></div>
                    </div>
                    <div class="hp-text">${gameState.player.currentHP}/${gameState.player.maxHP} HP</div>
                </div>
            </div>

            <div class="battle-area">
                <div class="player-character ${isBoss ? 'boss-battle' : ''}">
                    <div class="character-sprite">${gameState.player.character.emoji}</div>
                    <div class="character-label">You</div>
                </div>
                
                <div class="vs-badge">⚔️</div>
                
                <div class="monster ${isBoss ? 'boss' : ''}">
                    <div class="monster-sprite ${isBoss ? 'boss-anim' : ''}">${gameState.monster.emoji}</div>
                    <div class="monster-name">${gameState.monster.name}</div>
                    <div class="monster-hp-bar">
                        <div class="monster-hp-inner" style="width: ${(gameState.monster.hp / gameState.monster.maxHP) * 100}%"></div>
                    </div>
                    <div class="monster-hp-text">${gameState.monster.hp}/${gameState.monster.maxHP} HP</div>
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
                    ${question.options.map((option, index) => `
                        <button class="answer-btn" onclick="selectAnswer(${option})" data-index="${index}">
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

    // Start timer
    startTimer(gameState);

    window.selectAnswer = (answer) => {
        checkAnswer(gameState, answer);
    };
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
    
    // Generate wrong answers
    let options = [correctAnswer];
    while (options.length < 4) {
        let wrongAnswer = correctAnswer + (Math.floor(Math.random() * 21) - 10);
        if (wrongAnswer !== correctAnswer && !options.includes(wrongAnswer) && wrongAnswer >= 0) {
            options.push(wrongAnswer);
        }
    }
    
    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);

    return { question: questionText, options, correctAnswer };
}

function startTimer(gameState) {
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
            handleWrongAnswer(gameState, true);
        }
    }, 1000);
}

function checkAnswer(gameState, answer) {
    clearInterval(gameState.timerInterval);
    
    if (answer === gameState.currentQuestion.correctAnswer) {
        handleCorrectAnswer(gameState);
    } else {
        handleWrongAnswer(gameState, false);
    }
}

function handleCorrectAnswer(gameState) {
    gameState.player.correctCount++;
    
    // Calculate damage
    let damage = 1;
    
    // Mage double damage ability
    if (gameState.player.character.name === 'Mage' && gameState.player.correctCount % 3 === 0) {
        damage = 2;
    }
    
    // Double damage effect
    if (gameState.player.doubleDamageStacks > 0) {
        damage *= 2;
        gameState.player.doubleDamageStacks--;
    }
    
    // Apply damage to monster
    gameState.monster.hp -= damage;
    
    // Show damage effect
    showDamageEffect(damage);
    
    gameState.currentQuestion = null;
    
    if (gameState.monster.hp <= 0) {
        setTimeout(() => {
            if (gameState.currentLevel === 10) {
                showVictory(gameState);
            } else {
                gameState.currentLevel++;
                renderGameScreen(document.getElementById('app'), gameState);
            }
        }, 500);
    } else {
        setTimeout(() => {
            renderGameScreen(document.getElementById('app'), gameState);
        }, 500);
    }
}

function handleWrongAnswer(gameState, timeout) {
    let damage = 1;
    
    // Warrior ability: only 0.5 HP damage on wrong answer
    if (gameState.player.character.name === 'Warrior') {
        damage = 0.5;
    }
    
    // Mage ability: 50% chance to take 2 HP on wrong answer
    if (gameState.player.character.name === 'Mage') {
        if (Math.random() < 0.5) {
            damage = 2;
        }
    }
    
    // Archer ability: 50% chance no HP damage
    if (gameState.player.character.name === 'Archer') {
        if (Math.random() < 0.5) {
            damage = 0;
        }
    }
    
    gameState.player.currentHP -= damage;
    
    if (gameState.player.currentHP <= 0) {
        showGameOver(gameState);
        return;
    }
    
    gameState.currentQuestion = null;
    setTimeout(() => {
        renderGameScreen(document.getElementById('app'), gameState);
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

function renderRewardLevel(app, gameState) {
    const shuffledRewards = [...REWARDS].sort(() => Math.random() - 0.5);
    
    app.innerHTML = `
        <div class="reward-screen">
            <div class="reward-header">
                <h2 class="reward-title">🎉 Reward Level! 🎉</h2>
                <p class="reward-subtitle">Choose a special reward!</p>
            </div>
            <div class="reward-cards">
                ${shuffledRewards.map((reward, index) => `
                    <div class="reward-card" data-reward="${reward.effect}">
                        <div class="reward-emoji">${reward.emoji}</div>
                        <div class="reward-name">${reward.name}</div>
                        <div class="reward-desc">${reward.description}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.reward-card').forEach(card => {
        card.addEventListener('click', () => {
            applyReward(gameState, card.dataset.reward);
        });
    });
}

function applyReward(gameState, effect) {
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
    renderGameScreen(document.getElementById('app'), gameState);
}

function showVictory(gameState) {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - gameState.startTime) / 1000);
    
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="victory-screen">
            <div class="victory-content">
                <div class="victory-emoji">🎊</div>
                <h1 class="victory-title">YOU WIN!</h1>
                <p class="victory-message">Congratulations! You defeated the Demon King!</p>
                <div class="time-display">
                    <div class="time-label">Total Time</div>
                    <div class="time-value">${formatTime(totalTime)}</div>
                </div>
                <div class="name-input-container">
                    <input type="text" id="playerName" class="name-input" placeholder="Enter your name" maxlength="20">
                </div>
                <button class="submit-btn" onclick="submitScore(${totalTime})">
                    <span class="btn-text">Submit Score</span>
                </button>
            </div>
            <div class="confetti"></div>
        </div>
    `;

    window.submitScore = (time) => {
        const name = document.getElementById('playerName').value.trim() || 'Anonymous';
        
        const newScore = { name, time, date: new Date().toLocaleDateString() };
        gameState.leaderboard.push(newScore);
        gameState.leaderboard.sort((a, b) => a.time - b.time);
        gameState.leaderboard = gameState.leaderboard.slice(0, 15);
        
        localStorage.setItem('leaderboard', JSON.stringify(gameState.leaderboard));
        
        const { switchScreen } = import('../main.js');
        switchScreen('leaderboard');
    };
}

function showGameOver(gameState) {
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

    window.restartGame = () => {
        const { switchScreen } = import('../main.js');
        gameState.player.currentHP = gameState.player.maxHP;
        gameState.currentLevel = 1;
        gameState.player.correctCount = 0;
        gameState.player.doubleDamageStacks = 0;
        gameState.player.noTimeLimitStacks = 0;
        gameState.monster = null;
        gameState.currentQuestion = null;
        gameState.startTime = null;
        switchScreen('game');
    };

    window.goToMenu = () => {
        const { switchScreen } = import('../main.js');
        switchScreen('menu');
    };
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
