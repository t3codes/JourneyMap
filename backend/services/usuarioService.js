const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua_chave_secreta';

const getUsuarioById = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    const error = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }
  return usuario;
};

const createUsuario = async (data) => {
  const { email, nome_completo, endereco, estado, cidade, numero, cep, senha } = data;

  if (!email || !nome_completo || !endereco || !estado || !cidade || !numero || !cep || !senha) {
    const error = new Error('Todos os campos são obrigatórios');
    error.status = 400;
    throw error;
  }

  const usuarioExistente = await Usuario.findOne({ where: { email } });
  if (usuarioExistente) {
    const error = new Error('Email já cadastrado');
    error.status = 400;
    throw error;
  }

  return await Usuario.create({
    email,
    nome_completo,
    endereco,
    estado,
    cidade,
    numero,
    cep,
    senha
  });
};

const updateUsuario = async (usuarioId, data) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    const error = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }

  const { email, nome_completo, endereco, estado, cidade, numero, cep, senha } = data;

  if (email && email !== usuario.email) {
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      const error = new Error('Email já cadastrado');
      error.status = 400;
      throw error;
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

  return usuario;
};

const deleteUsuario = async (usuarioId) => {
  const usuario = await Usuario.findByPk(usuarioId);
  if (!usuario) {
    const error = new Error('Usuário não encontrado');
    error.status = 404;
    throw error;
  }

  await usuario.destroy();
};

const loginUsuario = async ({ email, senha }) => {
  if (!email || !senha) {
    const error = new Error('Email e senha são obrigatórios');
    error.status = 400;
    throw error;
  }

  const usuario = await Usuario.findOne({
    where: { email },
    attributes: { include: ['senha'] }
  });

  if (!usuario) {
    const error = new Error('Credenciais inválidas');
    error.status = 401;
    throw error;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    const error = new Error('Credenciais inválidas');
    error.status = 401;
    throw error;
  }

  const payload = {
    id: usuario.id,
    email: usuario.email,
    nome_completo: usuario.nome_completo
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  const { senha: _, ...usuarioSemSenha } = usuario.toJSON();

  return { token, usuario: usuarioSemSenha };
};

module.exports = {
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario
};