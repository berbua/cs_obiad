# 🍕 OBIAD TEAM - Web 1.0 Retro Edition 🍕

Aplikacja webowa do zapisywania się na obiad w stylu lat 2000! Z WordArtem, gifami i całym retro klimatem!

## ✨ Funkcjonalności

- 📝 **Zapisywanie na obiad** - Nick, godzina, komentarz
- 😋 **Status Głodomora** - Wybór ikony nastroju (🍕🥗🌯🍔🍜)
- 🔄 **Daily Reset** - Automatyczne czyszczenie o północy
- 📖 **Księga Gości** - Recenzje i komentarze
- 👁️ **Licznik Odwiedzin** - Klasyczny counter
- 🎵 **Muzyka 8-bit** - Opcjonalna muzyka w tle
- 🌟 **Retro Design** - WordArt, gradients, migające teksty!

## 🚀 Uruchomienie Lokalne

### Wymagania

- Node.js 18+
- npm

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend będzie dostępny na `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend będzie dostępny na `http://localhost:5173`

## 📦 Deploy na Vercel

### Krok 1: Zainstaluj Vercel CLI

```bash
npm i -g vercel
```

### Krok 2: Deploy

```bash
vercel
```

Lub użyj Vercel Dashboard:
1. Import repository z GitHub
2. Vercel automatycznie wykryje konfigurację
3. Deploy!

**Uwaga:** Na Vercel używamy JSON storage zamiast SQLite (automatycznie wykrywane).

## 🎨 Struktura Projektu

```
obiad_proj/
├── frontend/              # React app
│   ├── src/
│   │   ├── App.jsx       # Główny komponent
│   │   ├── styles.css    # Retro styling
│   │   └── main.jsx      
│   ├── public/
│   │   └── music/        # 8-bit music files
│   └── package.json
├── backend/               # Node.js API
│   ├── server.js         # Express server (local)
│   ├── server-serverless.js  # Serverless version
│   ├── database.js       # SQLite (local)
│   ├── database-json.js  # JSON storage (Vercel)
│   ├── cron.js           # Daily cleanup job
│   └── package.json
├── vercel.json           # Vercel config
└── README.md
```

## 🎮 API Endpoints

- `GET /api/signups` - Pobierz dzisiejsze zapisy
- `POST /api/signups` - Dodaj nowy zapis
  ```json
  {
    "nick": "John",
    "time": "12:30",
    "comment": "Pizza time!",
    "moodIcon": "🍕"
  }
  ```
- `GET /api/visits` - Pobierz i inkrementuj licznik
- `GET /api/guestbook` - Pobierz wpisy z księgi
- `POST /api/guestbook` - Dodaj wpis
  ```json
  {
    "nick": "John",
    "comment": "Great lunch!"
  }
  ```
- `GET /api/health` - Health check

## 🎯 Web 1.0 Features

- ✅ WordArt style headers
- ✅ Marquee scrolling text
- ✅ Rainbow gradients
- ✅ 3D borders (ridge/outset)
- ✅ Comic Sans MS font
- ✅ Blinking text animation
- ✅ Starry background
- ✅ Under construction GIF
- ✅ Glowing visitor counter
- ✅ Spinning animations

## 🎵 Dodawanie Muzyki

Pobierz darmową muzykę 8-bit/chiptune:
- https://archive.org/details/8bitcollective
- https://opengameart.org
- https://freemusicarchive.org

Zapisz jako `frontend/public/music/retro.mp3`

## 🔧 Konfiguracja

### Zmiana API URL (Frontend)

Edytuj `frontend/src/App.jsx`:
```javascript
const API_URL = 'https://twoja-domena.vercel.app/api';
```

### Zmiana portu (Backend)

Edytuj `backend/server.js` lub użyj zmiennej środowiskowej:
```bash
PORT=3002 npm run dev
```

## 🐛 Troubleshooting

### Backend nie startuje
- Sprawdź czy port 3001 nie jest zajęty
- Upewnij się że wszystkie dependencies są zainstalowane

### Frontend nie łączy się z backend
- Sprawdź URL w `App.jsx`
- Sprawdź czy backend działa
- CORS jest włączony w backend

### Vercel deployment
- SQLite nie działa na Vercel - używamy JSON storage
- Muzyka i assety muszą być w `frontend/public/`

## 📝 TODO / Ulepszenia

- [ ] Dodać więcej retro gifów
- [ ] Implementować persistent storage dla Vercel (Vercel KV/Postgres)
- [ ] Dodać więcej WordArt stylów
- [ ] Eksport statystyk "Kto najczęściej je pizzę?"
- [ ] Dark mode? (NO! To jest Web 1.0!)

## 🎉 Credits

Made with ❤️ and nostalgia for the golden age of the internet (2000s)

Best viewed in:
- Netscape Navigator 4.0
- Internet Explorer 6.0
- Opera 5.0

---

*"Under Construction" since 2000* 🚧
