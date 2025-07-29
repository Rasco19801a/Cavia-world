class VillageScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VillageScene' });
    }

    create() {
        // Hide all panels
        document.getElementById('customizationPanel').style.display = 'none';
        
        // Setup touch controls for mobile
        this.setupTouchControls();
        
        // Create background
        this.add.tileSprite(0, 0, 640, 480, 'background').setOrigin(0, 0);
        
        // Create buildings
        this.buildings = this.createBuildings();
        
        // Create player
        this.player = this.add.sprite(320, 240, 'custom_player');
        this.player.setScale(2);
        
        // Setup camera
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, 640, 480);
        
        // Setup physics (optional for simple movement)
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(16, 16);
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.actionKey = this.input.keyboard.addKey('E');
        this.spaceKey = this.input.keyboard.addKey('SPACE');
        
        // Interaction variables
        this.nearBuilding = null;
        this.interactionText = null;
        
        // Movement
        this.playerSpeed = 100;
        this.walkAnimation = null;
        
        // Setup pause functionality
        this.setupPause();
    }

    createBuildings() {
        const buildingData = [
            { 
                x: 150, y: 150, texture: 'vet', 
                name: 'Dierenarts', scene: 'VetScene',
                description: 'Health check-up mini-game'
            },
            { 
                x: 450, y: 150, texture: 'farm', 
                name: 'Boerderij', scene: 'FarmScene',
                description: 'Collect carrots to earn coins'
            },
            { 
                x: 150, y: 350, texture: 'shop', 
                name: 'Speelgoedwinkel', scene: 'ShopScene',
                description: 'Buy toys and accessories'
            },
            { 
                x: 450, y: 350, texture: 'grooming', 
                name: 'Trim-salon', scene: 'GroomingScene',
                description: 'Brushing mini-game'
            }
        ];
        
        const buildings = [];
        
        buildingData.forEach(data => {
            const building = this.add.sprite(data.x, data.y, data.texture);
            building.setScale(1.5);
            building.setInteractive();
            building.name = data.name;
            building.sceneName = data.scene;
            building.description = data.description;
            
            // Add physics for collision detection
            this.physics.add.existing(building, true); // true = static body
            building.body.setSize(48, 48);
            
            buildings.push(building);
        });
        
        return buildings;
    }

    setupTouchControls() {
        // Show touch controls on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.getElementById('touchControls').classList.remove('hidden');
        }
        
        // Touch control events
        const touchButtons = document.querySelectorAll('.dpad-btn');
        touchButtons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchInput(btn.dataset.key, true);
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchInput(btn.dataset.key, false);
            });
        });
        
        const actionBtn = document.getElementById('actionBtn');
        actionBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInteraction();
        });
        
        // Touch movement state
        this.touchInput = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    handleTouchInput(key, pressed) {
        switch(key) {
            case 'ArrowUp':
                this.touchInput.up = pressed;
                break;
            case 'ArrowDown':
                this.touchInput.down = pressed;
                break;
            case 'ArrowLeft':
                this.touchInput.left = pressed;
                break;
            case 'ArrowRight':
                this.touchInput.right = pressed;
                break;
        }
    }

    setupPause() {
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.scene.pause();
            // Show pause menu if you want to implement it
        });
    }

    update() {
        this.handleMovement();
        this.checkBuildingProximity();
        this.handleInteractionInput();
    }

    handleMovement() {
        const speed = this.playerSpeed;
        let velocityX = 0;
        let velocityY = 0;
        
        // Keyboard input
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            velocityX = -speed;
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            velocityX = speed;
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            velocityY = -speed;
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            velocityY = speed;
        }
        
        // Touch input
        if (this.touchInput.left) velocityX = -speed;
        if (this.touchInput.right) velocityX = speed;
        if (this.touchInput.up) velocityY = -speed;
        if (this.touchInput.down) velocityY = speed;
        
        // Apply movement
        this.player.body.setVelocity(velocityX, velocityY);
        
        // Play step sounds and animate
        if (velocityX !== 0 || velocityY !== 0) {
            this.playStepSound();
            this.animateWalk();
        } else {
            this.stopWalkAnimation();
        }
    }

    playStepSound() {
        // Simple step sound with limited frequency
        if (!this.lastStepTime || this.time.now - this.lastStepTime > 300) {
            this.lastStepTime = this.time.now;
            
            if (window.audioContext) {
                const oscillator = window.audioContext.createOscillator();
                const gainNode = window.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(window.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(150 + Math.random() * 50, window.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.05, window.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.1);
                
                oscillator.start(window.audioContext.currentTime);
                oscillator.stop(window.audioContext.currentTime + 0.1);
            }
        }
    }

    animateWalk() {
        // Simple bobbing animation
        if (!this.walkAnimation) {
            this.walkAnimation = this.tweens.add({
                targets: this.player,
                scaleY: { from: 2, to: 1.8 },
                duration: 200,
                yoyo: true,
                repeat: -1
            });
        }
    }

    stopWalkAnimation() {
        if (this.walkAnimation) {
            this.walkAnimation.stop();
            this.walkAnimation = null;
            this.player.setScale(2);
        }
    }

    checkBuildingProximity() {
        let nearestBuilding = null;
        let nearestDistance = Infinity;
        
        this.buildings.forEach(building => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                building.x, building.y
            );
            
            if (distance < 80 && distance < nearestDistance) {
                nearestDistance = distance;
                nearestBuilding = building;
            }
        });
        
        if (nearestBuilding !== this.nearBuilding) {
            this.nearBuilding = nearestBuilding;
            this.updateInteractionText();
        }
    }

    updateInteractionText() {
        if (this.interactionText) {
            this.interactionText.destroy();
            this.interactionText = null;
        }
        
        if (this.nearBuilding) {
            const building = this.nearBuilding;
            this.interactionText = this.add.text(
                building.x, building.y - 50,
                `Press E to enter\n${building.name}`,
                {
                    fontSize: '14px',
                    fill: '#000000',
                    backgroundColor: '#FFFFFF',
                    padding: { x: 8, y: 4 },
                    align: 'center'
                }
            ).setOrigin(0.5);
        }
    }

    handleInteractionInput() {
        if (Phaser.Input.Keyboard.JustDown(this.actionKey) || 
            Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.handleInteraction();
        }
    }

    handleInteraction() {
        if (this.nearBuilding) {
            this.enterBuilding(this.nearBuilding);
        }
    }

    enterBuilding(building) {
        // Play interaction sound
        if (window.audioContext) {
            const oscillator = window.audioContext.createOscillator();
            const gainNode = window.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(window.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523, window.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659, window.audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, window.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, window.audioContext.currentTime + 0.2);
            
            oscillator.start(window.audioContext.currentTime);
            oscillator.stop(window.audioContext.currentTime + 0.2);
        }
        
        // Store player position for return
        this.playerPosition = { x: this.player.x, y: this.player.y };
        
        // Switch to building scene
        this.scene.start(building.sceneName, { 
            returnScene: 'VillageScene',
            playerPosition: this.playerPosition
        });
    }

    // Called when returning from other scenes
    init(data) {
        if (data && data.playerPosition) {
            this.returnPosition = data.playerPosition;
        }
    }

    // Restore player position when returning
    create() {
        // ... existing create code ...
        
        // Restore position if returning from another scene
        if (this.returnPosition) {
            this.player.setPosition(this.returnPosition.x, this.returnPosition.y);
        }
    }
}