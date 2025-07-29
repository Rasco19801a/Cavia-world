# Guinea Pig Village - Phaser Edition 🐹⚡

Een moderne versie van het Guinea Pig Village spel, gebouwd met **Phaser 3** voor verbeterde prestaties en functionaliteit!

## 🆕 Wat is nieuw in de Phaser versie?

### ⚡ Prestatie verbeteringen
- **Hardware-accelerated rendering** met WebGL
- **Vloeiende animaties** en tweens
- **Optimized sprite management** en batching
- **Betere frame rates** en responsiviteit

### 🎨 Verbeterde graphics
- **Pixel-perfect rendering** bij elke schaalgrootte
- **Procedurele sprite generatie** zonder externe assets
- **Geavanceerde particle effects** en visuele feedback
- **Responsieve schaling** voor alle apparaten

### 🔊 Verbeterde audio
- **Web Audio API** integratie
- **Dynamische sound generation** 
- **Verbeterde geluidskwaliteit** en timing
- **Audio context management**

### 📱 Mobiele optimalisaties
- **Touch-geoptimaliseerde controls**
- **Responsief design** voor alle schermgroottes
- **Orientation change handling**
- **Zoom prevention** en andere mobiele verbeteringen

### 🎮 Geavanceerde input handling
- **Phaser's input system** voor betere responsiviteit
- **Gamepad support** (experimenteel)
- **Multi-input support** (keyboard, touch, mouse)

## 🚀 Hoe te gebruiken

### Optie 1: Direct via browser (Aanbevolen)
```bash
# Start een lokale server
python -m http.server 8000

# Open index-phaser.html in je browser
http://localhost:8000/index-phaser.html
```

### Optie 2: Met Node.js
```bash
# Installeer dependencies (optioneel)
npm install

# Start de server
npm start

# Navigeer naar de Phaser versie
http://localhost:8000/index-phaser.html
```

## 📁 Bestandsstructuur Phaser Versie

```
guinea-pig-village/
├── index-phaser.html          # Hoofdpagina voor Phaser versie
├── phaser-styles.css          # Stijlen voor Phaser versie
├── package.json               # NPM dependencies
├── phaser-game/               # Phaser game bestanden
│   ├── GameData.js           # Data management systeem
│   ├── AssetManager.js       # Procedurele asset generatie
│   ├── PhaserGame.js         # Hoofd game configuratie
│   └── scenes/               # Alle game scenes
│       ├── BootScene.js      # Laad scene
│       ├── CustomizationScene.js  # Karakter aanpassing
│       ├── VillageScene.js   # Hoofd dorp scene
│       ├── VetScene.js       # Dierenarts mini-game
│       ├── FarmScene.js      # Boerderij mini-game
│       ├── ShopScene.js      # Winkel scene
│       └── GroomingScene.js  # Trimmen mini-game
├── [originele bestanden...]  # Originele vanilla JS versie
```

## 🎯 Gameplay Features

Alle originele features zijn behouden en verbeterd:

### 🎨 Guinea Pig Customization
- **Live preview** met canvas rendering
- **Realtime updates** bij wijzigingen
- **Verbeterde randomization** en reset functionaliteit

### 🏘️ Village Exploration  
- **Vloeiende beweging** met Phaser physics
- **Verbeterde collision detection**
- **Animated walk cycles** en effects
- **Betere camera follow** systeem

### 🎮 Mini-Games
1. **Dierenarts** - Timing-based mini-game met verbeterde visuele feedback
2. **Boerderij** - Carrot collection met vloeiende beweging
3. **Speelgoedwinkel** - Enhanced item selection interface
4. **Trim-salon** - Brushing game met particle effects

### 💾 Progress System
- **Behouden save/load** functionaliteit
- **Verbeterde HUD updates**
- **Realtime inventory management**

## 🔧 Technische Details

