import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      toast.success(`С возвращением, ${data.user.name}!`);
      navigate('/swipe');
    } catch {
      toast.error('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>❤️ DatingApp</h1>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Пароль" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Войти'}</button>
        </form>
        <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
      </div>
    </div>
  );
}
