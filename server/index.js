const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();

// Configure CORS to allow requests from your client origin
app.use(cors({
  origin: 'https://abdaa-client.vercel.app', // Specify the allowed origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Specify allowed methods
  credentials: true, // If you need to send cookies with the requests
  optionsSuccessStatus: 204 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Your other routes and middleware
app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
