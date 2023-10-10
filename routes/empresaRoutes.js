const express = require('express');
const router = express.Router();

const { Empresa, galeria } = require('../models');

// Ruta de bienvenida
router.get('/', (req, res) => {
    res.send('Bienvenido a la API de empresas');
});

// Endpoint para manejar /empresas
router.get('/empresa', async (req, res) => {
    try {
        if (req.query.id) {
            const empresa = await Empresa.findByPk(req.query.id);
            if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
            return res.json(empresa);
        }
        const empresas = await Empresa.findAll();
        res.json(empresas);
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "Error al obtener las empresas." });
    }
});
router.get('/galeria', async (req, res) => {
    try {
        if (!req.query.empresa) return res.status(400).json({ error: 'El parámetro empresa es necesario' });
        
        const galerias = await galeria.findAll({
            where: { empresa_id: req.query.empresa }
        });
        res.json(galerias);
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "Error al obtener las galerías." });
    }
});



module.exports = router;
