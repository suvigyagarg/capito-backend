import express from 'express';
import ImageUploadRoutes from './imageUpload/index.js'

const router = express.Router();

export default ()=>{

    router.use('/onsubmit', ImageUploadRoutes());

    return router;
}
