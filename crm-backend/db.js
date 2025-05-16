const mongoose = require('mongoose');

// MongoDB connection URL (change with your database URL)
const mongoURI = 'mongodb://localhost:27017/miniCRM'; // Local MongoDB URL or your remote DB URL

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected...');
}).catch((err) => {
  console.log('MongoDB connection error: ', err);
});
