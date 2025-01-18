import { Router } from 'express';
import {
    getVideos,
    getVideo,
    getVideoBySlug,
    createVideo,
    updateVideo,
    deleteVideo,
    cambiarEstadoVideo,
    getVideosByCategoria,
    getVideosPublicos,
    getVideosPorCategoriaPublica
} from '../controllers/video.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createVideoSchema, updateVideoSchema } from '../schemas/video.schema';

const router = Router();

// Rutas públicas
router.get('/public', getVideosPublicos);
router.get('/public/categoria/:categoria', getVideosPorCategoriaPublica);
router.get('/slug/:slug', getVideoBySlug);

// Rutas protegidas
router.use(authMiddleware);
router.get('/', getVideos);
router.get('/categoria/:categoria', getVideosByCategoria);
router.get('/:id', getVideo);
router.post('/', validateSchema(createVideoSchema), createVideo);
router.put('/:id', validateSchema(updateVideoSchema), updateVideo);
router.delete('/:id', deleteVideo);
router.put('/:id/estado', cambiarEstadoVideo);

export default router; 