import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRouter from './routes/auth';
import profilesRouter from './routes/profiles';
import swipesRouter from './routes/swipes';
import matchesRouter from './routes/matches';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Статика для загруженных фото
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Роуты
app.use('/api/auth', authRouter);
app.use('/api/profiles', profilesRouter);
app.use('/api/swipes', swipesRouter);
app.use('/api/matches', matchesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
