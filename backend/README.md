# API Fullstack com Integração REST Countries

Este projeto é uma API Node.js com Express e PostgreSQL que inclui funcionalidades de usuários, países e integração com a API REST Countries.

## Funcionalidades Implementadas

### 1. API de Usuários
- Registro de usuários
- Login com JWT
- CRUD completo de usuários
- Autenticação via middleware

### 2. API de Países (Lista Pessoal)
- CRUD de países na lista pessoal do usuário
- Marcação de países visitados
- Observações personalizadas

### 3. **NOVA** - Integração REST Countries
- Busca de todos os países disponíveis
- Busca de país específico por nome
- Busca de países por região
- Salvamento de países da API externa na lista pessoal
- Busca com filtros avançados

## Estrutura do Projeto

```
projeto/
├── config/
│   └── database.js          # Configuração do banco PostgreSQL
├── middlewares/
│   └── verificaToken.js     # Middleware de autenticação JWT
├── models/
│   ├── index.js            # Configuração dos modelos
│   ├── Usuario.js          # Modelo de usuário
│   └── Pais.js             # Modelo de país
├── routes/
│   ├── usuariosRouters.js  # Rotas de usuários
│   ├── paisReouters.js     # Rotas de países (lista pessoal)
│   └── restCountriesRouters.js  # **NOVO** - Rotas REST Countries
├── services/
│   ├── usuarioService.js   # Lógica de negócio de usuários
│   ├── paisService.js      # Lógica de negócio de países
│   └── restCountriesService.js  # **NOVO** - Service REST Countries
├── __tests__/
│   ├── usuarios_simple_test.js     # Testes de usuários
│   └── restCountries_simple_test.js # Testes REST Countries
├── package.json
└── server.js               # Servidor principal
```

## Novas Rotas REST Countries

### Públicas (sem autenticação)

#### GET /api/rest-countries/all
Retorna todos os países disponíveis na API REST Countries.

**Resposta:**
```json
{
  "success": true,
  "total": 250,
  "data": [
    {
      "nome_comum": "Brazil",
      "nome_oficial": "Federative Republic of Brazil",
      "codigo_pais": "BR",
      "regiao": "Americas",
      "sub_regiao": "South America",
      "capital": "Brasília",
      "populacao": 212559409,
      "bandeira_png": "https://flagcdn.com/w320/br.png"
    }
  ]
}
```

#### GET /api/rest-countries/name/:countryName
Busca um país específico pelo nome.

**Exemplo:** `/api/rest-countries/name/brazil`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "nome_comum": "Brazil",
    "nome_oficial": "Federative Republic of Brazil",
    "regiao": "Americas",
    "moeda": "Brazilian real",
    "capital": "Brasília",
    "continente": "South America",
    "link_png": "https://flagcdn.com/w320/br.png",
    "link_googlemaps": "https://goo.gl/maps/waCKk21HeeqFzkNC9",
    "populacao": 212559409,
    "area": 8515767,
    "fronteiras": ["ARG", "BOL", "COL", "GUF", "GUY", "PRY", "PER", "SUR", "URY", "VEN"],
    "idiomas": {"por": "Portuguese"}
  }
}
```

#### GET /api/rest-countries/region/:region
Busca países por região.

**Exemplo:** `/api/rest-countries/region/americas`

#### GET /api/rest-countries/search
Busca países com filtros opcionais.

**Parâmetros de query:**
- `region`: Filtrar por região
- `subregion`: Filtrar por sub-região
- `limit`: Limitar número de resultados

**Exemplo:** `/api/rest-countries/search?region=americas&limit=10`

### Privadas (requer autenticação)

#### POST /api/rest-countries/save/:countryName
Busca um país na API REST Countries e salva na lista pessoal do usuário.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "observacoes": "Planejo visitar em 2026 para o carnaval"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "País adicionado à lista de interesse com sucesso",
  "data": {
    "saved_country": {
      "id": 1,
      "nome_comum": "Brazil",
      "nome_oficial": "Federative Republic of Brazil",
      "regiao": "Americas",
      "moeda": "Brazilian real",
      "capital": "Brasília",
      "continente": "South America",
      "link_png": "https://flagcdn.com/w320/br.png",
      "link_googlemaps": "https://goo.gl/maps/waCKk21HeeqFzkNC9",
      "populacao": 212559409,
      "official_name": "Brazil",
      "visited": false,
      "observacoes": "Planejo visitar em 2026 para o carnaval",
      "usuarioId": 1
    },
    "original_data": { /* dados completos da API REST Countries */ }
  }
}
```

## Fluxo de Uso Recomendado

1. **Listar países disponíveis:**
   ```
   GET /api/rest-countries/all
   ```

2. **Ver detalhes de um país específico:**
   ```
   GET /api/rest-countries/name/brazil
   ```

3. **Adicionar à lista pessoal:**
   ```
   POST /api/rest-countries/save/brazil
   Headers: Authorization: Bearer <token>
   Body: { "observacoes": "Suas observações aqui" }
   ```

4. **Ver lista pessoal:**
   ```
   GET /api/paises
   Headers: Authorization: Bearer <token>
   ```

## Instalação e Execução

1. Instalar dependências:
   ```bash
   npm install
   ```

2. Configurar variáveis de ambiente (criar arquivo .env):
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=seu_banco
   DB_USER=seu_usuario
   DB_PASS=sua_senha
   JWT_SECRET=sua_chave_secreta
   ```

3. Executar servidor:
   ```bash
   npm start
   ```

4. Executar testes:
   ```bash
   npm test
   ```

## Dependências Adicionadas

- `axios`: Para requisições HTTP à API REST Countries

## Testes

Os testes foram implementados de forma superficial conforme solicitado:

- **usuarios_simple_test.js**: Testa funcionalidades básicas de usuários
- **restCountries_simple_test.js**: Testa integração com REST Countries API

Para executar testes específicos:
```bash
npm test -- __tests__/restCountries_simple_test.js
```

## Observações

- A integração com REST Countries não interfere no banco de dados original
- Os testes são superficiais e focam nas funcionalidades principais
- O módulo REST Countries é completamente modular e separado das funcionalidades existentes
- Todas as rotas REST Countries são documentadas e seguem padrões REST

