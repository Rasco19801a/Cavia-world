// Game Data Management System
class GameData {
    constructor() {
        this.playerData = {
            name: 'Piggy',
            furType: 'short',
            furColor: 'brown',
            accessory: 'none',
            coins: 0,
            healthStars: 0,
            styleBadges: 0,
            inventory: []
        };
        this.load();
    }

    save() {
        localStorage.setItem('guineaPigVillage-phaser', JSON.stringify(this.playerData));
    }

    load() {
        const saved = localStorage.getItem('guineaPigVillage-phaser');
        if (saved) {
            this.playerData = { ...this.playerData, ...JSON.parse(saved) };
        }
    }

    updatePlayer(data) {
        this.playerData = { ...this.playerData, ...data };
        this.save();
        this.updateHUD();
    }

    addCoins(amount) {
        this.playerData.coins += amount;
        this.save();
        this.updateHUD();
    }

    spendCoins(amount) {
        if (this.playerData.coins >= amount) {
            this.playerData.coins -= amount;
            this.save();
            this.updateHUD();
            return true;
        }
        return false;
    }

    addHealthStar() {
        this.playerData.healthStars++;
        this.save();
        this.updateHUD();
    }

    addStyleBadge() {
        this.playerData.styleBadges++;
        this.save();
        this.updateHUD();
    }

    addToInventory(item) {
        this.playerData.inventory.push(item);
        this.save();
        this.updateInventoryDisplay();
    }

    updateHUD() {
        document.getElementById('playerName').textContent = this.playerData.name;
        document.getElementById('coinCount').textContent = `🥕 ${this.playerData.coins}`;
        document.getElementById('healthStars').textContent = `⭐ ${this.playerData.healthStars}`;
        document.getElementById('styleBadges').textContent = `✨ ${this.playerData.styleBadges}`;
    }

    updateInventoryDisplay() {
        const inventory = document.getElementById('inventory');
        inventory.innerHTML = '';
        
        this.playerData.inventory.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.textContent = item.emoji;
            itemDiv.title = item.name;
            inventory.appendChild(itemDiv);
        });
    }

    reset() {
        this.playerData = {
            name: 'Piggy',
            furType: 'short',
            furColor: 'brown',
            accessory: 'none',
            coins: 0,
            healthStars: 0,
            styleBadges: 0,
            inventory: []
        };
        this.save();
        this.updateHUD();
        this.updateInventoryDisplay();
    }
}

// Global game data instance
window.gameData = new GameData();