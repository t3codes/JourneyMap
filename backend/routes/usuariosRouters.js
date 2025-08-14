const express = require('express');
const router = express.Router();
const usuarioService = require('../services/usuarioService');
const verificarToken = require('../middlewares/verificaToken');

router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.usuarioId);
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

router.put('/', verificarToken, async (req, res) => {
  try {
    const usuario = await usuarioService.updateUsuario(req.usuarioId, req.body);
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

router.delete('/', verificarToken, async (req, res) => {
  try {
    await usuarioService.deleteUsuario(req.usuarioId);
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { token, usuario } = await usuarioService.loginUsuario(req.body);
    res.json({
      message: 'Login realizado com sucesso',
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(error.status || 500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

module.exports = router;