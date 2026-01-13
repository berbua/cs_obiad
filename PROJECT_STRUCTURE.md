# 📁 Project Structure - OBIAD TEAM

```
obiad_proj/
│
├── 📄 README.md                    # Główna dokumentacja
├── 📄 QUICKSTART.md                # Szybki start (5 minut)
├── 📄 DEPLOYMENT.md                # Instrukcje deploymentu na Vercel
├── 📄 DEVELOPMENT.md               # Tips dla developerów
├── 📄 ASSETS_README.md             # Info o assetach (gify, muzyka)
├── 📄 .gitignore                   # Git ignore file
├── 📄 package.json                 # Root package (scripts do obu projektów)
├── 📄 vercel.json                  # Konfiguracja Vercel
│
├── 📁 backend/                     # Node.js Backend
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 server.js                # Main Express server (elastyczny: SQLite/JSON)
│   ├── 📄 server-serverless.js     # Backup serverless version
│   ├── 📄 database.js              # SQLite database (dla local)
│   ├── 📄 database-json.js         # JSON storage (dla Vercel)
│   ├── 📄 cron.js                  # Daily cleanup job (midnight)
│   ├── 📄 obiad.db                 # SQLite database file (generated)
│   └── 📄 obiad_data.json          # JSON data file (generated)
│
└── 📁 frontend/                    # React Frontend
    ├── 📄 package.json             # Frontend dependencies
    ├── 📄 index.html               # HTML template
    ├── 📄 vite.config.js           # Vite configuration
    │
    ├── 📁 src/
    │   ├── 📄 main.jsx             # React entry point
    │   ├── 📄 App.jsx              # Main app component (wszystkie funkcje)
    │   └── 📄 styles.css           # Retro Web 1.0 styling 🌈
    │
    └── 📁 public/
        └── 📁 music/
            ├── 📄 README.md        # Instrukcje dodawania muzyki
            └── 🎵 retro.mp3        # 8-bit music (do dodania)
```

## 🎯 Kluczowe pliki

### Backend

**server.js** - Główny serwer
- 📡 Express API endpoints
- 🔄 Auto-detection SQLite vs JSON storage
- 🌐 CORS enabled
- ⏰ Cron job integration

**database.js** (Local)
- 💾 SQLite implementation
- 📊 3 tabele: signups, visits, guestbook
- 🔧 CRUD operations

**database-json.js** (Vercel)
- 📝 JSON file storage
- 🧹 Auto-cleanup przy każdym zapytaniu
- 💨 Serverless-compatible

**cron.js**
- ⏰ Scheduled cleanup o północy
- 🧹 Usuwa stare zapisy

### Frontend

**App.jsx** - Jeden główny komponent ze wszystkim:
- 📝 Formularz zapisu na obiad
- 👥 Lista zapisanych osób
- 😋 Mood icons selector
- 📖 Księga gości
- 👁️ Licznik odwiedzin
- 🎵 Music player
- 🎨 Wszystko w retro stylu!

**styles.css** - Pełny Web 1.0 experience:
- 🌈 Rainbow gradients
- ✨ WordArt CSS
- 💫 Animacje (blink, marquee, glow)
- 🎨 3D borders (ridge/outset/inset)
- 🌟 Starry background
- 📱 Responsive design

## 📊 Database Schema

### SQLite (Local)

**signups**
```sql
id INTEGER PRIMARY KEY
nick TEXT NOT NULL
time TEXT NOT NULL
comment TEXT
mood_icon TEXT
date TEXT NOT NULL
```

**visits**
```sql
id INTEGER PRIMARY KEY (always 1)
counter INTEGER DEFAULT 0
```

**guestbook**
```sql
id INTEGER PRIMARY KEY
nick TEXT NOT NULL
comment TEXT NOT NULL
date TEXT NOT NULL
```

### JSON (Vercel)

```json
{
  "signups": [...],
  "visits": 123,
  "guestbook": [...],
  "lastCleanup": "2024-01-13"
}
```

## 🛣️ API Routes

| Method | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/health` | Health check |
| GET | `/api/signups` | Pobierz dzisiejsze zapisy |
| POST | `/api/signups` | Dodaj nowy zapis |
| GET | `/api/visits` | Pobierz i +1 licznik |
| GET | `/api/guestbook` | Pobierz księgę gości |
| POST | `/api/guestbook` | Dodaj wpis do księgi |

## 🎨 Features Implemented

### ✅ Core Features
- [x] Zapisywanie na obiad (nick, godzina, komentarz)
- [x] Daily reset (automatyczny cleanup o północy)
- [x] Status głodomora (mood icons)
- [x] Licznik odwiedzin
- [x] Księga gości
- [x] Music player (8-bit)

### ✅ Web 1.0 Aesthetics
- [x] WordArt style header
- [x] Marquee scrolling text
- [x] Rainbow gradients
- [x] 3D borders
- [x] Comic Sans MS font
- [x] Blinking text
- [x] Starry background
- [x] Under construction GIF
- [x] Glowing effects
- [x] Spinning animations

### ✅ Technical
- [x] React frontend
- [x] Express backend
- [x] SQLite (local)
- [x] JSON storage (Vercel)
- [x] Cron jobs
- [x] CORS enabled
- [x] Environment variables
- [x] Responsive design
- [x] Error handling
- [x] Vercel-ready

## 🚀 Deployment Targets

### Local Development
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`
- Database: SQLite file

### Vercel Production
- Full app: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`
- Database: JSON storage in /tmp

## 📝 Configuration Files

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config |
| `package.json` (root) | Monorepo scripts |
| `package.json` (backend) | Backend dependencies |
| `package.json` (frontend) | Frontend dependencies |
| `.gitignore` | Ignored files |
| `vite.config.js` | Vite bundler config |

## 🎓 Learning Resources

Ten projekt używa:
- **React 19** - UI framework
- **Vite** - Build tool
- **Express** - Web server
- **better-sqlite3** - SQLite dla Node.js
- **node-cron** - Scheduled tasks
- **CORS** - Cross-origin requests

## 🤝 Contributing

Chcesz dodać nową feature? Process:
1. Dodaj feature do backendu (API endpoint)
2. Zaktualizuj database schema jeśli potrzeba
3. Dodaj UI w `App.jsx`
4. Dodaj styling w `styles.css`
5. Testuj lokalnie
6. Deploy na Vercel!

---

💡 **Pro tip**: Zacznij od `QUICKSTART.md` jeśli pierwszy raz uruchamiasz projekt!
