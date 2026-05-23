import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import type { User } from '../types';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://via.placeholder.com/300x300?text=No+Photo';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', age: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/profiles/me')
      .then(({ data }) => {
        setUser(data);
        setForm({ name: data.name, age: String(data.age), bio: data.bio });
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/profiles/me', { ...form, age: Number(form.age) });
      setUser(data);
      toast.success('Профиль сохранён!');
    } catch {
      toast.error('Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    setUploading(true);
    try {
      const { data } = await api.post('/profiles/me/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(prev => prev ? { ...prev, photoUrl: data.photoUrl } : prev);
      toast.success('Фото обновлено!');
    } catch {
      toast.error('Ошибка загрузки фото');
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) return <div className="loading">Загрузка...</div>;

  const photoSrc = user.photoUrl ? `http://localhost:3001${user.photoUrl}` : PLACEHOLDER;

  return (
    <div className="page">
      <nav className="navbar">
        <span>❤️ DatingApp</span>
        <div>
          <Link to="/swipe">Свайп</Link>
          <Link to="/matches">Матчи</Link>
          <button onClick={logout} className="btn-logout">Выйти</button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-photo-section">
          <img src={photoSrc} alt="Фото профиля" className="profile-photo" />
          <label className="btn btn-secondary">
            {uploading ? 'Загрузка...' : '📷 Изменить фото'}
            <input type="file" accept="image/*" onChange={handlePhoto} hidden />
          </label>
        </div>

        <form onSubmit={handleSave} className="profile-form">
          <h2>Мой профиль</h2>
          <label>Имя
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </label>
          <label>Возраст
            <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
          </label>
          <label>О себе
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={4} placeholder="Расскажи о себе..." />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}
