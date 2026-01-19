/**
 * Prompts for Project Scaffolding AI Generation
 */

/**
 * Get technology-specific instructions for project generation
 * @param {string} technology - Technology name
 * @param {string} version - Technology version
 * @returns {string} Specific instructions
 */
function getTechnologySpecificInstructions(technology, version) {
  const instructions = {
    'Angular': `
Angular ${version} COMPLETE DEPENDENCY LIST (like "ng new" generates):
dependencies:
  - @angular/animations: ~${version}.0
  - @angular/common: ~${version}.0
  - @angular/compiler: ~${version}.0
  - @angular/core: ~${version}.0
  - @angular/forms: ~${version}.0
  - @angular/platform-browser: ~${version}.0
  - @angular/platform-browser-dynamic: ~${version}.0
  - @angular/router: ~${version}.0
  - rxjs: ~7.8.0 (for v17+) or ~7.5.0 (for v16)
  - tslib: ^2.6.0
  - zone.js: ~0.14.0 (for v17+) or ~0.13.0 (for v16)

devDependencies:
  - @angular-devkit/build-angular: ~${version}.0
  - @angular/cli: ~${version}.0
  - @angular/compiler-cli: ~${version}.0
  - typescript: ~5.4.0 (v18.0-18.1), ~5.5.0 (v18.2+), ~5.2.0 (v16)
  - @types/node: ^18.0.0 or ^20.0.0

CRITICAL: All @angular/* packages MUST use the SAME version!
CRITICAL: TypeScript 5.4.x for Angular 18.0-18.1, TypeScript 5.5.x for Angular 18.2+`,

    'React': `
React ${version} COMPLETE DEPENDENCY LIST:
dependencies:
  - react: ^${version}.0.0
  - react-dom: ^${version}.0.0
  - react-scripts: ^5.0.1 (for Create React App)

For TypeScript React projects:
  - @types/react: ^${version}.0.0
  - @types/react-dom: ^${version}.0.0
  - typescript: ^5.0.0`,

    'Vue': `
Vue ${version} COMPLETE DEPENDENCY LIST:
dependencies:
  - vue: ^${version}.0.0
  - vue-router: ^4.0.0 (for Vue 3)
  - pinia: ^2.0.0 (state management)

devDependencies:
  - @vitejs/plugin-vue: latest
  - vite: ^5.0.0
  - typescript: ^5.0.0 (if TypeScript)`,

    'Spring Boot': `
Spring Boot ${version} COMPLETE DEPENDENCY LIST:
Use Maven or Gradle with these key dependencies:
  - spring-boot-starter-web
  - spring-boot-starter-test
  - spring-boot-devtools (optional)
Java version: 17 or 21 (LTS versions)
Packaging: jar`
  };

  return instructions[technology] || `Generate a complete, working project for ${technology} ${version} with all standard dependencies.`;
}

/**
 * Generate prompt for dependency analysis
 * @param {Object} config - Project configuration
 * @returns {string} Prompt for dependency analysis
 */
