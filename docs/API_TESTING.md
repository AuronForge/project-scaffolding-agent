# 🧪 Guia Rápido de Testes da API

## Passo a Passo

### 1. Reiniciar o Servidor
Pare o servidor atual (Ctrl+C) e reinicie:
```bash
npm start
```

### 2. Executar Testes Automatizados
```bash
bash test-api.sh
```

### 3. Testes Manuais

#### Health Check
```bash
curl http://localhost:3002/api/health
```

**Resposta Esperada:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-19T...",
  "version": "1.0.0"
}
```

#### Listar Templates
```bash
curl http://localhost:3002/api/projects/templates
```

**Resposta Esperada:**
```json
{
  "success": true,
  "data": [
    {
      "technology": "Angular",
      "version": "18",
      "type": "Frontend",
      "description": "Angular frontend application with TypeScript",
      "features": ["TypeScript", "Routing", "Forms", "HTTP Client", "Testing"]
    }
  ]
}
```

#### Preview de Projeto Simples
```bash
curl -X POST http://localhost:3002/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "test-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20"
  }'
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Project preview generated",
  "data": {
    "projectName": "test-api",
    "type": "Backend",
    "technology": "Node.js",
    "version": "20",
    "generationMethod": "ai-generated",
    "estimatedFiles": 3,
    "structure": [...]
  }
}
```

#### Preview com Dependências
```bash
curl -X POST http://localhost:3002/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-express-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express", "Prisma", "Jest"],
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

#### Teste de Validação (Erro Esperado)
```bash
curl -X POST http://localhost:3002/api/projects/preview \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "test"
  }'
```

**Resposta Esperada (Erro 400):**
```json
{
  "success": false,
  "error": "Missing required fields: projectName, front, technology, version"
}
```

## Logs do Servidor

Ao executar as requisições, você deve ver logs como:

```
→ GET /api/health
✓ GET /api/health - 200 (4ms)

→ POST /api/projects/preview
✓ POST /api/projects/preview - 200 (1234ms)
```

## Próximos Testes

Para testar a criação completa de projetos (quando estiver pronto):

### Criar Projeto Local
```bash
curl -X POST http://localhost:3002/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "test-local-project",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express"],
    "localPath": "/tmp/test-projects",
    "includeTests": true
  }'
```

### Criar Projeto no GitHub (Privado)
```bash
curl -X POST http://localhost:3002/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-private-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express", "Prisma"],
    "repositoryUrl": "https://github.com/username/my-private-api",
    "githubToken": "ghp_...",
    "isPrivate": true,
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

## Troubleshooting

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3002 | xargs kill -9
```

### Erro de módulo não encontrado
```bash
npm install
```

### Servidor não responde
Verifique se o servidor está rodando:
```bash
curl http://localhost:3002/api/health
```
