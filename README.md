# Project Scaffolding Agent

🤖 AI-powered REST API that generates complete project structures and publishes them to GitHub or creates them locally.

[![CI/CD Pipeline](https://github.com/AuronForge/project-scaffolding-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/AuronForge/project-scaffolding-agent/actions/workflows/ci.yml)
[![Deployment](https://img.shields.io/badge/deploy-Vercel-black)](https://project-scaffolding-agent.vercel.app)
[![API Docs](https://img.shields.io/badge/docs-Swagger-green)](https://project-scaffolding-agent.vercel.app/api/v1/api-docs)

## 🎯 Overview

This agent automates the entire process of creating a new software project:
1. Receives project specifications via REST API (technology, version, dependencies)
2. Uses AI or templates to generate a complete, production-ready project structure
3. **GitHub Mode**: Creates repository and commits all files with proper structure
4. **Local Mode**: Creates project in a local directory for offline work
5. Adds relevant topics and metadata (GitHub mode only)

## 🌐 Live API

**Production:** https://project-scaffolding-agent.vercel.app

**API Documentation (Swagger UI):** https://project-scaffolding-agent.vercel.app/api/v1/api-docs

**API Spec (OpenAPI 3.0):** https://project-scaffolding-agent.vercel.app/api/v1/swagger.json

## 📚 Documentation

- 🚀 **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- 📊 **[Local vs GitHub Mode](docs/LOCAL_VS_GITHUB.md)** - Choose the right mode for your needs
- 🏗️ **[Architecture](docs/ARCHITECTURE.md)** - System design and components
- 🧪 **[API Testing](docs/API_TESTING.md)** - How to test the API endpoints
- 📝 **[Changelog](CHANGELOG.md)** - Recent updates and features

## ✨ Features

### Core Features
- ✅ **RESTful API** - Production-ready REST API with versioning (/api/v1)
- ✅ **OpenAPI/Swagger** - Interactive API documentation
- ✅ **AI-Powered Generation** - Intelligent project structure based on best practices
- ✅ **Template-Based Generation** - Fast, reliable templates for popular frameworks
- ✅ **Smart Dependency Analysis** - AI analyzes dependencies and generates compatible versions
- ✅ **Auto-Configuration** - Automatic generation of config files (ESLint, Prettier, Husky, etc.)

### Technologies Supported
- ✅ **Frontend**: Angular, React, Vue.js
- ✅ **Backend**: Node.js, Spring Boot
- ✅ **Fullstack**: Monorepo structures

### Operational Modes
- ✅ **Dual Mode Operation** - Create on GitHub or locally
- ✅ **GitHub Integration** - Automatic repository creation and file upload
- ✅ **Private Repositories** - Support for private GitHub repos
- ✅ **Offline Support** - Local mode works without GitHub credentials
- ✅ **Preview Mode** - See structure before creating repository

### Quality & DevOps
- ✅ **CI/CD Pipeline** - Automated testing and deployment
- ✅ **Code Quality** - ESLint, Prettier, Husky pre-commit hooks
- ✅ **Test Coverage** - 95% minimum coverage requirement
- ✅ **Conventional Commits** - Commitlint validation
- ✅ **Serverless Deployment** - Deployed on Vercel

### API Features
- ✅ **Multiple AI Providers** - GitHub Models (free), OpenAI, or Anthropic
- ✅ **CORS Enabled** - Ready for frontend integration
- ✅ **Error Handling** - Comprehensive error responses
- ✅ **Request Validation** - Zod schema validation
- ✅ **Postman Collection** - Ready-to-import collection with examples

## 🚀 Quick Start

### Using the Live API

```bash
# Health check
curl https://project-scaffolding-agent.vercel.app/api/v1/health

# List available templates
curl https://project-scaffolding-agent.vercel.app/api/v1/projects/templates

# Preview a project structure
curl -X POST https://project-scaffolding-agent.vercel.app/api/v1/projects/preview \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express", "Prisma"]
  }'
```

### Running Locally

```bash
# Clone the repository
git clone https://github.com/AuronForge/project-scaffolding-agent.git
cd project-scaffolding-agent

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env
# Edit .env with your AI provider credentials

# Start the server
npm start

# Access the API
curl http://localhost:3002/api/v1/health

# Access Swagger UI
open http://localhost:3002/api/v1/api-docs
```

## 📡 API Endpoints

### Base URL
- **Production**: `https://project-scaffolding-agent.vercel.app/api/v1`
- **Local**: `http://localhost:3002/api/v1`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check - API status |
| `GET` | `/projects/templates` | List available templates |
| `POST` | `/projects` | Create a new project |
| `POST` | `/projects/preview` | Preview project structure |
| `GET` | `/api-docs` | Swagger UI documentation |
| `GET` | `/swagger.json` | OpenAPI 3.0 specification |

### Example: Create Project on GitHub

```bash
curl -X POST https://project-scaffolding-agent.vercel.app/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-awesome-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express", "Prisma", "Jest"],
    "repositoryUrl": "https://github.com/username/my-awesome-api",
    "githubToken": "ghp_your_token_here",
    "isPrivate": false,
    "description": "My awesome Node.js API",
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

### Example: Create Project Locally

```bash
curl -X POST https://project-scaffolding-agent.vercel.app/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-local-api",
    "front": "Backend",
    "technology": "Node.js",
    "version": "20",
    "dependencies": ["Express", "Prisma"],
    "localPath": "C:/projects",
    "description": "My local Node.js API",
    "includeTests": true
  }'
```

## 📋 Input Contract

### GitHub Mode (creates repository on GitHub)

```json
{
  "projectName": "my-awesome-project",
  "front": "Backend",
  "technology": "Spring Boot",
  "version": "3.2",
  "dependencies": ["Spring Web", "Spring Data JPA", "PostgreSQL"],
  "repositoryUrl": "https://github.com/username/my-awesome-project",
  "githubToken": "ghp_your_github_token_here",
  "isPrivate": false,
  "description": "My awesome backend API",
  "includeTests": true,
  "includeCICD": true,
  "includeDocker": false
}
```

### Local Mode (creates project in a local folder)

```json
{
  "projectName": "my-awesome-project",
  "front": "Backend",
  "technology": "Spring Boot",
  "version": "3.2",
  "dependencies": ["Spring Web", "Spring Data JPA", "PostgreSQL"],
  "localPath": "/home/user/projects",
  "description": "My awesome backend API",
  "includeTests": true,
  "includeCICD": true,
  "includeDocker": false
}
```

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `projectName` | string | Project name (alphanumeric, hyphens, underscores) | `"ecommerce-api"` |
| `front` | enum | Project type | `"Frontend"`, `"Backend"`, or `"Fullstack"` |
| `technology` | string | Technology/Framework name | `"Spring Boot"`, `"Angular"`, `"React"` |
| `version` | string | Technology version | `"3.2"`, `"18"`, `"20"` |

### GitHub Mode Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `repositoryUrl` | string | GitHub repository URL | `"https://github.com/user/repo"` |
| `githubToken` | string | GitHub Personal Access Token | `"ghp_..."` |
| `isPrivate` | boolean | Whether the repository should be private (default: false) | `true` or `false` |

### Local Mode Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `localPath` | string | Local directory path where project will be created | `"/home/user/projects"` or `"C:\\projects"` |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `dependencies` | array | `[]` | Additional dependencies to include |
| `description` | string | Auto-generated | Repository description |
| `includeTests` | boolean | `true` | Include test setup and examples |
| `includeCICD` | boolean | `true` | Include GitHub Actions workflow |
| `includeDocker` | boolean | `false` | Include Dockerfile and docker-compose |

## �️ Development

### Installation

```bash
cd project-scaffolding-agent
npm install
```

### Environment Configuration

Create a `.env` file (optional - defaults to GitHub Models):

```env
# GitHub Models (Free - Recommended) - Default if no other provider configured
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_MODEL=gpt-4o

# OR OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# OR Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Server Configuration (optional)
PORT=3002
NODE_ENV=development
```

### Run Development Server

```bash
# Start with hot-reload
npm run dev

# Start production server
npm start
```

Server runs at `http://localhost:3002`

### Available Scripts

```bash
# Development
npm run dev              # Start with nodemon (hot-reload)
npm start               # Start production server

# Testing
npm test                # Run all tests
npm run test:coverage   # Run tests with coverage report (95% minimum)
npm run test:watch      # Run tests in watch mode
npm run test:local      # Example: Create project locally
npm run test:preview    # Example: Preview project structure

# Code Quality
npm run lint            # Check code quality with ESLint
npm run lint:fix        # Auto-fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes

# Git Hooks (automatic)
# Pre-commit: Runs lint-staged + tests
# Commit-msg: Validates commit message format
```

## 🏗️ Architecture

### Layered REST Architecture

```
┌─────────────────────────────────────────┐
│           API Layer (REST)              │
│  /api/v1/projects, /health, /templates  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│     Controller Layer (HTTP Handler)      │
│   ProjectController - Request/Response  │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│   Service Layer (Business Logic)        │
│ ProjectService - Orchestrates Agents    │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼──────────┐
    │         │          │
┌───▼───┐ ┌──▼────┐ ┌───▼──────┐
│ Agent │ │Template│ │Repository│
│ Layer │ │Service │ │  Layer   │
└───────┘ └────────┘ └──────────┘
```

### Project Structure

```
project-scaffolding-agent/
├── api/                          # Vercel serverless functions
│   └── v1/                       # API v1 endpoints
│       ├── health.js             # Health check
│       ├── api-docs.js           # Swagger UI
│       ├── swagger.json.js       # OpenAPI spec
│       └── projects/
│           ├── index.js          # POST /projects (create)
│           ├── preview.js        # POST /projects/preview
│           └── templates.js      # GET /projects/templates
├── src/
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── routes/                   # Route definitions
│   │   └── index.js              # Centralized routing
│   ├── controllers/              # HTTP handlers
│   │   └── project.controller.js
│   ├── services/                 # Business logic
│   │   ├── project.service.js
│   │   ├── ai-service.js
│   │   ├── filesystem-service.js
│   │   ├── github-service.js
│   │   └── template-service.js
│   ├── repositories/             # Data persistence
│   │   └── project.repository.js
│   ├── agents/                   # AI agents
│   │   └── scaffolding-agent.js
│   ├── schemas/                  # Validation schemas
│   │   └── project-input-schema.js
│   ├── prompts/                  # AI prompts
│   │   └── project-scaffolding-prompts.js
│   ├── templates/                # Project templates
│   │   └── angular-template.js
│   └── utils/                    # Utilities
│       ├── logger.js
│       └── error-handler.js
├── tests/                        # Unit tests (95% coverage)
├── database/                     # JSON storage
├── docs/                         # Documentation
├── examples/                     # Usage examples
├── swagger.js                    # OpenAPI specification
├── postman-collection.json       # Postman API collection
└── vercel.json                   # Vercel configuration
```

## 📦 Postman Collection

Import the complete API collection with examples:

**File**: [postman-collection.json](postman-collection.json)

**Contains**:
- All 10 endpoints with examples
- Environment variables setup
- Pre-configured requests for both GitHub and Local modes
- Response validation tests

### Import Instructions

1. Open Postman
2. Click "Import" → "Upload Files"
3. Select `postman-collection.json`
4. Configure environment variables:
   - `BASE_URL`: `https://project-scaffolding-agent.vercel.app/api/v1` (production) or `http://localhost:3002/api/v1` (local)
   - `GITHUB_TOKEN`: Your GitHub Personal Access Token

## 🔌 Integration Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const createProject = async () => {
  const response = await axios.post(
    'https://project-scaffolding-agent.vercel.app/api/v1/projects',
    {
      projectName: 'my-app',
      front: 'Backend',
      technology: 'Node.js',
      version: '20',
      dependencies: ['Express', 'Prisma'],
      repositoryUrl: 'https://github.com/username/my-app',
      githubToken: process.env.GITHUB_TOKEN,
      isPrivate: false,
      includeTests: true,
      includeCICD: true
    }
  );
  console.log(response.data);
};
```

### Python

```python
import requests

response = requests.post(
    'https://project-scaffolding-agent.vercel.app/api/v1/projects',
    json={
        'projectName': 'my-app',
        'front': 'Backend',
        'technology': 'Node.js',
        'version': '20',
        'dependencies': ['Express', 'Prisma'],
        'repositoryUrl': 'https://github.com/username/my-app',
        'githubToken': 'ghp_your_token',
        'isPrivate': False,
        'includeTests': True,
        'includeCICD': True
    }
)
print(response.json())
```

### cURL

See examples in the [API Endpoints](#api-endpoints) section above.

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Test Coverage

Minimum required: **95%**

Current coverage:
- Statements: 96%
- Branches: 93%
- Functions: 95%
- Lines: 97%

### CI/CD Pipeline

GitHub Actions automatically:
- ✅ Runs ESLint on every push
- ✅ Executes all tests with coverage check
- ✅ Deploys to Vercel on successful tests
- ✅ Validates conventional commit messages

**Workflow**: [.github/workflows/ci.yml](.github/workflows/ci.yml)

## 🚀 Deployment

### Vercel (Production)

**Live URL**: https://project-scaffolding-agent.vercel.app

The project is automatically deployed on every push to `main` branch.

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Environment Variables

Configure in Vercel dashboard:
- `GITHUB_TOKEN` - For GitHub Models AI provider
- `OPENAI_API_KEY` - (Optional) For OpenAI provider
- `ANTHROPIC_API_KEY` - (Optional) For Anthropic provider

### Docker (Alternative)

```bash
# Build image
docker build -t project-scaffolding-agent .

# Run container
docker run -p 3002:3002 \
  -e GITHUB_TOKEN=your_token \
  project-scaffolding-agent
```

```

## 📊 Response Format

All API responses follow this format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data specific to the endpoint
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  }
}
```

## 🎨 Generated Project Features

Projects generated by this agent include:

### Configuration Files
- ✅ `package.json` / `pom.xml` / `build.gradle` - Dependency management
- ✅ `.gitignore` - Git ignore patterns
- ✅ `.env.example` - Environment variables template
- ✅ `README.md` - Complete project documentation
- ✅ `LICENSE` - MIT License

### Code Quality
- ✅ ESLint / Checkstyle configuration
- ✅ Prettier / EditorConfig for formatting
- ✅ Husky pre-commit hooks
- ✅ Commitlint for conventional commits

### Testing (if `includeTests: true`)
- ✅ Test framework setup (Jest, JUnit, etc.)
- ✅ Example test files
- ✅ Test coverage configuration
- ✅ Test scripts in package.json

### CI/CD (if `includeCICD: true`)
- ✅ GitHub Actions workflows
- ✅ Build and test automation
- ✅ Code quality checks
- ✅ Coverage reports

### Docker (if `includeDocker: true`)
- ✅ Dockerfile with multi-stage build
- ✅ docker-compose.yml
- ✅ .dockerignore

### Project Structure Examples

#### Node.js/Express Backend
```
my-backend-api/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── tests/
├── .github/workflows/
├── package.json
├── README.md
└── .env.example
```

#### Spring Boot Backend
```
my-backend-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── model/
│   │   │   └── Application.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/java/
├── .github/workflows/
├── pom.xml
└── README.md
```

#### Angular Frontend
```
my-frontend-app/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   └── app.module.ts
│   ├── assets/
│   ├── environments/
│   └── index.html
├── angular.json
├── package.json
└── README.md
```

## 🔒 Security Best Practices

### GitHub Token Security

**IMPORTANT**: Never commit your GitHub token to version control!

1. **Use Environment Variables**
   ```bash
   export GITHUB_TOKEN=ghp_your_token
   ```

2. **Use .env files** (already in .gitignore)
   ```env
   GITHUB_TOKEN=ghp_your_token
   ```

3. **Token Permissions Required**:
   - ✅ `repo` - Full control of private repositories
   - ✅ `public_repo` - Access to public repositories (if only creating public repos)

4. **Create Fine-Grained Token**: https://github.com/settings/tokens?type=beta
   - Select specific repositories (recommended)
   - Grant minimum permissions needed

### API Security

- ✅ **CORS enabled** for browser requests
- ✅ **Input validation** with Zod schemas
- ✅ **Error handling** without exposing internals
- ✅ **Rate limiting** (Vercel automatic)
- ✅ **HTTPS only** in production

## 🤔 FAQ

### Q: Which AI provider should I use?

**A**: GitHub Models is recommended (free) and works great. Use OpenAI or Anthropic for more advanced features.

### Q: Can I create private repositories?

**A**: Yes! Set `isPrivate: true` in the request body.

### Q: Does this work offline?

**A**: Local mode (`localPath`) works offline if you don't need AI generation. Template-based generation works without internet.

### Q: What happens if repository already exists?

**A**: The API returns an error. Delete the existing repository first or use a different name.

### Q: How do I add custom templates?

**A**: Add templates to `src/templates/` directory following the existing template structure.

### Q: Can I customize the generated project structure?

**A**: Yes! Edit the AI prompts in `src/prompts/` or create custom templates.

### Q: Is there a rate limit?

**A**: Vercel applies automatic rate limiting. GitHub API has a limit of 5000 requests/hour.

## 🗺️ Roadmap

### Planned Features
- [ ] Custom template support via API
- [ ] Project update/modification endpoint
- [ ] Dependency update suggestions
- [ ] Multi-repository monorepo support
- [ ] GitLab/Bitbucket integration
- [ ] Project migration assistant
- [ ] Architecture diagrams generation
- [ ] Database schema generation
- [ ] API documentation generation
- [ ] Terraform/IaC file generation

### In Progress
- 🔄 More framework templates (Next.js, NestJS, Django, FastAPI)
- 🔄 Better AI context for specific architectures
- 🔄 Project history and versioning

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Commit with conventional commits (`feat: add amazing feature`)
7. Push to the branch
8. Open a Pull Request

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```bash
feat(api): add private repository support
fix(github): correct file upload encoding
docs(readme): update API documentation
test(service): add project service tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- AI powered by [OpenAI](https://openai.com/), [Anthropic](https://anthropic.com/), and [GitHub Models](https://github.com/marketplace/models)
- Deployed on [Vercel](https://vercel.com/)
- Documentation with [Swagger/OpenAPI](https://swagger.io/)

## 📞 Support

- 📧 Email: support@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/AuronForge/project-scaffolding-agent/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/AuronForge/project-scaffolding-agent/discussions)
- 📖 Documentation: [docs/](docs/)

---

Made with ❤️ by the Future Agents Team
    "generatedAt": "2026-01-16T12:00:00.000Z"
  }
}
```

### Preview Project

```bash
POST /api/preview-project
```

Preview project structure without creating repository (no `repositoryUrl` or `githubToken` required).

**Request Body:**
```json
{
  "projectName": "test-project",
  "front": "Frontend",
  "technology": "Angular",
  "version": "18",
  "dependencies": ["Angular Material", "RxJS"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filesCount": 12,
    "files": [
      { "path": "package.json", "size": 1245 },
      { "path": "angular.json", "size": 3890 },
      ...
    ],
    "structure": {
      "description": "Angular 18 application with Material UI",
      "mainFiles": ["package.json", "angular.json", ...],
      "setupInstructions": [...]
    }
  }
}
```

## 🔐 GitHub Token Setup

### Required Permissions

Your GitHub Personal Access Token needs:

```
✅ repo (Full control of private repositories)
   ├── repo:status
   ├── repo_deployment
   ├── public_repo
   └── repo:invite

✅ workflow (if includeCICD is true)
```

### How to Create

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Select the permissions above
4. Copy the token (starts with `ghp_`)
5. Use in API requests or save in your application

## 🛠️ Supported Technologies

### Backend
- ✅ Spring Boot (Java)
- ✅ Node.js + Express
- ✅ NestJS
- ✅ .NET Core
- ✅ Django (Python)
- ✅ Flask (Python)

### Frontend
- ✅ Angular
- ✅ React
- ✅ Vue.js
- ✅ Next.js
- ✅ Svelte

### Fullstack
- ✅ MEAN (MongoDB, Express, Angular, Node)
- ✅ MERN (MongoDB, Express, React, Node)
- ✅ Spring Boot + Angular
- ✅ .NET + React

## 📝 Example Usage

### Creating a Spring Boot API with Dev Tools

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -H "x-ai-provider: github" \
  -d '{
    "projectName": "ecommerce-backend",
    "front": "Backend",
    "technology": "Spring Boot",
    "version": "3.2",
    "dependencies": [
      "Spring Web",
      "Spring Data JPA",
      "Spring Security",
      "PostgreSQL Driver",
      "Lombok",
      "Checkstyle",
      "SpotBugs"
    ],
    "repositoryUrl": "https://github.com/myuser/ecommerce-backend",
    "githubToken": "ghp_your_token_here",
    "description": "E-commerce REST API with authentication",
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

**What the AI will do:**
1. ✅ Analyze dependencies and find compatible versions
2. ✅ Generate Checkstyle configuration (checkstyle.xml)
3. ✅ Generate SpotBugs configuration
4. ✅ Update pom.xml with exact compatible versions
5. ✅ Add Maven plugins for code quality
6. ✅ Create GitHub Actions workflow with quality checks
7. ✅ Generate complete project structure

### Creating an Angular App with Linting & Formatting

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "ecommerce-frontend",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "dependencies": [
      "Angular Material",
      "RxJS",
      "NgRx",
      "Prettier",
      "ESLint",
      "Husky",
      "Lint-Staged"
    ],
    "repositoryUrl": "https://github.com/myuser/ecommerce-frontend",
    "githubToken": "ghp_your_token_here",
    "includeTests": true,
    "includeCICD": true
  }'
```

**What the AI will do:**
1. ✅ Analyze all dependencies and find compatible versions
2. ✅ Generate `.prettierrc.json` with Angular best practices
3. ✅ Generate `eslint.config.js` compatible with Angular 18
4. ✅ Create `.husky/pre-commit` hook
5. ✅ Generate `lint-staged.config.js`
6. ✅ Update `package.json` with:
   - Exact compatible versions
   - Scripts: `lint`, `format`, `prepare`
7. ✅ Ensure all tools work together seamlessly

**Response will include:**
```json
{
  "success": true,
  "data": {
    "repositoryUrl": "https://github.com/myuser/ecommerce-frontend",
    "filesCreated": 18,
    "dependencyConfiguration": {
      "versionsUsed": {
        "prettier": "^3.4.0",
        "eslint": "^9.18.0",
        "husky": "^9.1.7",
        "lint-staged": "^15.2.11",
        "@angular/material": "^18.0.0"
      },
      "configurationsGenerated": [
        ".prettierrc.json",
        "eslint.config.js",
        ".husky/pre-commit",
        "lint-staged.config.js"
      ],
      "scriptsAdded": ["lint", "format", "prepare", "lint:fix"]
    }
  }
}
```

## 🧪 Testing

```bash
npm test                  # Run all tests
npm run test:coverage     # Run with coverage
npm run test:watch        # Watch mode
```

## 🚢 Deployment

The agent can be deployed to:
- ✅ Vercel (Serverless Functions)
- ✅ AWS Lambda
- ✅ Google Cloud Functions
- ✅ Azure Functions
- ✅ Traditional Node.js server

## 📚 Documentation

- Input Schema: [`src/schemas/project-input-schema.js`](src/schemas/project-input-schema.js)
- GitHub Service: [`src/services/github-service.js`](src/services/github-service.js)
- AI Service: [`src/services/ai-service.js`](src/services/ai-service.js)
- Main Agent: [`src/agents/scaffolding-agent.js`](src/agents/scaffolding-agent.js)

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT

## 🔗 Related Projects

- [Test Scenario Generator Agent](../test-scenario-generator-agent)
- [User Story Generator Agent](../user-story-generator-agent)
