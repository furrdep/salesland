
import './App.css';
import React, { useState, useEffect } from 'react';
import EmpresaCard from './components/EmpresaCard';
import EmpresaForm from './components/EmpresaForm';


function App() {
  const [message, setMessage] = useState('');
  const [empresas, setEmpresas] = useState([]);
const [showForm, setShowForm] = useState(false);


  useEffect(() => {
    // Obtener el mensaje de bienvenida
    fetch('/api')
        .then(res => res.text())
        .then(data => setMessage(data))
        .catch(err => console.error('Error al obtener datos:', err));

    // Obtener la lista de empresas
    fetch('/api/empresa')
        .then(res => res.json())
        .then(data => setEmpresas(data))
        .catch(err => console.error('Error al obtener empresas:', err));
}, []);


    return (
        <div className="app">
            <h2>{message}</h2>
            <button onClick={() => setShowForm(true)}>Crear Empresa</button>
            {showForm && <EmpresaForm />}
            {empresas.map(empresa => <EmpresaCard key={empresa.id} empresa={empresa} />)}

            
        </div>
    
);

}

export default App;
