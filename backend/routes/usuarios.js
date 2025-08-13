const express = require('express');
const router = express.Router();
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verificarToken = require('../middlewares/verificaToken');

const JWT_SECRET = 'sua_chave_secreta';

router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { email, nome_completo, endereco, estado, cidade, numero, cep, senha } = req.body;

    if (!email || !nome_completo || !endereco || !estado || !cidade || !numero || !cep || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const novoUsuario = await Usuario.create({
      email,
      nome_completo,
      endereco,
      estado,
      cidade,
      numero,
      cep,
      senha
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { email, nome_completo, endereco, estado, cidade, numero, cep, senha } = req.body;

    if (email && email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
    }

    await usuario.update({
      email: email || usuario.email,
      nome_completo: nome_completo || usuario.nome_completo,
      endereco: endereco || usuario.endereco,
      estado: estado || usuario.estado,
      cidade: cidade || usuario.cidade,
      numero: numero || usuario.numero,
      cep: cep || usuario.cep,
      ...(senha && { senha })
    });

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({
      where: { email },
      attributes: { include: ['senha'] }
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const payload = {
      id: usuario.id,
      email: usuario.email,
      nome_completo: usuario.nome_completo
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    const { senha: _, ...usuarioSemSenha } = usuario.toJSON();
    res.json({
      message: 'Login realizado com sucesso',
      token: token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;