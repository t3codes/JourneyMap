const jwt = require('jsonwebtoken');

const JWT_SECRET = 'sua_chave_secreta'; // Use a chave secreta correta aqui

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
