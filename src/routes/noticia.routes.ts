import { Router } from 'express';
import {
    getNoticias,
    getNoticia,
    getNoticiaBySlug,
    createNoticia,
    updateNoticia,
    deleteNoticia,
    cambiarEstadoNoticia,
    getNoticiasByCategoria,
    getNoticiasPublicas,
    getNoticiasPorCategoriaPublica
} from '../controllers/noticia.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createNoticiaSchema, updateNoticiaSchema } from '../schemas/noticia.schema';

const router = Router();

// Rutas públicas
router.get('/public', getNoticiasPublicas);
router.get('/public/categoria/:categoria', getNoticiasPorCategoriaPublica);
router.get('/slug/:slug', getNoticiaBySlug);

// Rutas protegidas
router.use(authMiddleware);
router.get('/', getNoticias);
router.get('/categoria/:categoria', getNoticiasByCategoria);
router.get('/:id', getNoticia);
router.post('/', validateSchema(createNoticiaSchema), createNoticia);
router.put('/:id', validateSchema(updateNoticiaSchema), updateNoticia);
router.delete('/:id', deleteNoticia);
router.put('/:id/estado', cambiarEstadoNoticia);

export default router; 