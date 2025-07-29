// Guinea Pig Village Game
// Main game file with all systems and scenes

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.previewCtx = this.previewCanvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 640;
        this.canvas.height = 480;
        
        // Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;
        this.previewCtx.imageSmoothingEnabled = false;
        
        // Initialize systems
        this.state = new GameState();
        this.input = new InputManager();
        this.audio = new AudioManager();
        this.scenes = new SceneManager(this);
        this.sprites = new SpriteRenderer(this.ctx);
        
        // Game loop
        this.lastTime = 0;
        this.running = false;
        
        this.init();
    }
    
    init() {
        // Load saved data
        this.state.load();
        
        // Set up UI event listeners
        this.setupUI();
        
        // Show touch controls on mobile
        if (this.isMobile()) {
            document.getElementById('touchControls').classList.remove('hidden');
        }
        
        // Start game
        this.scenes.switchTo('customization');
        this.start();
    }
    
    setupUI() {
        // Customization panel
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomizeGuineaPig());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGuineaPig());
        document.getElementById('continueBtn').addEventListener('click', () => this.startGame());
        
        // Listen for customization changes
        ['pigName', 'furType', 'furColor', 'accessory'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.updatePreview());
        });
        
        // Pause menu
        document.getElementById('pauseBtn').addEventListener('click', () => this.scenes.switchTo('pause'));
        document.getElementById('resumeBtn').addEventListener('click', () => this.scenes.switchTo('village'));
        document.getElementById('audioToggleBtn').addEventListener('click', () => this.toggleAudio());
        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetGame());
        
        // Touch controls
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.input.keys[btn.dataset.key] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.input.keys[btn.dataset.key] = false;
            });
        });
        
        document.getElementById('actionBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.input.keys['KeyE'] = true;
        });
        document.getElementById('actionBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.input.keys['KeyE'] = false;
        });
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    randomizeGuineaPig() {
        const furTypes = ['short', 'long', 'rosette', 'ridgeback'];
        const colors = ['brown', 'white', 'black', 'ginger', 'gray', 'patches', 'tricolor'];
        const accessories = ['none', 'bow', 'hat'];
        
        document.getElementById('furType').value = furTypes[Math.floor(Math.random() * furTypes.length)];
        document.getElementById('furColor').value = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('accessory').value = accessories[Math.floor(Math.random() * accessories.length)];
        
        this.updatePreview();
    }
    
    resetGuineaPig() {
        document.getElementById('pigName').value = '';
        document.getElementById('furType').value = 'short';
        document.getElementById('furColor').value = 'patches'; // Default to patches like in example
        document.getElementById('accessory').value = 'none';
        this.updatePreview();
    }
    
    updatePreview() {
        const appearance = {
            furType: document.getElementById('furType').value,
            furColor: document.getElementById('furColor').value,
            accessory: document.getElementById('accessory').value
        };
        
        this.previewCtx.clearRect(0, 0, 128, 128);
        this.sprites.drawGuineaPig(this.previewCtx, 64, 64, appearance, 4);
    }
    
    startGame() {
        const name = document.getElementById('pigName').value.trim() || 'Piggy';
        this.state.player.name = name;
        this.state.player.appearance = {
            furType: document.getElementById('furType').value,
            furColor: document.getElementById('furColor').value,
            accessory: document.getElementById('accessory').value
        };
        
        this.updateHUD();
        this.scenes.switchTo('village');
    }
    
    updateHUD() {
        document.getElementById('playerName').textContent = this.state.player.name;
        document.getElementById('coinCount').textContent = `🥕 ${this.state.player.coins}`;
        document.getElementById('healthStars').textContent = `⭐ ${this.state.player.healthStars}`;
        document.getElementById('styleBadges').textContent = `✨ ${this.state.player.styleBadges}`;
        
        // Update inventory
        const inventory = document.getElementById('inventory');
        inventory.innerHTML = '';
        this.state.player.inventory.forEach(item => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.textContent = item.icon;
            div.title = item.name;
            inventory.appendChild(div);
        });
    }
    
    toggleAudio() {
        this.audio.enabled = !this.audio.enabled;
        const btn = document.getElementById('audioToggleBtn');
        btn.textContent = this.audio.enabled ? '🔊 Audio: ON' : '🔇 Audio: OFF';
    }
    
    resetGame() {
        this.state.reset();
        this.scenes.switchTo('customization');
    }
    
    start() {
        this.running = true;
        this.loop(0);
    }
    
    loop(currentTime) {
        if (!this.running) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update current scene
        if (this.scenes.current) {
            this.scenes.current.update(deltaTime);
            this.scenes.current.render(this.ctx);
        }
        
        requestAnimationFrame((time) => this.loop(time));
    }
}

