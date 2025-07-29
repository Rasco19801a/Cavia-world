class CustomizationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CustomizationScene' });
    }

    create() {
        // Show customization panel
        document.getElementById('customizationPanel').style.display = 'block';
        document.getElementById('hud').style.display = 'none';

        // Create preview guinea pig in HTML container
        this.setupPreview();
        this.setupUIEvents();
        
        // Update preview with current data
        this.updatePreview();
        this.updateUIFromData();
    }

    setupPreview() {
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = '';

        // Create a small canvas for preview
        this.previewCanvas = document.createElement('canvas');
        this.previewCanvas.width = 128;
        this.previewCanvas.height = 128;
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.previewCtx.imageSmoothingEnabled = false;
        
        previewContainer.appendChild(this.previewCanvas);
    }

    setupUIEvents() {
        // Name input
        const nameInput = document.getElementById('pigName');
        nameInput.addEventListener('input', () => {
            gameData.updatePlayer({ name: nameInput.value || 'Piggy' });
        });

        // Fur type select
        const furTypeSelect = document.getElementById('furType');
        furTypeSelect.addEventListener('change', () => {
            gameData.updatePlayer({ furType: furTypeSelect.value });
            this.updatePreview();
        });

        // Fur color select
        const furColorSelect = document.getElementById('furColor');
        furColorSelect.addEventListener('change', () => {
            gameData.updatePlayer({ furColor: furColorSelect.value });
            this.updatePreview();
        });

        // Accessory select
        const accessorySelect = document.getElementById('accessory');
        accessorySelect.addEventListener('change', () => {
            gameData.updatePlayer({ accessory: accessorySelect.value });
            this.updatePreview();
        });

        // Randomize button
        document.getElementById('randomizeBtn').addEventListener('click', () => {
            this.randomizeCharacter();
        });

        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetCharacter();
        });

        // Continue button
        document.getElementById('continueBtn').addEventListener('click', () => {
            this.startGame();
        });
    }

    updateUIFromData() {
        const data = gameData.playerData;
        document.getElementById('pigName').value = data.name;
        document.getElementById('furType').value = data.furType;
        document.getElementById('furColor').value = data.furColor;
        document.getElementById('accessory').value = data.accessory;
    }

    updatePreview() {
        const ctx = this.previewCtx;
        const data = gameData.playerData;
        
        // Clear canvas
        ctx.clearRect(0, 0, 128, 128);
        
        // Scale up for preview
        ctx.save();
        ctx.scale(4, 4);
        
        const color = this.getFurColor(data.furColor);
        
        // Body
        ctx.fillStyle = color;
        this.fillEllipse(ctx, 16, 20, 24, 16);
        
        // Head
        this.fillEllipse(ctx, 16, 10, 18, 18);
        
        // Fur type effects
        if (data.furType === 'long') {
            this.fillEllipse(ctx, 16, 24, 28, 14);
        } else if (data.furType === 'rosette') {
            ctx.fillStyle = this.darkenColor(color, 0.2);
            this.fillCircle(ctx, 12, 16, 3);
            this.fillCircle(ctx, 20, 18, 3);
        }
        
        // Ears
        ctx.fillStyle = color;
        this.fillEllipse(ctx, 10, 4, 6, 8);
        this.fillEllipse(ctx, 22, 4, 6, 8);
        
        // Eyes
        ctx.fillStyle = '#000000';
        this.fillCircle(ctx, 12, 8, 2);
        this.fillCircle(ctx, 20, 8, 2);
        
        // Nose
        ctx.fillStyle = '#FF69B4';
        this.fillCircle(ctx, 16, 12, 1);
        
        // Accessory
        if (data.accessory === 'bow') {
            ctx.fillStyle = '#FF1493';
            this.fillEllipse(ctx, 13, 0, 6, 4);
            this.fillEllipse(ctx, 19, 0, 6, 4);
            ctx.fillStyle = '#8B0000';
            ctx.fillRect(15, -2, 2, 4);
        } else if (data.accessory === 'hat') {
            ctx.fillStyle = '#000000';
            this.fillEllipse(ctx, 16, 0, 12, 6);
            ctx.fillRect(12, -4, 8, 4);
        }
        
        ctx.restore();
    }

    // Helper drawing functions
    fillEllipse(ctx, x, y, w, h) {
        ctx.beginPath();
        ctx.ellipse(x, y, w/2, h/2, 0, 0, 2 * Math.PI);
        ctx.fill();
    }

    fillCircle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
    }

    getFurColor(colorName) {
        const colors = {
            brown: '#8B4513',
            white: '#FFFFFF',
            black: '#000000',
            ginger: '#FF6600',
            gray: '#808080',
            patches: '#F4A460',
            tricolor: '#DEB887'
        };
        return colors[colorName] || colors.brown;
    }

    darkenColor(color, factor) {
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Darken
        const newR = Math.floor(r * (1 - factor));
        const newG = Math.floor(g * (1 - factor));
        const newB = Math.floor(b * (1 - factor));
        
        // Convert back to hex
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    randomizeCharacter() {
        const furTypes = ['short', 'long', 'rosette', 'ridgeback'];
        const furColors = ['brown', 'white', 'black', 'ginger', 'gray', 'patches', 'tricolor'];
        const accessories = ['none', 'bow', 'hat'];
        
        const randomData = {
            furType: furTypes[Math.floor(Math.random() * furTypes.length)],
            furColor: furColors[Math.floor(Math.random() * furColors.length)],
            accessory: accessories[Math.floor(Math.random() * accessories.length)]
        };
        
        gameData.updatePlayer(randomData);
        this.updateUIFromData();
        this.updatePreview();
        
        // Play sound effect
        this.playSound('randomize');
    }

    resetCharacter() {
        const defaultData = {
            name: 'Piggy',
            furType: 'short',
            furColor: 'brown',
            accessory: 'none'
        };
        
        gameData.updatePlayer(defaultData);
        this.updateUIFromData();
        this.updatePreview();
        
        // Play sound effect
        this.playSound('reset');
    }

    startGame() {
        // Hide customization panel
        document.getElementById('customizationPanel').style.display = 'none';
        document.getElementById('hud').style.display = 'block';
        
        // Create custom player texture based on customization
        const assetManager = new AssetManager(this);
        const data = gameData.playerData;
        assetManager.createCustomGuineaPigTexture(data.furType, data.furColor, data.accessory);
        
        // Update HUD
        gameData.updateHUD();
        gameData.updateInventoryDisplay();
        
        // Play sound effect
        this.playSound('continue');
        
        // Start village scene
        this.scene.start('VillageScene');
    }

    playSound(type) {
        if (!window.audioContext) return;
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        switch(type) {
            case 'randomize':
                oscillator.frequency.setValueAtTime(400, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, window.audioContext.currentTime + 0.1);
                break;
            case 'reset':
                oscillator.frequency.setValueAtTime(800, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, window.audioContext.currentTime + 0.1);
                break;
            case 'continue':
                oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(784, window.audioContext.currentTime + 0.2);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.3);
    }
}