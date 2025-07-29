class VetScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VetScene' });
    }

    init(data) {
        this.returnData = data;
    }

    create() {
        // Create medical background
        this.add.rectangle(320, 240, 640, 480, 0xF0F8FF);
        
        // Game variables
        this.gameActive = false;
        this.barPosition = 0;
        this.barDirection = 1;
        this.greenZoneStart = 0.4;
        this.greenZoneEnd = 0.6;
        this.barSpeed = 0.8;
        this.attempts = 0;
        this.maxAttempts = 3;
        this.success = false;
        
        // Create UI
        this.createUI();
        
        // Setup input
        this.actionKey = this.input.keyboard.addKey('E');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escapeKey = this.input.keyboard.addKey('ESC');
        
        // Start game after delay
        this.time.delayedCall(1500, () => {
            this.startGame();
        });
    }

    createUI() {
        // Title
        this.add.text(320, 50, 'Dierenarts - Health Check-up', {
            fontSize: '24px',
            fill: '#8B0000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(320, 80, 'Press SPACE when the red bar hits the green zone!', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(320, 100, 'Perfect timing earns a health star!', {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Create timing bar background
        this.barBackground = this.add.rectangle(320, 200, 400, 30, 0x888888);
        this.barBackground.setStrokeStyle(3, 0x000000);
        
        // Green zone
        const greenZoneWidth = 400 * (this.greenZoneEnd - this.greenZoneStart);
        const greenZoneX = 320 + 400 * (this.greenZoneStart + (this.greenZoneEnd - this.greenZoneStart) / 2 - 0.5);
        this.greenZone = this.add.rectangle(greenZoneX, 200, greenZoneWidth, 30, 0x00FF00);
        this.greenZone.setAlpha(0.7);
        
        // Moving red bar
        this.redBar = this.add.rectangle(120, 200, 20, 35, 0xFF0000);
        this.redBar.setStrokeStyle(2, 0x000000);
        
        // Attempts counter
        this.attemptsText = this.add.text(50, 150, `Attempts: ${this.attempts}/${this.maxAttempts}`, {
            fontSize: '18px',
            fill: '#8B0000',
            fontFamily: 'monospace',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        });
        
        // Exit button
        const exitBtn = this.add.text(590, 50, 'ESC: Exit', {
            fontSize: '14px',
            fill: '#FFFFFF',
            backgroundColor: '#8B0000',
            padding: { x: 8, y: 4 }
        }).setOrigin(1, 0).setInteractive();
        
        exitBtn.on('pointerdown', () => this.exitGame());
        
        // Add guinea pig for context
        this.patientPig = this.add.sprite(320, 350, 'custom_player');
        this.patientPig.setScale(3);
        
        // Add medical equipment graphics
        this.createMedicalEquipment();
    }

    createMedicalEquipment() {
        // Stethoscope
        const stethoscope = this.add.graphics();
        stethoscope.lineStyle(4, 0x666666);
        stethoscope.beginPath();
        stethoscope.arc(280, 320, 15, 0, Math.PI * 2);
        stethoscope.moveTo(295, 320);
        stethoscope.lineTo(350, 280);
        stethoscope.strokePath();
        
        // Medical chart
        const chart = this.add.rectangle(500, 300, 80, 100, 0xFFFFFF);
        chart.setStrokeStyle(2, 0x000000);
        
        this.add.text(500, 280, 'HEALTH\nCHART', {
            fontSize: '12px',
            fill: '#000000',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add some chart lines
        for (let i = 0; i < 5; i++) {
            this.add.line(500, 310 + i * 10, 0, 0, 30, 0, 0x000000);
        }
    }

    startGame() {
        this.gameActive = true;
        
        // Show start message
        const startText = this.add.text(320, 240, 'Get Ready...', {
            fontSize: '32px',
            fill: '#FF6600',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                startText.destroy();
                this.beginTiming();
            }
        });
    }

    beginTiming() {
        if (!this.gameActive) return;
        
        // Reset bar position
        this.barPosition = 0;
        this.barDirection = 1;
        
        // Start bar movement
        this.barTween = this.tweens.add({
            targets: this,
            barPosition: 1,
            duration: 2000 / this.barSpeed,
            yoyo: true,
            repeat: -1,
            ease: 'Linear'
        });
        
        // Show timing prompt
        const promptText = this.add.text(320, 260, 'NOW!', {
            fontSize: '24px',
            fill: '#FF0000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.time.delayedCall(500, () => {
            if (promptText) promptText.destroy();
        });
    }

    update() {
        if (!this.gameActive) return;
        
        // Update red bar position
        if (this.redBar) {
            const barX = 120 + (this.barPosition * 400);
            this.redBar.setX(barX);
        }
        
        // Check for timing input
        if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
            Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.checkTiming();
        }
        
        // Check exit
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.exitGame();
        }
    }

    checkTiming() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        if (this.barTween) {
            this.barTween.stop();
        }
        
        this.attempts++;
        this.attemptsText.setText(`Attempts: ${this.attempts}/${this.maxAttempts}`);
        
        // Check if in green zone
        const inGreenZone = this.barPosition >= this.greenZoneStart && this.barPosition <= this.greenZoneEnd;
        
        if (inGreenZone) {
            this.successfulTiming();
        } else {
            this.failedTiming();
        }
    }

    successfulTiming() {
        this.success = true;
        
        // Award health star
        gameData.addHealthStar();
        
        // Play success sound
        this.playSound('success');
        
        // Visual feedback
        const successText = this.add.text(320, 240, 'Perfect!\n+1 Health Star!', {
            fontSize: '32px',
            fill: '#00FF00',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        // Success particle effect
        this.createSuccessEffect();
        
        this.tweens.add({
            targets: successText,
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

    failedTiming() {
        // Play fail sound
        this.playSound('fail');
        
        // Visual feedback
        const accuracy = Math.abs(this.barPosition - (this.greenZoneStart + this.greenZoneEnd) / 2);
        let message = 'Try again!';
        
        if (accuracy < 0.1) {
            message = 'So close!';
        } else if (accuracy > 0.3) {
            message = 'Way off!';
        }
        
        const failText = this.add.text(320, 240, message, {
            fontSize: '28px',
            fill: '#FF6600',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: failText,
            alpha: 0,
            duration: 1500,
            onComplete: () => failText.destroy()
        });
        
        // Check if out of attempts
        if (this.attempts >= this.maxAttempts) {
            this.gameOver();
        } else {
            // Try again
            this.time.delayedCall(2000, () => {
                this.gameActive = true;
                this.beginTiming();
            });
        }
    }

    gameOver() {
        // Play game over sound
        this.playSound('gameOver');
        
        // Show game over message
        const gameOverText = this.add.text(320, 240, 'No more attempts!\nCome back later.', {
            fontSize: '24px',
            fill: '#FF0000',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        // Return to village after delay
        this.time.delayedCall(2500, () => {
            this.scene.start('VillageScene', this.returnData);
        });
    }

    createSuccessEffect() {
        // Create sparkle effects around the green zone
        for (let i = 0; i < 10; i++) {
            const sparkle = this.add.text(
                300 + Math.random() * 40,
                190 + Math.random() * 20,
                '✨',
                { fontSize: '16px' }
            );
            
            this.tweens.add({
                targets: sparkle,
                y: sparkle.y - 30,
                alpha: 0,
                scale: 0.5,
                duration: 1000,
                delay: Math.random() * 500,
                onComplete: () => sparkle.destroy()
            });
        }
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
            case 'success':
                oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(784, window.audioContext.currentTime + 0.4);
                break;
            case 'fail':
                oscillator.frequency.setValueAtTime(330, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(220, window.audioContext.currentTime + 0.3);
                break;
            case 'gameOver':
                oscillator.frequency.setValueAtTime(220, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, window.audioContext.currentTime + 0.8);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.8);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.8);
    }
}