export function buildDependencyAnalysisPrompt(config) {
  const { technology, version, dependencies } = config;

  return `You are an expert in ${technology} ${version} dependency management and configuration.

Your task is to generate a PRODUCTION-READY project with ALL required dependencies and configurations.
Think of this as replicating what tools like "ng new", "create-react-app", or "spring initializr" do automatically.

Analyze these additional dependencies and generate compatible versions:
${dependencies.map(dep => `- ${dep}`).join('\n')}

CRITICAL REQUIREMENTS:
1. Use ONLY versions that ACTUALLY EXIST in npm registry
2. Use STABLE, TESTED versions (avoid beta, alpha, rc unless specified)
3. Use versions that are COMPATIBLE with ${technology} ${version}
4. Generate a project that works with "npm install && npm start" WITHOUT errors
5. Include ALL dependencies that ${technology} ${version} projects need by default

PACKAGE NAMING RULES (CRITICAL - use EXACT npm package names):
- Prettier → "prettier"
- ESLint → "eslint" + "@typescript-eslint/eslint-plugin" + "@typescript-eslint/parser" (for TypeScript)
- Husky → "husky" (use version 8.x for stability)
- Lint-Staged → "lint-staged"
- Commitlint → "@commitlint/cli" + "@commitlint/config-conventional" (use version 18.x or 19.x)
- Commitizen → "commitizen" + "cz-conventional-changelog"

VERSION SELECTION STRATEGY:
- Use the LATEST STABLE version unless there are known compatibility issues
- For Angular projects: Match TypeScript version to EXACT Angular minor version
  * Angular 18.0 or 18.1 → TypeScript ~5.4.0 (requires >=5.4 <5.5)
  * Angular 18.2+ → TypeScript ~5.5.0  
  * Angular 17 → TypeScript ~5.2.0 or ~5.3.0
  * Angular 16 → TypeScript ~5.0.0 or ~5.1.0
- For Commitlint: Use latest stable (18.x or 19.x work with all Node versions)
- Use ~ for patch updates (e.g., ~18.2.0 allows 18.2.x)

TESTED STABLE VERSIONS (as of 2026):
- prettier: "^3.0.0" or "^3.1.0" or "^3.2.0"
- eslint: "^8.50.0" or "^8.57.0" (v9.x exists but may have breaking changes)
- husky: "^8.0.3" or "^9.0.0"
- lint-staged: "^14.0.0" or "^15.0.0"
- @commitlint/cli: "^18.0.0" or "^19.0.0" (NOT 17.7.x - doesn't exist)
- @commitlint/config-conventional: Same version as @commitlint/cli
- commitizen: "^4.3.0"
- cz-conventional-changelog: "^3.3.0"
- typescript: Match to framework requirements (see above)

IMPORTANT: If unsure about a version, use "latest" or a broad range like "^8.0.0"

IMPORTANT SCRIPT PATTERNS:
For linters (ESLint, etc.):
- "lint": Check without fixing (e.g., "eslint src/ api/ tests/")
- "lint:fix": Check and auto-fix (e.g., "eslint src/ api/ tests/ --fix")

For formatters (Prettier, etc.):
- "format": Format files (e.g., "prettier --write \"**/*.{js,json,md}\"")
- "format:check": Check formatting without writing (e.g., "prettier --check \"**/*.{js,json,md}\"")

For Husky (Git hooks):
- Always include "prepare": "husky" script
- Configure .husky/pre-commit for lint-staged/prettier/eslint
- If Commitlint or Commitizen is in dependencies, also configure:
  * .husky/commit-msg with "npx --no -- commitlint --edit \$1"
  * Add "commit": "cz" script for Commitizen
- Husky hooks are EXECUTABLE BASH SCRIPTS, not JSON files
- Example .husky/pre-commit content:
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  npx lint-staged
- Example .husky/commit-msg content:
  #!/usr/bin/env sh
  . "$(dirname -- "$0")/_/husky.sh"
  npx --no -- commitlint --edit $1

File patterns depend on project type and technology:
- Frontend JS/TS: "**/*.{js,ts,jsx,tsx,json,md,html,css,scss}"
- Backend Java: Use maven/gradle plugins instead of npm scripts
- Backend Node.js: "src/**/*.js", "api/**/*.js", "tests/**/*.js"
- Python: Use pylint/black in requirements.txt

Output Format (JSON only):
{
  "compatibleVersions": {
    "dependencyName": "version"
  },
  "configurations": [
    {
      "filename": "config-file-name",
      "content": "complete file content",
      "description": "what this configures"
    }
  ],
  "packageJsonScripts": {
    "scriptName": "script command"
  },
  "setupInstructions": ["instruction 1", "instruction 2"]
}

FINAL VALIDATION CHECKLIST:
✓ All package versions ACTUALLY EXIST in npm registry (no made-up versions!)
✓ All versions are COMPATIBLE with each other (no peer dependency conflicts)
✓ TypeScript version matches EXACT framework requirements (check peer dependencies!)
✓ All core framework dependencies included (not just minimal set)
✓ Configuration files are complete and syntactically correct
✓ Scripts follow naming conventions (lint/lint:fix, format/format:check)
✓ Husky hooks are bash scripts with proper shebang
✓ Project will work with npm install && npm start (NO --legacy-peer-deps needed!)

CRITICAL PEER DEPENDENCY CHECK:
Before finalizing versions, mentally verify:
- Does @angular/compiler-cli@18.0.x allow the TypeScript version chosen?
- Do all @typescript-eslint packages work with the TypeScript version?
- Are all framework packages using compatible versions?
If unsure, prefer CONSERVATIVE versions (e.g., TypeScript 5.4 for Angular 18.0)

CRITICAL: For Husky, you MUST include the hook files in configurations array:
- .husky/pre-commit (always required)
- .husky/commit-msg (if Commitlint is present)
- .husky/_/husky.sh (Husky initialization file)

Example Husky files to include in configurations:
{
  "filename": ".husky/pre-commit",
  "content": "#!/usr/bin/env sh\\n. \\"$(dirname -- \\"$0\\")/_/husky.sh\\"\\n\\nnpx lint-staged\\n",
  "description": "Pre-commit hook for lint-staged"
}

IMPORTANT:
- Use exact, tested, compatible versions
- Generate complete, working configuration files
- Include all necessary setup (prettier, eslint, husky, lint-staged, etc.)
- Ensure configurations don't conflict
- Follow ${technology} best practices
- For npm scripts, always include both check and fix variants:
  * lint + lint:fix for linters
  * format + format:check for formatters
- For Husky hooks:
  * Always create .husky/pre-commit
  * If Commitlint in dependencies: create .husky/commit-msg and commitlint.config.js
  * If Commitizen in dependencies: add "commit": "cz" script and .czrc or commitizen config
- Adjust file patterns in scripts based on project structure and technology

Generate ONLY valid JSON. No markdown, no explanations outside JSON.`;
}

