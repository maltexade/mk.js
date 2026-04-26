;(function () {

    var MobileGame = function () {
        this.currentScreen = 'menu';
        this.gameState = 'idle';
        this.isPaused = false;
        this.touchController = new TouchController();
        this.setupEventListeners();
        this.initializeGame();
    };

    MobileGame.prototype.setupEventListeners = function () {
        var self = this;

        // Menu buttons
        document.getElementById('startBtn').addEventListener('click', function () {
            self.startGame();
        });

        document.getElementById('instructionsBtn').addEventListener('click', function () {
            self.showScreen('instructions');
        });

        document.getElementById('aboutBtn').addEventListener('click', function () {
            self.showScreen('about');
        });

        document.getElementById('backFromInstructions').addEventListener('click', function () {
            self.showScreen('menu');
        });

        document.getElementById('backFromAbout').addEventListener('click', function () {
            self.showScreen('menu');
        });

        // Game controls
        document.getElementById('pauseBtn').addEventListener('click', function () {
            self.togglePause();
        });

        document.getElementById('resumeBtn').addEventListener('click', function () {
            self.togglePause();
        });

        document.getElementById('quitBtn').addEventListener('click', function () {
            self.quitGame();
        });

        document.getElementById('playAgainBtn').addEventListener('click', function () {
            self.startGame();
        });

        document.getElementById('menuBtn').addEventListener('click', function () {
            self.quitGame();
        });

        // Orientation change
        window.addEventListener('orientationchange', function () {
            setTimeout(function () {
                self.handleOrientationChange();
            }, 100);
        });
    };

    MobileGame.prototype.showScreen = function (screenName) {
        // Hide all screens
        var screens = document.querySelectorAll('.screen');
        screens.forEach(function (screen) {
            screen.classList.remove('active');
        });

        // Show the requested screen
        var screenMap = {
            'menu': 'menuScreen',
            'instructions': 'instructionsScreen',
            'about': 'aboutScreen',
            'game': 'gameScreen',
            'pause': 'pauseScreen',
            'gameover': 'gameOverScreen'
        };

        if (screenMap[screenName]) {
            document.getElementById(screenMap[screenName]).classList.add('active');
            this.currentScreen = screenName;
        }
    };

    MobileGame.prototype.initializeGame = function () {
        // Game will be initialized when player clicks start
        this.showScreen('menu');
    };

    MobileGame.prototype.startGame = function () {
        var self = this;
        this.showScreen('game');
        this.gameState = 'playing';
        this.isPaused = false;

        // Initialize the actual game
        var options = {
            gameType: 'multiplayer',
            arena: {
                container: document.getElementById('gameArena'),
                width: document.getElementById('gameArena').clientWidth,
                height: document.getElementById('gameArena').clientHeight,
                arena: mk.arenas.types.THRONE_ROOM
            },
            fighters: [
                { name: 'Sub-Zero' },
                { name: 'Kano' }
            ],
            callbacks: {
                attack: function (fighter, opponent, damage) {
                    self.onAttack(fighter, opponent, damage);
                },
                'game-end': function (loser) {
                    self.onGameEnd(loser);
                }
            }
        };

        mk.start(options).ready(function () {
            self.setupGameControls();
        });
    };

    MobileGame.prototype.setupGameControls = function () {
        var self = this;
        var pressed = {};

        this.touchController.onAction = function (action, state) {
            if (self.isPaused) return;

            var keyMap = {
                'up': mk.controllers.keys.p1.UP || 89,
                'down': mk.controllers.keys.p1.DOWN || 72,
                'left': mk.controllers.keys.p1.LEFT || 71,
                'right': mk.controllers.keys.p1.RIGHT || 74,
                'hp': mk.controllers.keys.p2.HP || 80,
                'lp': mk.controllers.keys.p2.LP || 219,
                'hk': mk.controllers.keys.p2.HK || 220,
                'lk': mk.controllers.keys.p2.LK || 221
            };

            if (state === 'press') {
                pressed[keyMap[action]] = true;
            } else {
                delete pressed[keyMap[action]];
            }

            self.updateGameControls(pressed);
        };
    };

    MobileGame.prototype.updateGameControls = function (pressed) {
        if (!mk.game) return;

        var game = mk.game;
        var m = mk.moves.types;
        var keys = mk.controllers.keys;

        // Update both fighters based on controls
        var move1 = this.getMove(pressed, keys.p1 || {}, 0);
        var move2 = this.getMove(pressed, keys.p2 || {}, 1);

        if (move1) game.fighters[0].setMove(move1);
        if (move2) game.fighters[1].setMove(move2);
    };

    MobileGame.prototype.getMove = function (pressed, keys, playerIndex) {
        if (!mk.game) return null;

        var m = mk.moves.types;
        var f = mk.game.fighters[playerIndex];
        if (!f) return null;

        var leftOrient = mk.fighters.orientations.LEFT;
        var rightOrient = mk.fighters.orientations.RIGHT;
        var orient = f.getOrientation();

        if (Object.keys(pressed).length === 0) {
            return m.STAND;
        }

        // Player 1 uses arrow keys (p1 keys)
        if (playerIndex === 0) {
            var p1Keys = mk.controllers.keys.p1 || { LEFT: 71, RIGHT: 74, UP: 89, DOWN: 72 };
            
            if (pressed[p1Keys.DOWN]) {
                return m.SQUAT;
            }
            if (pressed[p1Keys.LEFT]) {
                if (pressed[p1Keys.UP]) return m.BACKWARD_JUMP;
                return m.WALK_BACKWARD;
            }
            if (pressed[p1Keys.RIGHT]) {
                if (pressed[p1Keys.UP]) return m.FORWARD_JUMP;
                return m.WALK;
            }
            if (pressed[p1Keys.UP]) {
                return m.JUMP;
            }
        }
        // Player 2 uses attack buttons
        else {
            var p2Keys = mk.controllers.keys.p2 || { HP: 80, LP: 219, HK: 220, LK: 221 };
            
            if (pressed[p2Keys.HP]) {
                if (f.getMove().type === m.FORWARD_JUMP) return m.FORWARD_JUMP_PUNCH;
                if (f.getMove().type === m.BACKWARD_JUMP) return m.BACKWARD_JUMP_PUNCH;
                return m.HIGH_PUNCH;
            }
            if (pressed[p2Keys.LP]) {
                if (f.getMove().type === m.FORWARD_JUMP) return m.FORWARD_JUMP_PUNCH;
                if (f.getMove().type === m.BACKWARD_JUMP) return m.BACKWARD_JUMP_PUNCH;
                return m.LOW_PUNCH;
            }
            if (pressed[p2Keys.HK]) {
                if (f.getMove().type === m.FORWARD_JUMP) return m.FORWARD_JUMP_KICK;
                if (f.getMove().type === m.BACKWARD_JUMP) return m.BACKWARD_JUMP_KICK;
                return m.HIGH_KICK;
            }
            if (pressed[p2Keys.LK]) {
                if (f.getMove().type === m.FORWARD_JUMP) return m.FORWARD_JUMP_KICK;
                if (f.getMove().type === m.BACKWARD_JUMP) return m.BACKWARD_JUMP_KICK;
                return m.LOW_KICK;
            }
        }

        return m.STAND;
    };

    MobileGame.prototype.onAttack = function (fighter, opponent, damage) {
        this.updateHealthBars();
    };

    MobileGame.prototype.updateHealthBars = function () {
        if (!mk.game) return;

        var p1 = mk.game.fighters[0];
        var p2 = mk.game.fighters[1];

        if (p1) {
            var p1Health = (p1.getLife() / 100) * 100;
            document.getElementById('player1HealthFill').style.width = p1Health + '%';
            document.getElementById('player1HealthText').textContent = Math.max(0, p1.getLife()) + '/100';
        }

        if (p2) {
            var p2Health = (p2.getLife() / 100) * 100;
            document.getElementById('player2HealthFill').style.width = p2Health + '%';
            document.getElementById('player2HealthText').textContent = Math.max(0, p2.getLife()) + '/100';
        }
    };

    MobileGame.prototype.onGameEnd = function (loser) {
        this.gameState = 'over';
        var winner = loser.getName() === mk.game.fighters[0].getName() ? 'Player 2' : 'Player 1';
        var title = document.getElementById('gameOverTitle');
        var container = document.querySelector('.gameover-container');

        title.textContent = winner + ' WINS!';
        title.classList.remove('lose');
        container.classList.remove('lose');

        document.getElementById('gameOverStats').innerHTML = '<p>' + winner + ' is victorious!</p>';
        this.showScreen('gameover');
    };

    MobileGame.prototype.togglePause = function () {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showScreen('pause');
        } else {
            this.showScreen('game');
        }
    };

    MobileGame.prototype.quitGame = function () {
        this.gameState = 'idle';
        this.isPaused = false;
        
        // Clean up game
        if (mk.game) {
            mk.reset.call(mk.game);
            mk.game = null;
        }

        this.showScreen('menu');
    };

    MobileGame.prototype.handleOrientationChange = function () {
        if (mk.game && mk.game.arena) {
            var container = document.getElementById('gameArena');
            mk.game.arena.width = container.clientWidth;
            mk.game.arena.height = container.clientHeight;
        }
    };

    // Initialize on page load
    document.addEventListener('DOMContentLoaded', function () {
        window.mobileGame = new MobileGame();
    });

}());
