import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import type { Candidate, Match } from '../types';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://via.placeholder.com/400x500?text=No+Photo';

export default function Swipe() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

  useEffect(() => {
    api.get('/profiles/candidates')
      .then(({ data }) => setCandidates(data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const swipe = async (direction: 'like' | 'dislike') => {
    if (swiping || current >= candidates.length) return;
    const candidate = candidates[current];
    setSwiping(true);
    try {
      const { data } = await api.post('/swipes', {
        swipedId: candidate.id,
        direction,
      });
      if (data.match) {
        setNewMatch(data.match);
      }
    } catch {
      toast.error('Ошибка свайпа');
    } finally {
      setSwiping(false);
      setCurrent(prev => prev + 1);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const person = candidates[current];
  const photoSrc = person?.photoUrl ? `http://localhost:3001${person.photoUrl}` : PLACEHOLDER;

  return (
    <div className="page">
      <nav className="navbar">
        <span>❤️ DatingApp</span>
        <div>
          <Link to="/profile">Профиль</Link>
          <Link to="/matches">Матчи</Link>
          <button onClick={logout} className="btn-logout">Выйти</button>
        </div>
      </nav>

      <div className="swipe-container">
        {loading && <div className="loading">Загрузка...</div>}

        {!loading && current >= candidates.length && (
          <div className="no-candidates">
            <p>😔 Пока нет новых анкет</p>
            <p>Возвращайтесь позже!</p>
          </div>
        )}

        {!loading && person && (
          <div className="card">
            <img src={photoSrc} alt={person.name} className="card-photo" />
            <div className="card-info">
              <h2>{person.name}, {person.age}</h2>
              <p>{person.bio || 'Нет описания'}</p>
            </div>
            <div className="card-actions">
              <button
                className="btn-dislike"
                onClick={() => swipe('dislike')}
                disabled={swiping}
              >
                👎
              </button>
              <button
                className="btn-like"
                onClick={() => swipe('like')}
                disabled={swiping}
              >
                ❤️
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Модалка матча */}
      {newMatch && (
        <div className="match-overlay" onClick={() => setNewMatch(null)}>
          <div className="match-modal" onClick={e => e.stopPropagation()}>
            <h1>🎉 It's a Match!</h1>
            <p>Вы понравились друг другу!</p>
            <div className="match-actions">
              <button className="btn btn-primary" onClick={() => { setNewMatch(null); navigate('/matches'); }}>
                Смотреть матчи
              </button>
              <button className="btn btn-secondary" onClick={() => setNewMatch(null)}>
                Продолжить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
