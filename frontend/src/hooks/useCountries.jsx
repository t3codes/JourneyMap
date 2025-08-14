import { useState, useEffect } from 'react';
import { countriesService } from '../services/apiService.js';

export const useCountries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [userCountries, setUserCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllCountries = async () => {
    try {
      const response = await countriesService.getAllCountries();
      if (response.success) {
        setAllCountries(response.data);
      }
    } catch (err) {
      setError('Erro ao carregar países');
      console.error('Erro ao carregar países:', err);
    }
  };

  const fetchUserCountries = async () => {
    try {
      const response = await countriesService.getUserCountries();
      setUserCountries(response);
    } catch (err) {
      if (err.response?.status === 401) {
        // Erro de autenticação será tratado pelo interceptor
        setError('Sessão expirada. Redirecionando para login...');
      } else {
        setError('Erro ao carregar países do usuário');
      }
      console.error('Erro ao carregar países do usuário:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchAllCountries(),
        fetchUserCountries()
      ]);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Função para obter estatísticas
  const getStats = () => {
    const visited = userCountries.filter(country => country.visited).length;
    const desired = userCountries.filter(country => !country.visited).length;
    const total = userCountries.length;
    
    return { visited, desired, total };
  };

  // Função para verificar se um país foi visitado
  const isCountryVisited = (countryName) => {
    const userCountry = userCountries.find(
      country => country.nome_comum.toLowerCase() === countryName.toLowerCase()
    );
    return userCountry ? userCountry.visited : null; // null = não está na lista do usuário
  };

  // Função para obter dados do país do usuário
  const getUserCountryData = (countryName) => {
    return userCountries.find(
      country => country.nome_comum.toLowerCase() === countryName.toLowerCase()
    );
  };

  return {
    allCountries,
    userCountries,
    loading,
    error,
    getStats,
    isCountryVisited,
    getUserCountryData,
    refetch: loadData
  };
};

