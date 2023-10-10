const express = require('express');
const app = express();
const empresaRoutes = require('./routes/empresaRoutes');
const db = require('./models');

app.use(express.json());
app.use('/api', empresaRoutes);

db.sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
        const PORT = 3001; // Cambia el puerto a 3001
        app.listen(PORT, () => {
            console.log(`Backend corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error('No se pudo conectar a la base de datos:', error);
    });

