import dotenv from 'dotenv';
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer configuration with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
}).single('image');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// API endpoint
app.post('/api/submit', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size is too large. Max limit is 5MB' });
      }
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: 'Unknown error occurred during file upload' });
    }

    // Everything went fine.
    const { hashtag, emoji, description, tone } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    if (!hashtag || !emoji || !description || !tone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a response object
    const responseData = {
      image: {
        url: imageFile.path,
        publicId: imageFile.filename
      },
      hashtag,
      emoji,
      description,
      tone: JSON.parse(tone)
    };

    // Log the data in JSON format
    console.log('Received data:');
    console.log(JSON.stringify(responseData, null, 2));

    // Send the response back to the client
    res.json(responseData);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});