// Game State Management
class GameState {
    constructor() {
        this.player = {
            name: 'Piggy',
            appearance: {
                furType: 'short',
                furColor: 'patches', // Default to patches like in example
                accessory: 'none'
            },
            x: 10,
            y: 8,
            coins: 0,
            healthStars: 0,
            styleBadges: 0,
            inventory: []
        };
    }
    
    save() {
        localStorage.setItem('guineaPigVillage', JSON.stringify(this.player));
    }
    
    load() {
        const saved = localStorage.getItem('guineaPigVillage');
        if (saved) {
            this.player = { ...this.player, ...JSON.parse(saved) };
        }
    }
    
    reset() {
        localStorage.removeItem('guineaPigVillage');
        this.player = {
            name: 'Piggy',
            appearance: { furType: 'short', furColor: 'patches', accessory: 'none' }, // Default to patches
            x: 10, y: 8, coins: 0, healthStars: 0, styleBadges: 0, inventory: []
        };
    }
    
    addItem(item) {
        this.player.inventory.push(item);
        this.save();
    }
    
    addCoins(amount) {
        this.player.coins += amount;
        this.save();
    }
    
    spendCoins(amount) {
        if (this.player.coins >= amount) {
            this.player.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }
}

// Input Management
class InputManager {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    isPressed(key) {
        return !!this.keys[key];
    }
    
    wasPressed(key) {
        if (this.keys[key] && !this.keys[key + '_prev']) {
            this.keys[key + '_prev'] = true;
            return true;
        }
        if (!this.keys[key]) {
            this.keys[key + '_prev'] = false;
        }
        return false;
    }
}

// Audio Management
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.initAudio();
    }
    
    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }
    
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playStep() {
        this.playTone(200, 0.1, 'square');
    }
    
    playCollect() {
        this.playTone(400, 0.2);
    }
    
    playSuccess() {
        this.playTone(600, 0.3);
    }
    
    playError() {
        this.playTone(150, 0.4, 'sawtooth');
    }
}

// Scene Management
class SceneManager {
    constructor(game) {
        this.game = game;
        this.current = null;
        this.scenes = {
            customization: new CustomizationScene(game),
            village: new VillageScene(game),
            vet: new VetScene(game),
            farm: new FarmScene(game),
            shop: new ShopScene(game),
            grooming: new GroomingScene(game),
            pause: new PauseScene(game)
        };
    }
    
    switchTo(sceneName) {
        if (this.current) {
            this.current.exit();
        }
        
        this.current = this.scenes[sceneName];
        if (this.current) {
            this.current.enter();
        }
    }
}

// Base Scene Class
class Scene {
    constructor(game) {
        this.game = game;
    }
    
    enter() {}
    exit() {}
    update(deltaTime) {}
    render(ctx) {}
}

// Customization Scene
class CustomizationScene extends Scene {
    enter() {
        document.getElementById('customizationPanel').classList.remove('hidden');
        document.getElementById('hud').classList.add('hidden');
        this.game.updatePreview();
    }
    
    exit() {
        document.getElementById('customizationPanel').classList.add('hidden');
        document.getElementById('hud').classList.remove('hidden');
    }
    
    update(deltaTime) {}
    
