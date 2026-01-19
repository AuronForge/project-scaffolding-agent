# 🧪 Testing Guide

This guide explains how to test the Project Scaffolding Agent and its dependency analysis capabilities.

## 📋 Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your credentials:

   ### Option 1: GitHub Models (Free - Recommended)
   ```env
   GITHUB_TOKEN=ghp_your_personal_access_token
   GITHUB_MODEL=gpt-4o
   AI_PROVIDER=github
   ```

   **How to get GitHub Token:**
   1. Go to https://github.com/settings/tokens
   2. Click "Generate new token (classic)"
   3. Give it a name (e.g., "AI Models Access")
   4. Select scopes: (no scopes needed for AI models, but need `repo` + `workflow` for repository creation)
   5. Click "Generate token"
   6. Copy and paste in `.env`

   ### Option 2: OpenAI
   ```env
   OPENAI_API_KEY=sk-your_openai_key
   OPENAI_MODEL=gpt-4o
   AI_PROVIDER=openai
   ```

   ### Option 3: Anthropic
   ```env
   ANTHROPIC_API_KEY=sk-ant-your_anthropic_key
   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
   AI_PROVIDER=anthropic
   ```

## 🎯 Testing Scenarios

### 1. Dependency Analysis Test (No Repository Creation)

This test validates the two-phase AI approach:
- **Phase 1:** Analyzes dependencies and generates compatible versions
- **Phase 2:** Generates project structure with integrated configurations

```bash
node examples/test-dependency-analysis.js
```

**What it tests:**
- ✅ Input validation
- ✅ Dependency compatibility analysis
- ✅ Configuration file generation (ESLint, Prettier, Husky, etc.)
- ✅ Package.json scripts generation
- ✅ Project structure preview
- ✅ No GitHub repository is created (safe to test)

**Expected Output:**
```json
{
  "dependencyConfiguration": {
    "versionsUsed": {
      "prettier": "3.4.0",
      "eslint": "9.18.0",
      "husky": "9.1.7",
      "lint-staged": "15.2.11"
    },
    "configurationsGenerated": [
      ".prettierrc.json",
      "eslint.config.js",
      ".husky/pre-commit",
      "lint-staged.config.js"
    ],
    "scriptsAdded": [
      "format",
      "lint",
      "prepare"
    ]
  },
  "structure": {
    "filesCount": 18,
    "files": [...]
  }
}
```

### 2. API Test (Preview Mode)

Test the preview endpoint without creating a repository:

```bash
# Start the server
npm run dev

# In another terminal, make a request
curl -X POST http://localhost:3002/api/preview-project \
  -H "Content-Type: application/json" \
  -H "x-ai-provider: github" \
  -d '{
    "projectName": "test-angular-app",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "dependencies": ["Prettier", "ESLint", "Husky"],
    "description": "Test project",
    "includeTests": true,
    "repositoryUrl": "https://github.com/test/test-app",
    "githubToken": "ghp_dummy_token_for_preview"
  }'
```

### 3. Full Integration Test (Creates Real Repository)

⚠️ **Warning:** This test creates a real GitHub repository!

Before running, ensure:
1. You have a valid GitHub token with `repo` + `workflow` permissions
2. The repository URL doesn't already exist
3. You're ready to create a new repository

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -H "x-ai-provider: github" \
  -d '{
    "projectName": "my-new-app",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "dependencies": ["Prettier", "ESLint", "Husky", "Lint-Staged"],
    "description": "Production Angular application",
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": false,
    "repositoryUrl": "https://github.com/YOUR_USERNAME/my-new-app",
    "githubToken": "ghp_YOUR_REAL_TOKEN"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "repositoryUrl": "https://github.com/YOUR_USERNAME/my-new-app",
  "filesCreated": 18,
  "dependencyConfiguration": {
    "versionsUsed": { ... },
    "configurationsGenerated": [ ... ],
    "scriptsAdded": [ ... ]
  }
}
```

## 🔍 Test Examples

### Example 1: Angular 18 with Quality Tools
```javascript
{
  "projectName": "my-angular-app",
  "front": "Frontend",
  "technology": "Angular",
  "version": "18",
  "dependencies": [
    "Prettier",
    "ESLint",
    "Husky",
    "Lint-Staged",
    "Commitlint"
  ],
  "description": "Modern Angular 18 application",
  "includeTests": true,
  "includeCICD": true,
  "repositoryUrl": "https://github.com/username/my-angular-app",
  "githubToken": "ghp_token"
}
```

**AI will generate:**
- Compatible versions for Angular 18
- `.prettierrc.json` with Angular-specific rules
- `eslint.config.js` with @angular-eslint
- Husky pre-commit hooks
- Lint-staged configuration
- Commitlint with conventional commits
- Package.json scripts: `format`, `lint`, `prepare`

### Example 2: React + TypeScript
```javascript
{
  "projectName": "my-react-app",
  "front": "Frontend",
  "technology": "React",
  "version": "18",
  "dependencies": [
    "TypeScript",
    "Prettier",
    "ESLint",
    "Jest",
    "Testing Library"
  ],
  "includeTests": true,
  "repositoryUrl": "https://github.com/username/my-react-app",
  "githubToken": "ghp_token"
}
```

**AI will generate:**
- TypeScript configuration (tsconfig.json)
- React-specific ESLint rules
- Jest configuration
- Testing Library setup
- All configurations compatible with React 18

### Example 3: Spring Boot API
```javascript
{
  "projectName": "my-spring-api",
  "front": "Backend",
  "technology": "Spring Boot",
  "version": "3.2",
  "dependencies": [
    "Spring Web",
    "Spring Data JPA",
    "PostgreSQL",
    "Lombok",
    "MapStruct"
  ],
  "includeTests": true,
  "includeCICD": true,
  "includeDocker": true,
  "repositoryUrl": "https://github.com/username/my-spring-api",
  "githubToken": "ghp_token"
}
```

**AI will generate:**
- pom.xml with compatible dependencies
- application.yml with PostgreSQL config
- Lombok configuration
- MapStruct processor setup
- Docker configuration
- GitHub Actions CI/CD

## 🐛 Troubleshooting

### Issue: "GITHUB_TOKEN not found"
**Solution:** Create a `.env` file with your GitHub token:
```bash
cp .env.example .env
# Edit .env and add your token
```

### Issue: "Repository already exists"
**Solution:** Either:
1. Use a different repository name
2. Delete the existing repository
3. Use the preview endpoint instead

### Issue: "Invalid GitHub token"
**Solution:** Ensure your token:
1. Starts with `ghp_` or `github_pat_`
2. Has `repo` + `workflow` permissions
3. Is not expired

### Issue: AI response is incomplete
**Solution:**
1. Check your AI provider quota/credits
2. Try a different AI provider (GitHub Models is free)
3. Check the AI service logs for errors

### Issue: "Dependencies are incompatible"
**Solution:** This is exactly what the AI should prevent! If you see this:
1. Check the AI response for version conflicts
2. The AI should have analyzed and resolved conflicts
3. Report this as a bug with the input and output

## 📊 Expected Test Results

When running `test-dependency-analysis.js`, you should see:

```
🚀 Project Scaffolding Agent - Dependency Analysis Test
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AI Provider: GITHUB