/**
 * Generate prompt for project structure generation
 * @param {Object} config - Project configuration
 * @param {Object} dependencyConfig - Pre-analyzed dependency configuration
 * @returns {string} Prompt for project generation
 */
export function buildProjectStructurePrompt(config, dependencyConfig) {
  const { 
    projectName, 
    front, 
    technology, 
    version, 
    dependencies, 
    description, 
    includeTests, 
    includeCICD, 
    includeDocker 
  } = config;

  let dependencySection = '';
  if (dependencyConfig && dependencyConfig.compatibleVersions) {
    dependencySection = `
Dependencies with Compatible Versions:
${Object.entries(dependencyConfig.compatibleVersions).map(([name, ver]) => `- ${name}: ${ver}`).join('\n')}

Pre-configured Files (already generated, integrate them):
${dependencyConfig.configurations.map(cfg => `- ${cfg.filename}: ${cfg.description}`).join('\n')}

Package.json Scripts (include these):
${Object.entries(dependencyConfig.packageJsonScripts).map(([name, cmd]) => `  "${name}": "${cmd}"`).join(',\n')}
`;
  } else {
    dependencySection = `Additional Dependencies: ${dependencies && dependencies.length > 0 ? dependencies.join(', ') : 'None'}`;
  }

  return `You are an expert software architect. Generate a complete project structure for a ${front} project.

Project Details:
- Name: ${projectName}
- Type: ${front}
- Technology: ${technology} ${version}
- Description: ${description || 'No description provided'}
${dependencySection}

Requirements:
1. Generate a complete folder structure appropriate for ${technology} ${version}
2. Include all necessary configuration files (package.json, pom.xml, angular.json, etc.)
${dependencyConfig ? '3. INTEGRATE the pre-configured dependency files provided above' : '3. Add dependency configuration files'}
4. Add a comprehensive README.md with setup instructions
5. Include a proper .gitignore file
${includeTests ? '6. Add basic test setup and example tests' : ''}
${includeCICD ? '7. Include GitHub Actions CI/CD workflow' : ''}
${includeDocker ? '8. Add Dockerfile and docker-compose.yml' : ''}

CRITICAL - COMPLETE FUNCTIONAL PROJECT:
This project must be PRODUCTION-READY and work exactly like running official CLI tools:
- Angular: Replicate "ng new ${projectName}" output
- React: Replicate "npx create-react-app ${projectName}" output  
- Vue: Replicate "npm create vue@latest" output
- Spring Boot: Replicate "start.spring.io" generated project

REQUIREMENTS:
1. Include ALL dependencies the official CLI would include (not just basics)
2. Use versions that EXIST in npm/maven registries (verify before generating)
3. Use LATEST STABLE versions compatible with ${technology} ${version}
4. Project MUST work with standard commands: npm install && npm start (or mvn clean install)
5. No peer dependency warnings or errors
6. All configuration files must be complete and functional

For ${technology} ${version} specifically:
${getTechnologySpecificInstructions(technology, version)}

package.json MUST include:
- ALL core framework dependencies (e.g., all @angular/* packages for Angular)
- ALL required dev dependencies (CLI, compiler, build tools)
- Correct TypeScript version for the framework version
- All helper libraries (rxjs, zone.js for Angular, etc.)
- Build, start, test, and lint scripts
${dependencyConfig ? '- Integration with pre-configured dependency tools' : ''}
- For Angular:
  * Include all @angular/* packages with SAME version: animations, common, compiler, core, forms, platform-browser, platform-browser-dynamic, router
  * Angular 18.x requires: TypeScript ~5.4.0, rxjs ~7.8.0, zone.js ~0.14.0
  * Angular 17.x requires: TypeScript ~5.2.0, rxjs ~7.8.0, zone.js ~0.14.0
  * Angular 16.x requires: TypeScript ~5.0.0, rxjs ~7.5.0, zone.js ~0.13.0
  * Include @angular/cli, @angular/compiler-cli, @angular-devkit/build-angular in devDependencies
  * Use ~ for patch version flexibility (e.g., "~18.2.0" not "18.0.0")
- For React: include react, react-dom, react-scripts (or vite), all necessary loaders
- For Spring Boot: include all spring-boot-starter dependencies, plugins, java version in pom.xml
- For Node.js: include express (or framework), all middleware, typescript if needed
- The generated project MUST be able to run with "npm install && npm start" without errors or peer dependency warnings
- Verify all imports in generated code files have corresponding dependencies
- Test versions against official package compatibility, not theoretical versions

${dependencyConfig ? `
CRITICAL INSTRUCTIONS FOR CONFIGURATIONS:
- Use the EXACT versions from compatibleVersions above
- Include ALL configuration files from the pre-configured list
- Ensure package.json includes the scripts provided above
- For linters: include both "lint" (check) and "lint:fix" (auto-fix) scripts
- For formatters: include both "format" (write) and "format:check" (check only) scripts
- Adjust script file patterns based on project structure:
  * Frontend: include html, css, scss files
  * Backend Node.js: focus on src/, api/, tests/ folders
  * TypeScript: include .ts, .tsx extensions
- Make configurations work together seamlessly
- Add any additional integration needed between configs
` : ''}

Output Format:
Return a JSON object with this structure:
{
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "content": "file content here"
    }
  ],
  "structure": {
    "description": "Brief description of the generated structure",
    "mainFiles": ["list of main files"],
    "setupInstructions": ["step by step setup"]
  }
}

Generate ONLY valid JSON. Do not include markdown code blocks or any other text.
Ensure all file contents are complete and production-ready.
Include inline comments in code files to explain key sections.
${dependencyConfig ? 'ENSURE all dependency configurations are properly integrated and compatible.' : ''}`;
}

/**
 * System message for AI providers
 */
export const SYSTEM_MESSAGE = 'You are an expert software architect who generates complete, production-ready project structures. Always respond with valid JSON only.';
