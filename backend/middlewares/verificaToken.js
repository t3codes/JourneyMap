require('dotenv').config(); // Isso carrega as variáveis de ambiente do .env

const jwt = require('jsonwebtoken');

// Agora você pode acessar as variáveis do .env diretamente
const JWT_SECRET = process.env.JWT_SECRET;

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extrair o token do header 'Authorization'

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verificar e decodificar o token
    req.usuarioId = decoded.id;
    next(); 
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = verificarToken;
