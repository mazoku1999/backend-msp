import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        'http://localhost:3000',
        'https://motionsoundnews.com',
        'https://www.motionsoundnews.com',
        'https://api.motionsoundnews.com',
        'https://admin.motionsoundnews.com'
    ],
    credentials: true
}; 