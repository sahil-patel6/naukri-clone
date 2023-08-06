import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    //@ts-ignore
    folder: 'naukri-clone',
    public_id: (req, file) => `recruiter-${Date.now()}-${file.originalname}`
  },
  transformation: [{ width: 500, height: 500, crop: 'limit' }]
});

const upload = multer({ storage: storage });

export { upload };