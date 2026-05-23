import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Match } from '../types';

const PLACEHOLDER = 'https://via.placeholder.com/80x80?text=?';

export default function Matches() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/matches')
      .then(({ data }) => setMatches(data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="page">
      <nav className="navbar">
        <span>❤️ DatingApp</span>
        <div>
          <Link to="/profile">Профиль</Link>
          <Link to="/swipe">Свайп</Link>
          <button onClick={logout} className="btn-logout">Выйти</button>
        </div>
      </nav>

      <div className="matches-container">
        <h2>Ваши матчи ❤️</h2>

        {loading && <div className="loading">Загрузка...</div>}

        {!loading && matches.length === 0 && (
          <div className="no-matches">
            <p>Пока нет матчей 😔</p>
            <Link to="/swipe" className="btn btn-primary">Начать свайпать</Link>
          </div>
        )}

        <div className="matches-grid">
          {matches.map(m => {
            const photoSrc = m.partner.photoUrl
              ? `http://localhost:3001${m.partner.photoUrl}`
              : PLACEHOLDER;
            return (
              <div key={m.matchId} className="match-card">
                <img src={photoSrc} alt={m.partner.name} />
                <div className="match-card-info">
                  <h3>{m.partner.name}</h3>
                  <span>{m.partner.age} лет</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
