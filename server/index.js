const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();

// Configure CORS
app.use(cors({
  origin: 'https://abdaa-client.vercel.app', // Allow only your client origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  credentials: true, // If you need to send cookies/auth headers
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// If you want to allow all origins (less secure, use with caution for production APIs)
// app.use(cors());

// Your routes
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
