# MK.JS Mobile Enhanced Version

## 📱 Overview

This is a complete mobile-optimized version of MK.JS with full touch controls, responsive design, and an enhanced UI system.

## ✨ Key Features

- **Touch-Optimized Controls**: D-Pad for Player 1, Attack buttons for Player 2
- **Fully Responsive**: Works on all devices (phones, tablets, laptops)
- **Modern UI**: Professional menu, instructions, and about screens
- **Game Features**: All original fighters and moves
- **Smooth Performance**: Optimized for mobile devices
- **Pause/Resume**: Pause anytime during gameplay
- **Game Over Screen**: Replay or return to menu

## 🎮 How to Play

### Starting the Game
Open `game/mobile-index.html` in your browser

### Controls

**Player 1 (Left) - D-Pad Controls**
- ↑ **Up**: Jump
- ↓ **Down**: Squat (blocks high attacks)
- ← **Left**: Move backward
- → **Right**: Move forward

**Player 2 (Right) - Attack Buttons**
- **HP**: High Punch (strong, medium range)
- **LP**: Low Punch (quick, close range)
- **HK**: High Kick (strong, long range)
- **LK**: Low Kick (quick, medium range)

## 📂 File Structure

```
game/
├── mobile-index.html          # Main game file
├── styles/
│   └── mobile-styles.css      # Responsive styles
└── src/
    ├── mk.js                  # Original game engine
    ├── touch-controller.js    # Touch event handler
    └── mobile-game.js         # Game manager
```

## 🚀 Running Locally

```bash
# Start a local server
python -m http.server 8000
# or
npx http-server

# Open in browser
http://localhost:8000/game/mobile-index.html
```

## 📱 Mobile Testing

Find your IP address:
```bash
# Mac/Linux
ifconfig

# Windows  
ipconfig
```

Open on mobile: `http://<YOUR_IP>:8000/game/mobile-index.html`

## 🎯 Game Mechanics

- **Health**: 100 HP per fighter
- **Win Condition**: Reduce opponent to 0 HP
- **Defense**: Squat to block high attacks, move to dodge
- **Combos**: Jump + Attack for aerial moves

## ⚙️ Customization

### Change Fighters
Edit `game/src/mobile-game.js` line ~65:
```javascript
fighters: [
    { name: 'Sub-Zero' },
    { name: 'Kano' }
]
```

### Change Arena
```javascript
arena: mk.arenas.types.THRONE_ROOM  // or TOWER
```

## 📊 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Mobile Safari (iOS 11+)
- ✅ Mobile Chrome (Android 5+)

## 🐛 Troubleshooting

**Game won't start?**
- Clear browser cache
- Check console (F12) for errors
- Ensure all image files are loaded

**Controls not working?**
- Make sure browser tab is focused
- Try refreshing the page
- Test on a different browser

**Lagging?**
- Close other browser tabs
- Use landscape mode
- Reduce screen brightness

## 📄 License

MIT License - Original game by Minko Gechev (@mgechev)

## 🎊 Enjoy!

Have fun playing MK.JS on your mobile device! 🥊
