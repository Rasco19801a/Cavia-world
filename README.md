# Guinea Pig Village 🐹

A charming pixel-art web game where you create and care for your own guinea pig in a Dutch village! Customize your guinea pig's appearance and explore four different buildings, each offering unique mini-games and activities.

## Features

### 🎨 Guinea Pig Customization
- **Fur Types**: Short, Long, Rosette, Ridgeback
- **Colors**: Brown, White, Black, Ginger, Gray, Patches, Tricolor
- **Accessories**: None, Bow, Tiny Hat
- Live preview with randomize and reset options

### 🏘️ Village Exploration
Navigate a charming Dutch village with four buildings:

- **🏥 Dierenarts** (Veterinarian) - Health check-up mini-game
- **🚜 Boerderij** (Farm) - Carrot collection game
- **🧸 Speelgoedwinkel** (Toy Shop) - Buy toys and accessories
- **✂️ Trim-salon** (Grooming Salon) - Brushing mini-game

### 🎮 Mini-Games
1. **Vet Check-up**: Time your button press perfectly in the green zone
2. **Farm**: Collect carrots within the time limit to earn coins
3. **Shop**: Spend coins on toys that give buffs to your guinea pig
4. **Grooming**: Brush your guinea pig to earn style badges

### 💾 Progress System
- **Coins** 🥕: Earned from farm activities
- **Health Stars** ⭐: Earned from successful vet visits
- **Style Badges** ✨: Earned from grooming sessions
- **Inventory**: Store toys and items you've purchased
- **Auto-save**: Progress automatically saves to localStorage

## How to Run

### Option 1: Python Simple Server (Recommended)
```bash
# Navigate to the game directory
cd guinea-pig-village

# Start a local server (Python 3)
python -m http.server 8000

# Or for Python 2
python -m SimpleHTTPServer 8000

# Open your browser to:
http://localhost:8000
```

### Option 2: Node.js Server
```bash
# Install a simple server
npm install -g http-server

# Start the server
http-server

# Follow the URL provided (usually http://localhost:8080)
```

### Option 3: Direct File Opening
⚠️ **Note**: Some browsers may block certain features when opening files directly due to CORS restrictions. Using a local server is recommended.

Simply open `index.html` in your web browser.

## Controls

### 🖱️ Desktop Controls
- **Movement**: Arrow Keys or WASD
- **Interact**: E key or Space bar
- **Menu Navigation**: Arrow Keys (↑↓) in shops
- **Pause**: Click the pause button or use the pause menu

### 📱 Mobile Controls
Touch controls automatically appear on mobile devices:
- **D-Pad**: For movement
- **Action Button (E)**: For interactions
- All UI buttons are touch-friendly

### 🎮 Game-Specific Controls

#### Village
- Move around with arrow keys/WASD
- Walk into buildings to see interaction prompts
- Press E when near a building to enter

#### Vet (Dierenarts)
- Press Space/E when the red bar hits the green zone
- Perfect timing earns a health star

#### Farm (Boerderij)
- Use Space/E to collect carrots near the crosshair
- Collect 5 carrots within 10 seconds to earn coins

#### Shop (Speelgoedwinkel)
- Use ↑↓ arrow keys to select items
- Press E to purchase selected item
- Press Escape to exit

#### Grooming (Trim-salon)
- Press Space/E repeatedly to brush your guinea pig
- Complete 10 brush strokes to earn a style badge

## Game Architecture

### 🏗️ Modular Design
- **Scene System**: Each location is a separate scene with its own logic
- **State Management**: Centralized GameState handles all player data
- **Input System**: Unified input handling for keyboard and touch
- **Audio System**: WebAudio-generated sound effects
- **Sprite System**: Procedural pixel art rendering

### 🎨 Art Style
- **Pixel Perfect**: 16x16 and 32x32 tile-based graphics
- **Procedural Art**: All sprites drawn programmatically in JavaScript
- **Nearest-Neighbor**: Crisp pixel scaling without blur
- **Responsive**: Adapts to different screen sizes while maintaining pixel aesthetic

### 🔊 Audio
- **WebAudio API**: Dynamically generated sound effects
- **Sound Types**: 
  - Step sounds when walking
  - Collection sounds for items
  - Success/error feedback
  - Toggleable on/off

## File Structure

```
guinea-pig-village/
├── index.html      # Main HTML structure
├── styles.css      # All game styling and responsive design
├── game.js         # Complete game logic and systems
└── README.md       # This file
```

## Technical Features

- **No External Dependencies**: Runs entirely in the browser
- **Local Storage**: Automatic save/load functionality
- **Responsive Design**: Works on desktop and mobile
- **Pixel-Perfect Rendering**: Maintains crisp pixel art at any scale
- **Touch Support**: Full touch interface for mobile devices
- **Performance Optimized**: Efficient rendering with requestAnimationFrame

## Customization and Extension

The game is designed to be easily extensible:

### Adding New Buildings
1. Add building data to `VillageScene.buildings`
2. Create a new Scene class extending the base `Scene`
3. Add the scene to `SceneManager.scenes`

### Adding New Items
1. Extend the `items` array in `ShopScene`
2. Add corresponding inventory logic in `GameState`

### Adding New Fur Types/Colors
1. Update the HTML select options
2. Add rendering logic in `SpriteRenderer.drawGuineaPig`

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11.3+)
- **Mobile Browsers**: Optimized touch controls

## Development Notes

- Built with vanilla JavaScript ES6+
- Uses HTML5 Canvas for all rendering
- WebAudio API for sound (fallback for unsupported browsers)
- CSS Grid and Flexbox for responsive layout
- LocalStorage for persistence

## Credits

Created as a complete pixel-art web game featuring Dutch-themed guinea pig village life. No external assets or frameworks used - everything is procedurally generated!

---

Enjoy exploring the village with your custom guinea pig! 🐹✨