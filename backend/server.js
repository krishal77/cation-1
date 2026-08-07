const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'culture-guide-express-server',
    timestamp: new Date(),
  });
});

app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/recognize', require('./src/routes/recognitionRoutes'));
app.use('/api/heritage', require('./src/routes/heritageRoutes'));
app.use('/api/story', require('./src/routes/storyRoutes'));

app.get('/download-apk', (req, res) => {
  const apkPath = path.join(__dirname, '../frontend/public/app-debug.apk');
  res.download(apkPath, 'CultureGuide.apk');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Express Server running on port ${PORT}`);
});

