# Quick Start Guide

Get started with the Project Scaffolding Agent in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A text editor (VS Code recommended)
- GitHub token (for AI generation - free with GitHub Models)

## Step 1: Installation (1 minute)

```bash
# Navigate to project directory
cd project-scaffolding-agent

# Install dependencies
npm install
```

## Step 2: Configuration (1 minute)

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` and add your GitHub token:

```env
# Get a free token at https://github.com/settings/tokens
GITHUB_TOKEN=ghp_your_token_here
GITHUB_MODEL=gpt-4o
AI_PROVIDER=github
```

**Getting a GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it "AI Models"
4. No scopes needed for AI (select `repo` + `workflow` if you want to create repos too)
5. Copy and paste into `.env`

## Step 3: Test It! (2 minutes)

### Option A: Preview Mode (No Repository Created)

Test dependency analysis without creating anything:

```bash
npm run test:preview
```

This will:
- ✅ Analyze an Angular 18 project
- ✅ Show compatible dependency versions
- ✅ Display configuration files to be generated
- ✅ No repository or local files created

### Option B: Create Local Project

Create a real project on your computer:

```bash
npm run test:local
```

This will:
- ✅ Generate a complete Angular 18 project
- ✅ Create it in `examples/output/test-angular-local/`
- ✅ Include Prettier, ESLint, and Husky configurations
- ✅ Show you next steps

**After creation:**
```bash
cd examples/output/test-angular-local
npm install
npm start
```

## Step 4: Create Your Own Project (1 minute)

### Method 1: Using the API

Start the development server:

```bash
npm run dev
```

In another terminal, create a project:

```bash
# Local project
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-first-project",
    "front": "Frontend",
    "technology": "React",
    "version": "18",
    "dependencies": ["TypeScript", "Prettier"],
    "localPath": "./my-projects"
  }'
```

### Method 2: Using JavaScript

Create a file `create-my-project.js`:

```javascript
import { ProjectScaffoldingAgent } from './src/agents/scaffolding-agent.js';

const agent = new ProjectScaffoldingAgent('github');

const project = {
  projectName: 'my-awesome-app',
  front: 'Frontend',
  technology: 'React',
  version: '18',
  dependencies: ['TypeScript', 'Prettier', 'ESLint'],
  localPath: './my-projects',
  includeTests: true
};

const result = await agent.createProject(project);
console.log(result);
```

Run it:

```bash
node create-my-project.js
```

## Common Scenarios

### Scenario 1: Quick Prototype

**Goal**: Create a quick Angular prototype without GitHub

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "prototype-app",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "localPath": "./prototypes",
    "includeTests": false,
    "includeCICD": false
  }'
```

**Time**: ~5 seconds
**Result**: Ready-to-run Angular app in `./prototypes/prototype-app/`

### Scenario 2: Production Project on GitHub

**Goal**: Create production-ready project with CI/CD

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "production-api",
    "front": "Backend",
    "technology": "Spring Boot",
    "version": "3.2",
    "dependencies": ["Spring Web", "Spring Security", "PostgreSQL"],
    "repositoryUrl": "https://github.com/YOUR_USERNAME/production-api",
    "githubToken": "ghp_YOUR_TOKEN",
    "isPrivate": false,
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

**Time**: ~15 seconds
**Result**: Complete GitHub repository with CI/CD

### Scenario 3: Learning Project

**Goal**: Explore how modern projects are structured

```bash
npm run test:preview
```

**Time**: ~5 seconds
**Result**: See complete project structure without creating files

## Supported Technologies

### Frontend
- ✅ Angular (14, 15, 16, 17, 18)
- ✅ React (17, 18, 19)
- ✅ Vue.js (2, 3)
- ✅ Next.js (13, 14, 15)
- ✅ Svelte (3, 4, 5)

### Backend
- ✅ Spring Boot (2.7, 3.0, 3.1, 3.2)
- ✅ Node.js + Express
- ✅ NestJS
- ✅ FastAPI (Python)
- ✅ Django (Python)

### Fullstack
- ✅ Next.js
- ✅ Nuxt.js
- ✅ SvelteKit
- ✅ Remix

## Supported Dependencies

The AI can configure these tools automatically:

### Code Quality
- Prettier
- ESLint
- Stylelint
- EditorConfig

### Git Hooks
- Husky
- Lint-Staged
- Commitlint
- Commitizen

### Testing
- Jest
- Testing Library
- Cypress
- Playwright
- Vitest

### CI/CD
- GitHub Actions
- GitLab CI
- CircleCI

### Containerization
- Docker
- Docker Compose
- Kubernetes

## Troubleshooting

### Issue: "GITHUB_TOKEN not found"

**Solution**: Create a `.env` file with your token

```bash
cp .env.example .env
# Edit .env and add your token
```

### Issue: "Directory already exists"

**Solution**: The project folder already exists. Either:
- Use a different project name
- Delete the existing folder
- Use a different `localPath`

### Issue: "Invalid GitHub token"

**Solution**: Check your token:
1. Should start with `ghp_` or `github_pat_`
2. Not expired
3. Has correct permissions (repo + workflow for GitHub creation)

### Issue: AI generation is slow

**Solution**: 
- First run is always slower (model initialization)
- Subsequent runs are faster
- Try GitHub Models (free and fast)

### Issue: "Repository already exists" on GitHub

**Solution**: 
- The GitHub repository URL is already taken
- Use a different repository name
- Or delete the existing repository

## Next Steps

Now that you're set up:

1. **Explore Examples**: Check [examples/](../examples/) directory
2. **Read Documentation**: See [README.md](../README.md) for detailed docs
3. **Compare Modes**: Read [docs/LOCAL_VS_GITHUB.md](LOCAL_VS_GITHUB.md)
4. **Customize**: Modify [src/prompts/](../src/prompts/) for custom generation
5. **Contribute**: Report issues or contribute features

## Tips for Success

1. **Start with Preview**: Use `test:preview` to see what will be generated
2. **Test Locally First**: Create locally before pushing to GitHub
3. **Review Generated Code**: AI is smart but always review the output
4. **Customize After**: Generated projects are starting points, customize as needed
5. **Save Tokens**: Preview mode doesn't create files, great for exploration

## Example Workflow

Here's a typical workflow:

```bash
# 1. Preview project structure
npm run test:preview

# 2. If happy, create locally
npm run test:local

# 3. Navigate and test
cd examples/output/test-angular-local
npm install
npm start

# 4. If everything works, create on GitHub
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-production-app",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "dependencies": ["Prettier", "ESLint"],
    "repositoryUrl": "https://github.com/myuser/my-production-app",
    "githubToken": "ghp_...",
    "isPrivate": false,
    "includeTests": true,
    "includeCICD": true
  }'

# 5. Clone and continue development
git clone https://github.com/myuser/my-production-app
cd my-production-app
npm install
```

## Support

- **Documentation**: [README.md](../README.md)
- **Examples**: [examples/](../examples/)
- **Testing Guide**: [TESTING.md](../TESTING.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)

Happy coding! 🚀
