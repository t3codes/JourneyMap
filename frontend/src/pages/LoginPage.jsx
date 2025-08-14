import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import AnimatedBackground from '../components/AnimatedBackground.jsx';
import LoginForm from '../components/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm.jsx';
import CustomAlert from '../components/CustomAlert.jsx';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        showAlert('success', 'Login realizado com sucesso!', result.message);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        showAlert('error', 'Erro no login', result.message);
      }
    } catch (error) {
      showAlert('error', 'Erro no login', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const result = await register(formData);
      
      if (result.success) {
        showAlert('success', 'Conta criada com sucesso!', 'Agora você pode fazer login');
        setTimeout(() => {
          setIsLogin(true);
        }, 2000);
      } else {
        showAlert('error', 'Erro no registro', result.message);
      }
    } catch (error) {
      showAlert('error', 'Erro no registro', 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Journey Map
          </h1>
          <p className="text-muted-foreground">
            Explore o mundo e marque suas aventuras
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm
              key="login"
              onSubmit={handleLogin}
              loading={loading}
              onToggleForm={() => setIsLogin(false)}
            />
          ) : (
            <RegisterForm
              key="register"
              onSubmit={handleRegister}
              loading={loading}
              onToggleForm={() => setIsLogin(true)}
            />
          )}
        </AnimatePresence>
      </div>

      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default LoginPage;

