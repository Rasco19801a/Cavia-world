// Asset Manager for Procedural Graphics
class AssetManager {
    constructor(scene) {
        this.scene = scene;
    }

    // Create procedural textures
    createTextures() {
        this.createPlayerTexture();
        this.createBuildingTextures();
        this.createUITextures();
        this.createItemTextures();
    }

    createPlayerTexture() {
        const graphics = this.scene.add.graphics();
        const size = 32;
        
        // Create render texture for guinea pig
        const pigTexture = this.scene.add.renderTexture(0, 0, size, size);
        
        // Body
        graphics.fillStyle(this.getFurColor('brown'));
        graphics.fillEllipse(size/2, size/2 + 4, 24, 16);
        
        // Head
        graphics.fillEllipse(size/2, size/2 - 6, 18, 18);
        
        // Ears
        graphics.fillEllipse(size/2 - 6, size/2 - 12, 6, 8);
        graphics.fillEllipse(size/2 + 6, size/2 - 12, 6, 8);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size/2 - 4, size/2 - 8, 2);
        graphics.fillCircle(size/2 + 4, size/2 - 8, 2);
        
        // Nose
        graphics.fillStyle(0xFF69B4);
        graphics.fillCircle(size/2, size/2 - 4, 1);
        
        pigTexture.draw(graphics, 0, 0);
        pigTexture.saveTexture('player');
        
