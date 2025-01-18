import { Router } from 'express';
import {
    getCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    cambiarEstadoCategoria,
    getCategoriasPublicas,
    getCategoriasConConteosPublicos,
    getCategoriasConConteos
} from '../controllers/categoria.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateSchema } from '../middleware/validate.middleware';
import { createCategoriaSchema, updateCategoriaSchema } from '../schemas/categoria.schema';

const router = Router();

// Rutas públicas
router.get('/public', getCategoriasPublicas);
router.get('/public/with-counts', getCategoriasConConteosPublicos);

// Rutas protegidas
router.use(authMiddleware);
router.get('/', getCategorias);
router.get('/with-counts', getCategoriasConConteos);
router.get('/:id', getCategoria);
router.post('/', validateSchema(createCategoriaSchema), createCategoria);
router.put('/:id', validateSchema(updateCategoriaSchema), updateCategoria);
router.delete('/:id', deleteCategoria);
router.put('/:id/estado', cambiarEstadoCategoria);

export default router; 