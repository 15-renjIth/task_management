
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));

app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});

app.use('/api/tasks', tasksRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("LLLL");

    console.log(`API running at http://localhost:${PORT}`);
});
