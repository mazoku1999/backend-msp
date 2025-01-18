export default async function handler(req, res) {
    console.log('Método:', req.method);
    console.log('URL:', req.url);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Método no permitido' });
    }

    try {
        // tu lógica aquí
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor' });
    }
} 