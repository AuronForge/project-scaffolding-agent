import * as angularTemplate from '../templates/angular-template.js';

/**
 * Template-based Project Generation Service
 * Uses fixed, tested templates instead of AI for project structure
 */
export class TemplateService {
  /**
   * Check if technology has a template
   */
  hasTemplate(technology) {
    const templates = ['Angular', 'React', 'Vue'];
    return templates.includes(technology);
  }

  /**
   * Generate project from template
   */
  async generateFromTemplate(config) {
    const { technology, version, projectName, description, dependencies } = config;

    switch (technology) {
      case 'Angular':
        return this.generateAngularProject(projectName, version, description, dependencies);
      
      case 'React':
        // TODO: Implement React template
        throw new Error('React template not yet implemented');
      
      case 'Vue':
        // TODO: Implement Vue template
        throw new Error('Vue template not yet implemented');
      
      default:
        throw new Error(`No template available for ${technology}`);
    }
  }

  /**
   * Generate Angular project from template
   */
  generateAngularProject(projectName, version, description, dependencies = []) {
    const files = [];

    // 1. Generate package.json with tested versions
    const packageJson = angularTemplate.generateAngularPackageJson(
      projectName,
      version,
      dependencies
    );
    files.push({
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2)
    });

    // 2. Generate angular.json
    const angularJson = angularTemplate.generateAngularJson(projectName);
    files.push({
      path: 'angular.json',
      content: JSON.stringify(angularJson, null, 2)
    });

    // 3. Generate TypeScript configs
    const tsConfigs = angularTemplate.generateTsConfig();
    Object.entries(tsConfigs).forEach(([filename, content]) => {
      files.push({
        path: filename,
        content: JSON.stringify(content, null, 2)
      });
    });

    // 4. Generate source files
    const sourceFiles = angularTemplate.generateSourceFiles(projectName);
    Object.entries(sourceFiles).forEach(([path, content]) => {
      files.push({ path, content });
    });

    // 5. Generate .gitignore
    files.push({
      path: '.gitignore',
      content: angularTemplate.generateGitignore()
    });

    // 6. Generate README
    files.push({
      path: 'README.md',
      content: angularTemplate.generateReadme(projectName, description, version)
    });

    return {
      files,
      frameworkVersion: angularTemplate.ANGULAR_VERSIONS[version],
      toolsVersions: angularTemplate.ADDITIONAL_TOOLS_VERSIONS
    };
  }

  /**
   * Generate additional tool configurations using AI
   * This is where AI is still useful - for configs of Prettier, ESLint, etc.
   */
  async generateToolConfigurations(dependencies, aiService) {
    const configs = [];

    if (dependencies.includes('Prettier')) {
      configs.push({
        filename: '.prettierrc',
        content: JSON.stringify({
          semi: true,
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 100,
          tabWidth: 2
        }, null, 2),
        description: 'Prettier configuration'
      });

      configs.push({
        filename: '.prettierignore',
        content: `node_modules
dist
coverage
.angular`,
        description: 'Prettier ignore file'
      });
    }

    if (dependencies.includes('ESLint')) {
      configs.push({
        filename: '.eslintrc.json',
        content: JSON.stringify({
          root: true,
          ignorePatterns: ['dist', 'node_modules'],
          overrides: [
            {
              files: ['*.ts'],
              parser: '@typescript-eslint/parser',
              parserOptions: {
                project: ['tsconfig.json'],
                createDefaultProgram: true
              },
              extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended'
              ],
              rules: {
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
              }
            }
          ]
        }, null, 2),
        description: 'ESLint configuration'
      });
    }

    if (dependencies.includes('Husky')) {
      configs.push({
        filename: '.husky/pre-commit',
        content: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

${dependencies.includes('Lint-Staged') ? 'npx lint-staged' : 'npm run lint && npm run format:check'}
`,
        description: 'Pre-commit hook'
      });

      configs.push({
        filename: '.husky/_/husky.sh',
        content: `#!/usr/bin/env sh
# Husky initialization script
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  if [ $exitCode = 127 ]; then
    echo "husky - command not found in PATH=$PATH"
  fi

  exit $exitCode
fi
`,
        description: 'Husky initialization script'
      });
    }

    if (dependencies.includes('Commitlint')) {
      configs.push({
        filename: 'commitlint.config.js',
        content: `module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ]
  }
};
`,
        description: 'Commitlint configuration'
      });

      if (dependencies.includes('Husky')) {
        configs.push({
          filename: '.husky/commit-msg',
          content: `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
`,
          description: 'Commit message hook'
        });
      }
    }

    if (dependencies.includes('Commitizen')) {
      configs.push({
        filename: '.czrc',
        content: JSON.stringify({
          path: 'cz-conventional-changelog'
        }, null, 2),
        description: 'Commitizen configuration'
      });
    }

    return configs;
  }

  /**
   * List all available templates
   * @returns {Array} List of available templates
   */
  listAvailableTemplates() {
    return [
      {
        technology: 'Angular',
        version: '18',
        type: 'Frontend',
        description: 'Angular frontend application with TypeScript',
        features: ['TypeScript', 'Routing', 'Forms', 'HTTP Client', 'Testing'],
      },
      {
        technology: 'React',
        version: '18',
        type: 'Frontend',
        description: 'React frontend application (Coming soon)',
        features: ['JSX', 'Hooks', 'Context API', 'React Router'],
        available: false,
      },
      {
        technology: 'Vue',
        version: '3',
        type: 'Frontend',
        description: 'Vue.js frontend application (Coming soon)',
        features: ['Composition API', 'Vue Router', 'Pinia'],
        available: false,
      },
    ];
  }

  /**
   * Get specific template information
   * @param {string} technology - Technology name
   * @param {string} version - Version
   * @returns {Object|null} Template information or null
   */
  getTemplate(technology, version) {
    const templates = this.listAvailableTemplates();
    return templates.find(t => 
      t.technology === technology && 
      t.version === version
    ) || null;
  }
}
