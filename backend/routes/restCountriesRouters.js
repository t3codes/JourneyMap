const express = require('express');
const router = express.Router();
const restCountriesService = require('../services/restCountriesService');
const paisService = require('../services/paisService');
const verificarToken = require('../middlewares/verificaToken');

/**
 * @route GET /api/rest-countries/all
 * @desc Busca todos os países disponíveis na API REST Countries
 * @access Public
 */
router.get('/all', verificarToken, async (req, res) => {
  try {
    const countries = await restCountriesService.getAllCountries();
    res.json({
      success: true,
      total: countries.length,
      data: countries
    });
  } catch (error) {
    console.error('Erro ao buscar todos os países:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/rest-countries/name/:countryName
 * @desc Busca um país específico pelo nome
 * @access Public
 */
router.get('/name/:countryName', verificarToken, async (req, res) => {
  try {
    const { countryName } = req.params;
    
    if (!countryName || countryName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome do país é obrigatório'
      });
    }

    const country = await restCountriesService.getCountryByName(countryName);
    res.json({
      success: true,
      data: country
    });
  } catch (error) {
    console.error(`Erro ao buscar país ${req.params.countryName}:`, error);
    
    if (error.message === 'País não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'País não encontrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/rest-countries/region/:region
 * @desc Busca países por região
 * @access Public
 */
router.get('/region/:region', verificarToken, async (req, res) => {
  try {
    const { region } = req.params;
    
    if (!region || region.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome da região é obrigatório'
      });
    }

    const countries = await restCountriesService.getCountriesByRegion(region);
    res.json({
      success: true,
      total: countries.length,
      data: countries
    });
  } catch (error) {
    console.error(`Erro ao buscar países da região ${req.params.region}:`, error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @route POST /api/rest-countries/save/:countryName
 * @desc Busca um país na API REST Countries e salva na lista de interesse do usuário
 * @access Private (requer token)
 */
router.post('/save/:countryName', verificarToken, async (req, res) => {
  try {
    const { countryName } = req.params;
    const { observacoes } = req.body;
    
    if (!countryName || countryName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome do país é obrigatório'
      });
    }

    // Buscar dados do país na API REST Countries
    const countryDetails = await restCountriesService.getCountryByName(countryName);
    
    // Preparar dados para salvar no banco local
    const countryData = restCountriesService.prepareForLocalStorage(countryDetails);
    
    // Adicionar observações se fornecidas
    if (observacoes && observacoes.trim() !== '') {
      countryData.observacoes = observacoes.trim();
    }

    // Salvar no banco de dados local
    const savedCountry = await paisService.createPais(req.usuarioId, countryData);
    
    res.status(201).json({
      success: true,
      message: 'País adicionado à lista de interesse com sucesso',
      data: {
        saved_country: savedCountry,
        original_data: countryDetails
      }
    });
  } catch (error) {
    console.error(`Erro ao salvar país ${req.params.countryName}:`, error);
    
    if (error.message === 'País não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'País não encontrado na API REST Countries'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/rest-countries/details/:countryName
 * @desc Busca detalhes completos de um país na API REST Countries
 * @access Public
 */
router.get('/details/:countryName', verificarToken, async (req, res) => {
  try {
    const { countryName } = req.params;
    
    if (!countryName || countryName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Nome do país é obrigatório'
      });
    }

    const countryDetails = await restCountriesService.getCountryByName(countryName);
    res.json({
      success: true,
      data: countryDetails
    });
  } catch (error) {
    console.error(`Erro ao buscar detalhes do país ${req.params.countryName}:`, error);
    
    if (error.message === 'País não encontrado') {
      return res.status(404).json({
        success: false,
        error: 'País não encontrado'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

/**
 * @route GET /api/rest-countries/search
 * @desc Busca países com filtros opcionais
 * @access Public
 */
router.get('/search', verificarToken, async (req, res) => {
  try {
    const { region, subregion, limit } = req.query;
    let countries;

    if (region) {
      countries = await restCountriesService.getCountriesByRegion(region);
    } else {
      countries = await restCountriesService.getAllCountries();
    }

    // Filtrar por sub-região se especificado
    if (subregion) {
      countries = countries.filter(country => 
        country.sub_regiao && 
        country.sub_regiao.toLowerCase().includes(subregion.toLowerCase())
      );
    }

    // Limitar resultados se especificado
    if (limit && !isNaN(parseInt(limit))) {
      countries = countries.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      total: countries.length,
      filters: {
        region: region || null,
        subregion: subregion || null,
        limit: limit || null
      },
      data: countries
    });
  } catch (error) {
    console.error('Erro na busca de países:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno do servidor'
    });
  }
});

module.exports = router;

