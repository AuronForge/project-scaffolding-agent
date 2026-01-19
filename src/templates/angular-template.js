/**
 * Angular Project Template
 * Based on official Angular CLI output
 */

export const ANGULAR_VERSIONS = {
  '18': {
    angular: '18.2.12',
    typescript: '5.4.5',
    rxjs: '7.8.1',
    zoneJs: '0.14.10',
    tslib: '2.8.1',
    nodeTypes: '20.17.10'
  },
  '17': {
    angular: '17.3.12',
    typescript: '5.2.2',
    rxjs: '7.8.1',
    zoneJs: '0.14.10',
    tslib: '2.8.1',
    nodeTypes: '20.17.10'
  },
  '16': {
    angular: '16.2.12',
    typescript: '5.1.6',
    rxjs: '7.8.1',
    zoneJs: '0.13.3',
    tslib: '2.6.3',
    nodeTypes: '18.19.67'
  }
};

export const ADDITIONAL_TOOLS_VERSIONS = {
  prettier: '3.4.2',
  eslint: '8.57.1',
  typescriptEslint: '7.18.0',
  husky: '9.1.7',
  lintStaged: '15.2.11',
  commitlintCli: '19.6.1',
  commitlintConfig: '19.6.0',
  commitizen: '4.3.1',
  czConventional: '3.3.0'
};

/**
 * Generate package.json for Angular project
 */
export function generateAngularPackageJson(projectName, version, additionalDeps = []) {
  const versions = ANGULAR_VERSIONS[version];
  if (!versions) {
    throw new Error(`Angular version ${version} not supported. Available: ${Object.keys(ANGULAR_VERSIONS).join(', ')}`);
  }

  const packageJson = {
    name: projectName,
    version: '0.0.0',
    scripts: {
      ng: 'ng',
      start: 'ng serve',
      build: 'ng build',
      watch: 'ng build --watch --configuration development',
      test: 'ng test'
    },
    private: true,
    dependencies: {
      '@angular/animations': `^${versions.angular}`,
      '@angular/common': `^${versions.angular}`,
      '@angular/compiler': `^${versions.angular}`,
      '@angular/core': `^${versions.angular}`,
      '@angular/forms': `^${versions.angular}`,
      '@angular/platform-browser': `^${versions.angular}`,
      '@angular/platform-browser-dynamic': `^${versions.angular}`,
      '@angular/router': `^${versions.angular}`,
      'rxjs': `^${versions.rxjs}`,
      'tslib': `^${versions.tslib}`,
      'zone.js': `^${versions.zoneJs}`
    },
    devDependencies: {
      '@angular-devkit/build-angular': `^${versions.angular}`,
      '@angular/cli': `^${versions.angular}`,
      '@angular/compiler-cli': `^${versions.angular}`,
      '@types/node': `^${versions.nodeTypes}`,
      'typescript': `~${versions.typescript}`
    }
  };

  // Add additional tools
  if (additionalDeps.includes('Prettier')) {
    packageJson.scripts.format = 'prettier --write "**/*.{ts,js,json,md,html,css,scss}"';
    packageJson.scripts['format:check'] = 'prettier --check "**/*.{ts,js,json,md,html,css,scss}"';
    packageJson.devDependencies.prettier = `^${ADDITIONAL_TOOLS_VERSIONS.prettier}`;
  }

  if (additionalDeps.includes('ESLint')) {
    packageJson.scripts.lint = 'eslint "src/**/*.ts"';
    packageJson.scripts['lint:fix'] = 'eslint "src/**/*.ts" --fix';
    packageJson.devDependencies.eslint = `^${ADDITIONAL_TOOLS_VERSIONS.eslint}`;
    packageJson.devDependencies['@typescript-eslint/eslint-plugin'] = `^${ADDITIONAL_TOOLS_VERSIONS.typescriptEslint}`;
    packageJson.devDependencies['@typescript-eslint/parser'] = `^${ADDITIONAL_TOOLS_VERSIONS.typescriptEslint}`;
  }

  if (additionalDeps.includes('Husky')) {
    packageJson.scripts.prepare = 'husky';
    packageJson.devDependencies.husky = `^${ADDITIONAL_TOOLS_VERSIONS.husky}`;
  }

  if (additionalDeps.includes('Lint-Staged')) {
    packageJson.devDependencies['lint-staged'] = `^${ADDITIONAL_TOOLS_VERSIONS.lintStaged}`;
    packageJson['lint-staged'] = {
      '*.{ts,js,json,md,html,css,scss}': ['prettier --write']
    };
    if (additionalDeps.includes('ESLint')) {
      packageJson['lint-staged']['*.ts'] = ['eslint --fix', 'prettier --write'];
    }
  }

  if (additionalDeps.includes('Commitlint')) {
    packageJson.devDependencies['@commitlint/cli'] = `^${ADDITIONAL_TOOLS_VERSIONS.commitlintCli}`;
    packageJson.devDependencies['@commitlint/config-conventional'] = `^${ADDITIONAL_TOOLS_VERSIONS.commitlintConfig}`;
  }

  if (additionalDeps.includes('Commitizen')) {
    packageJson.scripts.commit = 'cz';
    packageJson.devDependencies.commitizen = `^${ADDITIONAL_TOOLS_VERSIONS.commitizen}`;
    packageJson.devDependencies['cz-conventional-changelog'] = `^${ADDITIONAL_TOOLS_VERSIONS.czConventional}`;
    packageJson.config = {
      commitizen: {
        path: './node_modules/cz-conventional-changelog'
      }
    };
  }

  return packageJson;
}