    render(ctx) {
        ctx.fillStyle = '#F0F8FF'; // Light blue background for customization
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

// Village Scene
class VillageScene extends Scene {
    constructor(game) {
        super(game);
        this.tileSize = 32;
        this.mapWidth = 20;
        this.mapHeight = 15;
        this.camera = { x: 0, y: 0 };
        this.tooltip = null;
        
        // Building positions and info
        this.buildings = [
            { x: 5, y: 3, width: 3, height: 3, name: 'Dierenarts', scene: 'vet', color: '#FF6B6B' },
            { x: 12, y: 3, width: 3, height: 3, name: 'Boerderij', scene: 'farm', color: '#4ECDC4' },
            { x: 5, y: 9, width: 3, height: 3, name: 'Speelgoedwinkel', scene: 'shop', color: '#45B7D1' },
            { x: 12, y: 9, width: 3, height: 3, name: 'Trim-salon', scene: 'grooming', color: '#96CEB4' }
        ];
    }
    
    enter() {
        this.updateCamera();
    }
    
    update(deltaTime) {
        const player = this.game.state.player;
        let moved = false;
        
        // Movement
        if (this.game.input.isPressed('ArrowLeft') || this.game.input.isPressed('KeyA')) {
            if (player.x > 0 && !this.isCollision(player.x - 1, player.y)) {
                player.x--;
                moved = true;
            }
        }
        if (this.game.input.isPressed('ArrowRight') || this.game.input.isPressed('KeyD')) {
            if (player.x < this.mapWidth - 1 && !this.isCollision(player.x + 1, player.y)) {
                player.x++;
                moved = true;
            }
        }
        if (this.game.input.isPressed('ArrowUp') || this.game.input.isPressed('KeyW')) {
            if (player.y > 0 && !this.isCollision(player.x, player.y - 1)) {
                player.y--;
                moved = true;
            }
        }
        if (this.game.input.isPressed('ArrowDown') || this.game.input.isPressed('KeyS')) {
            if (player.y < this.mapHeight - 1 && !this.isCollision(player.x, player.y + 1)) {
                player.y++;
                moved = true;
            }
        }
        
        if (moved) {
            this.game.audio.playStep();
            this.updateCamera();
            this.game.state.save();
        }
        
        // Check for building interaction
        this.tooltip = null;
        const building = this.getBuildingAt(player.x, player.y);
        if (building) {
            this.tooltip = `Enter ${building.name} [E]`;
            if (this.game.input.wasPressed('KeyE')) {
                this.game.scenes.switchTo(building.scene);
            }
        }
        
        this.updateTooltip();
    }
    
    updateCamera() {
        const player = this.game.state.player;
        this.camera.x = Math.max(0, Math.min(
            (this.mapWidth * this.tileSize) - this.game.canvas.width,
            (player.x * this.tileSize) - (this.game.canvas.width / 2)
        ));
        this.camera.y = Math.max(0, Math.min(
            (this.mapHeight * this.tileSize) - this.game.canvas.height,
            (player.y * this.tileSize) - (this.game.canvas.height / 2)
        ));
    }
    
    isCollision(x, y) {
        return this.buildings.some(building => 
            x >= building.x && x < building.x + building.width &&
            y >= building.y && y < building.y + building.height
        );
    }
    
    getBuildingAt(x, y) {
        return this.buildings.find(building => 
            x >= building.x && x < building.x + building.width &&
            y >= building.y && y < building.y + building.height
        );
    }
    
    updateTooltip() {
        const tooltipEl = document.getElementById('tooltip');
        if (this.tooltip) {
            tooltipEl.textContent = this.tooltip;
            tooltipEl.classList.remove('hidden');
            tooltipEl.style.left = '50%';
            tooltipEl.style.top = '20px';
            tooltipEl.style.transform = 'translateX(-50%)';
        } else {
            tooltipEl.classList.add('hidden');
        }
    }
    
    render(ctx) {
        // Clear canvas
        ctx.fillStyle = '#90EE90'; // Softer green base
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw grass pattern
        ctx.fillStyle = '#98FB98';
        for (let x = 0; x < this.mapWidth; x++) {
            for (let y = 0; y < this.mapHeight; y++) {
                if ((x + y) % 2 === 0) {
                    ctx.fillRect(
                        x * this.tileSize - this.camera.x,
                        y * this.tileSize - this.camera.y,
                        this.tileSize,
                        this.tileSize
                    );
                }
            }
        }
        
        // Draw buildings
        this.buildings.forEach(building => {
            const x = building.x * this.tileSize - this.camera.x;
            const y = building.y * this.tileSize - this.camera.y;
            const width = building.width * this.tileSize;
            const height = building.height * this.tileSize;
            
            // Building base
            ctx.fillStyle = building.color;
            ctx.fillRect(x, y, width, height);
            
            // Building outline
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            
            // Building sign
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(x + 4, y + height - 12, width - 8, 8);
            ctx.fillStyle = 'white';
            ctx.font = '8px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(building.name, x + width/2, y + height - 6);
        });
        
        // Draw player
        const player = this.game.state.player;
        const playerX = player.x * this.tileSize - this.camera.x;
        const playerY = player.y * this.tileSize - this.camera.y;
        this.game.sprites.drawGuineaPig(ctx, playerX + 16, playerY + 16, player.appearance, 2);
    }
}

// Mini-game scenes
class VetScene extends Scene {
    constructor(game) {
        super(game);
        this.timeLeft = 3000;
        this.targetTime = 1500;
        this.tolerance = 300;
        this.completed = false;
    }
    
    enter() {
        this.timeLeft = 3000;
        this.completed = false;
    }
    
    update(deltaTime) {
        if (this.completed) {
            if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
                this.game.scenes.switchTo('village');
            }
            return;
        }
        
        this.timeLeft -= deltaTime;
        
        if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
            const accuracy = Math.abs(this.timeLeft - this.targetTime);
            if (accuracy <= this.tolerance) {
                this.game.state.player.healthStars++;
                this.game.audio.playSuccess();
                this.completed = true;
                this.game.updateHUD();
            } else {
                this.game.audio.playError();
                this.game.scenes.switchTo('village');
            }
        }
        
        if (this.timeLeft <= 0) {
            this.game.audio.playError();
            this.game.scenes.switchTo('village');
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#FFE4E1';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw vet scene
        ctx.fillStyle = '#333';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Dierenarts Check-up', ctx.canvas.width/2, 60);
        
        if (!this.completed) {
            ctx.font = '16px monospace';
            ctx.fillText('Press SPACE when the bar hits the green zone!', ctx.canvas.width/2, 120);
            
            // Progress bar
            const barWidth = 400;
            const barHeight = 20;
            const barX = (ctx.canvas.width - barWidth) / 2;
            const barY = 200;
            
            ctx.fillStyle = '#DDD';
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Green zone
            const greenStart = barX + (this.targetTime - this.tolerance) / 3000 * barWidth;
            const greenWidth = (this.tolerance * 2) / 3000 * barWidth;
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(greenStart, barY, greenWidth, barHeight);
            
            // Current position
            const currentPos = barX + (3000 - this.timeLeft) / 3000 * barWidth;
            ctx.fillStyle = '#F44336';
            ctx.fillRect(currentPos - 2, barY - 5, 4, barHeight + 10);
        } else {
            ctx.font = '20px monospace';
            ctx.fillStyle = '#4CAF50';
            ctx.fillText('Health Star Earned!', ctx.canvas.width/2, 200);
            ctx.font = '14px monospace';
            ctx.fillStyle = '#333';
            ctx.fillText('Press SPACE to continue', ctx.canvas.width/2, 300);
        }
    }
}

class FarmScene extends Scene {
    constructor(game) {
        super(game);
        this.timeLeft = 10000; // 10 seconds
        this.carrots = [];
        this.collected = 0;
        this.target = 5;
        this.completed = false;
        this.generateCarrots();
    }
    
