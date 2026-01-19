# Project Scaffolding Agent

🤖 AI-powered agent that generates complete project structures and publishes them to GitHub or creates them locally.

[![CI/CD Pipeline](https://github.com/AuronForge/project-scaffolding-agent/actions/workflows/deploy.yml/badge.svg)](https://github.com/AuronForge/project-scaffolding-agent/actions/workflows/deploy.yml)

## 🎯 Overview

This agent automates the entire process of creating a new software project:
1. Receives project specifications (technology, version, dependencies)
2. Uses AI to generate a complete, production-ready project structure
3. **GitHub Mode**: Creates repository and commits all files with proper structure
4. **Local Mode**: Creates project in a local directory for offline work
5. Adds relevant topics and metadata (GitHub mode only)

## 📚 Documentation

- 🚀 **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- 📊 **[Local vs GitHub Mode](docs/LOCAL_VS_GITHUB.md)** - Choose the right mode for your needs
- 🧪 **[Testing Guide](TESTING.md)** - How to test the agent
- 📝 **[Changelog](CHANGELOG.md)** - Recent updates and features

## ✨ Features

- ✅ **AI-Powered Generation** - Intelligent project structure based on best practices
- ✅ **Smart Dependency Analysis** - AI analyzes dependencies and generates compatible versions
- ✅ **Auto-Configuration** - Automatic generation of config files (ESLint, Prettier, Husky, etc.)
- ✅ **Version Compatibility** - Ensures all dependencies work together seamlessly
- ✅ **Multiple Technologies** - Support for Spring Boot, Angular, React, Node.js, and more
- ✅ **Dual Mode Operation** - Create on GitHub or locally
- ✅ **GitHub Integration** - Automatic repository creation and file upload
- ✅ **Offline Support** - Local mode works without GitHub credentials
- ✅ **Configurable Options** - Tests, CI/CD, Docker support
- ✅ **Preview Mode** - See structure before creating repository
- ✅ **Multiple AI Providers** - GitHub Models (free), OpenAI, or Anthropic

## 📋 Input Contract

The agent supports two modes of operation:

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
| `version` | string | Technology version | `"3.2"`, `"18"`, `"19"` |

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

## 🚀 Quick Start

### Installation

```bash
cd project-scaffolding-agent
npm install
```

### Environment Configuration

Create a `.env` file:

```env
# GitHub Models (Free - Recommended)
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_MODEL=gpt-4o

# OR OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o

# OR Anthropic
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:3002`

### Test Scripts

```bash
# Test local project creation (creates project in examples/output/)
npm run test:local

# Test dependency analysis without creating project (preview mode)
npm run test:preview

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📡 API Endpoints

### Create Project (GitHub Mode)

```bash
POST /api/create-project
```

Creates a complete project and publishes to GitHub.

**Headers:**
```
Content-Type: application/json
x-ai-provider: github  # Optional: github, openai, or anthropic
```

**Request Body:**
```json
{
  "projectName": "my-backend-api",
  "front": "Backend",
  "technology": "Spring Boot",
  "version": "3.2",
  "dependencies": ["Spring Web", "Spring Security", "PostgreSQL"],
  "repositoryUrl": "https://github.com/username/my-backend-api",
  "githubToken": "ghp_your_token_here",
  "description": "REST API for my application",
  "includeTests": true,
  "includeCICD": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "mode": "github",
    "repositoryUrl": "https://github.com/username/my-backend-api",
    "cloneUrl": "https://github.com/username/my-backend-api.git",
    "filesCreated": 15,
    "files": ["pom.xml", "src/main/java/...", "README.md", ...],
    "structure": {
      "description": "Spring Boot REST API with PostgreSQL",
      "mainFiles": ["pom.xml", "Application.java", ...],
      "setupInstructions": ["Clone repository", "Run mvn install", ...]
    }
  },
  "metadata": {
    "agent": "Project Scaffolding Agent",
    "version": "1.0.0",
    "provider": "github",
    "generatedAt": "2026-01-16T12:00:00.000Z"
  }
}
```

### Create Project (Local Mode)

```bash
POST /api/create-project
```

Creates a complete project in a local directory.

**Request Body:**
```json
{
  "projectName": "my-backend-api",
  "front": "Backend",
  "technology": "Spring Boot",
  "version": "3.2",
  "dependencies": ["Spring Web", "Spring Security", "PostgreSQL"],
  "localPath": "/home/user/projects",
  "description": "REST API for my application",
  "includeTests": true,
  "includeCICD": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "mode": "local",
    "projectPath": "/home/user/projects/my-backend-api",
    "filesCreated": 15,
    "files": ["pom.xml", "src/main/java/...", "README.md", ...],
    "structure": {
      "description": "Spring Boot REST API with PostgreSQL",
      "mainFiles": ["pom.xml", "Application.java", ...],
      "setupInstructions": ["Navigate to project", "Run mvn install", ...]
    }
  },
  "metadata": {
    "agent": "Project Scaffolding Agent",
    "version": "1.0.0",
    "provider": "github",
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
