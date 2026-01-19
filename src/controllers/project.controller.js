/**
 * Project Controller
 * Handles HTTP requests for project operations
 */
import { ProjectService } from '../services/project.service.js';
import { projectInputSchema } from '../schemas/project-input-schema.js';

export class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
  }

  /**
   * Create a new project
   * POST /api/projects
   */
  async createProject(req, res) {
    try {
      const projectInput = req.body;

      // Validate input
      const validation = projectInputSchema.safeParse(projectInput);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Create project
      const result = await this.projectService.createProject(validation.data);

      return res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: result,
      });

    } catch (error) {
      console.error('Error in createProject controller:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Preview project structure without creating
   * POST /api/projects/preview
   */
  async previewProject(req, res) {
    try {
      const projectInput = req.body;

      // For preview, we don't require GitHub or local path
      // Just validate basic fields
      if (!projectInput.projectName || !projectInput.front || 
          !projectInput.technology || !projectInput.version) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: projectName, front, technology, version',
        });
      }

      // Generate preview
      const result = await this.projectService.previewProject(projectInput);

      return res.status(200).json({
        success: true,
        message: 'Project preview generated',
        data: result,
      });

    } catch (error) {
      console.error('Error in previewProject controller:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Get project templates
   * GET /api/projects/templates
   */
  async getTemplates(req, res) {
    try {
      const templates = await this.projectService.getAvailableTemplates();

      return res.status(200).json({
        success: true,
        data: templates,
      });

    } catch (error) {
      console.error('Error in getTemplates controller:', error);
      
      return res.status(500).json({
        success: false,
        error: error.message || 'Internal server error',
      });
    }
  }

  /**
   * Health check endpoint
   * GET /api/health
   */
  async healthCheck(req, res) {
    return res.status(200).json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  }
}
