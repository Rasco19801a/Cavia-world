class ShopScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ShopScene' });
    }

    init(data) {
        this.returnData = data;
    }

    create() {
        // Create shop background
        this.add.rectangle(320, 240, 640, 480, 0xFFE4B5);
        
        // Shop variables
        this.selectedIndex = 0;
        this.items = [
            { name: 'Toy Ball', price: 15, emoji: '🏀', texture: 'toy_ball', description: 'A fun ball to play with!' },
            { name: 'Tunnel', price: 25, emoji: '🕳️', texture: 'toy_tunnel', description: 'Hide and play tunnel!' },
            { name: 'Brush', price: 10, emoji: '🪥', texture: 'brush', description: 'Keep your fur neat!' },
            { name: 'Carrot Treat', price: 5, emoji: '🥕', texture: 'carrot', description: 'Delicious and healthy!' }
        ];
        
        // Create UI
        this.createUI();
        this.createItemList();
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.actionKey = this.input.keyboard.addKey('E');
        this.escapeKey = this.input.keyboard.addKey('ESC');
        
        // Update selection display
        this.updateSelection();
    }

    createUI() {
        // Title
        this.add.text(320, 50, 'Speelgoedwinkel - Toy Shop', {
            fontSize: '24px',
            fill: '#8B4513',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Instructions
        this.add.text(320, 80, 'Use ↑↓ to select, E to buy, ESC to exit', {
            fontSize: '16px',
            fill: '#000000',
            fontFamily: 'monospace'
        }).setOrigin(0.5);
        
        // Player coins display
        this.coinsText = this.add.text(50, 120, `Coins: 🥕 ${gameData.playerData.coins}`, {
            fontSize: '18px',
            fill: '#8B4513',
            fontFamily: 'monospace',
            backgroundColor: '#FFFFFF',
            padding: { x: 10, y: 5 }
        });
        
        // Exit button
        const exitBtn = this.add.text(590, 50, 'ESC: Exit', {
            fontSize: '14px',
            fill: '#FFFFFF',
            backgroundColor: '#8B4513',
            padding: { x: 8, y: 4 }
        }).setOrigin(1, 0).setInteractive();
        
        exitBtn.on('pointerdown', () => this.exitShop());
        
        // Shop counter decoration
        this.add.rectangle(320, 400, 600, 20, 0x8B4513);
        this.add.rectangle(320, 420, 580, 80, 0xDEB887);
        this.add.rectangle(320, 420, 580, 80).setStrokeStyle(3, 0x8B4513);
        
        // Add shopkeeper (another guinea pig)
        this.shopkeeper = this.add.sprite(500, 350, 'player');
        this.shopkeeper.setScale(2);
        this.shopkeeper.setTint(0xFFB6C1); // Pink tint to differentiate
        
        // Add shopkeeper hat
        const hat = this.add.graphics();
        hat.fillStyle(0x000080);
        hat.fillRect(490, 320, 20, 10);
        hat.fillRect(492, 315, 16, 5);
    }

    createItemList() {
        this.itemElements = [];
        const startY = 180;
        const itemHeight = 50;
        
        this.items.forEach((item, index) => {
            const y = startY + index * itemHeight;
            
            // Item background
            const itemBg = this.add.rectangle(320, y, 500, 45, 0xFFFFFF);
            itemBg.setStrokeStyle(2, 0x8B4513);
            
            // Item icon
            const icon = this.add.sprite(180, y, item.texture);
            icon.setScale(1.5);
            
            // Item name and description
            const nameText = this.add.text(220, y - 10, item.name, {
                fontSize: '16px',
                fill: '#8B4513',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            });
            
            const descText = this.add.text(220, y + 8, item.description, {
                fontSize: '12px',
                fill: '#666666',
                fontFamily: 'monospace'
            });
            
            // Price
            const priceText = this.add.text(520, y, `🥕 ${item.price}`, {
                fontSize: '16px',
                fill: '#FF6600',
                fontFamily: 'monospace',
                fontStyle: 'bold'
            }).setOrigin(1, 0.5);
            
            // Selection indicator (initially hidden)
            const selector = this.add.text(150, y, '►', {
                fontSize: '20px',
                fill: '#FF0000',
                fontFamily: 'monospace'
            }).setOrigin(0.5);
            selector.setVisible(false);
            
            this.itemElements.push({
                background: itemBg,
                icon: icon,
                nameText: nameText,
                descText: descText,
                priceText: priceText,
                selector: selector,
                item: item
            });
        });
    }

    updateSelection() {
        // Hide all selectors
        this.itemElements.forEach((element, index) => {
            element.selector.setVisible(false);
            element.background.setFillStyle(0xFFFFFF);
            
            // Check if affordable
            const canAfford = gameData.playerData.coins >= element.item.price;
            element.priceText.setStyle({ fill: canAfford ? '#FF6600' : '#FF0000' });
        });
        
        // Show current selection
        if (this.itemElements[this.selectedIndex]) {
            const selected = this.itemElements[this.selectedIndex];
            selected.selector.setVisible(true);
            selected.background.setFillStyle(0xFFFFAA);
        }
        
        // Update coins display
        this.coinsText.setText(`Coins: 🥕 ${gameData.playerData.coins}`);
    }

    update() {
        // Navigation
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            this.selectedIndex = Math.max(0, this.selectedIndex - 1);
            this.updateSelection();
            this.playSound('navigate');
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            this.selectedIndex = Math.min(this.items.length - 1, this.selectedIndex + 1);
            this.updateSelection();
            this.playSound('navigate');
        }
        
        // Purchase
        if (Phaser.Input.Keyboard.JustDown(this.actionKey)) {
            this.tryPurchase();
        }
        
        // Exit
        if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
            this.exitShop();
        }
    }

    tryPurchase() {
        const selectedItem = this.items[this.selectedIndex];
        
        if (gameData.spendCoins(selectedItem.price)) {
            // Successful purchase
            gameData.addToInventory({
                name: selectedItem.name,
                emoji: selectedItem.emoji,
                type: 'toy'
            });
            
            this.showPurchaseSuccess(selectedItem);
            this.playSound('purchase');
            this.updateSelection();
        } else {
            // Not enough coins
            this.showInsufficientFunds();
            this.playSound('error');
        }
    }

    showPurchaseSuccess(item) {
        const successText = this.add.text(320, 240, `Purchased ${item.name}!\nAdded to inventory`, {
            fontSize: '20px',
            fill: '#00FF00',
            fontFamily: 'monospace',
            align: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: successText,
            alpha: 0,
            scale: 1.2,
            duration: 2000,
            onComplete: () => successText.destroy()
        });
    }

    showInsufficientFunds() {
        const errorText = this.add.text(320, 240, 'Not enough coins!\nPlay farm game to earn more', {
            fontSize: '18px',
            fill: '#FF0000',
            fontFamily: 'monospace',
            align: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: errorText,
            alpha: 0,
            duration: 2000,
            onComplete: () => errorText.destroy()
        });
    }

    exitShop() {
        this.scene.start('VillageScene', this.returnData);
    }

    playSound(type) {
        if (!window.audioContext) return;
        
        const oscillator = window.audioContext.createOscillator();
        const gainNode = window.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(window.audioContext.destination);
        
        switch(type) {
            case 'navigate':
                oscillator.frequency.setValueAtTime(440, window.audioContext.currentTime);
                break;
            case 'purchase':
                oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.1);
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(220, window.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(110, window.audioContext.currentTime + 0.3);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.3);
        
        oscillator.start(window.audioContext.currentTime);
        oscillator.stop(window.audioContext.currentTime + 0.3);
    }
}