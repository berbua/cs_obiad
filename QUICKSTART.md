# 🚀 Quick Start Guide - OBIAD TEAM

## Szybkie uruchomienie (5 minut!)

### 1️⃣ Sprawdź wymagania

Upewnij się, że masz zainstalowane:
- Node.js (wersja 18 lub nowsza)
- npm

```bash
node --version  # Powinno pokazać v18.x.x lub nowszą
npm --version
```

### 2️⃣ Zainstaluj zależności

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

Lub użyj skryptu w root (wymaga instalacji concurrently):
```bash
npm install  # Zainstaluje concurrently
npm run install-all
```

### 3️⃣ Uruchom backend

Otwórz pierwszy terminal:

```bash
cd backend
npm run dev
```

Powinno się pojawić:
```
🍕 OBIAD TEAM Server running on http://localhost:3001
⏰ Cron job scheduled: Daily cleanup at midnight
```

Zostaw ten terminal otwarty!

### 4️⃣ Uruchom frontend

Otwórz drugi terminal:

```bash
cd frontend
npm run dev
```

Powinno się pojawić:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 5️⃣ Otwórz przeglądarkę

Idź na: **http://localhost:5173/**

Powinnaś zobaczyć piękną retro stronę z WordArtem "OBIAD TEAM"! 🎉

## ✅ Sprawdzenie czy działa

1. **Frontend działa?** 
   - Widzisz kolorowy header z "OBIAD TEAM"
   - Widzisz przewijający się tekst (marquee)
   - Licznik wizyt się inkrementuje

2. **Backend działa?**
   - Otwórz http://localhost:3001/api/health
   - Powinno pokazać: `{"status":"OK","message":"OBIAD TEAM API is running!","database":"SQLite"}`

3. **Połączenie frontend-backend działa?**
   - Spróbuj zapisać się na obiad
   - Wpis powinien się pojawić na liście
   - Sprawdź DevTools Console - nie powinno być błędów

## 🔧 Troubleshooting

### Port 3001 jest zajęty?

Zmień port w `backend/server.js` lub:
```bash
PORT=3002 npm run dev
```

I zaktualizuj `frontend/src/App.jsx`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
```

### CORS errors?

Backend ma już włączone CORS, ale jeśli masz problemy:
- Sprawdź czy backend naprawdę działa
- Sprawdź URL w Network tab w DevTools

### "Module not found"?

```bash
# Usuń node_modules i zainstaluj ponownie
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 🎨 Customizacja

### Zmiana godzin obiadu

W `frontend/src/App.jsx` znajdź:
```javascript
for (let hour = 11; hour <= 15; hour++) {
```

Zmień zakres (np. 10-16 dla 10:00-16:00)

### Dodanie więcej emoji

W `frontend/src/App.jsx` znajdź:
```javascript
{['🍕', '🥗', '🌯', '🍔', '🍜'].map((icon) => (
```

Dodaj swoje: `['🍕', '🥗', '🌯', '🍔', '🍜', '🍱', '🍣', '🥙']`

### Zmiana kolorów

Edytuj `frontend/src/styles.css` - wszystkie kolory są tam!

## 📝 Testowanie funkcjonalności

1. **Zapisz się na obiad** 
   - Wpisz nick
   - Wybierz godzinę
   - Wybierz emoji
   - Kliknij "Zapisz się"

2. **Dodaj wpis do księgi gości**
   - Przewiń na dół
   - Wpisz nick i komentarz
   - Kliknij "Dodaj wpis"

3. **Sprawdź licznik wizyt**
   - Odśwież stronę
   - Licznik powinien się zwiększyć

4. **Sprawdź daily reset**
   - Sprawdź bazę danych: `backend/obiad.db`
   - Lub poczekaj do północy 😴

## 🎵 Dodaj muzykę (opcjonalne)

1. Pobierz darmową muzykę 8-bit:
   - https://archive.org/details/8bitcollective
   - https://opengameart.org

2. Zapisz jako `frontend/public/music/retro.mp3`

3. Odśwież stronę - przycisk muzyki powinien działać!

## 🚀 Następne kroki

- Przeczytaj [README.md](README.md) dla pełnej dokumentacji
- Zobacz [DEPLOYMENT.md](DEPLOYMENT.md) jak wrzucić na Vercel
- Pokaż zespołowi i zbierajcie się na obiady! 🍕

---

Miłego obiadowania! 😋