        graphics.destroy();
        pigTexture.destroy();
    }

    createBuildingTextures() {
        const buildings = [
            { key: 'vet', color: 0xFF6B6B, roof: 0x8B0000 },
            { key: 'farm', color: 0x4ECDC4, roof: 0x006400 },
            { key: 'shop', color: 0xFFE66D, roof: 0xFF8C00 },
            { key: 'grooming', color: 0xA8E6CF, roof: 0x9370DB }
        ];

        buildings.forEach(building => {
            const graphics = this.scene.add.graphics();
            const width = 64;
            const height = 64;
            
            const texture = this.scene.add.renderTexture(0, 0, width, height);
            
            // Main building
            graphics.fillStyle(building.color);
            graphics.fillRect(8, 20, 48, 44);
            
            // Roof
            graphics.fillStyle(building.roof);
            graphics.fillTriangle(4, 20, 32, 4, 60, 20);
            
            // Door
            graphics.fillStyle(0x8B4513);
            graphics.fillRect(24, 40, 16, 24);
            
            // Door handle
            graphics.fillStyle(0xFFD700);
            graphics.fillCircle(36, 52, 2);
            
            // Windows
            graphics.fillStyle(0x87CEEB);
            graphics.fillRect(12, 28, 12, 8);
            graphics.fillRect(40, 28, 12, 8);
            
            texture.draw(graphics, 0, 0);
            texture.saveTexture(building.key);
            
            graphics.destroy();
            texture.destroy();
        });
    }

    createUITextures() {
        // Create button texture
        const graphics = this.scene.add.graphics();
        const buttonTexture = this.scene.add.renderTexture(0, 0, 100, 30);
        
        graphics.fillStyle(0xFFD700);
        graphics.fillRoundedRect(0, 0, 100, 30, 15);
        graphics.lineStyle(2, 0x8B4513);
        graphics.strokeRoundedRect(0, 0, 100, 30, 15);
        
        buttonTexture.draw(graphics, 0, 0);
        buttonTexture.saveTexture('button');
        
        graphics.destroy();
        buttonTexture.destroy();
    }

    createItemTextures() {
        const items = [
            { key: 'carrot', color: 0xFF6600, detail: 0x00FF00 },
            { key: 'toy_ball', color: 0xFF69B4, detail: 0xFFFF00 },
            { key: 'toy_tunnel', color: 0x9370DB, detail: 0xFFFFFF },
            { key: 'brush', color: 0x8B4513, detail: 0xC0C0C0 }
        ];

        items.forEach(item => {
            const graphics = this.scene.add.graphics();
            const size = 16;
            const texture = this.scene.add.renderTexture(0, 0, size, size);
            
            switch(item.key) {
                case 'carrot':
                    graphics.fillStyle(item.color);
                    graphics.fillTriangle(size/2, 2, size/2 - 4, size - 2, size/2 + 4, size - 2);
                    graphics.fillStyle(item.detail);
                    graphics.fillRect(size/2 - 1, 0, 2, 4);
                    break;
                case 'toy_ball':
                    graphics.fillStyle(item.color);
                    graphics.fillCircle(size/2, size/2, 6);
                    graphics.fillStyle(item.detail);
                    graphics.fillCircle(size/2 - 2, size/2 - 2, 2);
                    break;
                case 'toy_tunnel':
                    graphics.fillStyle(item.color);
                    graphics.fillEllipse(size/2, size/2, 12, 8);
                    graphics.fillStyle(0x000000);
                    graphics.fillEllipse(size/2, size/2, 8, 4);
                    break;
                case 'brush':
                    graphics.fillStyle(item.color);
                    graphics.fillRect(size/2 - 2, 2, 4, 8);
                    graphics.fillStyle(item.detail);
                    graphics.fillRect(size/2 - 3, 10, 6, 4);
                    break;
            }
            
            texture.draw(graphics, 0, 0);
            texture.saveTexture(item.key);
            
            graphics.destroy();
            texture.destroy();
        });
    }

    // Create custom guinea pig texture based on customization
    createCustomGuineaPigTexture(furType, furColor, accessory) {
        const graphics = this.scene.add.graphics();
        const size = 32;
        
        const texture = this.scene.add.renderTexture(0, 0, size, size);
        
        const color = this.getFurColor(furColor);
        
        // Body
        graphics.fillStyle(color);
        graphics.fillEllipse(size/2, size/2 + 4, 24, 16);
        
        // Head
        graphics.fillEllipse(size/2, size/2 - 6, 18, 18);
        
        // Fur type effects
        if (furType === 'long') {
            graphics.fillEllipse(size/2, size/2 + 8, 28, 14);
        } else if (furType === 'rosette') {
            graphics.fillStyle(this.darkenColor(color, 0.2));
            graphics.fillCircle(size/2 - 4, size/2, 3);
            graphics.fillCircle(size/2 + 4, size/2 + 2, 3);
        }
        
        // Ears
        graphics.fillStyle(color);
        graphics.fillEllipse(size/2 - 6, size/2 - 12, 6, 8);
        graphics.fillEllipse(size/2 + 6, size/2 - 12, 6, 8);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillCircle(size/2 - 4, size/2 - 8, 2);
        graphics.fillCircle(size/2 + 4, size/2 - 8, 2);
        
        // Nose
        graphics.fillStyle(0xFF69B4);
        graphics.fillCircle(size/2, size/2 - 4, 1);
        
        // Accessory
        if (accessory === 'bow') {
            graphics.fillStyle(0xFF1493);
            graphics.fillEllipse(size/2 - 3, size/2 - 16, 6, 4);
            graphics.fillEllipse(size/2 + 3, size/2 - 16, 6, 4);
            graphics.fillStyle(0x8B0000);
            graphics.fillRect(size/2 - 1, size/2 - 18, 2, 4);
        } else if (accessory === 'hat') {
            graphics.fillStyle(0x000000);
            graphics.fillEllipse(size/2, size/2 - 16, 12, 6);
            graphics.fillRect(size/2 - 4, size/2 - 20, 8, 4);
        }
        
        texture.draw(graphics, 0, 0);
        texture.saveTexture('custom_player');
        
        graphics.destroy();
        texture.destroy();
    }

    getFurColor(colorName) {
        const colors = {
            brown: 0x8B4513,
            white: 0xFFFFFF,
            black: 0x000000,
            ginger: 0xFF6600,
            gray: 0x808080,
            patches: 0xF4A460,
            tricolor: 0xDEB887
        };
        return colors[colorName] || colors.brown;
    }

    darkenColor(color, factor) {
        const r = (color >> 16) & 0xFF;
        const g = (color >> 8) & 0xFF;
        const b = color & 0xFF;
        
        return ((r * (1 - factor)) << 16) | 
               ((g * (1 - factor)) << 8) | 
               (b * (1 - factor));
    }

    // Create tilemap background
    createBackground() {
        const graphics = this.scene.add.graphics();
        const tileSize = 32;
        const mapWidth = 20;
        const mapHeight = 15;
        
        const bgTexture = this.scene.add.renderTexture(0, 0, mapWidth * tileSize, mapHeight * tileSize);
        
        // Create grass tiles
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                const baseGreen = 0x228B22;
                const variation = Math.random() * 0x202020;
                graphics.fillStyle(baseGreen + variation);
                graphics.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                
                // Add some grass details
                if (Math.random() < 0.3) {
                    graphics.fillStyle(0x32CD32);
                    for (let i = 0; i < 3; i++) {
                        const grassX = x * tileSize + Math.random() * tileSize;
                        const grassY = y * tileSize + Math.random() * tileSize;
                        graphics.fillRect(grassX, grassY, 2, 4);
                    }
                }
            }
        }
        
        bgTexture.draw(graphics, 0, 0);
        bgTexture.saveTexture('background');
        
        graphics.destroy();
        bgTexture.destroy();
    }
}