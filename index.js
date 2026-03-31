import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import gameRouter from './routes/gameRouter.js';

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the PixelGate API!');
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use('/api/games', gameRouter);

app.listen(PORT, HOST, async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});