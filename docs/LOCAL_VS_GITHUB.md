# Local vs GitHub Mode Comparison

## Quick Reference

| Feature | GitHub Mode | Local Mode |
|---------|-------------|------------|
| **Repository Creation** | ✅ Yes | ❌ No |
| **Git Integration** | ✅ Automatic | ⚠️ Manual (run `git init`) |
| **GitHub Token Required** | ✅ Yes | ❌ No |
| **Internet Required** | ✅ Yes (for GitHub API) | ⚠️ Only for AI generation |
| **CI/CD Setup** | ✅ GitHub Actions included | ⚠️ Can be included but won't run |
| **Topics/Tags** | ✅ Added automatically | ❌ N/A |
| **Clone URL** | ✅ Provided | ❌ N/A |
| **Best For** | Production projects, team collaboration | Testing, prototyping, offline work |

## Use Cases

### When to Use GitHub Mode

1. **Production Projects**
   - Project will be hosted on GitHub
   - Need immediate repository for team collaboration
   - Want automatic CI/CD setup with GitHub Actions

2. **Open Source Projects**
   - Need public repository with topics/tags
   - Want to share project immediately
   - Need clone URL for documentation

3. **Team Collaboration**
   - Multiple developers need access
   - Using GitHub Projects, Issues, or Discussions
   - Integrated with GitHub ecosystem

### When to Use Local Mode

1. **Prototyping & Testing**
   - Experimenting with different configurations
   - Testing the agent itself
   - Don't want to clutter GitHub with test repos

2. **Offline Development**
   - Limited or no internet access (after AI generation)
   - Working on airplane, remote locations
   - Avoiding API rate limits

3. **Private/Confidential Projects**
   - Not ready to create GitHub repository yet
   - Company policy requires approval before repository creation
   - Need to review generated code first

4. **Educational Purposes**
   - Learning project structure
   - Teaching best practices
   - Students without GitHub accounts

## Examples

### Example 1: Quick Prototype (Local Mode)

You want to quickly prototype an Angular app without creating a GitHub repository yet.

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "prototype-angular-app",
    "front": "Frontend",
    "technology": "Angular",
    "version": "18",
    "localPath": "/Users/myuser/prototypes",
    "includeTests": false,
    "includeCICD": false
  }'
```

**Result**: Project created at `/Users/myuser/prototypes/prototype-angular-app/`

**Next Steps**:
```bash
cd /Users/myuser/prototypes/prototype-angular-app
npm install
npm start
```

### Example 2: Production Project (GitHub Mode)

You want to create a production-ready Spring Boot API with full CI/CD.

```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "ecommerce-api",
    "front": "Backend",
    "technology": "Spring Boot",
    "version": "3.2",
    "dependencies": ["Spring Web", "Spring Security", "PostgreSQL", "Redis"],
    "repositoryUrl": "https://github.com/mycompany/ecommerce-api",
    "githubToken": "ghp_your_real_token_here",
    "description": "E-commerce REST API with authentication and caching",
    "includeTests": true,
    "includeCICD": true,
    "includeDocker": true
  }'
```

**Result**: Repository created at `https://github.com/mycompany/ecommerce-api`

**Next Steps**:
```bash
git clone https://github.com/mycompany/ecommerce-api
cd ecommerce-api
mvn spring-boot:run
```

### Example 3: Local First, GitHub Later

Create project locally, review it, then push to GitHub manually.

**Step 1: Create locally**
```bash
curl -X POST http://localhost:3002/api/create-project \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "my-react-app",
    "front": "Frontend",
    "technology": "React",
    "version": "18",
    "dependencies": ["TypeScript", "Prettier", "ESLint"],
    "localPath": "/Users/myuser/projects"
  }'
```

**Step 2: Review and test**
```bash
cd /Users/myuser/projects/my-react-app
npm install
npm start
# Review code, make changes...
```

**Step 3: Push to GitHub when ready**
```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/myuser/my-react-app.git
git push -u origin main
```

