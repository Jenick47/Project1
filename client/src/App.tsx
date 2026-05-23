import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Swipe from './pages/Swipe';
import Matches from './pages/Matches';
import './App.css';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/swipe" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/swipe" element={<PrivateRoute><Swipe /></PrivateRoute>} />
        <Route path="/matches" element={<PrivateRoute><Matches /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
