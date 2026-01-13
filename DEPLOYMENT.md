# 🚀 Vercel Deployment Guide

## Opcja 1: Deploy przez Vercel CLI (Najszybsza)

### 1. Zainstaluj Vercel CLI

```bash
npm install -g vercel
```

### 2. Login do Vercel

```bash
vercel login
```

### 3. Deploy

W głównym katalogu projektu:

```bash
vercel
```

Pierwszym razem odpowiedz na pytania:
- Set up and deploy? **Y**
- Which scope? (wybierz swoje konto)
- Link to existing project? **N**
- What's your project's name? **obiad-team** (lub dowolna nazwa)
- In which directory is your code located? **./**

Vercel automatycznie wykryje konfigurację i zdeployuje!

### 4. Deploy produkcyjny

```bash
vercel --prod
```

## Opcja 2: Deploy przez GitHub (Automatyczny)

### 1. Push do GitHub

```bash
git init
git add .
git commit -m "Initial commit - OBIAD TEAM 🍕"
git remote add origin https://github.com/TWOJA_NAZWA/obiad-team.git
git push -u origin main
```

### 2. Import w Vercel

1. Idź na https://vercel.com/new
2. Zaimportuj swoje repo z GitHub
3. Vercel automatycznie wykryje konfigurację
4. Kliknij **Deploy**

Każdy push do main będzie automatycznie deployowany!

## Konfiguracja Środowiska

### Frontend - Zmiana API URL

Po deploymencie, zaktualizuj `frontend/src/App.jsx`:

```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel automatycznie routuje do backendu
  : 'http://localhost:3001/api';
```

Lub jeszcze lepiej, użyj zmiennej środowiskowej. Dodaj w Vercel Dashboard:

**Project Settings → Environment Variables:**
- Name: `VITE_API_URL`
- Value: `/api`

A w kodzie:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```

## Ważne Uwagi

### 1. Database
- **Lokalne**: Używa SQLite (`backend/database.js`)
- **Vercel**: Automatycznie używa JSON storage (`backend/database-json.js`)
- JSON storage w `/tmp` nie jest persistent między wywołaniami serverless functions
- Dla produkcji rozważ:
  - Vercel KV (Redis)
  - Vercel Postgres
  - External database (PlanetScale, Supabase)

### 2. Persistence na Vercel

Obecnie dane są zapisywane w `/tmp/obiad_data.json` na Vercel, co oznacza:
- ✅ Działa dla małych zespołów
- ⚠️ Dane mogą się resetować przy cold starts
- ⚠️ Każda serverless function instance ma własne storage

Dla lepszej persistence, możesz dodać Vercel KV:

```bash
npm install @vercel/kv
```

I zamienić `database-json.js` aby używał Vercel KV.

### 3. Assety

- Muzyka i gify muszą być w `frontend/public/`
- Będą dostępne po deploymencie

## Sprawdzanie Deploymentu

Po deploymencie sprawdź:
1. `https://twoja-domena.vercel.app/` - Frontend
2. `https://twoja-domena.vercel.app/api/health` - Backend health check

## Troubleshooting

### Backend nie odpowiada
- Sprawdź Logs w Vercel Dashboard
- Upewnij się że `backend/server.js` eksportuje `module.exports = app`

### Frontend nie łączy się z API
- Sprawdź czy API_URL jest poprawnie ustawione
- Sprawdź Network tab w DevTools przeglądarki

### Cold starts
- Serverless functions na Vercel mają cold start (pierwsze wywołanie może być wolne)
- To normalne zachowanie

## Custom Domain

W Vercel Dashboard:
1. Project Settings → Domains
2. Dodaj swoją domenę
3. Skonfiguruj DNS zgodnie z instrukcjami

---

Happy deploying! 🚀🍕
