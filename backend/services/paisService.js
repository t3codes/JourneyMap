const { Pais } = require('../models');

const createPais = async (usuarioId, data) => {
  const {
    nome_comum,
    nome_oficial,
    regiao,
    moeda,
    capital,
    continente,
    link_png,
    link_googlemaps,
    populacao,
    official_name,
    visited,
    observacoes
  } = data;

  // Validação dos campos obrigatórios
  if (
    !nome_comum ||
    !nome_oficial ||
    !regiao ||
    !moeda ||
    !capital ||
    !continente ||
    !link_png ||
    !link_googlemaps ||
    !populacao ||
    !official_name
  ) {
    const error = new Error('Todos os campos obrigatórios devem ser preenchidos');
    error.status = 400;
    throw error;
  }

  // Criação do país associado ao usuarioId
  return await Pais.create({
    nome_comum,
    nome_oficial,
    regiao,
    moeda,
    capital,
    continente,
    link_png,
    link_googlemaps,
    populacao,
    official_name,
    visited: visited || false,
    observacoes,
    usuarioId
  });
};

const getPaisesByUsuario = async (usuarioId) => {
  const paises = await Pais.findAll({
    where: { usuarioId }
  });
  return paises;
};

const getPaisById = async (usuarioId, paisId) => {
  const pais = await Pais.findOne({
    where: { id: paisId, usuarioId }
  });
  if (!pais) {
    const error = new Error('País não encontrado ou não pertence ao usuário');
    error.status = 404;
    throw error;
  }
  return pais;
};

const updatePais = async (usuarioId, paisId, data) => {
  const pais = await Pais.findOne({
    where: { id: paisId, usuarioId }
  });
  if (!pais) {
    const error = new Error('País não encontrado ou não pertence ao usuário');
    error.status = 404;
    throw error;
  }

  const {
    nome_comum,
    nome_oficial,
    regiao,
    moeda,
    capital,
    continente,
    link_png,
    link_googlemaps,
    populacao,
    official_name,
    visited,
    observacoes
  } = data;

  await pais.update({
    nome_comum: nome_comum || pais.nome_comum,
    nome_oficial: nome_oficial || pais.nome_oficial,
    regiao: regiao || pais.regiao,
    moeda: moeda || pais.moeda,
    capital: capital || pais.capital,
    continente: continente || pais.continente,
    link_png: link_png || pais.link_png,
    link_googlemaps: link_googlemaps || pais.link_googlemaps,
    populacao: populacao || pais.populacao,
    official_name: official_name || pais.official_name,
    visited: visited !== undefined ? visited : pais.visited,
    observacoes: observacoes !== undefined ? observacoes : pais.observacoes
  });

  return pais;
};

const deletePais = async (usuarioId, paisId) => {
  const pais = await Pais.findOne({
    where: { id: paisId, usuarioId }
  });
  if (!pais) {
    const error = new Error('País não encontrado ou não pertence ao usuário');
    error.status = 404;
    throw error;
  }

  await pais.destroy();
};

module.exports = {
  createPais,
  getPaisesByUsuario,
  getPaisById,
  updatePais,
  deletePais
};