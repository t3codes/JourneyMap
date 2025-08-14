# 🚀 JourneyMap

Bem-vindo ao **JourneyMap**, um sistema de agenda de viagens para registrar destinos visitados e planejar futuras aventuras! Desenvolvido como teste prático para a Connect Sales, este projeto fullstack combina tecnologias modernas para oferecer uma experiência fluida e interativa.

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca JavaScript para interfaces dinâmicas
- **Vite** - Ferramenta de build rápida e moderna
- **Tailwind CSS** - Framework CSS para estilização
- **Framer Motion** - Animações suaves e interativas
- **React Router** - Navegação no frontend
- **Leaflet** - Mapas interativos

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **Sequelize** - ORM para JavaScript
- **bcryptjs** - Criptografia de senhas
- **CORS** - Suporte a requisições cross-origin

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional robusto

### DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers

## 📁 Estrutura do Projeto

```
journeymap/
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
├── frontend/                   # Aplicação React
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── src/
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Docker**: Instale o Docker em sua máquina ([Instruções de instalação](https://docs.docker.com/get-docker/)).
- **Docker Compose**: Normalmente incluído com o Docker Desktop, mas verifique ([Instruções](https://docs.docker.com/compose/install/)).

### Passos para Execução

1. **Clone o repositório**
   ```bash
   git clone https://github.com/t3codes/JourneyMap.git
   cd JourneyMap
   ```

2. **Verifique o arquivo `.env`**
   - Renomeie o arquivo `.env-example` para `.env` na pasta raiz ou em `backend/` (se aplicável).
   - Exemplo:
     ```bash
     mv backend/.env-example backend/.env
     ```
   - Confirme que as variáveis de ambiente estão corretas, como `DB_HOST`, `DB_NAME`, `JWT_SECRET`, etc. (veja a seção **Variáveis de Ambiente**).

3. **Execute o projeto com Docker Compose**
   ```bash
   docker-compose up --build -d
   ```
   - O comando baixa as imagens necessárias, constrói os containers (frontend, backend e banco de dados) e inicia o PostgreSQL.
   - O `-d` faz os containers rodarem em segundo plano.

4. **Verifique se os containers estão online**
   Execute:
   ```bash
   docker ps
   ```
   Você verá algo como:
   ```
   CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS                    PORTS                                         NAMES
   b257fbfc77c1   journeymap-frontend   "docker-entrypoint.s…"   53 seconds ago   Up 52 seconds             0.0.0.0:5173->5173/tcp, [::]:5173->5173/tcp   journey_frontend
   7094e02dc452   journeymap-backend    "docker-entrypoint.s…"   2 hours ago      Up 22 seconds             0.0.0.0:5000->5000/tcp, [::]:5000->5000/tcp   journeymap_backend
   d457c85b3767   postgres:15           "docker-entrypoint.s…"   2 hours ago      Up 52 seconds (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   journeymap_db
   ```
   Se os três containers (`journey_frontend`, `journeymap_backend`, `journeymap_db`) estiverem com status `Up` (e o banco com `healthy`), está tudo certo!

5. **Acesse a aplicação**
   - Abra o navegador em: [http://localhost:5173/](http://localhost:5173/)
   - Escolha a opção **Registro** para criar sua conta e obter credenciais.
   - Após registrar, você será redirecionado para a tela de **Login**. Faça login para acessar o dashboard e explorar mais funcionalidades.

## 📊 Funcionalidades do JourneyMap
- **Registro e Login**: Crie uma conta e faça login com segurança.
- **Dashboard Interativo**: Veja um mapa mundial interativo com Leaflet.
- **Lista de Interesses**: Gerencie países visitados e desejados no menu lateral esquerdo.
- **Adição de Países**: Clique em um país no mapa para adicionar à sua lista de desejos.
- **Imagens no Google Maps**: Visualize fotos de destinos clicando em botões específicos.
- **Atualização e Logout**: Atualize os dados com o botão "Atualizar" ou saia com "Sair".


## 📡 Comandos Úteis do Docker
- **Iniciar containers em segundo plano**:
  ```bash
  docker-compose up -d
  ```
- **Parar e remover containers**:
  ```bash
  docker-compose down
  ```
- **Reconstruir containers (útil após mudanças)**:
  ```bash
  docker-compose up --build
  ```
- **Verificar containers em execução**:
  ```bash
  docker ps
  ```
- **Ver logs de todos os containers**:
  ```bash
  docker-compose logs
  ```
- **Ver logs de um container específico**:
  ```bash
  docker-compose logs backend
  docker-compose logs frontend
  docker-compose logs database
  ```
- **Ver logs em tempo real**:
  ```bash
  docker-compose logs -f
  ```

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

### Frontend
| Variável     | Valor Padrão    | Descrição                    |
|--------------|-----------------|------------------------------|
| VITE_API_URL | http://localhost:5000 | URL da API backend         |

> **Nota**: Certifique-se de renomear `.env-example` para `.env` e ajustar as variáveis, especialmente `JWT_SECRET`, para valores seguros em produção.



### Logs Úteis
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs do backend
docker-compose logs backend
```


**Desenvolvido com ❤️ por Tharlles Jhoines Silva Té**
- Email: [tharlles.engineer@gmail.com](mailto:tharlles.engineer@gmail.com)
- Telefone: [+55 77 99875-3554](tel:+5577998753554)