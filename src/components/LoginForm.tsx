import React, { useState } from 'react';
import { login } from '../api/login';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [emailOrUserName, setEmailOrUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(emailOrUserName, password);
      if (data && data.token) {
        localStorage.setItem('jwtToken', data.token);
        onLoginSuccess();
      } else {
        setError('Credenciales incorrectas.');
      }
    } catch (err) {
      setError('Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: '40px auto', padding: 24, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Iniciar sesión</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Usuario o Email"
          value={emailOrUserName}
          onChange={e => setEmailOrUserName(e.target.value)}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
    </form>
  );
};

export default LoginForm;
