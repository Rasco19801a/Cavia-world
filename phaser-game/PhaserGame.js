// Main Phaser Game Configuration and Initialization
class PhaserGuineaPigGame {
    constructor() {
        this.config = {
            type: Phaser.AUTO,
            width: 640,
            height: 480,
            parent: 'game',
            backgroundColor: '#87CEEB',
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [
                BootScene,
                CustomizationScene,
                VillageScene,
                VetScene,
                FarmScene,
                ShopScene,
                GroomingScene
            ],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                min: {
                    width: 320,
                    height: 240
                },
                max: {
                    width: 1280,
                    height: 960
                }
            },
            input: {
                gamepad: true
            },
            render: {
                antialias: false,
                pixelArt: true
            }
        };

        this.game = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.createGame());
        } else {
            this.createGame();
        }
    }

    createGame() {
        // Create the Phaser game instance
        this.game = new Phaser.Game(this.config);

        // Setup global error handling
        this.setupErrorHandling();

        // Setup mobile optimizations
        this.setupMobileOptimizations();

        // Setup pause/resume functionality
        this.setupPauseResume();
    }

    setupErrorHandling() {
        // Handle Phaser errors gracefully
        window.addEventListener('error', (event) => {
            console.error('Game Error:', event.error);
            this.showErrorMessage('An error occurred. Please refresh the page.');
        });

        // Handle WebGL context loss
        this.game.canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            console.warn('WebGL context lost');
            this.showErrorMessage('Graphics context lost. Please refresh the page.');
        });
    }

    setupMobileOptimizations() {
        // Prevent zoom on mobile
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        });

        // Prevent context menu on long touch
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.game.scale.refresh();
            }, 100);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.game.scale.refresh();
        });
    }

    setupPauseResume() {
        // Pause game when window loses focus
        window.addEventListener('blur', () => {
            if (this.game && this.game.scene.isActive('VillageScene')) {
                this.game.scene.pause('VillageScene');
            }
        });

        // Resume game when window gains focus
        window.addEventListener('focus', () => {
            if (this.game && this.game.scene.isPaused('VillageScene')) {
                this.game.scene.resume('VillageScene');
            }
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden
                if (this.game && this.game.scene.isActive('VillageScene')) {
                    this.game.scene.pause('VillageScene');
                }
            } else {
                // Page is visible
                if (this.game && this.game.scene.isPaused('VillageScene')) {
                    this.game.scene.resume('VillageScene');
                }
            }
        });
    }

    showErrorMessage(message) {
        // Create error overlay
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.width = '100%';
        errorDiv.style.height = '100%';
        errorDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        errorDiv.style.color = 'white';
        errorDiv.style.display = 'flex';
        errorDiv.style.alignItems = 'center';
        errorDiv.style.justifyContent = 'center';
        errorDiv.style.fontSize = '18px';
        errorDiv.style.fontFamily = 'monospace';
        errorDiv.style.zIndex = '10000';
        errorDiv.style.cursor = 'pointer';
        
        errorDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 20px;">⚠️ Error</div>
                <div style="margin-bottom: 20px;">${message}</div>
                <div style="font-size: 14px; opacity: 0.8;">Click to dismiss</div>
            </div>
        `;

        errorDiv.addEventListener('click', () => {
            document.body.removeChild(errorDiv);
        });

        document.body.appendChild(errorDiv);
    }

    // Public methods for external control
    pauseGame() {
        if (this.game) {
            this.game.scene.pause();
        }
    }

    resumeGame() {
        if (this.game) {
            this.game.scene.resume();
        }
    }

    restartGame() {
        if (this.game) {
            this.game.scene.start('BootScene');
        }
    }

    destroyGame() {
        if (this.game) {
            this.game.destroy(true);
            this.game = null;
        }
    }
}

// Initialize the game when the script loads
window.addEventListener('load', () => {
    // Create global game instance
    window.phaserGame = new PhaserGuineaPigGame();
    
    // Update HUD initially
    if (window.gameData) {
        window.gameData.updateHUD();
        window.gameData.updateInventoryDisplay();
    }
    
    console.log('🐹 Guinea Pig Village - Phaser Edition loaded!');
    console.log('Features:');
    console.log('- Hardware-accelerated graphics with Phaser 3');
    console.log('- Improved performance and animations');
    console.log('- Procedural pixel art generation');
    console.log('- Enhanced audio with Web Audio API');
    console.log('- Mobile-optimized touch controls');
    console.log('- Responsive scaling and pixel-perfect rendering');
});