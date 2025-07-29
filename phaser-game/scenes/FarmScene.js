class FarmScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FarmScene' });
    }

    init(data) {
        this.returnData = data;
    }

    create() {
        // Create green farm background
        this.add.rectangle(320, 240, 640, 480, 0x228B22);
        
        // Game variables
        this.carrots = [];
        this.collected = 0;
        this.target = 5;
        this.timeLimit = 10;
        this.timeLeft = this.timeLimit;
        this.gameActive = false;
        this.crosshair = null;
        
        // Create UI
        this.createUI();
        
        // Setup input
        this.actionKey = this.input.keyboard.addKey('E');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escapeKey = this.input.keyboard.addKey('ESC');
        
        // Start game after a brief delay
        this.time.delayedCall(1000, () => {
            this.startGame();
        });
    }

    createUI() {
        // Title
        this.add.text(320, 50, 'Boerderij - Carrot Collection', {
            fontSize: '24px',
            fill: '#8B4513',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(320, 80, 'Collect 5 carrots within 10 seconds!', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(320, 100, 'Press SPACE or E when near a carrot', {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Score display
        this.scoreText = this.add.text(50, 150, `Collected: 0/${this.target}`, {
            fontSize: '18px',
            fill: '#8B4513',
            fontFamily: 'monospace',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        });
        
        // Timer display
        this.timerText = this.add.text(590, 150, `Time: ${this.timeLeft}s`, {
            fontSize: '18px',
            fill: '#8B4513',
            fontFamily: 'monospace',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        }).setOrigin(1, 0);
        
        // Exit button
        const exitBtn = this.add.text(590, 50, 'ESC: Exit', {
            fontSize: '14px',
            fill: '#FFFFFF',
            backgroundColor: '#8B4513',
            padding: { x: 8, y: 4 }
        }).setOrigin(1, 0).setInteractive();
        
        exitBtn.on('pointerdown', () => this.exitGame());
    }

    startGame() {
        this.gameActive = true;
        
        // Create crosshair (player indicator)
        this.crosshair = this.add.graphics();
        this.crosshair.lineStyle(3, 0xFF0000);
        this.crosshair.beginPath();
        this.crosshair.moveTo(-10, 0);
        this.crosshair.lineTo(10, 0);
        this.crosshair.moveTo(0, -10);
        this.crosshair.lineTo(0, 10);
        this.crosshair.strokePath();
        this.crosshair.setPosition(320, 240);
        
        // Setup crosshair movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Create carrots
        this.spawnCarrots();
        
        // Start timer
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Show start message
        const startText = this.add.text(320, 240, 'GO!', {
            fontSize: '48px',
            fill: '#00FF00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: 0,
            scale: 3,
            duration: 1000,
            onComplete: () => startText.destroy()
        });
    }

    spawnCarrots() {
        const numberOfCarrots = 8; // More than needed for variety
        
        for (let i = 0; i < numberOfCarrots; i++) {
            const x = Phaser.Math.Between(100, 540);
            const y = Phaser.Math.Between(200, 400);
            
            const carrot = this.add.sprite(x, y, 'carrot');
            carrot.setScale(2);
            carrot.setInteractive();
            
            // Add hover effect
            carrot.on('pointerover', () => {
                carrot.setTint(0xFFFFAA);
            });
            
            carrot.on('pointerout', () => {
                carrot.clearTint();
            });
            
            // Add bobbing animation
            this.tweens.add({
                targets: carrot,
                y: carrot.y - 5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.carrots.push(carrot);
        }
    }

    update() {
        if (!this.gameActive || !this.crosshair) return;
        
        // Move crosshair
        const speed = 3;
        
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.crosshair.x -= speed;
        }
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.crosshair.x += speed;
        }
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.crosshair.y -= speed;
        }
        if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.crosshair.y += speed;
        }
        
        // Keep crosshair in bounds
        this.crosshair.x = Phaser.Math.Clamp(this.crosshair.x, 50, 590);
        this.crosshair.y = Phaser.Math.Clamp(this.crosshair.y, 180, 420);
        
        // Check for collection input
        if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
            Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.tryCollectCarrot();
        }
        
        // Check exit
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.exitGame();
        }
    }

    tryCollectCarrot() {
        if (!this.gameActive) return;
        
        // Find nearest carrot within collection range
        let nearestCarrot = null;
        let nearestDistance = Infinity;
        const collectionRange = 40;
        
        this.carrots.forEach(carrot => {
            if (!carrot.active) return;
            
            const distance = Phaser.Math.Distance.Between(
                this.crosshair.x, this.crosshair.y,
                carrot.x, carrot.y
            );
            
            if (distance < collectionRange && distance < nearestDistance) {
                nearestDistance = distance;
                nearestCarrot = carrot;
            }
        });
        
        if (nearestCarrot) {
            this.collectCarrot(nearestCarrot);
        } else {
            // Miss sound
            this.playSound('miss');
        }
    }

    collectCarrot(carrot) {
        // Remove carrot
        carrot.setActive(false).setVisible(false);
        
        // Update score
        this.collected++;
        this.scoreText.setText(`Collected: ${this.collected}/${this.target}`);
        
        // Play collect sound
        this.playSound('collect');
        
        // Collection effect
        const collectText = this.add.text(carrot.x, carrot.y, '+1', {
            fontSize: '20px',
            fill: '#00FF00',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: collectText,
            y: collectText.y - 30,
            alpha: 0,
            duration: 800,
            onComplete: () => collectText.destroy()
        });
        
        // Check win condition
        if (this.collected >= this.target) {
            this.winGame();
        }
    }

    updateTimer() {
        if (!this.gameActive) return;
        
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}s`);
        
        // Time warning colors
        if (this.timeLeft <= 3) {
            this.timerText.setStyle({ fill: '#FF0000' });
        } else if (this.timeLeft <= 5) {
            this.timerText.setStyle({ fill: '#FF6600' });
        }
        
        if (this.timeLeft <= 0) {
            this.loseGame();
        }
    }

    winGame() {
        this.gameActive = false;
        this.gameTimer.remove();
        
        // Award coins
        const coinsEarned = 10;
        gameData.addCoins(coinsEarned);
        
        // Play win sound
        this.playSound('win');
        
        // Show win message
        const winText = this.add.text(320, 240, `Success!\n+${coinsEarned} Carrots!`, {
            fontSize: '32px',
            fill: '#00FF00',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: winText,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 2
        });
        
        // Return to village after delay
        this.time.delayedCall(3000, () => {
            this.scene.start('VillageScene', this.returnData);
        });
    }

    loseGame() {
        this.gameActive = false;
        this.gameTimer.remove();
        
        // Play lose sound
        this.playSound('lose');
        
        // Show lose message
        const loseText = this.add.text(320, 240, 'Time\'s up!\nTry again?', {
            fontSize: '28px',
            fill: '#FF0000',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        // Return to village after delay
        this.time.delayedCall(2000, () => {
            this.scene.start('VillageScene', this.returnData);
        });
    }

    exitGame() {
        this.scene.start('VillageScene', this.returnData);
    }

    playSound(type) {
        if (!window.audioContext) return;
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        switch(type) {
            case 'collect':
                oscillator.frequency.setValueAtTime(440, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, window.audioContext.currentTime + 0.1);
                break;
            case 'miss':
                oscillator.frequency.setValueAtTime(220, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, window.audioContext.currentTime + 0.2);
                break;
            case 'win':
                oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(784, window.audioContext.currentTime + 0.4);
                break;
            case 'lose':
                oscillator.frequency.setValueAtTime(330, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(165, window.audioContext.currentTime + 0.5);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.5);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.5);
    }
}