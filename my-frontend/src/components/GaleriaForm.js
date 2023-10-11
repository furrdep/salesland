// src/components/GaleriaForm.js
import React, { useState } from 'react';

function GaleriaForm({ empresaId }) {
    const [imagen, setImagen] = useState(null);
    const [descripcion, setDescripcion] = useState('');  // <-- Nuevo estado para la descripción

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        
        formData.append('imagen', imagen);
        formData.append('descripcion', descripcion);  // <-- Añadir descripción al FormData
        formData.append('empresa_id', empresaId);

        try {
            const response = await fetch('/api/galeria', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log(data);
            // Aquí puedes hacer algo con la respuesta, como actualizar la lista de imágenes o mostrar un mensaje.

        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Descripción" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
                required
            />
            <input 
                type="file" 
                onChange={(e) => setImagen(e.target.files[0])} 
                required
            />
            <button type="submit">Subir Imagen</button>
        </form>
    );
}

export default GaleriaForm;
