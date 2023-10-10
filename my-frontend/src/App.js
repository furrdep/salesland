
import './App.css';
import React, { useState, useEffect } from 'react';
import EmpresaCard from './components/EmpresaCard';

function App() {
  const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api') // Asumiendo que tu backend está en la misma URL pero en otro puerto, y que has configurado un proxy en package.json o un CORS middleware en tu backend.
            .then(res => res.text())
            .then(data => setMessage(data))
            .catch(err => console.error('Error al obtener datos:', err));
    }, []);

    return (
        <div className="app">
            {message}
        </div>
    );
}

export default App;
