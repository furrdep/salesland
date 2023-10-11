import React, { useState, useEffect } from 'react';

function EmpresaForm({ empresa = null, onFormCompleted }) {
    const [nombre, setNombre] = useState(empresa ? empresa.nombre : '');
    const [descripcion, setDescripcion] = useState(empresa ? empresa.descripcion : '');
    const [fecha, setFecha] = useState(empresa ? empresa.fecha : '');

    useEffect(() => {
        if (empresa) {
            setNombre(empresa.nombre);
            setDescripcion(empresa.descripcion);
            setFecha(empresa.fecha);
        }
    }, [empresa]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = empresa ? `/api/empresa/${empresa.id}` : '/api/empresa';
        const method = empresa ? 'PUT' : 'POST';
        const formData = new FormData();

        formData.append('nombre', nombre);
        formData.append('descripcion', descripcion);
        formData.append('fecha', fecha);

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            const data = await response.json();
            console.log(data);
            
            onFormCompleted && onFormCompleted(); // informar al componente padre si es necesario

        } catch (error) {
            console.error('Error al procesar la empresa:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Nombre" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
            />
            <textarea 
                placeholder="Descripción" 
                value={descripcion} 
                onChange={(e) => setDescripcion(e.target.value)} 
            />
            <input 
                type="date" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                required
            />

            <button type="submit">{empresa ? 'Editar Empresa' : 'Crear Empresa'}</button>
        </form>
    );
}

export default EmpresaForm;
