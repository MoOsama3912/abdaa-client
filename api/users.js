const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://abdaa-client.vercel.app', // ده موقع الواجهة بتاعتك
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.post('/users', (req, res) => {
  const user = req.body;
  res.status(201).json({ message: 'تم إضافة المستخدم بنجاح', user });
});

module.exports = app;