    enter() {
        this.timeLeft = 10000;
        this.collected = 0;
        this.completed = false;
        this.generateCarrots();
    }
    
    generateCarrots() {
        this.carrots = [];
        for (let i = 0; i < this.target + 3; i++) {
            this.carrots.push({
                x: Math.random() * (this.game.canvas.width - 40) + 20,
                y: Math.random() * (this.game.canvas.height - 140) + 100,
                collected: false
            });
        }
    }
    
    update(deltaTime) {
        if (this.completed) {
            if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
                this.game.scenes.switchTo('village');
            }
            return;
        }
        
        this.timeLeft -= deltaTime;
        
        // Check for carrot collection (simulate clicking)
        if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
            // Collect nearest carrot
            let nearest = null;
            let nearestDist = Infinity;
            
            this.carrots.forEach(carrot => {
                if (!carrot.collected) {
                    const dist = Math.sqrt(
                        Math.pow(carrot.x - this.game.canvas.width/2, 2) +
                        Math.pow(carrot.y - this.game.canvas.height/2, 2)
                    );
                    if (dist < nearestDist && dist < 50) {
                        nearest = carrot;
                        nearestDist = dist;
                    }
                }
            });
            
            if (nearest) {
                nearest.collected = true;
                this.collected++;
                this.game.audio.playCollect();
                
                if (this.collected >= this.target) {
                    this.game.state.addCoins(5);
                    this.game.audio.playSuccess();
                    this.completed = true;
                    this.game.updateHUD();
                }
            }
        }
        
