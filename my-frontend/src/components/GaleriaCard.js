import React, { useState } from 'react';

function GaleriaCard({ galeria }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDescripcion, setEditedDescripcion] = useState(galeria.descripcion);
    const [editedImage, setEditedImage] = useState(null);


    const handleEditSave = async () => {
    if (isEditing) {
        try {
            const formData = new FormData();
            formData.append("descripcion", editedDescripcion);

            // Si se ha seleccionado una nueva imagen, agrégala al formData
            if (editedImage) {
                formData.append("imagen", editedImage);
            }

            const response = await fetch(`/api/galeria/${galeria.id}`, {
                method: 'PUT',
                body: formData,  // Usamos formData aquí en lugar de JSON
            });

            const data = await response.json();
            console.log(data);
            // Aquí puedes hacer algo con la respuesta...

        } catch (error) {
            console.error('Error al actualizar la descripción de la galería:', error);
        }
    }
    setIsEditing(!isEditing);
};

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/galeria/${galeria.id}`, {
                method: 'DELETE',
            });

    
            if (response.ok) {
                // Aquí puedes actualizar el estado para reflejar la eliminación.
                // Por ejemplo, puedes emitir un evento para que el componente padre actualice la lista de galerías.
                console.log("Galería eliminada correctamente");
            } else {
                console.error('Error al eliminar la galería.');
            }
        } catch (error) {
            console.error('Error al eliminar la galería:', error);
        }
    };
    return (
        <div className="galeria-card">
            <p>
            {isEditing ? 
                <>
                    <textarea value={editedDescripcion} onChange={(e) => setEditedDescripcion(e.target.value)} />
                    <input type="file" onChange={(e) => setEditedImage(e.target.files[0])} />
                </>
                : 
                galeria.descripcion
            }

            </p>
            <img src={`http://localhost:3001/imagenesdegaleria/${galeria.imagen}`} alt={galeria.imagen} />
            <button onClick={handleEditSave}>{isEditing ? 'Guardar' : 'Editar Descripción'}</button>
            <button onClick={handleDelete}>Eliminar</button>
        </div>
    );
}

export default GaleriaCard;
