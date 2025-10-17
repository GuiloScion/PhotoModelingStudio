import express from 'express';
import multer from 'multer';
import { processPhotogrammetry } from './photogrammetry/processor';
import cors from 'cors';
import path from 'path';
import { PhotoProcessingOptions } from './types';

const app = express();
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
app.use('/uploads', express.static('uploads'));

app.post('/api/photogrammetry/process', upload.array('photos'), async (req, res) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new Error('No files uploaded');
    }

    const options: PhotoProcessingOptions = {
      algorithm: req.body.algorithm || 'sfm',
      quality: parseInt(req.body.quality) || 50,
      density: parseInt(req.body.density) || 30
    };

    const result = await processPhotogrammetry(req.files, options);
    res.json(result);
  } catch (error) {
    console.error('Processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});