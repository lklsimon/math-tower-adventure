import { renderMainMenu } from './screens/mainMenu.js';
import { renderCharacterSelection } from './screens/characterSelection.js';
import { renderGameScreen } from './screens/gameScreen.js';
import { renderLeaderboard } from './screens/leaderboard.js';

// Game state
const gameState = {
    screen: 'menu',
    player: {
        name: '',
        character: null,
        maxHP: 10,
        currentHP: 10,
        correctCount: 0,
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

function switchScreen(screenName) {
    gameState.screen = screenName;
    const app = document.getElementById('app');
    
    switch(screenName) {
        case 'menu':
            renderMainMenu(app, gameState);
            break;
        case 'character':
            renderCharacterSelection(app, gameState);
            break;
        case 'game':
            renderGameScreen(app, gameState);
            break;
        case 'leaderboard':
            renderLeaderboard(app, gameState);
            break;
    }
}

export { gameState, MONSTERS, CHARACTERS, REWARDS, switchScreen };

// Start the game
switchScreen('menu');
