// src/components/Auth/Register.js
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoLight from '../../assets/logo-light.png';

const Register = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('CLIENT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Garantir que o body e html não tenham margens/padding
  useEffect(() => {
    // Salvar estilos originais
    const originalBodyStyle = document.body.style.cssText;
    const originalHtmlStyle = document.documentElement.style.cssText;
    
    // Aplicar estilos para tela cheia
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Cleanup ao desmontar o componente
    return () => {
      document.body.style.cssText = originalBodyStyle;
      document.documentElement.style.cssText = originalHtmlStyle;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const userData = { username, password, role, name, email };

    try {
      // Armazena o novo usuário no localStorage através da função register
      const result = await register(userData);
      
      if (result && result.success !== false) {
        navigate('/login'); // Redireciona para a página de login após o registro
      } else {
        setError(result?.message || 'Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao criar conta');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.registerCard}>
        <div style={styles.header}>
          <img
            src={logoLight}
            alt="Live Insights Logo"
            style={styles.logoImage}
          />
          <h1 style={styles.welcomeText}>Cadastre-se</h1>
          <p style={styles.subtitle}>Crie sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
          >
            {isLoading ? (
              <span style={styles.loadingContent}>
                <div style={styles.spinner}></div>
                Cadastrando...
              </span>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Já tem uma conta?{' '}
            <a href="/login" style={styles.loginLink}>
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #FF5722 0%, #9C27B0 100%)', // laranja para roxo
    fontFamily: "'Inter', sans-serif",
    padding: '20px',
    boxSizing: 'border-box',
    margin: 0,
    overflowY: 'auto', // Permitir scroll se necessário no mobile
  },
  logoImage: {
    width: '140px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  registerCard: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#f4f7fe',
    borderRadius: '20px',
    padding: '40px 30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    margin: 'auto', // Centralizar verticalmente se houver scroll
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '12px',
  },
  logoIcon: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    padding: '8px',
  },
  bar1: { width: '8px', height: '24px', backgroundColor: '#FF5722', borderRadius: '4px' },
  bar2: { width: '8px', height: '32px', backgroundColor: '#FF5722', borderRadius: '4px' },
  bar3: { width: '8px', height: '20px', backgroundColor: '#FF5722', borderRadius: '4px' },
  logoText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  logoTextMain: { fontSize: '26px', fontWeight: '700', color: '#1E293B' },
  logoTextSub: { fontSize: '26px', fontWeight: '700', color: '#1E293B' },
  welcomeText: { fontSize: '24px', fontWeight: '600', color: '#1E293B', margin: '0 0 6px' },
  subtitle: { fontSize: '16px', color: '#64748B', margin: 0, fontWeight: '400' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  label: { fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px', textAlign: 'left' },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #E0E7FF',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: '#1E293B',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #E0E7FF',
    borderRadius: '12px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    color: '#1E293B',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    background: 'linear-gradient(135deg, #FF5722, #9C27B0)', // degradê laranja para roxo
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(255,87,34,0.25)',
    marginTop: '8px',
  },
  buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  loadingContent: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorMessage: {
    padding: '12px',
    backgroundColor: '#FFE5E5',
    color: '#D32F2F',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #F44336',
    textAlign: 'center',
  },
  footer: { textAlign: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #E2E8F0' },
  footerText: { fontSize: '14px', color: '#64748B', margin: 0 },
  loginLink: { color: '#FF5722', textDecoration: 'none', fontWeight: '600' },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `;
  document.head.appendChild(style);
}

export default Register;