import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, RefreshCw, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCountries } from '../hooks/useCountries.jsx';
import WorldMap from '../components/WorldMap.jsx';
import StatsCard from '../components/StatsCard.jsx';
import CountryList from '../components/CountryList.jsx';
import CustomAlert from '../components/CustomAlert.jsx';
import AddCountryModal from '../components/AddCountryModal.jsx';
import VisitedModal from '../components/VisitedModal.jsx';
import { Button } from '../components/ui/button.jsx';

const Dashboard = () => {
  const [alert, setAlert] = useState({ isOpen: false, type: 'success', title: '', message: '' });
  const [addCountryModal, setAddCountryModal] = useState({ isOpen: false, country: null });
  const [visitedModal, setVisitedModal] = useState({ isOpen: false, country: null });
  const [addingCountry, setAddingCountry] = useState(false);
  const [updatingCountry, setUpdatingCountry] = useState(false);
  const [removingCountry, setRemovingCountry] = useState(false);
  const { logout, isAuthenticated, user } = useAuth();
  const { 
    allCountries, 
    userCountries, 
    loading, 
    error, 
    getStats, 
    isCountryVisited,
    getUserCountryData,
    refetch 
  } = useCountries();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
    
    // Expor função global para o WorldMap
    window.openAddCountryModal = (country) => {
      setAddCountryModal({ isOpen: true, country });
    };
    
    return () => {
      delete window.openAddCountryModal;
    };
  }, [isAuthenticated, navigate]);

  const showAlert = (type, title, message) => {
    setAlert({ isOpen: true, type, title, message });
  };

  const handleLogout = () => {
    logout();
    showAlert('success', 'Logout realizado', 'Até a próxima viagem!');
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleCountryClick = (country) => {
    // A lógica do modal de adicionar à lista ou de visualização já é tratada pelo Popup do Leaflet
    // e pelo window.openAddCountryModal. Não é necessário um alerta adicional aqui.
  };

  const handleUserCountryClick = (countryName) => {
    showAlert('info', 'País Selecionado', countryName);
  };

  const handleRefresh = () => {
    refetch();
    showAlert('success', 'Dados atualizados', 'As informações foram recarregadas');
  };

  const handleAddCountry = async (countryName, observations) => {
    setAddingCountry(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://127.0.0.1:5000/api/rest-countries/save/${countryName.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ observacoes: observations })
      });

      if (response.ok) {
        showAlert('success', 'País adicionado!', `${countryName} foi adicionado à sua lista de viagens.`);
        refetch(); // Atualizar a lista
      } else if (response.status === 401) {
        // Token expirado ou inválido
        logout();
        navigate('/');
        showAlert('error', 'Sessão expirada', 'Faça login novamente para continuar.');
      } else {
        throw new Error('Erro ao adicionar país');
      }
    } catch (error) {
      console.error('Erro ao adicionar país:', error);
      showAlert('error', 'Erro', 'Não foi possível adicionar o país à sua lista.');
    } finally {
      setAddingCountry(false);
    }
  };

  const handleRemoveCountry = async (country) => {
    if (!confirm(`Tem certeza que deseja remover ${country.nome_comum} da sua lista?`)) {
      return;
    }

    setRemovingCountry(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://127.0.0.1:5000/api/paises/${country.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        showAlert('success', 'País removido!', `${country.nome_comum} foi removido da sua lista.`);
        refetch(); // Atualizar a lista
      } else if (response.status === 401) {
        logout();
        navigate('/');
        showAlert('error', 'Sessão expirada', 'Faça login novamente para continuar.');
      } else {
        throw new Error('Erro ao remover país');
      }
    } catch (error) {
      console.error('Erro ao remover país:', error);
      showAlert('error', 'Erro', 'Não foi possível remover o país da sua lista.');
    } finally {
      setRemovingCountry(false);
    }
  };

  const handleMarkVisited = async (countryId, observations) => {
    setUpdatingCountry(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`http://127.0.0.1:5000/api/paises/${countryId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visited: true,
          observacoes: observations
        })
      });

      if (response.ok) {
        showAlert('success', 'País atualizado!', 'As informações do país foram atualizadas.');
        refetch(); // Atualizar a lista
      } else if (response.status === 401) {
        logout();
        navigate('/');
        showAlert('error', 'Sessão expirada', 'Faça login novamente para continuar.');
      } else {
        throw new Error('Erro ao atualizar país');
      }
    } catch (error) {
      console.error('Erro ao atualizar país:', error);
      showAlert('error', 'Erro', 'Não foi possível atualizar as informações do país.');
    } finally {
      setUpdatingCountry(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar dados</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} className="bg-primary hover:bg-primary/90">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Travel Map</h1>
              <span className="text-muted-foreground">Dashboard</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="border-border hover:bg-muted"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

        {/* Main Content */}
      <main className="flex h-[calc(100vh-80px)]">
        {/* Sidebar - Menu Lateral Esquerdo */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-80 bg-card/50 border-r border-border overflow-y-auto"
        >
          <div className="p-4">
            {/* Stats Cards */}
            <StatsCard stats={stats} loading={loading} />
            
            {/* Country List */}
            <div className="mt-6">
              <CountryList
                countries={userCountries}
                onCountryClick={handleUserCountryClick}
                onRemoveCountry={handleRemoveCountry}
                onMarkVisited={(country) => setVisitedModal({ isOpen: true, country })}
                loading={loading}
              />
            </div>
          </div>
        </motion.aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* World Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 pt-0 mt-8"
          >
            <div className="glass rounded-lg p-4 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-3">Legenda</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
                  <span className="text-sm text-muted-foreground">Países Visitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-secondary rounded-full border-2 border-white"></div>
                  <span className="text-sm text-muted-foreground">Países Desejados</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white"></div>
                  <span className="text-sm text-muted-foreground">Outros Países</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1 p-4"
          >
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              🗺️ Mapa Mundial
            </h2>
            {loading ? (
              <div className="w-full h-full rounded-lg border border-border bg-card/50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando mapa...</p>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100%-60px)]">
                <WorldMap
                  countries={allCountries}
                  userCountries={userCountries}
                  onCountryClick={handleCountryClick}
                  isCountryVisited={isCountryVisited}
                />
              </div>
            )}
          </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 pt-0 mt-8"
            >
              <div className="glass rounded-lg p-4 border border-border">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Desenvolvido por <strong>Tharlles Jhoines Silva Té</strong></p>
                  <p>Telefone: <a href="tel:+5577998753554" className="text-primary">77998753554</a></p>
                  <p>Email: <a href="mailto:tharlles.engineer@gmail.com" className="text-primary">tharlles.engineer@gmail.com</a></p>
                </div>
              </div>
            </motion.div>

        </div>
      </main>

      <CustomAlert
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        autoClose={alert.type !== 'info'}
        duration={alert.type === 'info' ? 4000 : 2000}
      />

      <AddCountryModal
        isOpen={addCountryModal.isOpen}
        onClose={() => setAddCountryModal({ isOpen: false, country: null })}
        country={addCountryModal.country}
        onAddCountry={handleAddCountry}
        loading={addingCountry}
      />

      <VisitedModal
        isOpen={visitedModal.isOpen}
        onClose={() => setVisitedModal({ isOpen: false, country: null })}
        country={visitedModal.country}
        onMarkVisited={handleMarkVisited}
        loading={updatingCountry}
      />
    </div>
  );
};

export default Dashboard;