        if (this.timeLeft <= 0) {
            if (this.collected >= this.target) {
                this.game.state.addCoins(this.collected);
                this.game.updateHUD();
            }
            this.game.scenes.switchTo('village');
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#8FBC8F';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw farm scene
        ctx.fillStyle = '#333';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Boerderij - Carrot Collection', ctx.canvas.width/2, 40);
        
        if (!this.completed) {
            ctx.font = '14px monospace';
            ctx.fillText(`Collect ${this.target} carrots! Time: ${Math.ceil(this.timeLeft/1000)}s`, ctx.canvas.width/2, 70);
            ctx.fillText(`Collected: ${this.collected}/${this.target}`, ctx.canvas.width/2, 90);
            
            // Draw carrots
            this.carrots.forEach(carrot => {
                if (!carrot.collected) {
                    ctx.fillStyle = '#FF4500';
                    ctx.fillRect(carrot.x - 8, carrot.y - 4, 16, 8);
                    ctx.fillStyle = '#228B22';
                    ctx.fillRect(carrot.x - 4, carrot.y - 8, 8, 8);
                }
            });
            
            // Draw crosshair
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            const centerX = ctx.canvas.width / 2;
            const centerY = ctx.canvas.height / 2;
            ctx.beginPath();
            ctx.moveTo(centerX - 10, centerY);
            ctx.lineTo(centerX + 10, centerY);
            ctx.moveTo(centerX, centerY - 10);
            ctx.lineTo(centerX, centerY + 10);
            ctx.stroke();
        } else {
            ctx.font = '20px monospace';
            ctx.fillStyle = '#4CAF50';
            ctx.fillText(`Earned ${this.collected} coins!`, ctx.canvas.width/2, 200);
            ctx.font = '14px monospace';
            ctx.fillStyle = '#333';
            ctx.fillText('Press SPACE to continue', ctx.canvas.width/2, 300);
        }
    }
}

class ShopScene extends Scene {
    constructor(game) {
        super(game);
        this.items = [
            { name: 'Ball', cost: 3, icon: '⚽', buff: 'Fun +1' },
            { name: 'Tunnel', cost: 5, icon: '🕳️', buff: 'Adventure +1' },
            { name: 'Treat', cost: 2, icon: '🍯', buff: 'Health +1' }
        ];
        this.selectedItem = 0;
    }
    
    enter() {
        this.selectedItem = 0;
    }
    
    update(deltaTime) {
        if (this.game.input.wasPressed('ArrowUp') || this.game.input.wasPressed('KeyW')) {
            this.selectedItem = Math.max(0, this.selectedItem - 1);
        }
        if (this.game.input.wasPressed('ArrowDown') || this.game.input.wasPressed('KeyS')) {
            this.selectedItem = Math.min(this.items.length - 1, this.selectedItem + 1);
        }
        
        if (this.game.input.wasPressed('KeyE') || this.game.input.wasPressed('Space')) {
            const item = this.items[this.selectedItem];
            if (this.game.state.spendCoins(item.cost)) {
                this.game.state.addItem({
                    name: item.name,
                    icon: item.icon,
                    buff: item.buff
                });
                this.game.audio.playSuccess();
                this.game.updateHUD();
            } else {
                this.game.audio.playError();
            }
        }
        
        if (this.game.input.wasPressed('Escape')) {
            this.game.scenes.switchTo('village');
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#E6E6FA';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Speelgoedwinkel', ctx.canvas.width/2, 50);
        
        ctx.font = '14px monospace';
        ctx.fillText(`Your coins: 🥕 ${this.game.state.player.coins}`, ctx.canvas.width/2, 80);
        
        // Draw items
        this.items.forEach((item, index) => {
            const y = 150 + index * 60;
            const isSelected = index === this.selectedItem;
            
            if (isSelected) {
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(ctx.canvas.width/2 - 150, y - 25, 300, 50);
            }
            
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.font = '18px monospace';
            ctx.fillText(`${item.icon} ${item.name}`, ctx.canvas.width/2 - 140, y - 5);
            
            ctx.font = '14px monospace';
            ctx.fillText(`Cost: 🥕 ${item.cost}`, ctx.canvas.width/2 - 140, y + 15);
            ctx.fillText(item.buff, ctx.canvas.width/2 + 50, y + 15);
        });
        
        ctx.textAlign = 'center';
        ctx.fillText('Use ↑↓ to select, E to buy, ESC to exit', ctx.canvas.width/2, ctx.canvas.height - 30);
    }
}

class GroomingScene extends Scene {
    constructor(game) {
        super(game);
        this.brushStrokes = 0;
        this.targetStrokes = 10;
        this.completed = false;
        this.particles = [];
    }
    
