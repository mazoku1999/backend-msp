const cors = require('cors');

app.use(cors());

app.use('/api/categorias/public', (req, res) => {
    console.log('Ruta accedida:', req.path);
    console.log('Método:', req.method);
    // tu lógica aquí
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
}); 