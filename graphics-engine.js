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
        
        // Body (main ellipse)
        const body = new Konva.Ellipse({
            x: 0,
            y: 0,
            radiusX: 25,
            radiusY: 15,
            fill: this.getFurColor(config.furColor || 'brown'),
            stroke: '#654321',
            strokeWidth: 1
        });
        
        // Head (circle)
        const head = new Konva.Circle({
            x: -20,
            y: -5,
            radius: 18,
            fill: this.getFurColor(config.furColor || 'brown'),
            stroke: '#654321',
            strokeWidth: 1
        });
        
        // Eyes
        const leftEye = new Konva.Circle({
            x: -28,
            y: -10,
            radius: 3,
            fill: 'black'
        });
        
        const rightEye = new Konva.Circle({
            x: -22,
            y: -10,
            radius: 3,
            fill: 'black'
        });
        
        // Eye shine
        const leftShine = new Konva.Circle({
            x: -29,
            y: -11,
            radius: 1,
            fill: 'white'
        });
        
        const rightShine = new Konva.Circle({
            x: -23,
            y: -11,
            radius: 1,
            fill: 'white'
        });
        
        // Nose
        const nose = new Konva.Ellipse({
            x: -32,
            y: -5,
            radiusX: 2,
            radiusY: 1,
            fill: 'pink'
        });
        
        // Ears
        const leftEar = new Konva.Ellipse({
            x: -22,
            y: -18,
            radiusX: 6,
            radiusY: 8,
            fill: this.getFurColor(config.furColor || 'brown'),
            stroke: '#654321',
            strokeWidth: 1,
            rotation: -20
        });
        
        const rightEar = new Konva.Ellipse({
            x: -15,
            y: -18,
            radiusX: 6,
            radiusY: 8,
            fill: this.getFurColor(config.furColor || 'brown'),
            stroke: '#654321',
            strokeWidth: 1,
            rotation: 20
        });
        
        // Legs
        const legs = [];
        for (let i = 0; i < 4; i++) {
            const leg = new Konva.Circle({
                x: -15 + (i * 10),
                y: 12,
                radius: 4,
                fill: this.getFurColor(config.furColor || 'brown'),
                stroke: '#654321',
                strokeWidth: 1
            });
            legs.push(leg);
        }
        
        // Add all parts to pig group
        pig.add(body);
        pig.add(head);
        pig.add(leftEar);
        pig.add(rightEar);
        pig.add(leftEye);
        pig.add(rightEye);
        pig.add(leftShine);
        pig.add(rightShine);
        pig.add(nose);
        legs.forEach(leg => pig.add(leg));
        
        // Add accessory if specified
        if (config.accessory && config.accessory !== 'none') {
            const accessory = this.createAccessory(config.accessory);
            pig.add(accessory);
        }
        
        // Add breathing animation
        this.addBreathingAnimation(body, head);
        
        // Add blinking animation
        this.addBlinkingAnimation(leftEye, rightEye, leftShine, rightShine);
        
        // Store animation state
        pig.animationState = {
            isWalking: false,
            direction: 'right',
            legs: legs
        };
        
        this.characterLayer.add(pig);
        return pig;
    }
    
    getFurColor(colorName) {
        const colors = {
            brown: '#8B4513',
            white: '#F5F5F5',
            black: '#2F2F2F',
            ginger: '#FF8C00',
            gray: '#808080',
            patches: '#8B4513', // Will add pattern later
            tricolor: '#8B4513'  // Will add pattern later
        };
        return colors[colorName] || colors.brown;
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
    
    addBreathingAnimation(body, head) {
        const breatheTween = new Konva.Tween({
            node: body,
            duration: 2,
            scaleX: 1.05,
            scaleY: 1.02,
            yoyo: true,
            repeat: -1,
            easing: Konva.Easings.EaseInOut
        });
        
        const headBreathe = new Konva.Tween({
            node: head,
            duration: 2,
            scaleX: 1.02,
            scaleY: 1.02,
            yoyo: true,
            repeat: -1,
            easing: Konva.Easings.EaseInOut
        });
        
        breatheTween.play();
        headBreathe.play();
    }
    
    addBlinkingAnimation(leftEye, rightEye, leftShine, rightShine) {
        const blink = () => {
            const blinkTween = new Konva.Tween({
                node: leftEye,
                duration: 0.1,
                scaleY: 0.1,
                yoyo: true,
                onFinish: () => {
                    setTimeout(blink, 2000 + Math.random() * 3000); // Blink every 2-5 seconds
                }
            });
            
            const blinkTween2 = new Konva.Tween({
                node: rightEye,
                duration: 0.1,
                scaleY: 0.1,
                yoyo: true
            });
            
            const shineBlink1 = new Konva.Tween({
                node: leftShine,
                duration: 0.1,
                scaleY: 0.1,
                yoyo: true
            });
            
            const shineBlink2 = new Konva.Tween({
                node: rightShine,
                duration: 0.1,
                scaleY: 0.1,
                yoyo: true
            });
            
            blinkTween.play();
            blinkTween2.play();
            shineBlink1.play();
            shineBlink2.play();
        };
        
        setTimeout(blink, 2000 + Math.random() * 3000);
    }
    
    // Walking animation
    startWalkingAnimation(pig, direction = 'right') {
        if (pig.animationState.isWalking) return;
        
        pig.animationState.isWalking = true;
        pig.animationState.direction = direction;
        
        // Scale flip for direction
        pig.scaleX(direction === 'left' ? -1 : 1);
        
        // Animate legs
        pig.animationState.legs.forEach((leg, index) => {
            const tween = new Konva.Tween({
                node: leg,
                duration: 0.3,
                y: leg.y() + (index % 2 === 0 ? -3 : 3),
                yoyo: true,
                repeat: -1,
                easing: Konva.Easings.EaseInOut
            });
            tween.play();
            leg.walkTween = tween;
        });
        
        // Body bob
        const bodyBob = new Konva.Tween({
            node: pig,
            duration: 0.6,
            y: pig.y() - 2,
            yoyo: true,
            repeat: -1,
            easing: Konva.Easings.EaseInOut
        });
        bodyBob.play();
        pig.bodyBobTween = bodyBob;
    }
    
    stopWalkingAnimation(pig) {
        if (!pig.animationState.isWalking) return;
        
        pig.animationState.isWalking = false;
        
        // Stop leg animations
        pig.animationState.legs.forEach(leg => {
            if (leg.walkTween) {
                leg.walkTween.destroy();
                leg.walkTween = null;
            }
        });
        
        // Stop body bob
        if (pig.bodyBobTween) {
            pig.bodyBobTween.destroy();
            pig.bodyBobTween = null;
        }
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