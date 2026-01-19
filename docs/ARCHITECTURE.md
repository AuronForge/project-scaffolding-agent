# Arquitetura REST em Camadas

## Estrutura do Projeto

```
src/
├── controllers/          # Camada de apresentação (HTTP handlers)
│   └── project.controller.js
├── services/            # Camada de lógica de negócio
│   ├── project.service.js
│   ├── ai-service.js
│   ├── github-service.js
│   ├── filesystem-service.js
│   └── template-service.js
├── repositories/        # Camada de acesso a dados
│   └── project.repository.js
├── middlewares/         # Middlewares da aplicação
│   ├── error.middleware.js
│   └── logger.middleware.js
├── routes/              # Definição de rotas
│   └── index.js
├── agents/              # Agentes de IA
│   └── scaffolding-agent.js
├── schemas/             # Schemas de validação (Zod)
│   └── project-input-schema.js
├── app.js               # Configuração do Express
└── server.js            # Entry point do servidor
```

## Camadas da Aplicação

### 1. Controllers (Camada de Apresentação)
Responsável por:
- Receber requisições HTTP
- Validar entrada básica
- Chamar serviços apropriados
- Formatar respostas HTTP

**Exemplo:**
```javascript
// src/controllers/project.controller.js
async createProject(req, res) {
  const validation = projectInputSchema.safeParse(req.body);
  const result = await this.projectService.createProject(validation.data);
  return res.status(201).json({ success: true, data: result });
}
```

### 2. Services (Camada de Lógica de Negócio)
Responsável por:
- Implementar regras de negócio
- Orquestrar operações complexas
- Chamar repositórios e outros serviços
- Processar dados

**Exemplo:**
```javascript
// src/services/project.service.js
async createProject(projectInput) {
  const result = await this.agent.createProject(projectInput);
  await this.projectRepository.save(metadata);
  return result;
}
```

### 3. Repositories (Camada de Acesso a Dados)
Responsável por:
- Persistir dados
- Buscar dados
- Abstrair detalhes de armazenamento

**Exemplo:**
```javascript
// src/repositories/project.repository.js
async save(project) {
  const projects = await this.findAll();
  projects.push(newProject);
  await fs.writeFile(this.projectsFile, JSON.stringify(projects));
}
```

## Endpoints da API

### POST /api/projects
Cria um novo projeto no GitHub ou localmente.

**Request:**
```json
{
  "projectName": "my-project",
  "front": "Backend",
  "technology": "Node.js",
  "version": "20",
  "dependencies": ["Express", "Prisma"],
  "repositoryUrl": "https://github.com/user/repo",
  "githubToken": "ghp_...",
  "isPrivate": false,
  "includeTests": true,
  "includeCICD": true,
  "includeDocker": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "mode": "github",
    "repositoryUrl": "https://github.com/user/repo",
    "filesCreated": 17,
    "projectName": "my-project"
  }
}
```

### POST /api/projects/preview
Visualiza a estrutura do projeto sem criar.

**Request:**
```json
{
  "projectName": "my-project",
  "front": "Backend",
  "technology": "Node.js",
  "version": "20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Project preview generated",
  "data": {
    "projectName": "my-project",
    "type": "Backend",
    "technology": "Node.js",
    "estimatedFiles": 15,
    "structure": [...]
  }
}
```

### GET /api/projects/templates
Lista templates disponíveis.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "technology": "Angular",
      "version": "18",
      "type": "Frontend",
      "features": ["routing", "forms", "http"]
    }
  ]
}
```

### GET /api/health
Verifica saúde da aplicação.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-19T...",
  "version": "1.0.0"
}
```

## Execução

### Desenvolvimento Local (Express)
```bash
npm start
# ou
npm run dev
```

### Desenvolvimento com Vercel
```bash
npm run dev:vercel
```

### Produção (Vercel)
Os endpoints são automaticamente expostos como serverless functions:
- `/api/create-project`
- `/api/preview-project`
- `/api/health`
- `/api/templates`

## Fluxo de Requisição

```
Request
  ↓
Middleware (Logger, CORS)
  ↓
Routes
  ↓
Controller (Validação, HTTP)
  ↓
Service (Lógica de Negócio)
  ↓
Repository (Persistência)
  ↓
Service (Processamento)
  ↓
Controller (Formatação)
  ↓
Response
```

## Benefícios da Arquitetura em Camadas

1. **Separação de Responsabilidades**: Cada camada tem uma função específica
2. **Testabilidade**: Fácil testar cada camada isoladamente
3. **Manutenibilidade**: Código organizado e fácil de entender
4. **Escalabilidade**: Fácil adicionar novos recursos
5. **Reutilização**: Services e repositories podem ser reutilizados
6. **Flexibilidade**: Trocar implementações sem afetar outras camadas

## Próximos Passos

- [ ] Adicionar autenticação/autorização
- [ ] Implementar cache
- [ ] Adicionar rate limiting
- [ ] Adicionar logs estruturados
- [ ] Implementar métricas e monitoramento
- [ ] Adicionar testes unitários para cada camada
- [ ] Implementar paginação nos endpoints de listagem
