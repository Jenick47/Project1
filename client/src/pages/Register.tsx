import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', name: '', age: '', gender: 'male' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      toast.success(`Добро пожаловать, ${data.user.name}!`);
      navigate('/profile');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Ошибка регистрации';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>❤️ DatingApp</h1>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Имя" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Пароль" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <input type="number" placeholder="Возраст" value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
          <div className="gender-select">
            <label className={`gender-option ${form.gender === 'male' ? 'active' : ''}`}>
              <input type="radio" name="gender" value="male" checked={form.gender === 'male'} onChange={e => setForm({...form, gender: e.target.value})} />
              👨 Мужчина
            </label>
            <label className={`gender-option ${form.gender === 'female' ? 'active' : ''}`}>
              <input type="radio" name="gender" value="female" checked={form.gender === 'female'} onChange={e => setForm({...form, gender: e.target.value})} />
              👩 Женщина
            </label>
          </div>
          <button type="submit" disabled={loading}>{loading ? 'Загрузка...' : 'Зарегистрироваться'}</button>
        </form>
        <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
      </div>
    </div>
  );
}
