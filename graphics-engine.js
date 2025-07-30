// Enhanced Graphics Engine with Konva.js
// Provides better animations, effects, and rendering performance

class GraphicsEngine {
    constructor(containerId, width = 640, height = 480) {
        this.width = width;
        this.height = height;
        
        // Initialize Konva stage
        this.stage = new Konva.Stage({
            container: containerId,
            width: width,
            height: height
        });
        
        // Create layers for different elements
        this.backgroundLayer = new Konva.Layer();
        this.gameLayer = new Konva.Layer();
        this.characterLayer = new Konva.Layer();
        this.uiLayer = new Konva.Layer();
        this.effectsLayer = new Konva.Layer();
        
        // Add layers to stage
        this.stage.add(this.backgroundLayer);
        this.stage.add(this.gameLayer);
        this.stage.add(this.characterLayer);
        this.stage.add(this.uiLayer);
        this.stage.add(this.effectsLayer);
        
        // Animation frame management
        this.animations = new Set();
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.createBackground();
        this.setupAnimationLoop();
    }
    
    createBackground() {
        // Create gradient background
        const gradient = this.backgroundLayer.getContext()._context.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(0.7, '#98FB98'); // Pale green
        gradient.addColorStop(1, '#90EE90'); // Light green
        
        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: this.width,
            height: this.height,
            fill: gradient
        });
        
        this.backgroundLayer.add(background);
        
        // Add clouds
        this.createClouds();
        
        // Add grass texture
        this.createGrassTexture();
        
        this.backgroundLayer.draw();
    }
    
    createClouds() {
        const cloudCount = 3;
        for (let i = 0; i < cloudCount; i++) {
            const cloud = this.createCloud(
                Math.random() * this.width,
                50 + Math.random() * 100
            );
            this.backgroundLayer.add(cloud);
            
            // Animate clouds slowly moving
            this.animateCloud(cloud);
        }
    }
    
    createCloud(x, y) {
        const cloud = new Konva.Group({
            x: x,
            y: y
        });
        
        // Create multiple circles for cloud effect
        const circles = [
            { x: 0, y: 0, radius: 20 },
            { x: 15, y: -5, radius: 25 },
            { x: 30, y: 0, radius: 20 },
            { x: 45, y: 5, radius: 18 },
            { x: 20, y: 10, radius: 15 }
        ];
        
        circles.forEach(circle => {
            const cloudPart = new Konva.Circle({
                x: circle.x,
                y: circle.y,
                radius: circle.radius,
                fill: 'rgba(255, 255, 255, 0.8)',
                stroke: 'rgba(255, 255, 255, 0.9)',
                strokeWidth: 1
            });
            cloud.add(cloudPart);
        });
        
        return cloud;
    }
    
    animateCloud(cloud) {
        const tween = new Konva.Tween({
            node: cloud,
            duration: 30 + Math.random() * 20, // 30-50 seconds
            x: cloud.x() + this.width + 100,
            onFinish: () => {
                cloud.x(-100);
                this.animateCloud(cloud); // Restart animation
            }
        });
        tween.play();
    }
    
    createGrassTexture() {
        const grassGroup = new Konva.Group();
        
        // Create grass blades
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = this.height - 50 + Math.random() * 30;
            const height = 15 + Math.random() * 10;
            
            const grass = new Konva.Line({
                points: [x, y, x + Math.random() * 4 - 2, y - height],
                stroke: '#228B22',
                strokeWidth: 2,
                lineCap: 'round'
            });
            
            grassGroup.add(grass);
        }
        
        this.backgroundLayer.add(grassGroup);
    }
    
    // Enhanced Guinea Pig Sprite with animations
    createGuineaPig(x, y, config = {}) {
        const pig = new Konva.Group({
            x: x,
            y: y,
            name: 'guineaPig'
        });
        
        const pixelSize = 3; // Size of each pixel
        const furColor = this.getFurColor(config.furColor || 'brown');
        const bellyColor = '#F5F5DC';
        const outlineColor = '#000000';
        
        // Define the guinea pig shape in a 16x12 grid (same as in game.js)
        const sprite = [
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],  // Row 0
            [0,0,0,1,1,2,2,2,2,2,2,1,1,0,0,0],  // Row 1
            [0,0,1,2,2,2,2,2,2,2,2,2,2,1,0,0],  // Row 2
            [0,1,2,2,1,2,2,2,2,2,1,2,2,2,1,0],  // Row 3 - eyes
            [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],  // Row 4
            [1,2,2,3,3,3,3,3,3,3,3,3,2,2,2,1],  // Row 5 - belly start
            [1,2,3,3,3,3,3,3,3,3,3,3,3,2,2,1],  // Row 6
            [1,2,3,3,3,3,3,3,3,3,3,3,3,2,2,1],  // Row 7
            [1,2,2,3,3,3,3,3,3,3,3,3,2,2,2,1],  // Row 8
            [0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0],  // Row 9
            [0,0,1,1,2,1,1,2,2,1,1,2,1,1,0,0],  // Row 10 - feet
            [0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0],  // Row 11 - feet bottom
        ];
        
        // Create pixels
        const pixels = new Konva.Group({
            x: -8 * pixelSize,
            y: -6 * pixelSize
        });
        
        // Draw the sprite
        for (let row = 0; row < sprite.length; row++) {
            for (let col = 0; col < sprite[row].length; col++) {
                const pixel = sprite[row][col];
                if (pixel === 0) continue; // Skip transparent pixels
                
                let pixelColor;
                switch(pixel) {
                    case 1:
                        pixelColor = outlineColor;
                        break;
                    case 2:
                        pixelColor = furColor;
                        break;
                    case 3:
                        pixelColor = bellyColor;
                        break;
                }
                
                const rect = new Konva.Rect({
                    x: col * pixelSize,
                    y: row * pixelSize,
                    width: pixelSize,
                    height: pixelSize,
                    fill: pixelColor
                });
                
                pixels.add(rect);
            }
        }
        
        // Add patches for multicolor varieties
        if (config.furColor === 'patches' || config.furColor === 'tricolor') {
            // Face patch
            const facePatch = new Konva.Rect({
                x: 5 * pixelSize,
                y: 2 * pixelSize,
                width: 4 * pixelSize,
                height: 3 * pixelSize,
                fill: '#CD853F'
            });
            pixels.add(facePatch);
            
            // Body patch
            const bodyPatch = new Konva.Rect({
                x: 10 * pixelSize,
                y: 5 * pixelSize,
                width: 4 * pixelSize,
                height: 3 * pixelSize,
                fill: '#CD853F'
            });
            pixels.add(bodyPatch);
        }
        
        // Eye shines (white pixels)
        const leftEyeShine = new Konva.Rect({
            x: 4 * pixelSize,
            y: 3 * pixelSize,
            width: pixelSize,
            height: pixelSize,
            fill: '#FFFFFF'
        });
        pixels.add(leftEyeShine);
        
        const rightEyeShine = new Konva.Rect({
            x: 11 * pixelSize,
            y: 3 * pixelSize,
            width: pixelSize,
            height: pixelSize,
            fill: '#FFFFFF'
        });
        pixels.add(rightEyeShine);
        
        // Nose
        const nose = new Konva.Rect({
            x: 7.5 * pixelSize,
            y: 5 * pixelSize,
            width: pixelSize,
            height: pixelSize,
            fill: '#8B4513'
        });
        pixels.add(nose);
        
        pig.add(pixels);
        
        // Add breathing animation
        this.addBreathingAnimation(pixels);
        
        // Store reference for animations
        pig.pixels = pixels;
        pig.config = config;
        
        // Add to character layer
        this.characterLayer.add(pig);
        
        return pig;
    }
    
    // Helper function to get fur color
    getFurColor(colorName) {
        const colors = {
            brown: '#CD853F',
            white: '#F5F5DC',
            black: '#2F2F2F',
            ginger: '#D2691E',
            gray: '#A9A9A9',
            patches: '#F5F5DC',
            tricolor: '#F5F5DC'
        };
        return colors[colorName] || colors.brown;
    }
    
    // Add breathing animation to guinea pig
    addBreathingAnimation(pixelGroup) {
        const breathe = new Konva.Animation((frame) => {
            const scale = 1 + Math.sin(frame.time * 0.002) * 0.02;
            pixelGroup.scaleY(scale);
        }, this.characterLayer);
        
        breathe.start();
        this.animations.add(breathe);
    }
    
    // Walking animation for pixel art guinea pig
    startWalkingAnimation(pig, direction = 'right') {
        if (pig.walkingAnim) {
            pig.walkingAnim.stop();
        }
        
        const walkSpeed = 2;
        const bounceHeight = 2;
        
        pig.walkingAnim = new Konva.Animation((frame) => {
            // Move in direction
            if (direction === 'right') {
                pig.x(pig.x() + walkSpeed);
                pig.scaleX(1);
            } else if (direction === 'left') {
                pig.x(pig.x() - walkSpeed);
                pig.scaleX(-1);
            }
            
            // Add bounce
            const bounce = Math.abs(Math.sin(frame.time * 0.01)) * bounceHeight;
            pig.y(pig.attrs.baseY - bounce);
            
            // Wrap around screen
            if (pig.x() > this.width + 50) {
                pig.x(-50);
            } else if (pig.x() < -50) {
                pig.x(this.width + 50);
            }
        }, this.characterLayer);
        
        pig.attrs.baseY = pig.y();
        pig.walkingAnim.start();
    }
    
    stopWalkingAnimation(pig) {
        if (pig.walkingAnim) {
            pig.walkingAnim.stop();
            pig.y(pig.attrs.baseY);
        }
    }
    
    createAccessory(type) {
        const accessory = new Konva.Group({
            x: -20,
            y: -25
        });
        
        if (type === 'bow') {
            // Create a bow
            const bow = new Konva.Star({
                x: 0,
                y: 0,
                numPoints: 4,
                innerRadius: 3,
                outerRadius: 6,
                fill: '#FF69B4',
                stroke: '#FF1493',
                strokeWidth: 1
            });
            accessory.add(bow);
        } else if (type === 'hat') {
            // Create a tiny hat
            const hat = new Konva.Ellipse({
                x: 0,
                y: 0,
                radiusX: 8,
                radiusY: 3,
                fill: '#4B0082',
                stroke: '#2F0052',
                strokeWidth: 1
            });
            const hatTop = new Konva.Rect({
                x: -4,
                y: -8,
                width: 8,
                height: 8,
                fill: '#4B0082',
                stroke: '#2F0052',
                strokeWidth: 1
            });
            accessory.add(hat);
            accessory.add(hatTop);
        }
        
        return accessory;
    }
    
    // Particle effects
    createParticleEffect(x, y, type = 'coins') {
        const particleCount = type === 'coins' ? 5 : 10;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.createParticle(x, y, type);
            this.effectsLayer.add(particle);
            this.animateParticle(particle, type);
        }
        
        this.effectsLayer.draw();
    }
    
    createParticle(x, y, type) {
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;
        
        if (type === 'coins') {
            return new Konva.Circle({
                x: x + offsetX,
                y: y + offsetY,
                radius: 3,
                fill: '#FFD700',
                stroke: '#FFA500',
                strokeWidth: 1
            });
        } else if (type === 'hearts') {
            return new Konva.Star({
                x: x + offsetX,
                y: y + offsetY,
                numPoints: 5,
                innerRadius: 2,
                outerRadius: 4,
                fill: '#FF69B4'
            });
        } else {
            return new Konva.Circle({
                x: x + offsetX,
                y: y + offsetY,
                radius: 2,
                fill: '#FFFFFF',
                opacity: 0.8
            });
        }
    }
    
    animateParticle(particle, type) {
        const tween = new Konva.Tween({
            node: particle,
            duration: 1 + Math.random(),
            y: particle.y() - 50 - Math.random() * 30,
            opacity: 0,
            scaleX: 0,
            scaleY: 0,
            easing: Konva.Easings.EaseOut,
            onFinish: () => {
                particle.destroy();
            }
        });
        tween.play();
    }
    
    // Create interactive objects
    createCarrot(x, y) {
        const carrot = new Konva.Group({
            x: x,
            y: y,
            name: 'carrot'
        });
        
        // Carrot body
        const body = new Konva.Ellipse({
            x: 0,
            y: 0,
            radiusX: 6,
            radiusY: 15,
            fill: '#FF8C00',
            stroke: '#FF7F00',
            strokeWidth: 1
        });
        
        // Carrot leaves
        const leaves = new Konva.Star({
            x: 0,
            y: -12,
            numPoints: 3,
            innerRadius: 3,
            outerRadius: 8,
            fill: '#228B22',
            rotation: 45
        });
        
        carrot.add(body);
        carrot.add(leaves);
        
        // Add floating animation
        const floatTween = new Konva.Tween({
            node: carrot,
            duration: 2,
            y: y - 5,
            yoyo: true,
            repeat: -1,
            easing: Konva.Easings.EaseInOut
        });
        floatTween.play();
        
        // Add rotation animation
        const rotateTween = new Konva.Tween({
            node: carrot,
            duration: 4,
            rotation: 360,
            repeat: -1,
            easing: Konva.Easings.Linear
        });
        rotateTween.play();
        
        this.gameLayer.add(carrot);
        return carrot;
    }
    
    // UI elements with better styling
    createButton(x, y, width, height, text, onClick) {
        const button = new Konva.Group({
            x: x,
            y: y,
            name: 'button'
        });
        
        const bg = new Konva.Rect({
            x: 0,
            y: 0,
            width: width,
            height: height,
            fill: '#4CAF50',
            stroke: '#45a049',
            strokeWidth: 2,
            cornerRadius: 8,
            shadowColor: 'black',
            shadowBlur: 4,
            shadowOffset: { x: 2, y: 2 },
            shadowOpacity: 0.3
        });
        
        const label = new Konva.Text({
            x: 0,
            y: height / 2 - 8,
            width: width,
            text: text,
            fontSize: 16,
            fontFamily: 'Arial',
            fill: 'white',
            align: 'center',
            verticalAlign: 'middle'
        });
        
        button.add(bg);
        button.add(label);
        
        // Add hover and click effects
        button.on('mouseenter', () => {
            bg.fill('#5CBF60');
            this.stage.container().style.cursor = 'pointer';
            this.uiLayer.draw();
        });
        
        button.on('mouseleave', () => {
            bg.fill('#4CAF50');
            this.stage.container().style.cursor = 'default';
            this.uiLayer.draw();
        });
        
        button.on('click', onClick);
        
        this.uiLayer.add(button);
        return button;
    }
    
    setupAnimationLoop() {
        const animate = () => {
            // Update particles
            this.updateParticles();
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateParticles() {
        // Clean up destroyed particles
        this.particles = this.particles.filter(particle => !particle.isDestroyed);
    }
    
    // Utility methods
    moveCharacter(character, x, y, duration = 0.5) {
        const tween = new Konva.Tween({
            node: character,
            duration: duration,
            x: x,
            y: y,
            easing: Konva.Easings.EaseInOut
        });
        tween.play();
        return tween;
    }
    
    fadeIn(node, duration = 0.5) {
        node.opacity(0);
        const tween = new Konva.Tween({
            node: node,
            duration: duration,
            opacity: 1,
            easing: Konva.Easings.EaseIn
        });
        tween.play();
        return tween;
    }
    
    fadeOut(node, duration = 0.5) {
        const tween = new Konva.Tween({
            node: node,
            duration: duration,
            opacity: 0,
            easing: Konva.Easings.EaseOut
        });
        tween.play();
        return tween;
    }
    
    // Draw all layers
    draw() {
        this.backgroundLayer.draw();
        this.gameLayer.draw();
        this.characterLayer.draw();
        this.uiLayer.draw();
        this.effectsLayer.draw();
    }
    
    // Get stage for event handling
    getStage() {
        return this.stage;
    }
}