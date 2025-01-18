import { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
    origin: [
        'http://localhost:3000',
        'https://motionsoundnews.com',
        'https://api.motionsoundnews.com'
    ],
    credentials: true
}; 