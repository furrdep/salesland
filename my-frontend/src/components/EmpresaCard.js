// src/components/EmpresaCard.js

import React from 'react';

function EmpresaCard({ empresa }) {
    return (
        <div className="empresa-card">
            <h2>{empresa.nombre}</h2>
            <p>{empresa.descripcion}</p>
            <p>{empresa.historia}</p>
            <p>{empresa.fecha}</p>
        </div>
    );
}

export default EmpresaCard;
