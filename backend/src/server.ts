import express from 'express';
import history from './routes/history';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.send('OK'));
app.use('/api/history', history);

app.listen(3000, () => console.log('Backend listening on :3000'));
