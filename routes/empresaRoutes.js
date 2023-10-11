const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const app = express();
const { Empresa, galeria } = require('../models');
const fs = require('fs');

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


//subir
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
       cb(null, "EMPRESA-" + Date.now() + path.extname(file.originalname));
    }
});
  
const upload = multer({ storage: storage });

router.post('/empresa', upload.single('imagen'), async (req, res) => {
    console.log(req.body);  // Añade esta línea
    
    const { nombre, descripcion,fecha } = req.body;
    const [day, month, year] = fecha.split("-");
    const formattedDate = `${year}-${month}-${day}`;

    try {
        const newEmpresa = await Empresa.create({
            nombre: nombre,
            descripcion: descripcion,
            fecha: formattedDate
        });
        
        res.json(newEmpresa);
    } catch (error) {
        console.error("Error detallado:", error.message);  // Cambia esta línea
        res.status(500).json({ error: "Error al crear la empresa." });
    }
});
//subir las imagenes
// Configuración para subir imágenes de la galería
const galeriaStorage = multer.diskStorage({
    destination: path.join(__dirname, '/imagenesdegaleria/'),
    filename: function(req, file, cb){
        cb(null, "GALERIA-" + Date.now() + path.extname(file.originalname));
    }
});

const galeriaUpload = multer({ storage: galeriaStorage });

router.post('/galeria', galeriaUpload.single('imagen'), async (req, res) => {
    console.log("Imagen recibida:", req.file);

    const { descripcion, empresa_id } = req.body;
    const imagenName = req.file.filename; // Solo guarda el nombre del archivo

    try {
        const nuevaGaleria = await galeria.create({
            descripcion: descripcion,
            imagen: imagenName,  // Usar solo el nombre del archivo aquí
            empresa_id: empresa_id
        });
        
        res.json(nuevaGaleria);
    } catch (error) {
        console.error("Error al añadir imagen a la galería:", error.message);
        res.status(500).json({ error: "Error al añadir imagen a la galería." });
    }
});


//editar la empresa
router.put('/empresa/:id', async (req, res) => {
    const { nombre, descripcion, historia, fecha } = req.body;
    
    try {
        const empresa = await Empresa.findByPk(req.params.id);
        
        if (!empresa) {
            return res.status(404).json({ error: 'Empresa no encontrada' });
        }

        empresa.nombre = nombre;
        empresa.descripcion = descripcion;
        empresa.historia = historia;
        empresa.fecha = fecha;

        await empresa.save();

        res.json(empresa);
    } catch (error) {
        console.error("Error al actualizar la empresa:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
});
//editar la galeria 
router.put('/galeria/:id', galeriaUpload.single('imagen'), async (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    const imagenName = req.file ? req.file.filename : null;

    try {
        const galeriaToUpdate = await galeria.findByPk(id);
        if (!galeriaToUpdate) {
            return res.status(404).json({ error: 'Galería no encontrada.' });
        }

        if (imagenName && galeriaToUpdate.imagen !== imagenName) {
            console.log("Intentando eliminar la imagen anterior:", galeriaToUpdate.imagen);
            
            const pathToDelete = path.join(__dirname, 'imagenesdegaleria', galeriaToUpdate.imagen);
            console.log("Ruta completa de la imagen a eliminar:", pathToDelete);
            
            try {
                fs.unlinkSync(pathToDelete);
                console.log("Imagen anterior eliminada con éxito");
            } catch (err) {
                console.error("Error al eliminar el archivo de imagen anterior:", err);
            }
        
            // Actualizamos la galería con la nueva imagen
            galeriaToUpdate.imagen = imagenName;
        }

        if (descripcion) {
            galeriaToUpdate.descripcion = descripcion;
        }

        await galeriaToUpdate.save();

        res.json(galeriaToUpdate);
    } catch (error) {
        console.error("Error al actualizar galería:", error.message);
        res.status(500).json({ error: "Error al actualizar la galería." });
    }
});


//eliminacion de galeria
router.delete('/galeria/:id', async (req, res) => {
    try {
        const galeriaToDelete = await galeria.findByPk(req.params.id);
        if (!galeriaToDelete) {
            return res.status(404).json({ error: 'Galería no encontrada.' });
        }

        // Eliminar imagen del sistema de archivos
        fs.unlink(path.join(__dirname, 'imagenesdegaleria', galeriaToDelete.imagen), (err) => {
            if (err) {
                console.error("Error al eliminar el archivo de imagen:", err);
                // Aquí puedes decidir si quieres continuar con la eliminación de la base de datos o detener el proceso.
                // Por simplicidad, vamos a continuar, pero en un entorno de producción puedes manejar esto con más detalle.
            }

            console.log("Archivo de imagen eliminado con éxito");
        });

        // Eliminar entrada en la base de datos
        await galeriaToDelete.destroy();

        res.json({ success: 'Galería eliminada correctamente.' });
    } catch (error) {
        console.error("Error al eliminar la galería:", error.message);
        res.status(500).json({ error: "Error al eliminar la galería." });
    }
});

//eliminacion de empresas
router.delete('/empresa/:id', async (req, res) => {
    try {
        const empresaToDelete = await Empresa.findByPk(req.params.id);
        if (!empresaToDelete) {
            return res.status(404).json({ error: 'Empresa no encontrada.' });
        }

        // Obtener todas las galerías asociadas a la empresa
        const galerias = await galeria.findAll({
            where: { empresa_id: req.params.id }
        });

        // Eliminar cada imagen de galería del sistema de archivos y luego la entrada en la base de datos
        for (let g of galerias) {
            fs.unlink(path.join(__dirname, 'imagenesdegaleria', g.imagen), (err) => {
                if (err) {
                    console.error("Error al eliminar el archivo de imagen:", err);
                    // Aquí, nuevamente, puedes decidir si deseas continuar o detener el proceso.
                }
            });

            // Eliminar entrada de la galería en la base de datos
            await g.destroy();
        }

        // Finalmente, eliminar la empresa
        await empresaToDelete.destroy();

        res.json({ success: 'Empresa y sus galerías asociadas eliminadas correctamente.' });
    } catch (error) {
        console.error("Error al eliminar la empresa y sus galerías:", error.message);
        res.status(500).json({ error: "Error al eliminar la empresa y sus galerías." });
    }
});

module.exports = router;
