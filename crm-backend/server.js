require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
const segmentationRoutes = require('./routes/segmentation');
const campaignsRoutes = require('./routes/campaign');
const nlpParserRoutes = require('./routes/nlpParser');

const app = express();

// Middleware setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(bodyParser.json());



// Your other routes...
app.use('/api', customerRoutes);
app.use('/api', orderRoutes);
app.use('/api', segmentationRoutes);
app.use('/api', campaignsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api', nlpParserRoutes);

// MongoDB connection
mongoose.connect('mongodb://0.0.0.0:27017/miniCRM')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
