import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autorização
api.interceptors.request.use((config) => {
  // Primeiro tenta pegar o token do localStorage com a chave 'token'
  let token = localStorage.getItem('token') || localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - apenas limpa os tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      
      // NÃO redirecionar automaticamente - deixar o componente decidir
      console.warn('Token expirado ou inválido. Limpando tokens do localStorage.');
    }
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/usuarios/login', { email, senha });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/usuarios/', userData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('accessToken');
  },
  
  getToken: () => {
    return localStorage.getItem('accessToken');
  },
  
  setToken: (token) => {
    localStorage.setItem('accessToken', token);
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

// Serviços de países
export const countriesService = {
  getAllCountries: async () => {
    const response = await api.get('/rest-countries/all');
    return response.data;
  },
  
  getUserCountries: async () => {
    const response = await api.get('/paises/');
    return response.data;
  },
  
  addCountry: async (countryData) => {
    const response = await api.post('/paises/', countryData);
    return response.data;
  },
  
  updateCountry: async (id, countryData) => {
    const response = await api.put(`/paises/${id}`, countryData);
    return response.data;
  },
  
  deleteCountry: async (id) => {
    const response = await api.delete(`/paises/${id}`);
    return response.data;
  }
};

export default api;
