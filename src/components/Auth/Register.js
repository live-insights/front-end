// src/components/Auth/Register.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Register.css';

const Register = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Cliente');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { username, password, role, name, email };

    // Armazena o novo usuário no localStorage através da função register
    register(userData);
    navigate('/login'); // Redireciona para a página de login após o registro
  };

  return (
    <div>
      <h2>Cadastre-se</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          required
        >
          <option value="CLIENT">Cliente</option>
          <option value="ATTENDING">Atendimento</option>
          <option value="MANAGER">Gerente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
