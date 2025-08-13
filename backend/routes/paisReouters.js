const express = require('express');
const router = express.Router();
const paisService = require('../services/paisService');
const verificarToken = require('../middlewares/verificaToken');

// Criar um novo país
router.post('/', verificarToken, async (req, res) => {
  try {
    const pais = await paisService.createPais(req.usuarioId, req.body);
    res.status(201).json(pais);
  } catch (error) {
    console.error('Erro ao criar país:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Listar todos os países de um usuário
router.get('/', verificarToken, async (req, res) => {
  try {
    const paises = await paisService.getPaisesByUsuario(req.usuarioId);
    res.json(paises);
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Buscar um país específico por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const pais = await paisService.getPaisById(req.usuarioId, req.params.id);
    res.json(pais);
  } catch (error) {
    console.error('Erro ao buscar país:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Atualizar um país
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const pais = await paisService.updatePais(req.usuarioId, req.params.id, req.body);
    res.json(pais);
  } catch (error) {
    console.error('Erro ao atualizar país:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Deletar um país
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    await paisService.deletePais(req.usuarioId, req.params.id);
    res.json({ message: 'País deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar país:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

module.exports = router;