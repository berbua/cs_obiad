# 💡 Development Tips & Future Enhancements

## Przydatne komendy

### Development

```bash
# Uruchom backend i frontend jednocześnie (wymaga concurrently)
npm run dev

# Tylko backend
cd backend && npm run dev

# Tylko frontend  
cd frontend && npm run dev

# Build produkcyjny frontendu
cd frontend && npm run build

# Preview produkcyjnego buildu
cd frontend && npm run preview
```

### Database

```bash
# Sprawdź bazę danych (wymaga sqlite3)
sqlite3 backend/obiad.db

# Wewnątrz sqlite3:
.tables                    # Pokaż tabele
SELECT * FROM signups;     # Pokaż zapisy
SELECT * FROM visits;      # Pokaż licznik
SELECT * FROM guestbook;   # Pokaż księgę gości
.exit                      # Wyjdź
```

### Debugging

```bash
# Backend logi
cd backend
NODE_ENV=development npm run dev

# Frontend z network inspection
cd frontend
npm run dev
# Potem otwórz DevTools (F12) → Network tab
```

## 🎨 Pomysły na ulepszenia

### 1. Persistent Storage dla Vercel

Obecnie na Vercel używamy `/tmp/` co nie jest persistent. Opcje:

**Vercel KV (Redis) - Recommended**
```bash
npm install @vercel/kv
```

Przykładowy kod:
```javascript
// database-kv.js
import { kv } from '@vercel/kv';

async function getTodaySignups() {
  const today = new Date().toISOString().split('T')[0];
  const signups = await kv.get(`signups:${today}`);
  return signups || [];
}

async function addSignup(nick, time, comment, moodIcon) {
  const today = new Date().toISOString().split('T')[0];
  const signups = await getTodaySignups();
  const newSignup = { id: Date.now(), nick, time, comment, mood_icon: moodIcon, date: today };
  signups.push(newSignup);
  await kv.set(`signups:${today}`, signups);
  return { lastInsertRowid: newSignup.id };
}
```

**Vercel Postgres**
```bash
npm install @vercel/postgres
```

**External Database**
- Supabase (PostgreSQL)
- PlanetScale (MySQL)
- MongoDB Atlas

### 2. Statystyki

Dodaj endpoint `/api/stats`:
```javascript
app.get('/api/stats', (req, res) => {
  // Kto najczęściej je pizzę?
  // Najpopularniejsze godziny
  // Najaktywniejsze dni tygodnia
});
```

### 3. Notifications

**Discord webhook** gdy ktoś się zapisze:
```javascript
const webhookUrl = process.env.DISCORD_WEBHOOK;
await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: `🍕 ${nick} zapisał się na obiad o ${time}!`
  })
});
```

**Slack webhook** - podobnie!

### 4. Admin Panel

Dodaj prostą autentykację:
```javascript
// Prosty admin password
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'obiad2000';

app.post('/api/admin/clear', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Clear all signups
  cleanupAllSignups();
  res.json({ success: true });
});
```

### 5. Więcej Retro Features

- **Visitor guestbook comments** - jak prawdziwe księgi gości z emotkami
- **Hit counter z różnymi stylami** - rolling numbers, LCD style
- **MIDI muzyka** zamiast MP3 (bardziej autentyczne!)
- **Cursor trails** - gwiazdki za kursorem
- **"Best viewed in" badge** z rotacją przeglądarek
- **Frames!** - Dodaj <frameset> dla jeszcze bardziej retro look

### 6. PWA (Progressive Web App)

Dodaj `manifest.json` i service worker żeby można było dodać do ekranu głównego telefonu:

```json
{
  "name": "OBIAD TEAM",
  "short_name": "Obiad",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FF00FF",
  "background_color": "#001f3f"
}
```

### 7. Easter Eggs

- **Konami Code** (↑↑↓↓←→←→BA) - włącza super retro mode z jeszcze więcej efektów
- **Click counter na logo** - po 10 kliknięciach coś śmiesznego
- **Hidden ascii art** w console.log
- **Secret admin page** pod `/pizzamasterrace`

## 🐛 Known Issues & Solutions

### 1. SQLite na Vercel nie działa
✅ Rozwiązane - automatycznie używamy JSON storage

### 2. Cold starts na Vercel
Serverless functions mają cold start (2-5 sekund przy pierwszym wywołaniu).

Rozwiązanie: Vercel Pro ma lepsze cold starts, lub użyj external DB.

### 3. Timezone issues
Backend używa UTC. Jeśli chcesz lokalny timezone:

```javascript
const today = new Date().toLocaleDateString('pl-PL', { 
  timeZone: 'Europe/Warsaw' 
}).split('T')[0];
```

### 4. Concurrent writes w JSON storage
Teoretycznie możliwe race conditions. Dla produkcji użyj prawdziwej bazy danych.

## 📊 Monitoring

### Simple logging
```javascript
// Dodaj do server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});
```

### Vercel Analytics
Dodaj w Vercel Dashboard → Analytics → Enable

### Error tracking
Rozważ Sentry:
```bash
npm install @sentry/node @sentry/react
```

## 🔐 Security Considerations

1. **Rate limiting** - dodaj limit requestów
```bash
npm install express-rate-limit
```

2. **Input validation** - dodaj walidację
```bash
npm install joi
```

3. **XSS protection** - React już ma, ale uważaj na `dangerouslySetInnerHTML`

4. **SQL Injection** - better-sqlite3 używa prepared statements (już zabezpieczone)

## 🎯 Performance Tips

1. **Lazy load images/GIFs** - użyj `loading="lazy"`
2. **Compress images** - użyj TinyPNG
3. **CDN dla assetów** - Vercel już to robi
4. **Memoization w React** - użyj `useMemo` dla dużych list

## 📚 Przydatne linki

- [Vercel Docs](https://vercel.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [Express Docs](https://expressjs.com/)
- [better-sqlite3 Docs](https://github.com/WiseLibs/better-sqlite3)
- [Retro Web Assets](https://gifcities.org/)
- [8-bit Music](https://archive.org/details/8bitcollective)

---

Happy coding! 🍕💻✨
