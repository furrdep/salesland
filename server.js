const express = require('express');
const app = express();
const empresaRoutes = require('./routes/empresaRoutes');
const db = require('./models');

app.use(express.json());
app.use('/api', empresaRoutes);

db.sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito.');
        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch
