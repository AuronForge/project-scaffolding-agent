/**
 * Project Service
 * Business logic for project operations
 */
import { ProjectScaffoldingAgent } from '../agents/scaffolding-agent.js';
import { TemplateService } from './template-service.js';
import { ProjectRepository } from '../repositories/project.repository.js';

export class ProjectService {
  constructor() {
    this.agent = new ProjectScaffoldingAgent();
    this.templateService = new TemplateService();
    this.projectRepository = new ProjectRepository();
  }

  /**
   * Create a new project (GitHub or Local)
   * @param {Object} projectInput - Validated project input
   * @returns {Promise<Object>} Project creation result
   */
  async createProject(projectInput) {
    try {
      console.log('🚀 ProjectService: Creating project...');
      
      // Create project using the agent
      const result = await this.agent.createProject(projectInput);

      // Save project metadata to repository
      await this.projectRepository.save({
        name: projectInput.projectName,
        type: projectInput.front,
        technology: projectInput.technology,
        version: projectInput.version,
        mode: result.mode,
        repositoryUrl: result.repositoryUrl,
        localPath: result.localPath,
        filesCreated: result.filesCreated,
        isPrivate: projectInput.isPrivate || false,
        createdAt: new Date().toISOString(),
      });

      console.log('✅ ProjectService: Project created successfully');
      
      return {
        ...result,
        projectName: projectInput.projectName,
        createdAt: new Date().toISOString(),
      };

    } catch (error) {
      console.error('❌ ProjectService: Error creating project:', error);
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  /**
   * Generate project preview without creating
   * @param {Object} projectInput - Project configuration
   * @returns {Promise<Object>} Project structure preview
   */
  async previewProject(projectInput) {
    try {
      console.log('🔍 ProjectService: Generating project preview...');

      // Check if template is available
      const hasTemplate = this.templateService.hasTemplate(
        projectInput.technology,
        projectInput.version
      );

      // Generate structure preview
      let structure;
      if (hasTemplate) {
        const template = this.templateService.getTemplate(
          projectInput.technology,
          projectInput.version
        );
        structure = template.generate(projectInput);
      } else {
        // For AI-generated projects, provide estimated structure
        structure = await this._generateAIPreview(projectInput);
      }

      const preview = {
        projectName: projectInput.projectName,
        type: projectInput.front,
        technology: projectInput.technology,
        version: projectInput.version,
        generationMethod: hasTemplate ? 'template' : 'ai-generated',
        estimatedFiles: structure.files?.length || 0,
        structure: structure.files?.map(f => ({
          path: f.path,
          type: 'file',
        })) || [],
        dependencies: structure.dependencies || projectInput.dependencies || [],
        includeTests: projectInput.includeTests,
        includeCICD: projectInput.includeCICD,
        includeDocker: projectInput.includeDocker,
      };

      console.log('✅ ProjectService: Preview generated');
      return preview;

    } catch (error) {
      console.error('❌ ProjectService: Error generating preview:', error);
      throw new Error(`Failed to generate preview: ${error.message}`);
    }
  }

  /**
   * Get available project templates
   * @returns {Promise<Array>} List of available templates
   */
  async getAvailableTemplates() {
    try {
      const templates = this.templateService.listAvailableTemplates();
      
      return templates.map(template => ({
        technology: template.technology,
        version: template.version,
        type: template.type,
        description: template.description,
        features: template.features || [],
      }));

    } catch (error) {
      console.error('❌ ProjectService: Error getting templates:', error);
      throw new Error(`Failed to get templates: ${error.message}`);
    }
  }

  /**
   * Generate AI-based preview structure
   * @private
   */
  async _generateAIPreview(projectInput) {
    // This is a simplified preview - actual AI generation happens during creation
    const baseFiles = [
      'package.json',
      'README.md',
      '.gitignore',
    ];

    if (projectInput.includeTests) {
      baseFiles.push('tests/sample.test.js');
    }

    if (projectInput.includeCICD) {
      baseFiles.push('.github/workflows/ci.yml');
    }

    if (projectInput.includeDocker) {
      baseFiles.push('Dockerfile', 'docker-compose.yml');
    }

    return {
      files: baseFiles.map(path => ({ path })),
      dependencies: projectInput.dependencies || [],
    };
  }
}
