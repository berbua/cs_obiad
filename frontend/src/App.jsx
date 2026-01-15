import { useState, useEffect } from 'react';
import './styles.css';

// Use environment variable for API URL
// In production (Vercel), use relative path /api
// In development, use localhost:6001
const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:6001/api');

function App() {
  const [signups, setSignups] = useState([]);
  const [visits, setVisits] = useState(0);
  const [guestbookEntries, setGuestbookEntries] = useState([]);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [previousSignupsCount, setPreviousSignupsCount] = useState(0);
  const [previousLikesMap, setPreviousLikesMap] = useState({});
  
  // Form states
  const [nick, setNick] = useState('');
  const [time, setTime] = useState('');
  const [comment, setComment] = useState('');
  const [moodIcon, setMoodIcon] = useState('🍕');
  
  // Guestbook form states
  const [guestNick, setGuestNick] = useState('');
  const [guestComment, setGuestComment] = useState('');

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        showNotification('🔔 Powiadomienia włączone!', 'Będziesz dostawać powiadomienia o nowych zapisach i lajkach');
      }
    }
  };

  // Show notification
  const showNotification = (title, body) => {
    if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
      });
    }
  };

  // Load saved nick from localStorage on mount
  useEffect(() => {
    const savedNick = localStorage.getItem('obiad_nick');
    if (savedNick) {
      setNick(savedNick);
    }
    
    const savedGuestNick = localStorage.getItem('obiad_guest_nick');
    if (savedGuestNick) {
      setGuestNick(savedGuestNick);
    }

    // Check if notifications are already enabled
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchSignups();
    fetchVisits();
    fetchGuestbook();
  }, []);

  // Poll for changes every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchSignupsWithNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [previousSignupsCount, previousLikesMap, notificationsEnabled]);

  const fetchSignupsWithNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/signups`);
      const data = await response.json();
      const newSignups = data.signups || [];
      
      // Check for new signups
      if (notificationsEnabled && newSignups.length > previousSignupsCount) {
        const newCount = newSignups.length - previousSignupsCount;
        showNotification(
          '🍕 Nowy zapis na obiad!',
          `${newCount} ${newCount === 1 ? 'osoba zapisała się' : 'osób zapisało się'} na obiad!`
        );
      }

      // Check for new likes
      if (notificationsEnabled) {
        newSignups.forEach(signup => {
          const prevLikes = previousLikesMap[signup.id] || 0;
          if (signup.likes > prevLikes) {
            const newLikes = signup.likes - prevLikes;
            showNotification(
              '👍 Nowy lajk!',
              `${signup.nick} dostał ${newLikes} ${newLikes === 1 ? 'nowy lajk' : 'nowe lajki'}!`
            );
          }
        });
      }

      // Update previous values
      setPreviousSignupsCount(newSignups.length);
      const likesMap = {};
      newSignups.forEach(s => likesMap[s.id] = s.likes || 0);
      setPreviousLikesMap(likesMap);

      setSignups(newSignups);
    } catch (error) {
      console.error('Error fetching signups:', error);
    }
  };

  const fetchSignups = async () => {
    try {
      const response = await fetch(`${API_URL}/signups`);
      const data = await response.json();
      setSignups(data.signups || []);
    } catch (error) {
      console.error('Error fetching signups:', error);
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await fetch(`${API_URL}/visits`);
      const data = await response.json();
      setVisits(data.visits || 0);
    } catch (error) {
      console.error('Error fetching visits:', error);
    }
  };

  const fetchGuestbook = async () => {
    try {
      const response = await fetch(`${API_URL}/guestbook`);
      const data = await response.json();
      setGuestbookEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching guestbook:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nick) {
      alert('⚠️ Musisz podać nick!');
      return;
    }

    // Save nick to localStorage for future use
    localStorage.setItem('obiad_nick', nick);

    try {
      const response = await fetch(`${API_URL}/signups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, time, comment, moodIcon }),
      });

      if (response.ok) {
        alert('✅ Zapisano na obiad!');
        setTime('');
        setComment('');
        setMoodIcon('🍕');
        await fetchSignups();
      } else {
        alert('❌ Błąd! Nie udało się zapisać.');
      }
    } catch (error) {
      console.error('Error adding signup:', error);
      alert('❌ Błąd połączenia! Sprawdź czy backend działa na http://localhost:6001');
    }
  };

  const handleGuestbookSubmit = async (e) => {
    e.preventDefault();
    if (!guestNick || !guestComment) {
      alert('⚠️ Musisz podać nick i komentarz!');
      return;
    }

    // Save guest nick to localStorage
    localStorage.setItem('obiad_guest_nick', guestNick);

    try {
      const response = await fetch(`${API_URL}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: guestNick, comment: guestComment }),
      });

      if (response.ok) {
        alert('✅ Wpis dodany do księgi gości!');
        setGuestComment('');
        await fetchGuestbook();
      } else {
        alert('❌ Błąd! Nie udało się dodać wpisu.');
      }
    } catch (error) {
      console.error('Error adding guestbook entry:', error);
      alert('❌ Błąd połączenia! Sprawdź czy backend działa.');
    }
  };

  const handleLike = async (id) => {
    try {
      const response = await fetch(`${API_URL}/signup-like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        await fetchSignups();
      }
    } catch (error) {
      console.error('Error liking entry:', error);
    }
  };

  const toggleMusic = () => {
    const audio = document.getElementById('bgMusic');
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play();
      setMusicPlaying(true);
    }
  };

  return (
    <div className="app">
      {/* Header with WordArt style */}
      <header className="header">
        <h1 className="wordart">CS OBIAD TEAM</h1>
        <div className="marquee">
          <span>🍕 Witamy na stronie obiadowej! 🍔 Zapisz się na obiad już dziś! 🌯 Bon appetit! 🥗</span>
        </div>
        
        {/* Notification banner */}
        {!notificationsEnabled && (
          <div className="notification-banner">
            <button onClick={requestNotificationPermission} className="notification-btn-top">
              🔔 WŁĄCZ POWIADOMIENIA! 🔔
              <span className="notification-subtitle">Dowiedz się o nowych zapisach i lajkach!</span>
            </button>
          </div>
        )}
        {notificationsEnabled && (
          <div className="notification-banner enabled">
            <span className="notification-status-top">✅ Powiadomienia są włączone!</span>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="main-content">
        {/* Status section */}
        <div className="status-box">
          <h2 className="blink">📢 Status Dnia 📢</h2>
          {signups.length === 0 ? (
            <p className="big-text">Dzis jeszcze nikt sie nie zapisal! 😢</p>
          ) : (
            <div>
              <p className="big-text">Dzis zapisanych: {signups.length} osób! 🎉</p>
              <div className="signups-list">
                {signups.map((signup) => (
                  <div key={signup.id} className="signup-item">
                    <span className="mood-icon">{signup.mood_icon}</span>
                    <span className="signup-nick">{signup.nick}</span>
                    {signup.time && <span className="signup-time">⏰ {signup.time}</span>}
                    {signup.comment && (
                      <span className="signup-comment">💬 {signup.comment}</span>
                    )}
                    <button 
                      className="like-btn signup-like-btn" 
                      onClick={() => handleLike(signup.id)}
                      title="Polub wpis"
                    >
                      👍 {signup.likes || 0}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Signup form */}
        <div className="form-box">
          <h2>✍️ Zapisz się na obiad!</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nick:</label>
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Twój nick..."
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label>Godzina (opcjonalnie):</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="np. 12:30"
                maxLength={5}
              />
            </div>

            <div className="form-group">
              <label>Komentarz (opcjonalnie):</label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="np. 'Mam ochotę na pizzę!'"
                maxLength={100}
              />
            </div>

            <div className="form-group">
              <label>Status Głodomora:</label>
              <div className="mood-selector">
                {['🍕', '🥗', '🌯', '🍔', '🍜'].map((icon) => (
                  <label key={icon} className={`mood-option ${moodIcon === icon ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="mood"
                      value={icon}
                      checked={moodIcon === icon}
                      onChange={(e) => setMoodIcon(e.target.value)}
                    />
                    <span className="mood-icon-large">{icon}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              🎯 Zapisz się!
            </button>
          </form>
        </div>

        {/* Guestbook section */}
        <div className="guestbook-box">
          <h2>📖 Księga Gości 📖</h2>
          <form onSubmit={handleGuestbookSubmit} className="guestbook-form">
            <input
              type="text"
              value={guestNick}
              onChange={(e) => setGuestNick(e.target.value)}
              placeholder="Twój nick..."
              maxLength={30}
            />
            <input
              type="text"
              value={guestComment}
              onChange={(e) => setGuestComment(e.target.value)}
              placeholder="Twoja opinia o obiedzie..."
              maxLength={200}
            />
            <button type="submit" className="guest-btn">✏️ Dodaj wpis</button>
          </form>

          <div className="guestbook-entries">
            {guestbookEntries.length === 0 ? (
              <p>Brak wpisów. Bądź pierwszy!</p>
            ) : (
              guestbookEntries.slice(0, 10).map((entry) => (
                <div key={entry.id} className="guest-entry">
                  <div className="guest-header">
                    <strong>{entry.nick}</strong>
                    <span className="guest-date">{entry.date}</span>
                  </div>
                  <div className="guest-text">{entry.comment}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="music-control">
          <button onClick={toggleMusic} className="music-btn">
            {musicPlaying ? '🔇 Wyłącz muzykę' : '🎵 Włącz muzykę'}
          </button>
        </div>
        
        <div className="visitor-counter">
          <img src="https://i.imgur.com/5bFqsP7.gif" alt="Under Construction" className="construction-gif" />
          <p className="counter-text">
            Jesteś gościem numer: <span className="counter-number">{visits}</span>
          </p>
          <img src="https://i.imgur.com/5bFqsP7.gif" alt="Under Construction" className="construction-gif" />
        </div>

        <p className="footer-text">
          © 2000 OBIAD TEAM - Best viewed in Netscape Navigator 4.0 
        </p>
      </footer>

      {/* Nokia Tune audio */}
      <audio id="bgMusic" loop>
        <source src="/music/83326-nokia-tune.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