    enter() {
        this.brushStrokes = 0;
        this.completed = false;
        this.particles = [];
    }
    
    update(deltaTime) {
        if (this.completed) {
            if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
                this.game.scenes.switchTo('village');
            }
            return;
        }
        
        // Simulate brushing with spacebar
        if (this.game.input.wasPressed('Space') || this.game.input.wasPressed('KeyE')) {
            this.brushStrokes++;
            this.game.audio.playCollect();
            
            // Add particle effect
            this.particles.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                life: 1000
            });
            
            if (this.brushStrokes >= this.targetStrokes) {
                this.game.state.player.styleBadges++;
                this.game.audio.playSuccess();
                this.completed = true;
                this.game.updateHUD();
            }
        }
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.life -= deltaTime;
            return p.life > 0;
        });
    }
    
    render(ctx) {
        ctx.fillStyle = '#F0F8FF';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        ctx.fillStyle = '#333';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Trim-salon', ctx.canvas.width/2, 50);
        
        if (!this.completed) {
            ctx.font = '16px monospace';
            ctx.fillText('Press SPACE to brush your guinea pig!', ctx.canvas.width/2, 100);
            ctx.fillText(`Brush strokes: ${this.brushStrokes}/${this.targetStrokes}`, ctx.canvas.width/2, 130);
            
            // Draw guinea pig in center
            this.game.sprites.drawGuineaPig(ctx, ctx.canvas.width/2, ctx.canvas.height/2, 
                this.game.state.player.appearance, 4);
            
            // Draw particles
            this.particles.forEach(p => {
                const alpha = p.life / 1000;
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
            });
        } else {
            ctx.font = '20px monospace';
            ctx.fillStyle = '#4CAF50';
            ctx.fillText('Style Badge Earned!', ctx.canvas.width/2, 200);
            ctx.font = '14px monospace';
            ctx.fillStyle = '#333';
            ctx.fillText('Your guinea pig looks fabulous!', ctx.canvas.width/2, 250);
            ctx.fillText('Press SPACE to continue', ctx.canvas.width/2, 300);
        }
    }
}

class PauseScene extends Scene {
    enter() {
        document.getElementById('pauseMenu').classList.remove('hidden');
    }
    
    exit() {
        document.getElementById('pauseMenu').classList.add('hidden');
    }
    
    render(ctx) {
        // Dim the background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}

// Sprite Renderer
class SpriteRenderer {
    constructor(ctx) {
        this.ctx = ctx;
    }
    
    drawGuineaPig(ctx, x, y, appearance, scale = 2) {
        // Color palette inspired by the example image
        const colors = {
            brown: '#CD853F',     // Sandy brown like in the image
            white: '#F5F5DC',     // Beige/cream white
            black: '#2F2F2F',
            ginger: '#D2691E',    // Orange-brown from the image
            gray: '#A9A9A9',
            patches: ['#F5F5DC', '#CD853F'], // Cream and brown patches
            tricolor: ['#F5F5DC', '#CD853F', '#8B4513'] // Cream, brown, dark brown
        };
        
        const baseColor = colors[appearance.furColor] || colors.brown;
        const outlineColor = '#000000'; // Black outline like in the example
        const bellyColor = '#F5F5DC';   // Cream belly color
        
        // Helper function to draw with outline
        const drawWithOutline = (fillColor, outlineWidth = scale) => {
            ctx.fillStyle = outlineColor;
            return fillColor;
        };
        
        // Save context for easier restoration
        ctx.save();
        
        // Body outline (larger rounded rectangle)
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x - 10*scale, y - 6*scale, 20*scale, 12*scale); // Body outline
        ctx.fillRect(x - 8*scale, y - 8*scale, 16*scale, 16*scale);   // Head outline
        
        // Body fill (main color)
        ctx.fillStyle = Array.isArray(baseColor) ? baseColor[0] : baseColor;
        ctx.fillRect(x - 9*scale, y - 5*scale, 18*scale, 10*scale); // Main body
        
        // Head fill
        ctx.fillRect(x - 7*scale, y - 7*scale, 14*scale, 14*scale);
        
        // Belly/chest area (cream colored like in the image)
        ctx.fillStyle = bellyColor;
        ctx.fillRect(x - 6*scale, y - 2*scale, 12*scale, 6*scale); // Belly
        ctx.fillRect(x - 4*scale, y - 6*scale, 8*scale, 6*scale);  // Face/chest
        
        // Patches for multicolor varieties
        if (Array.isArray(baseColor)) {
            ctx.fillStyle = baseColor[1];
            // Patch on face
            ctx.fillRect(x - 3*scale, y - 6*scale, 6*scale, 4*scale);
            // Patch on body
            ctx.fillRect(x + 2*scale, y - 3*scale, 5*scale, 4*scale);
            
            if (baseColor.length > 2) {
                ctx.fillStyle = baseColor[2];
                ctx.fillRect(x - 6*scale, y - 1*scale, 4*scale, 3*scale);
            }
        }
        
        // Eyes (black dots with white highlights like in the example)
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x - 4*scale, y - 5*scale, 2*scale, 2*scale); // Left eye
        ctx.fillRect(x + 2*scale, y - 5*scale, 2*scale, 2*scale);  // Right eye
        
        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x - 4*scale, y - 5*scale, scale, scale); // Left highlight
        ctx.fillRect(x + 2*scale, y - 5*scale, scale, scale);  // Right highlight
        
