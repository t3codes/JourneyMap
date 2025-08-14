const axios = require('axios');

class RestCountriesService {
  constructor() {
    this.baseURL = 'https://restcountries.com/v3.1';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RestCountriesClient/1.0'
      }
    });
  }

  /**
   * Busca todos os países disponíveis na API REST Countries
   * @returns {Promise<Array>} Lista de países
   */
  async getAllCountries() {
    try {
      const response = await this.client.get('/all?fields=name,capitalInfo,capital,currencies,region,subregion,languages,flag,maps,population');
      console.log(response.data);
      return this.formatCountriesList(response.data);
    } catch (error) {
      console.error('Erro ao buscar todos os países:', error.message);
      throw new Error('Falha ao buscar lista de países');
    }
  }

  /**
   * Busca um país específico pelo nome
   * @param {string} countryName - Nome do país
   * @returns {Promise<Object>} Dados detalhados do país
   */
  async getCountryByName(countryName) {
    try {
      const response = await this.client.get(`/name/${encodeURIComponent(countryName)}`);
      return this.formatCountryDetails(response.data[0]);
    } catch (error) {
      console.error(`Erro ao buscar país ${countryName}:`, error.message);
      if (error.response && error.response.status === 404) {
        throw new Error('País não encontrado');
      }
      throw new Error('Falha ao buscar dados do país');
    }
  }

  /**
   * Busca países por região
   * @param {string} region - Nome da região
   * @returns {Promise<Array>} Lista de países da região
   */
  async getCountriesByRegion(region) {
    try {
      const response = await this.client.get(`/region/${encodeURIComponent(region)}`);
      return this.formatCountriesList(response.data);
    } catch (error) {
      console.error(`Erro ao buscar países da região ${region}:`, error.message);
      throw new Error('Falha ao buscar países da região');
    }
  }

  /**
   * Formata a lista de países para exibição simplificada
   * @param {Array} countries - Array de países da API
   * @returns {Array} Lista formatada
   */
  formatCountriesList(countries) {
    return countries.map(country => ({
      nome_comum: country.name?.common || 'N/A',
      nome_oficial: country.name?.official || 'N/A',
      codigo_pais: country.cca2 || 'N/A',
      capitalInfo: country.capitalInfo.latlng || 'N/A',
      regiao: country.region || 'N/A',
      sub_regiao: country.subregion || 'N/A',
      capital: Array.isArray(country.capital) ? country.capital[0] : (country.capital || 'N/A'),
      populacao: country.population || 0,
      bandeira_png: country.flags?.png || '',
      bandeira_svg: country.flags?.svg || '',
      moeda: country.currencies ? Object.values(country.currencies)[0]?.name || 'N/A' : 'N/A',
      simbolo_moeda: country.currencies ? Object.values(country.currencies)[0]?.symbol || 'N/A' : 'N/A',
      idioma: country.languages ? Object.values(country.languages)[0] || 'N/A' : 'N/A',
      mapas: country.maps ? {
        googleMaps: country.maps.googleMaps || 'N/A',
        openStreetMaps: country.maps.openStreetMaps || 'N/A',
      } : { googleMaps: 'N/A', openStreetMaps: 'N/A' }
    }));
  }


  /**
   * Formata os dados detalhados de um país
   * @param {Object} country - Dados do país da API
   * @returns {Object} Dados formatados
   */
  formatCountryDetails(country) {
    // Extrair moeda principal
    const currencies = country.currencies || {};
    const currencyKey = Object.keys(currencies)[0];
    const currency = currencies[currencyKey];

    // Extrair continente principal
    const continents = country.continents || [];
    const continent = continents[0] || 'N/A';

    return {
      // Informações gerais
      nome_comum: country.name?.common || 'N/A',
      nome_oficial: country.name?.official || 'N/A',
      codigo_pais_2: country.cca2 || 'N/A',
      codigo_pais_3: country.cca3 || 'N/A',
      codigo_numerico: country.ccn3 || 'N/A',
      regiao: country.region || 'N/A',
      sub_regiao: country.subregion || 'N/A',
      capital: Array.isArray(country.capital) ? country.capital[0] : country.capital || 'N/A',
      continente: continent,

      // Moeda
      moeda: currency?.name || 'N/A',
      simbolo_moeda: currency?.symbol || 'N/A',

      // Links
      link_png: country.flags?.png || '',
      link_svg: country.flags?.svg || '',
      link_googlemaps: country.maps?.googleMaps || '',
      link_openstreetmaps: country.maps?.openStreetMaps || '',

      // Geografia e população
      populacao: country.population || 0,
      area: country.area || 0,
      coordenadas: country.latlng || [],
      fronteiras: country.borders || [],
      sem_litoral: country.landlocked || false,

      // Informações administrativas
      independente: country.independent || false,
      membro_onu: country.unMember || false,
      fusos_horarios: country.timezones || [],
      dominio_internet: country.tld || [],
      codigo_telefone: this.formatPhoneCode(country.idd),

      // Informações culturais
      idiomas: country.languages || {},
      demonyms: country.demonyms || {},
      traducoes: country.translations || {},
      gini: country.gini || {},
      fifa: country.fifa || 'N/A',
      inicio_semana: country.startOfWeek || 'monday',

      // Informações sobre a capital
      info_capital: country.capitalInfo || {},
      codigo_postal: country.postalCode || {},
      coat_of_arms_png: country.coatOfArms?.png || '',
      coat_of_arms_svg: country.coatOfArms?.svg || '',
    };
  }


  /**
   * Formata o código telefônico do país
   * @param {Object} idd - Dados do código telefônico
   * @returns {string} Código formatado
   */
  formatPhoneCode(idd) {
    if (!idd || !idd.root) return 'N/A';
    
    const root = idd.root;
    const suffixes = idd.suffixes || [];
    
    if (suffixes.length === 0) return root;
    if (suffixes.length === 1) return root + suffixes[0];
    
    return root + suffixes.join('/');
  }

  /**
   * Prepara dados para registro no banco local
   * @param {Object} countryDetails - Dados detalhados do país
   * @returns {Object} Dados formatados para o modelo local
   */
  prepareForLocalStorage(countryDetails) {
    return {
      nome_comum: countryDetails.nome_comum,
      nome_oficial: countryDetails.nome_oficial,
      regiao: countryDetails.regiao,
      moeda: countryDetails.moeda,
      capital: countryDetails.capital,
      continente: countryDetails.continente,
      link_png: countryDetails.link_png,
      link_googlemaps: countryDetails.link_googlemaps,
      populacao: countryDetails.populacao,
      official_name: countryDetails.nome_oficial,
      visited: false,
      observacoes: ''
    };
  }
}

module.exports = new RestCountriesService();

