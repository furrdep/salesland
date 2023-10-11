const express = require('express');
const app = express();
const empresaRoutes = require('./routes/empresaRoutes');
const db = require('./models');
const cors = require('cors')
const path = require('path');
app.use(express.json());
app.use(cors());
app.use('/api', empresaRoutes);
app.use('/imagenesdegaleria', express.static(path.join(__dirname, './routes/imagenesdegaleria')));

app.use(cors());
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

