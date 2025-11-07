const express = require('express');
const cors = require('cors');
const app = express();

// إعدادات CORS
const corsOptions = {
    origin: ['https://abdaa-client.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 ساعة
};

// تفعيل CORS
app.use(cors(corsOptions));

// باقي إعدادات السيرفر
app.use(express.json());
