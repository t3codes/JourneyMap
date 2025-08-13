# 🚀 Projeto Fullstack

Um projeto fullstack completo utilizando as tecnologias mais modernas para desenvolvimento web.

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Sequelize** - ORM para JavaScript
- **bcryptjs** - Biblioteca para criptografia de senhas
- **CORS** - Middleware para permitir requisições cross-origin

### Banco de Dados
- **PostgreSQL** - Sistema de gerenciamento de banco de dados relacional

### DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
fullstack-project/
├── docker-compose.yml          # Orquestração dos containers
├── backend/                    # API Node.js
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── index.js
│   │   └── Usuario.js
│   └── routes/
│       └── usuarios.js
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker
- Docker Compose

### Passos para Execução

1. **Clone ou extraia o projeto**
   ```bash
   cd fullstack-project
   ```

2. **Execute o projeto com Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Aguarde a inicialização**
   - O comando irá baixar as imagens necessárias
   - Construir os containers do frontend e backend
   - Inicializar o banco de dados PostgreSQL
   - Sincronizar os modelos com o banco

4. **Acesse a aplicação**
   - **Backend API**: http://127.0.0.1:5000
   - **Banco de dados**: localhost:5432

### Comandos Úteis

```bash
# Executar em background
docker-compose up -d

# Parar os containers
docker-compose down

# Reconstruir os containers
docker-compose up --build

# Ver logs dos containers
docker-compose logs

# Ver logs de um container específico
docker-compose logs backend
docker-compose logs database
```

## 📊 Modelo de Dados

### Usuário

| Campo         | Tipo    | Descrição                    |
|---------------|---------|------------------------------|
| id            | INTEGER | Chave primária (auto increment) |
| email         | STRING  | Email único do usuário       |
| nome_completo | STRING  | Nome completo do usuário     |
| endereco      | STRING  | Endereço residencial         |
| estado        | STRING  | Estado                       |
| cidade        | STRING  | Cidade                       |
| numero        | STRING  | Número da residência         |
| cep           | STRING  | CEP                          |
| senha         | STRING  | Senha criptografada (bcrypt) |
| createdAt     | DATE    | Data de criação              |
| updatedAt     | DATE    | Data de atualização          |

## 🔌 API Endpoints

### Usuários

| Método | Endpoint              | Descrição                    |
|--------|-----------------------|------------------------------|
| GET    | `/api/usuarios`       | Listar todos os usuários     |
| GET    | `/api/usuarios/:id`   | Buscar usuário por ID        |
| POST   | `/api/usuarios`       | Criar novo usuário           |
| PUT    | `/api/usuarios/:id`   | Atualizar usuário            |
| DELETE | `/api/usuarios/:id`   | Deletar usuário              |
| POST   | `/api/usuarios/login` | Fazer login                  |

### Exemplo de Requisição - Criar Usuário

```json
POST /api/usuarios
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "nome_completo": "João Silva",
  "endereco": "Rua das Flores, 123",
  "estado": "SP",
  "cidade": "São Paulo",
  "numero": "123",
  "cep": "01234-567",
  "senha": "minhasenha123"
}
```

### Exemplo de Resposta

```json
{
  "id": 1,
  "email": "usuario@exemplo.com",
  "nome_completo": "João Silva",
  "endereco": "Rua das Flores, 123",
  "estado": "SP",
  "cidade": "São Paulo",
  "numero": "123",
  "cep": "01234-567",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## 🔒 Segurança

- **Senhas**: Todas as senhas são criptografadas usando bcryptjs com salt de 10 rounds
- **CORS**: Configurado para permitir requisições do frontend
- **Validação**: Validação de email e campos obrigatórios
- **Unicidade**: Email único por usuário

## 🌐 Variáveis de Ambiente

### Backend

| Variável     | Valor Padrão    | Descrição                    |
|--------------|-----------------|------------------------------|
| NODE_ENV     | development     | Ambiente de execução         |
| DB_HOST      | database        | Host do banco de dados       |
| DB_PORT      | 5432            | Porta do banco de dados      |
| DB_NAME      | fullstack_db    | Nome do banco de dados       |
| DB_USER      | admin           | Usuário do banco de dados    |
| DB_PASSWORD  | admin123        | Senha do banco de dados      |
| JWT_SECRET   | (definido)      | Chave secreta para JWT       |
| PORT         | 5000            | Porta do servidor backend    |


## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com o banco**
   - Verifique se o container do PostgreSQL está rodando
   - Aguarde alguns segundos para o banco inicializar completamente

2. **API não responde**
   - Verifique se a porta 5000 não está sendo usada
   - Confirme se o backend conseguiu conectar com o banco

3. **Erro de CORS**
   - Verifique se a variável VITE_API_URL está configurada corretamente

### Logs Úteis

```bash
# Ver logs de todos os containers
docker-compose logs

# Ver logs apenas do backend
docker-compose logs backend

# Ver logs em tempo real
docker-compose logs -f
```

## 🚀 Próximos Passos

- Implementar autenticação JWT completa
- Adicionar validação de formulários no frontend
- Implementar testes unitários e de integração
- Adicionar middleware de rate limiting
- Configurar ambiente de produção
- Implementar CI/CD


**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento fullstack**