================================================================================
🧪 Testing: Angular 18 with Development Tools
================================================================================

📋 Project Input:
{
  "projectName": "my-angular-app",
  "front": "Frontend",
  "technology": "Angular",
  "version": "18",
  "dependencies": ["Prettier", "ESLint", "Husky", "Lint-Staged", "Commitlint"],
  ...
}

⏳ Analyzing dependencies and generating project preview...

✅ Analysis completed in 8.45s

📊 Dependency Configuration:
{
  "versionsUsed": {
    "prettier": "3.4.0",
    "eslint": "9.18.0",
    "@angular-eslint/builder": "18.4.4",
    "husky": "9.1.7",
    "lint-staged": "15.2.11",
    "@commitlint/cli": "19.6.1"
  },
  "configurationsGenerated": [
    ".prettierrc.json",
    "eslint.config.js",
    ".husky/pre-commit",
    "lint-staged.config.js",
    "commitlint.config.js"
  ],
  "scriptsAdded": [
    "format",
    "format:check",
    "lint",
    "lint:fix",
    "prepare"
  ]
}

📁 Project Structure:
Total files: 18
  package.json (2145 bytes)
  .prettierrc.json (289 bytes)
  eslint.config.js (1456 bytes)
  ... and 15 more files

================================================================================
📊 Test Summary
================================================================================

✅ Successful: 1
❌ Failed: 0
📈 Total: 1

🎉 All tests passed!
```

## 🎓 Learning Points

### Two-Phase AI Architecture

1. **Phase 1: Dependency Analysis** (`analyzeDependencies()`)
   - Analyzes user-provided dependencies
   - Determines exact compatible versions
   - Generates configuration files
   - Returns JSON with versions, configs, scripts

2. **Phase 2: Project Generation** (`generateProjectStructure()`)
   - Takes dependency analysis results
   - Generates complete project structure
   - Integrates pre-analyzed configurations
   - Returns file tree with contents

### Why Two Phases?

- **Compatibility:** Ensures all tools work together (e.g., Prettier 3.4.0 compatible with Angular 18)
- **Configuration:** Generates proper config files (eslint.config.js, .prettierrc.json, etc.)
- **Scripts:** Adds npm scripts for each tool (`format`, `lint`, `prepare`)
- **No Conflicts:** AI validates dependencies don't conflict with each other

### Benefits

✅ No manual dependency research
✅ No configuration file writing
✅ No version compatibility issues
✅ Ready-to-use project structure
✅ Best practices included

## 📚 Next Steps

After successful testing:

1. **Use in production:** Call `/api/create-project` with real tokens
2. **Add CI/CD:** The generated project includes CI/CD configuration
3. **Customize:** Modify prompts in `ai-service.js` for your needs
4. **Extend:** Add support for more technologies
5. **Monitor:** Check AI usage and costs

## 🔗 Related Documentation

- [README.md](README.md) - Full project documentation
- [DEPLOYMENT.md](../test-scenario-generator-agent/.github/DEPLOY.md) - CI/CD setup guide
- [GitHub API Documentation](https://docs.github.com/en/rest) - GitHub API reference
