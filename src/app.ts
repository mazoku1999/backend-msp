import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { corsOptions } from './config/cors.config';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import categoriaRoutes from './routes/categoria.routes';
import noticiaRoutes from './routes/noticia.routes';
import videoRoutes from './routes/video.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/videos', videoRoutes);

// Error handling
app.use(errorHandler);

// Ruta de prueba
app.get('/', (_req, res) => {
    res.json({ message: 'API MSP funcionando correctamente' });
});

// Agregar después de las importaciones
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Modificar la exportación para Vercel
export default app;

// Solo escuchar en el puerto cuando no estamos en Vercel
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        logger.info(`Servidor corriendo en puerto ${PORT}`);
    });
}

// Manejo de errores no capturados
process.on('unhandledRejection', (err: any) => {
    logger.error('Error no manejado:', err);
    // No cerrar el proceso en producción
    if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
    }
}); 