### Example 4: Multiple Environments

Create same project in both modes for different purposes.

**Development (Local)**:
```json
{
  "projectName": "myapp-dev",
  "front": "Fullstack",
  "technology": "Next.js",
  "version": "14",
  "localPath": "/Users/myuser/dev",
  "includeTests": false,
  "includeCICD": false
}
```

**Production (GitHub)**:
```json
{
  "projectName": "myapp-prod",
  "front": "Fullstack",
  "technology": "Next.js",
  "version": "14",
  "repositoryUrl": "https://github.com/mycompany/myapp",
  "githubToken": "ghp_...",
  "includeTests": true,
  "includeCICD": true,
  "includeDocker": true
}
```

## Path Considerations

### Absolute Paths

Both Windows and Unix-style paths are supported:

**Windows**:
```json
{
  "localPath": "C:\\Users\\myuser\\projects"
}
```

**Unix/Mac**:
```json
{
  "localPath": "/home/myuser/projects"
}
```

### Relative Paths

Relative paths are resolved from the agent's working directory:

```json
{
  "localPath": "./output"  // Resolves to agent-dir/output
}
```

### Project Name

The project will be created in a subdirectory with the project name:

```json
{
  "projectName": "my-app",
  "localPath": "/home/user/projects"
}
```

Result: `/home/user/projects/my-app/`

## Error Handling

### GitHub Mode Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Repository already exists" | Repo URL already taken | Use different name or delete existing repo |
| "Invalid GitHub token" | Token expired or wrong format | Generate new token with correct permissions |
| "Rate limit exceeded" | Too many API calls | Wait or use authenticated requests |

### Local Mode Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Directory not writable" | No write permissions | Check directory permissions |
| "Directory already exists" | Project folder exists | Use different name or delete existing folder |
| "Invalid path" | Path format incorrect | Use absolute path or check syntax |

## Migration Path

### Local to GitHub

If you created a project locally and want to move it to GitHub:

```bash
# 1. Navigate to project
cd /path/to/project

# 2. Initialize git (if not done)
git init

# 3. Create GitHub repository (via GitHub UI or gh CLI)
gh repo create myuser/myproject --public

# 4. Add remote and push
git remote add origin https://github.com/myuser/myproject.git
git add .
git commit -m "feat: initial commit"
git push -u origin main
```

### GitHub to Local

If you want to work on a GitHub project locally:

```bash
# Simply clone the repository
git clone https://github.com/myuser/myproject.git
cd myproject
npm install
```

## Performance Comparison

| Metric | GitHub Mode | Local Mode |
|--------|-------------|------------|
| **Time to Create** | ~10-15 seconds | ~2-5 seconds |
| **API Calls** | 5-10 (GitHub API) | 0 |
| **Network Usage** | High | Low (only AI generation) |
| **Disk Space** | Remote + Local (if cloned) | Local only |

## Best Practices

### Local Mode

1. **Use Descriptive Paths**: Organize projects in clear directory structures
   ```
   /projects/
     /prototypes/
     /production/
     /learning/
   ```

2. **Version Control**: Initialize git even for local projects
   ```bash
   cd project-dir
   git init
   git add .
   git commit -m "initial commit"
   ```

3. **Regular Backups**: Local projects aren't backed up automatically

### GitHub Mode

1. **Repository Naming**: Follow GitHub naming conventions
   - Lowercase
   - Hyphens for spaces
   - Descriptive names

2. **Token Security**: 
   - Never commit tokens to git
   - Use environment variables
   - Rotate tokens regularly

3. **Repository Settings**: Configure after creation
   - Branch protection
   - Required reviews
   - Security policies

## Conclusion

Both modes have their place:

- **Use GitHub Mode** when you're ready to collaborate and deploy
- **Use Local Mode** when you're experimenting, learning, or need offline access

The best workflow often combines both: prototype locally, then create on GitHub when ready.
