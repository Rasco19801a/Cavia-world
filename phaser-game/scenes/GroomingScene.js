class GroomingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GroomingScene' });
    }

    init(data) {
        this.returnData = data;
    }

    create() {
        // Create grooming salon background
        this.add.rectangle(320, 240, 640, 480, 0xE6E6FA);
        
        // Game variables
        this.brushCount = 0;
        this.targetBrushes = 10;
        this.gameActive = false;
        this.brushSpeed = 0;
        this.lastBrushTime = 0;
        
        // Create UI
        this.createUI();
        
        // Setup input
        this.actionKey = this.input.keyboard.addKey('E');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        this.escapeKey = this.input.keyboard.addKey('ESC');
        
        // Start game after delay
        this.time.delayedCall(1000, () => {
            this.startGame();
        });
    }

    createUI() {
        // Title
        this.add.text(320, 50, 'Trim-salon - Grooming Session', {
            fontSize: '24px',
            fill: '#9370DB',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(320, 80, 'Press SPACE or E repeatedly to brush your guinea pig!', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.add.text(320, 100, 'Complete 10 brush strokes to earn a style badge!', {
            fontSize: '14px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Progress bar background
        this.progressBg = this.add.rectangle(320, 150, 400, 25, 0x888888);
        this.progressBg.setStrokeStyle(3, 0x000000);
        
        // Progress bar fill
        this.progressBar = this.add.rectangle(120, 150, 0, 25, 0x9370DB);
        
        // Progress text
        this.progressText = this.add.text(320, 150, `${this.brushCount}/${this.targetBrushes}`, {
            fontSize: '16px',
            fill: '#FFFFFF',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Exit button
        const exitBtn = this.add.text(590, 50, 'ESC: Exit', {
            fontSize: '14px',
            fill: '#FFFFFF',
            backgroundColor: '#9370DB',
            padding: { x: 8, y: 4 }
        }).setOrigin(1, 0).setInteractive();
        
        exitBtn.on('pointerdown', () => this.exitGrooming());
        
        // Add guinea pig
        this.guineaPig = this.add.sprite(320, 300, 'custom_player');
        this.guineaPig.setScale(4);
        
        // Add grooming table
        this.add.rectangle(320, 380, 200, 20, 0x8B4513);
        this.add.rectangle(320, 400, 180, 40, 0xDEB887);
        
        // Add brush
        this.brush = this.add.sprite(400, 250, 'brush');
        this.brush.setScale(3);
        this.brush.setVisible(false);
        
        // Add salon decorations
        this.createSalonDecorations();
        
        // Brush effect particles
        this.brushEffects = [];
    }

    createSalonDecorations() {
        // Mirror
        this.add.rectangle(100, 200, 80, 100, 0xC0C0C0);
        this.add.rectangle(100, 200, 80, 100).setStrokeStyle(5, 0x8B4513);
        
        // Reflection of guinea pig in mirror
        const reflection = this.add.sprite(100, 220, 'custom_player');
        reflection.setScale(2);
        reflection.setAlpha(0.7);
        reflection.setFlipX(true);
        
        // Grooming tools shelf
        this.add.rectangle(550, 180, 80, 15, 0x8B4513);
        
        // Tools on shelf
        const tools = [
            { x: 520, sprite: 'brush' },
            { x: 540, sprite: 'brush' },
            { x: 560, sprite: 'brush' }
        ];
        
        tools.forEach(tool => {
            const toolSprite = this.add.sprite(tool.x, 175, tool.sprite);
            toolSprite.setScale(1);
        });
        
        // Salon chair decoration
        this.add.ellipse(320, 420, 220, 40, 0x8B4513);
    }

    startGame() {
        this.gameActive = true;
        this.brush.setVisible(true);
        
        // Show start message
        const startText = this.add.text(320, 240, 'Start Brushing!', {
            fontSize: '32px',
            fill: '#9370DB',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: 0,
            scale: 1.5,
            duration: 1500,
            onComplete: () => startText.destroy()
        });
    }

    update() {
        if (!this.gameActive) return;
        
        // Check for brushing input
        if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
            Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.performBrush();
        }
        
        // Check exit
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.exitGrooming();
        }
        
        // Update brush effects
        this.updateBrushEffects();
    }

    performBrush() {
        if (!this.gameActive) return;
        
        // Prevent too rapid brushing
        const currentTime = this.time.now;
        if (currentTime - this.lastBrushTime < 200) return;
        this.lastBrushTime = currentTime;
        
        this.brushCount++;
        this.updateProgress();
        
        // Animate brush
        this.animateBrush();
        
        // Create brush effect
        this.createBrushEffect();
        
        // Play brush sound
        this.playSound('brush');
        
        // Guinea pig reaction
        this.animateGuineaPig();
        
        // Check completion
        if (this.brushCount >= this.targetBrushes) {
            this.completeGrooming();
        }
    }

    updateProgress() {
        const progress = this.brushCount / this.targetBrushes;
        const barWidth = 400 * progress;
        this.progressBar.setDisplaySize(barWidth, 25);
        this.progressBar.setX(120 + barWidth / 2);
        
        this.progressText.setText(`${this.brushCount}/${this.targetBrushes}`);
        
        // Change colors as progress increases
        if (progress >= 1) {
            this.progressBar.setFillStyle(0x00FF00);
        } else if (progress >= 0.7) {
            this.progressBar.setFillStyle(0xFFFF00);
        } else {
            this.progressBar.setFillStyle(0x9370DB);
        }
    }

    animateBrush() {
        // Brush movement animation
        this.tweens.add({
            targets: this.brush,
            x: 300 + Math.random() * 40,
            y: 240 + Math.random() * 40,
            duration: 150,
            yoyo: true,
            onComplete: () => {
                this.brush.setPosition(400, 250);
            }
        });
        
        // Brush rotation
        this.tweens.add({
            targets: this.brush,
            angle: this.brush.angle + 15,
            duration: 100
        });
    }

    animateGuineaPig() {
        // Guinea pig happy bounce
        this.tweens.add({
            targets: this.guineaPig,
            scaleY: 4.2,
            duration: 100,
            yoyo: true
        });
        
        // Add sparkles around guinea pig
        for (let i = 0; i < 3; i++) {
            const sparkle = this.add.text(
                320 + (Math.random() - 0.5) * 100,
                300 + (Math.random() - 0.5) * 60,
                '✨',
                { fontSize: '16px' }
            );
            
            this.tweens.add({
                targets: sparkle,
                y: sparkle.y - 20,
                alpha: 0,
                duration: 800,
                delay: Math.random() * 200,
                onComplete: () => sparkle.destroy()
            });
        }
    }

    createBrushEffect() {
        // Create brush stroke effect
        const effect = {
            sprite: this.add.ellipse(
                300 + Math.random() * 40,
                280 + Math.random() * 40,
                20, 10, 0xFFFFFF
            ),
            life: 30
        };
        
        effect.sprite.setAlpha(0.8);
        this.brushEffects.push(effect);
    }

    updateBrushEffects() {
        this.brushEffects = this.brushEffects.filter(effect => {
            effect.life--;
            effect.sprite.setAlpha(effect.life / 30);
            
            if (effect.life <= 0) {
                effect.sprite.destroy();
                return false;
            }
            return true;
        });
    }

    completeGrooming() {
        this.gameActive = false;
        
        // Award style badge
        gameData.addStyleBadge();
        
        // Play completion sound
        this.playSound('complete');
        
        // Hide brush
        this.brush.setVisible(false);
        
        // Completion animation
        const completionText = this.add.text(320, 240, 'Beautiful!\n+1 Style Badge!', {
            fontSize: '32px',
            fill: '#9370DB',
            fontFamily: 'monospace',
            align: 'center'
        }).setOrigin(0.5);
        
        // Celebration effect
        this.createCelebrationEffect();
        
        this.tweens.add({
            targets: completionText,
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: 3
        });
        
        // Return to village after delay
        this.time.delayedCall(4000, () => {
            this.scene.start('VillageScene', this.returnData);
        });
    }

    createCelebrationEffect() {
        // Confetti effect
        for (let i = 0; i < 20; i++) {
            const confetti = this.add.rectangle(
                320 + (Math.random() - 0.5) * 200,
                100,
                8, 8,
                Phaser.Display.Color.GetColor32(
                    Math.random() * 255,
                    Math.random() * 255,
                    Math.random() * 255,
                    255
                )
            );
            
            this.tweens.add({
                targets: confetti,
                y: 500,
                x: confetti.x + (Math.random() - 0.5) * 100,
                rotation: Math.random() * Math.PI * 4,
                duration: 2000 + Math.random() * 1000,
                delay: Math.random() * 500,
                onComplete: () => confetti.destroy()
            });
        }
    }

    exitGrooming() {
        this.scene.start('VillageScene', this.returnData);
    }

    playSound(type) {
        if (!window.audioContext) return;
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        switch(type) {
            case 'brush':
                oscillator.frequency.setValueAtTime(200 + Math.random() * 100, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, window.audioContext.currentTime + 0.1);
                break;
            case 'complete':
                oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(784, window.audioContext.currentTime + 0.4);
                oscillator.frequency.setValueAtTime(1047, window.audioContext.currentTime + 0.6);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.2);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.2);
    }
}