import React, { useState, useEffect } from 'react';
import GaleriaCard from './GaleriaCard';
import GaleriaForm from './GaleriaForm';

function EmpresaCard({ empresa }) {
    const [galerias, setGalerias] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Para saber si estamos en modo edición
    const [editedEmpresa, setEditedEmpresa] = useState({ ...empresa }); // Empresa en edición

    useEffect(() => {
        const fetchGalerias = async () => {
            try {
                const response = await fetch(`/api/galeria?empresa=${empresa.id}`);
                const data = await response.json();

                setGalerias(data);
            } catch (error) {
                console.error("Error al obtener las galerías:", error);
            }
        };

        fetchGalerias();
    }, [empresa.id]);

    const handleEditSave = async () => {
        if (isEditing) {
            try {
                const response = await fetch(`/api/empresa/${editedEmpresa.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editedEmpresa),
                });
    
                const data = await response.json();
                console.log(data);
                // Aquí puedes hacer algo con la respuesta, como actualizar la empresa en el estado o mostrar un mensaje de éxito.
    
            } catch (error) {
                console.error('Error al actualizar empresa:', error);
            }
        }
        setIsEditing(!isEditing);
    };
    

    return (
        <div className="empresa-card">
            <h2>
                {isEditing ? 
                    <input value={editedEmpresa.nombre} onChange={(e) => setEditedEmpresa({ ...editedEmpresa, nombre: e.target.value })} /> 
                    : empresa.nombre}
            </h2>
            <p>
                {isEditing ? 
                    <textarea value={editedEmpresa.descripcion} onChange={(e) => setEditedEmpresa({ ...editedEmpresa, descripcion: e.target.value })} /> 
                    : empresa.descripcion}
            </p>
            <p>
                {isEditing ? 
                    <textarea value={editedEmpresa.historia} onChange={(e) => setEditedEmpresa({ ...editedEmpresa, historia: e.target.value })} />
                    : empresa.historia}
            </p>
            <p>
                {isEditing ? 
                    <input type="date" value={editedEmpresa.fecha} onChange={(e) => setEditedEmpresa({ ...editedEmpresa, fecha: e.target.value })} />
                    : empresa.fecha}
            </p>

            <button onClick={handleEditSave}>{isEditing ? 'Guardar' : 'Editar'}</button>

            <h3>Subir galeria:</h3>
            <GaleriaForm empresaId={empresa.id} />
            
            {galerias.length > 0 && <h3>Galerías de la empresa:</h3>}
            {galerias.map(galeria => <GaleriaCard key={galeria.id} galeria={galeria} />)}
        </div>
    );
}

export default EmpresaCard;
