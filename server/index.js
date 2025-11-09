const express = require('express');
const cors = require('cors'); 
// تأكد من استيراد dotenv و mongoose إذا كنت تستخدمهما في باقي الملف
// const mongoose = require('mongoose'); 
// require('dotenv').config();

const app = express();

// 1. تفعيل CORS (تم التحقق: هذا الجزء صحيح تمامًا)
app.use(cors({
    origin: 'https://abdaa-client.vercel.app', // السماح فقط لهذا الأصل
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true,
    optionsSuccessStatus: 204 
}));

// 2. تفعيل قراءة JSON (إلزامي لطلبات POST والبيانات المرسلة)
// هذا السطر يسمح للسيرفر بفهم وقراءة البيانات المرسلة في جسم الطلب (req.body)
app.use(express.json());


// مثال لمسار GET (أرسلته أنت)
app.get('/users', (req, res) => {
    // Note: This response is hardcoded. You need to connect MongoDB here.
    res.json([{ id: 1, name: 'John Doe' }]);
});

// مثال لمسار POST (لإضافة مستخدم - يجب عليك إضافة المنطق الخاص به)
app.post('/users', (req, res) => {
    // عند استلام البيانات، ستجدها في req.body
    console.log('Received data:', req.body); 
    
    // هنا يجب أن تضع منطق إضافة المستخدم لقاعدة البيانات
    
    res.status(201).json({ 
        message: 'User created successfully (Deployment test successful!)',
        data: req.body 
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});