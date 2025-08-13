const request = require('supertest');
const express = require('express');
const router = require('../routes/usuariosRouters');
const app = express();
app.use(express.json());
app.use('/api/usuarios', router);

describe('Teste de Login', () => {
  test('deve realizar login com sucesso e retornar a mensagem correta', async () => {
    const loginData = {
      email: 'tharllesjhoines@gmail.com',
      senha: 'LiLEXXhP',
    };

    const response = await request(app)
      .post('/api/usuarios/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login realizado com sucesso');
    expect(response.body).toHaveProperty('token');
  });
});
