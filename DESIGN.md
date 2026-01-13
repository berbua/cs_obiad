# 🎨 Visual Design Guide - OBIAD TEAM

## 🖼️ Layout Overview

```
┌────────────────────────────────────────────────────────────┐
│                      HEADER (Gradient)                      │
│                                                             │
│         ████████   ███████    ████████  ████████           │
│        ██      ██  ██    ██   ██     ██ ██     ██          │
│        ██      ██  ███████    ████████  ████████           │
│         RAINBOW GRADIENT WORDART "OBIAD TEAM"              │
│                                                             │
│   ╔══════════════════════════════════════════════════╗    │
│   ║ 🍕 Witamy! 🍔 Zapisz się! 🌯 Bon appetit! 🥗   ║    │
│   ╚══════════════════════════════════════════════════╝    │
│                  (Scrolling Marquee)                       │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                     STATUS BOX (Green)                      │
│   ╔════════════════════════════════════════════════════╗  │
│   ║        📢 Status Dnia 📢 (Blinking)               ║  │
│   ║                                                     ║  │
│   ║   Dzis jeszcze nikt sie nie zapisal! 😢          ║  │
│   ║              -- or --                              ║  │
│   ║   Dzis zapisanych: 3 osób! 🎉                    ║  │
│   ║                                                     ║  │
│   ║   🍕 Ania        ⏰ 12:30  💬 Pizza pls           ║  │
│   ║   🥗 Bartek      ⏰ 13:00  💬 Zdrowo dzis        ║  │
│   ║   🌯 Kasia       ⏰ 12:45                          ║  │
│   ╚════════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  FORM BOX (Orange Gradient)                 │
│   ╔════════════════════════════════════════════════════╗  │
│   ║           ✍️ Zapisz się na obiad!                  ║  │
│   ║                                                     ║  │
│   ║   Nick:                                            ║  │
│   ║   [________________]                               ║  │
│   ║                                                     ║  │
│   ║   Godzina:                                         ║  │
│   ║   [12:00 ▼]                                        ║  │
│   ║                                                     ║  │
│   ║   Komentarz (opcjonalnie):                        ║  │
│   ║   [________________]                               ║  │
│   ║                                                     ║  │
│   ║   Status Głodomora:                               ║  │
│   ║   ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐               ║  │
│   ║   │🍕 │ │🥗 │ │🌯 │ │🍔 │ │🍜 │               ║  │
│   ║   └───┘ └───┘ └───┘ └───┘ └───┘               ║  │
│   ║                                                     ║  │
│   ║          ┌──────────────────┐                     ║  │
│   ║          │ 🎯 Zapisz się!  │                     ║  │
│   ║          └──────────────────┘                     ║  │
│   ╚════════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                 GUESTBOOK BOX (Pink Gradient)               │
│   ╔════════════════════════════════════════════════════╗  │
│   ║              📖 Księga Gości 📖                    ║  │
│   ║                                                     ║  │
│   ║   [Nick] [Komentarz...] [✏️ Dodaj wpis]          ║  │
│   ║                                                     ║  │
│   ║   ┌─────────────────────────────────────────────┐ ║  │
│   ║   │ Ania          2024-01-13                    │ ║  │
│   ║   │ Pizza była pycha! 🍕                        │ ║  │
│   ║   └─────────────────────────────────────────────┘ ║  │
│   ║   ┌─────────────────────────────────────────────┐ ║  │
│   ║   │ Bartek        2024-01-13                    │ ║  │
│   ║   │ Świetna zupa dnia!                          │ ║  │
│   ║   └─────────────────────────────────────────────┘ ║  │
│   ╚════════════════════════════════════════════════════╝  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  FOOTER (Blue Gradient)                     │
│                                                             │
│              ┌──────────────────┐                          │
│              │ 🎵 Włącz muzykę │                          │
│              └──────────────────┘                          │
│                                                             │
│    🚧   Jesteś gościem numer: 12345   🚧                   │
│   (Spinning)     (Glowing)        (Spinning)               │
│                                                             │
│  © 2000 OBIAD TEAM - Best viewed in Netscape Navigator    │
└────────────────────────────────────────────────────────────┘
```

## 🎨 Color Palette

### Header
- Background: `linear-gradient(to bottom, #FF00FF, #00FFFF, #FFFF00)`
- Border: `5px ridge gold`
- WordArt: Rainbow gradient (7 colors)

### Status Box
- Background: `linear-gradient(135deg, #00FF00, #00FFFF)`
- Border: `5px ridge #00FF00`
- Text: Black with white shadow

### Form Box
- Background: `linear-gradient(135deg, #FFD700, #FFA500)`
- Border: `5px ridge #FFD700`
- Buttons: Red gradient with yellow text

### Guestbook Box
- Background: `linear-gradient(135deg, #FF69B4, #FFB6C1)`
- Border: `5px ridge #FF1493`
- Entries: Light yellow (`#FFFACD`)

