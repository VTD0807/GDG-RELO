import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';
import businessRouter from './routes/business';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use('/analyze', analyzeRouter);
app.use('/business', businessRouter);

app.get('/health', (req, res) => {
  res.send('OK');
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