/**
 * Generate angular.json configuration
 */
export function generateAngularJson(projectName) {
  return {
    "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
    "version": 1,
    "newProjectRoot": "projects",
    "projects": {
      [projectName]: {
        "projectType": "application",
        "schematics": {},
        "root": "",
        "sourceRoot": "src",
        "prefix": "app",
        "architect": {
          "build": {
            "builder": "@angular-devkit/build-angular:application",
            "options": {
              "outputPath": "dist/" + projectName,
              "index": "src/index.html",
              "browser": "src/main.ts",
              "polyfills": ["zone.js"],
              "tsConfig": "tsconfig.app.json",
              "assets": ["src/favicon.ico", "src/assets"],
              "styles": ["src/styles.css"],
              "scripts": []
            },
            "configurations": {
              "production": {
                "budgets": [{
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                }, {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }],
                "outputHashing": "all"
              },
              "development": {
                "optimization": false,
                "extractLicenses": false,
                "sourceMap": true
              }
            },
            "defaultConfiguration": "production"
          },
          "serve": {
            "builder": "@angular-devkit/build-angular:dev-server",
            "configurations": {
              "production": {
                "buildTarget": `${projectName}:build:production`
              },
              "development": {
                "buildTarget": `${projectName}:build:development`
              }
            },
            "defaultConfiguration": "development"
          },
          "extract-i18n": {
            "builder": "@angular-devkit/build-angular:extract-i18n",
            "options": {
              "buildTarget": `${projectName}:build`
            }
          },
          "test": {
            "builder": "@angular-devkit/build-angular:karma",
            "options": {
              "polyfills": ["zone.js", "zone.js/testing"],
              "tsConfig": "tsconfig.spec.json",
              "assets": ["src/favicon.ico", "src/assets"],
              "styles": ["src/styles.css"],
              "scripts": []
            }
          }
        }
      }
    }
  };
}

/**
 * Generate TypeScript configuration files
 */
export function generateTsConfig() {
  return {
    "tsconfig.json": {
      "compileOnSave": false,
      "compilerOptions": {
        "outDir": "./dist/out-tsc",
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "noImplicitOverride": true,
        "noPropertyAccessFromIndexSignature": true,
        "noImplicitReturns": true,
        "noFallthroughCasesInSwitch": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "sourceMap": true,
        "declaration": false,
        "experimentalDecorators": true,
        "moduleResolution": "bundler",
        "importHelpers": true,
        "target": "ES2022",
        "module": "ES2022",
        "lib": ["ES2022", "dom"]
      },
      "angularCompilerOptions": {
        "enableI18nLegacyMessageIdFormat": false,
        "strictInjectionParameters": true,
        "strictInputAccessModifiers": true,
        "strictTemplates": true
      }
    },
    "tsconfig.app.json": {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/app",
        "types": []
      },
      "files": ["src/main.ts"],
      "include": ["src/**/*.d.ts"]
    },
    "tsconfig.spec.json": {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/spec",
        "types": ["jasmine"]
      },
      "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
    }
  };
}

/**
 * Generate source files
 */
export function generateSourceFiles(projectName) {
  return {
    'src/index.html': `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${projectName}</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
</body>
</html>`,
    
    'src/main.ts': `import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));`,
    
    'src/styles.css': `/* You can add global styles to this file, and also import other style files */`,
    
    'src/app/app.config.ts': `import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};`,
    
    'src/app/app.routes.ts': `import { Routes } from '@angular/router';

export const routes: Routes = [];`,
    
    'src/app/app.component.ts': `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = '${projectName}';
}`,
    
    'src/app/app.component.html': `<main>
  <h1>Welcome to {{ title }}!</h1>
  <p>This is your Angular application. Start building amazing features!</p>
</main>
<router-outlet />`,
    
    'src/app/app.component.css': `:host {
  display: block;
  padding: 2rem;
}

h1 {
  color: #1976d2;
}`,
    
    'src/app/app.component.spec.ts': `import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(\`should have the '\${projectName}' title\`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('${projectName}');
  });
});`
  };
}

/**
 * Generate .gitignore
 */
export function generateGitignore() {
  return `.DS_Store
node_modules
/dist
/tmp
/out-tsc
/bazel-out

# IDEs
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*

# Miscellaneous
/.angular/cache
.sass-cache/
/connect.lock
/coverage
/libpeerconnection.log
testem.log
/typings

# System files
Thumbs.db`;
}

/**
 * Generate README
 */
export function generateReadme(projectName, description, version) {
  return `# ${projectName}

${description || 'An Angular application'}

This project was generated with Angular ${version}.

## Development server

Run \`npm start\` for a dev server. Navigate to \`http://localhost:4200/\`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run \`ng generate component component-name\` to generate a new component. You can also use \`ng generate directive|pipe|service|class|guard|interface|enum|module\`.

## Build

Run \`npm run build\` to build the project. The build artifacts will be stored in the \`dist/\` directory.

## Running unit tests

Run \`npm test\` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use \`ng help\` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.`;
}