### Footer
- Background: `linear-gradient(to top, #000080, #0000FF)`
- Text: Yellow (`#FFFF00`)
- Counter: Green glow (`#00FF00`)

## 🌟 Animation Effects

### 1. WordArt Header
```
Effect: Rainbow gradient moving
Speed: 3s loop
Colors: Red → Orange → Yellow → Green → Blue → Indigo → Violet
```

### 2. Marquee
```
Effect: Horizontal scroll right-to-left
Speed: 15s linear
Content: "🍕 Witamy! 🍔 Zapisz się!..."
```

### 3. Blinking Status
```
Effect: Opacity 1 → 0 → 1
Speed: 1s, 2 steps
Target: "📢 Status Dnia 📢"
```

### 4. Starry Background
```
Effect: Twinkling stars
Speed: 3s infinite
Pattern: Radial gradients across body
```

### 5. Spinning GIFs
```
Effect: 360° rotation
Speed: 2s linear
Target: Construction GIF icons
```

### 6. Glowing Counter
```
Effect: Text shadow pulse
Speed: 1s alternate
Color: Green (#00FF00)
Shadow: 10px → 40px spread
```

### 7. Button Press
```
Effect: 3D inset + translate
On hover: Shadow reduction
On click: Border inset + move down
```

## 🖌️ Typography

### Fonts
- **Primary**: Comic Sans MS
- **Fallback**: Chalkboard SE, Comic Neue, cursive

### Sizes
- WordArt Header: 72px (48px mobile)
- Section Headers: 36px (28px mobile)
- Marquee: 24px (18px mobile)
- Status Text: 28px (22px mobile)
- Form Labels: 22px
- Body Text: 18px (16px mobile)
- Footer: 16px

### Effects
- Text Shadow: 2-3px offset, rgba black
- WordArt: Transparent fill with gradient background
- Blinking: CSS keyframe animation

## 📐 Layout & Spacing

### Box Design
```
Border: 5px ridge (3D effect)
Border Radius: 15px
Padding: 25px
Margin Bottom: 30px
Box Shadow: 10px 10px 0 rgba(0,0,0,0.3)
```

### Responsive Breakpoints
- Desktop: 1200px max-width
- Tablet: Adjusts to container
- Mobile (<768px): Smaller fonts, single column

## 🎯 Interactive Elements

### Buttons
```
Style: 3D outset border
Colors: Red bg, Yellow text
Hover: Slight shadow reduction
Active: Inset border + position shift
Shadow: 5px 5px offset
```

### Inputs
```
Style: 3D inset border
Focus: 3px solid #FF00FF outline
Background: White
Font: Comic Sans MS
```

### Mood Icons
```
Size: 48px
Background: White semi-transparent
Border: 3px solid transparent
Selected: Yellow bg + red border + glow
Hover: Scale 1.1
```

### Signup Items
```
Background: White 90% opacity
Border: 3px outset #666
Layout: Flexbox with gap
Icons: 32px
Nick: Bold, Blue
Time: Bold, Red
Comment: Italic, Dark Green
```

## 🌈 Retro Details

### Construction GIF
- Position: Footer, both sides of counter
- Animation: Spinning 360°
- Size: 80px

### Visitor Counter
- Style: Glowing green numbers
- Size: 36px
- Effect: Pulsing shadow
- Random range: 99999-999999 start

### Marquee Bar
- Background: Bright yellow
- Text: Red, bold
- Border: 3px solid black
- Speed: Continuous scroll

### Under Construction
- Classic animated GIF
- External URL (imgur)
- Authentic 90s/2000s style

## 📱 Mobile Responsiveness

### Changes on <768px
- WordArt: 48px (from 72px)
- Headers: 28px (from 36px)
- Mood icons: 36px (from 48px)
- Signup items: Single column
- Form: Full width inputs
- Guestbook: Stack inputs vertically

### Touch Optimization
- Larger tap targets (48px minimum)
- No hover effects on touch devices
- Simplified animations for performance

## 🎬 User Journey

1. **Page Load**
   - Starry background animates
   - WordArt rainbow cycles
   - Marquee starts scrolling
   - Counter increments

2. **Viewing Status**
   - Blinking header catches attention
   - List shows today's signups
   - Each with mood icon, name, time

3. **Signing Up**
   - Fill nick
   - Select time from dropdown
   - Choose mood icon (clicks to select)
   - Optional comment
   - Big red "Zapisz się!" button
   - Immediate update on submit

4. **Guestbook**
   - Scroll down
   - See recent entries
   - Add own review
   - Submit button

5. **Footer**
   - Toggle music (if added)
   - See visitor count (glowing)
   - Notice spinning construction GIFs
   - Read "Best viewed in..." text

---

🎨 **Design Philosophy**: Maximum nostalgia, maximum fun, maximum Web 1.0 energy! ✨