        // Ears with outline
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x - 7*scale, y - 9*scale, 3*scale, 4*scale); // Left ear outline
        ctx.fillRect(x + 4*scale, y - 9*scale, 3*scale, 4*scale); // Right ear outline
        
        // Ear fills
        ctx.fillStyle = Array.isArray(baseColor) ? baseColor[0] : baseColor;
        ctx.fillRect(x - 6*scale, y - 8*scale, scale, 2*scale); // Left ear
        ctx.fillRect(x + 5*scale, y - 8*scale, scale, 2*scale); // Right ear
        
        // Nose (small dark triangle)
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x - scale/2, y - 3*scale, scale, scale);
        
        // Feet (small dark rectangles)
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x - 7*scale, y + 3*scale, 2*scale, 2*scale); // Front left
        ctx.fillRect(x - 3*scale, y + 3*scale, 2*scale, 2*scale); // Front right
        ctx.fillRect(x + 2*scale, y + 3*scale, 2*scale, 2*scale); // Back left
        ctx.fillRect(x + 6*scale, y + 3*scale, 2*scale, 2*scale); // Back right
        
        // Fur texture based on type (more subtle than before)
        if (appearance.furType === 'long') {
            ctx.fillStyle = Array.isArray(baseColor) ? baseColor[1] || baseColor[0] : baseColor;
            // Softer fur spikes
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(x - 6*scale + i*3*scale, y + 2*scale, scale, scale);
            }
        } else if (appearance.furType === 'rosette') {
            ctx.fillStyle = outlineColor;
            // Small rosette patterns
            ctx.fillRect(x - 2*scale, y - 2*scale, scale, scale);
            ctx.fillRect(x + 2*scale, y, scale, scale);
        } else if (appearance.furType === 'ridgeback') {
            ctx.fillStyle = outlineColor;
            // Ridge pattern down the back
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(x - scale/2, y - 4*scale + i*2*scale, scale, scale);
            }
        }
        
        // Accessories
        if (appearance.accessory === 'bow') {
            // Bow outline
            ctx.fillStyle = outlineColor;
            ctx.fillRect(x - 3*scale, y - 10*scale, 6*scale, 3*scale);
            // Bow fill
            ctx.fillStyle = '#FF69B4';
            ctx.fillRect(x - 2*scale, y - 9*scale, 4*scale, scale);
            // Bow center
            ctx.fillStyle = '#FF1493';
            ctx.fillRect(x - scale/2, y - 9*scale, scale, scale);
        } else if (appearance.accessory === 'hat') {
            // Hat outline
            ctx.fillStyle = outlineColor;
            ctx.fillRect(x - 4*scale, y - 12*scale, 8*scale, 4*scale);
            // Hat fill
            ctx.fillStyle = '#4B0082';
            ctx.fillRect(x - 3*scale, y - 11*scale, 6*scale, 2*scale);
            // Hat band
            ctx.fillStyle = '#8B008B';
            ctx.fillRect(x - 3*scale, y - 10*scale, 6*scale, scale);
        }
        
        ctx.restore();
    }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});