### Phaser 3 Features gebruikt:
- **Scene Management** - Modulaire scene architectuur
- **Arcade Physics** - Voor beweging en collision detection
- **Tween System** - Voor vloeiende animaties
- **Input Management** - Unified input handling
- **Render Textures** - Voor procedurele sprite generatie
- **Scale Manager** - Voor responsief design

### Architectuur Voordelen:
- **Betere code organisatie** met scene-based structuur
- **Herbruikbare components** en systemen
- **Verbeterde performance** door Phaser's optimalisaties
- **Makkelijker uitbreidbaar** voor nieuwe features

## 🎨 Procedurele Art Systeem

De Phaser versie genereert alle graphics procedureel:

```javascript
// Voorbeeld: Guinea pig texture generatie
createCustomGuineaPigTexture(furType, furColor, accessory) {
    const graphics = this.scene.add.graphics();
    const texture = this.scene.add.renderTexture(0, 0, 32, 32);
    
    // Teken lichaam, hoofd, oren...
    // Voeg fur type effecten toe...
    // Voeg accessoires toe...
    
    texture.draw(graphics, 0, 0);
    texture.saveTexture('custom_player');
}
```

## 📱 Mobiele Ondersteuning

De Phaser versie heeft verbeterde mobiele ondersteuning:

- **Touch controls** automatisch gedetecteerd
- **D-pad interface** voor beweging
- **Responsive UI** elementen
- **Orientation handling**
- **Zoom prevention**

## 🔧 Development

### Nieuwe features toevoegen:

1. **Nieuwe Scene maken:**
```javascript
class NewScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NewScene' });
    }
    
    create() {
        // Scene logic hier
    }
}
```

2. **Voeg toe aan game config:**
```javascript
scene: [
    // ... bestaande scenes,
    NewScene
]
```

### Debug Mode:
```javascript
// In PhaserGame.js configuratie
physics: {
    default: 'arcade',
    arcade: {
        debug: true  // Schakel in voor debug visuals
    }
}
```

## 🎮 Controls

### Desktop:
- **Beweging**: Pijltjes toetsen of WASD
- **Interactie**: E toets of Spatiebalk
- **Menu navigatie**: Pijltjes toetsen
- **Pauzeren**: Pauze knop in HUD

### Mobiel:
- **D-Pad**: Voor beweging
- **Actie knop**: Voor interacties
- **Touch UI**: Voor menu's en interface

## 🚀 Prestatie Tips

Voor de beste ervaring:

1. **Gebruik een moderne browser** met WebGL ondersteuning
2. **Start een lokale server** in plaats van bestanden direct openen
3. **Sluit andere tabbladen** voor optimale prestaties
4. **Gebruik de nieuwste browser versie**

## 🔄 Vergelijking: Vanilla JS vs Phaser

| Feature | Vanilla JS | Phaser 3 |
|---------|------------|----------|
| Rendering | Canvas 2D | WebGL + Canvas |
| Performance | Goed | Uitstekend |
| Animaties | CSS/Manual | Tween System |
| Physics | Manual | Arcade Physics |
| Input | Event Listeners | Input Manager |
| Mobile | Basic Touch | Optimized Touch |
| Scaling | CSS | Scale Manager |
| Audio | Web Audio | Enhanced Audio |

## 🛠️ Browser Compatibiliteit

**Volledig ondersteund:**
- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

**Mobiele browsers:**
- Chrome Mobile
- Safari iOS
- Samsung Internet
- Firefox Mobile

## 🤝 Contributing

De Phaser versie bouwt voort op het originele spel. Alle originele functionaliteit is behouden terwijl we de voordelen van Phaser 3 benutten.

### Ontwikkeling stappen:
1. Test de originele versie (`index.html`)
2. Vergelijk met Phaser versie (`index-phaser.html`)
3. Voeg nieuwe features toe in de `phaser-game/` directory

## 📜 Licentie

Zelfde licentie als het originele project - Vrij te gebruiken voor educatieve doeleinden.

---

**Veel plezier met de verbeterde Guinea Pig Village experience! 🐹✨**

*De kracht van Phaser 3 gecombineerd met de charme van pixel art gaming!*