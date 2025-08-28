# AgriTech - Sistema de Gestão para Empresas de Agritech

## 📋 Descrição

Sistema de gestão para empresas de agritech que permite registrar e gerenciar empresas, campanhas de produção, técnicos e produtores. A API RESTful oferece funcionalidades completas para manipulação eficiente desses recursos.

## 🚀 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite3** - Banco de dados (configurável para MySQL/PostgreSQL)
- **Knex.js** - Query builder e migrações
- **Zod** - Validação de dados
- **Morgan** - Logging de requisições
- **CORS** - Cross-origin resource sharing

## 🏗️ Estrutura do Projeto

```
AgriTech/
├── src/
│   ├── controllers/          # Controladores da aplicação
│   ├── routes/              # Definição das rotas
│   ├── database/            # Configuração e migrações do banco
│   ├── middlewares/         # Middlewares personalizados
│   ├── app.js              # Configuração do Express
│   └── server.js           # Servidor da aplicação
├── knexfile.js             # Configuração do Knex
├── package.json            # Dependências do projeto
└── README.md              # Este arquivo
```

## 🗄️ Modelo de Banco de Dados

### Tabelas Principais

- **empresas**: Cadastro de empresas
- **campanhas**: Campanhas de produção
- **tecnicos**: Técnicos responsáveis
- **produtores**: Produtores rurais
- **produtores_campanhas**: Relacionamento entre produtores e técnicos

## 📡 Endpoints da API

### 1. Empresas

#### POST /api/empresas
Cadastra uma nova empresa.

**Body:**
```json
{
  "nome": "Exon Mobil",
  "cnpj": "12345678901234",
  "telefone": "11999999999",
  "email": "comercial@exonmobil.com"
}
```

**Resposta:**
```json
{
  "message": "Empresa criada com sucesso",
  "data": {
    "id": 1,
    "nome": "Exon Mobil",
    "cnpj": "12345678901234",
    "telefone": "11999999999",
    "email": "comercial@exonmobil.com"
  }
}
```
 
### 2. Campanhas

#### POST /api/campanhas
Cadastra uma nova campanha.

**Body:**
```json
{
  "nome": "Campanha Soja 2024",
  "empresa_id": 1,
  "data_inicio": "2024-01-01",
  "data_fim": "2024-12-31"
}
```
 

### 3. Técnicos

#### POST /api/tecnicos
Cadastra um novo técnico.

**Body:**
```json
{
  "nome": "João Silva",
  "campanha_id": 1
}
```
 

#### GET /api/tecnicos/:id/produtores
Lista todos os produtores atribuídos a um técnico específico.

### 4. Produtores

#### POST /api/produtores
Cadastra um novo produtor.

**Body:**
```json
{
  "nome": "Fazenda Santa Maria",
  "localizacao": "São Paulo, SP"
}
```
 
#### POST /api/produtores/atribuir
Atribui um produtor a um técnico.

**Body:**
```json
{
  "produtor_id": 1,
  "tecnico_id": 1,
  "campanha_id": 1
}
```

#### PUT /api/produtores/transferir
Transfere um produtor de um técnico para outro.

**Body:**
```json
{
  "produtor_id": 1,
  "tecnico_antigo_id": 1,
  "tecnico_novo_id": 2,
  "campanha_id": 1
}
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Passos para Instalação

1. **Extração do arquivo .zip:**

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure o banco de dados:**
  - Para MySQL/PostgreSQL: Configure as variáveis de ambiente no arquivo `.env`

4. **Inicialize o banco de dados:**
```bash
node src/database/initialize.js
```

5. **Inicie o servidor:**
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🧪 Testando a API

### Exemplos de Uso com cURL

#### 1. Criar Empresa
```bash
curl -X POST http://localhost:3000/api/empresas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Empresa Teste",
    "cnpj": "12345678901234",
    "telefone": "11999999999",
    "email": "teste@empresa.com"
  }'
```

#### 2. Criar Campanha
```bash
curl -X POST http://localhost:3000/api/campanhas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Campanha Soja 2024",
    "empresa_id": 1,
    "data_inicio": "2024-01-01",
    "data_fim": "2024-12-31"
  }'
```

#### 3. Criar Técnico
```bash
curl -X POST http://localhost:3000/api/tecnicos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "campanha_id": 1
  }'
```

#### 4. Criar Produtor
```bash
curl -X POST http://localhost:3000/api/produtores \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Fazenda Santa Maria",
    "localizacao": "São Paulo, SP"
  }'
```

#### 5. Atribuir Produtor a Técnico
```bash
curl -X POST http://localhost:3000/api/produtores/atribuir \
  -H "Content-Type: application/json" \
  -d '{
    "produtor_id": 1,
    "tecnico_id": 1,
    "campanha_id": 1
  }'
```

#### 6. Transferir Produtor
```bash
curl -X PUT http://localhost:3000/api/produtores/transferir \
  -H "Content-Type: application/json" \
  -d '{
    "produtor_id": 1,
    "tecnico_antigo_id": 1,
    "tecnico_novo_id": 2,
    "campanha_id": 1
  }'
```

#### 7. Listar Produtores por Técnico
```bash
curl http://localhost:3000/api/tecnicos/1/produtores
```

## ✅ Funcionalidades Implementadas

- [x] Cadastro de Empresas com validação de CNPJ único
- [x] Cadastro de Campanhas com validação de empresa existente
- [x] Cadastro de Técnicos com validação de campanha existente
- [x] Cadastro de Produtores
- [x] Atribuição de Produtor a Técnico
- [x] Transferência de Produtor entre Técnicos
- [x] Listagem de Produtores por Técnico
- [x] Validação de dados com Zod
- [x] Tratamento de erros
- [x] Estrutura organizada em controllers, routes e middlewares
- [x] Banco de dados com relacionamentos e integridade referencial

## 🔧 Configuração de Banco de Dados

### MySQL (Padrão)
O projeto está configurado para usar MySQL por padrão, facilitando o desenvolvimento e testes.
Para usar outros bancos, modifique o `knexfile.js` e configure as variáveis de ambiente:

```bash
DB_CLIENT=mysql2
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=___senha__
DB_NAME=___db__
```

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em modo desenvolvimento com nodemon

## 🚨 Tratamento de Erros

A API inclui tratamento robusto de erros:
- Validação de dados de entrada
- Mensagens de erro claras e informativas
- Códigos de status HTTP apropriados

## 🔒 Validações Implementadas

- **CNPJ único** para empresas
- **Empresa existente** para campanhas
- **Campanha existente** para técnicos
- **Produtor existente** para atribuições
- **Técnicos pertencentes à mesma campanha** para transferências
- **Formato de data** (YYYY-MM-DD) para campanhas
- **Campos obrigatórios** para todas as entidades

## 📊 Status da API

- **GET /status/check** - Retorna o status da API
- Resposta: `{"ok": true}`

## 🤝  
  

**Desenvolvido para o Desafio de Backend para Vaga com Node.js e SQL ___Obanze008___** 