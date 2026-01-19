import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project Scaffolding Agent API',
      version: '1.0.0',
      description:
        'AI-powered agent that generates production-ready project structures and publishes them to GitHub or creates them locally. Supports multiple frameworks (Angular, React, Vue, Node.js, Spring Boot) with customizable templates and dependencies.',
      contact: {
        name: 'API Support',
        url: 'https://github.com/AuronForge/project-scaffolding-agent',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://project-scaffolding-agent.vercel.app/api/v1',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Projects',
        description: 'Project creation and preview endpoints',
      },
      {
        name: 'Templates',
        description: 'Available project templates',
      },
    ],
    components: {
      schemas: {
        ProjectInput: {
          type: 'object',
          required: ['projectName', 'front', 'technology', 'version'],
          properties: {
            projectName: {
              type: 'string',
              description: 'Project name (kebab-case recommended)',
              example: 'my-awesome-app',
            },
            front: {
              type: 'string',
              enum: ['Frontend', 'Backend', 'Fullstack'],
              description: 'Project type',
              example: 'Backend',
            },
            technology: {
              type: 'string',
              description: 'Main technology/framework',
              example: 'Node.js',
            },
            version: {
              type: 'string',
              description: 'Technology version',
              example: '20',
            },
            dependencies: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Additional dependencies to include',
              example: ['Express', 'Prisma', 'Jest'],
            },
            description: {
              type: 'string',
              description: 'Project description',
              example: 'My awesome Node.js API',
            },
            includeTests: {
              type: 'boolean',
              description: 'Include test setup',
              default: false,
            },
            includeCICD: {
              type: 'boolean',
              description: 'Include CI/CD configuration',
              default: false,
            },
            includeDocker: {
              type: 'boolean',
              description: 'Include Docker configuration',
              default: false,
            },
            localPath: {
              type: 'string',
              description: 'Local path for project creation (use this OR repositoryUrl)',
              example: 'C:/projects',
            },
            repositoryUrl: {
              type: 'string',
              description: 'GitHub repository URL (use this OR localPath)',
              example: 'https://github.com/username/my-awesome-app',
            },
            githubToken: {
              type: 'string',
              description: 'GitHub personal access token (required with repositoryUrl)',
              example: 'ghp_xxxxxxxxxxxxxxxxxxxx',
            },
            isPrivate: {
              type: 'boolean',
              description: 'Create private GitHub repository',
              default: false,
            },
          },
        },
        FileStructure: {
          type: 'object',
          properties: {
            path: {
              type: 'string',
              description: 'File or directory path',
              example: 'src/index.js',
            },
            type: {
              type: 'string',
              enum: ['file', 'directory'],
              description: 'Resource type',
              example: 'file',
            },
            content: {
              type: 'string',
              description: 'File content (only for files)',
            },
          },
        },
        ProjectResult: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              example: 'my-awesome-app',
            },
            mode: {
              type: 'string',
              enum: ['github', 'local'],
              example: 'github',
            },
            repositoryUrl: {
              type: 'string',
              example: 'https://github.com/username/my-awesome-app',
            },
            localPath: {
              type: 'string',
              example: 'C:/projects/my-awesome-app',
            },
            filesCreated: {
              type: 'integer',
              example: 15,
            },
            structure: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FileStructure',
              },
            },
            generationMethod: {
              type: 'string',
              enum: ['template', 'ai-generated'],
              example: 'template',
            },
            dependencyConfig: {
              type: 'object',
              description: 'Dependency configuration details',
            },
          },
        },
        ProjectPreview: {
          type: 'object',
          properties: {
            projectName: {
              type: 'string',
              example: 'my-awesome-app',
            },
            type: {
              type: 'string',
              example: 'Backend',
            },
            technology: {
              type: 'string',
              example: 'Node.js',
            },
            version: {
              type: 'string',
              example: '20',
            },
            generationMethod: {
              type: 'string',
              enum: ['template-based', 'ai-generated'],
              example: 'template-based',
            },
            estimatedFiles: {
              type: 'integer',
              example: 12,
            },
            structure: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FileStructure',
              },
            },
            dependencies: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Express', 'Prisma', 'Jest'],
            },
          },
        },
        Template: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Angular',
            },
            type: {
              type: 'string',
              example: 'Frontend',
            },
            description: {
              type: 'string',
              example: 'Angular framework with TypeScript',
            },
            features: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['TypeScript', 'Component-based', 'Dependency Injection'],
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Invalid input data',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
          },
        },
      },
    },
  },
  apis: ['./api/*.js', './src/**/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
