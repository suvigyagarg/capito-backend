import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadform = async (req, res) => {
  const storage = multer.diskStorage({
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  });

  const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }).single('image');

  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.file) {
      return {
        status: 400,
        message: 'No image file provided'
      };
    }

    const { hashtag, emoji, description, tone } = req.body;
    const imageFile = req.file;

    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'uploads'
    });

    await fs.unlink(imageFile.path);

    const responseData = {
      image_url: result.secure_url,
      hashtag: hashtag === 'true' || hashtag === true,
      emoji: emoji === 'true' || emoji === true,
      description,
      tone
    };

    return {
      status: 200,
      message: 'Image uploaded successfully',
      data: responseData
    };

  } catch (error) {
    console.error('Error in uploadform:', error);

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return {
          status: 413,
          message: 'File size is too large. Max limit is 5MB'
        };
      }
      return {
        status: 400,
        message: error.message
      };
    }

    return {
      status: 500,
      message: 'Internal server error'
    };
  }
};