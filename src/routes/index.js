/**
 * Main router
 * Combines all application routes
 */
import { ProjectController } from '../controllers/project.controller.js';

const projectController = new ProjectController();

/**
 * Setup routes for the application
 * @param {Object} app - Express app instance
 */
export function setupRoutes(app) {
  // Root redirect to API documentation
  app.get('/', (_req, res) => {
    res.redirect('/api/v1/api-docs');
  });

  // Health check
  app.get('/api/v1/health', (req, res) => projectController.healthCheck(req, res));

  // Project routes
  app.post('/api/v1/projects', (req, res) => projectController.createProject(req, res));
  app.post('/api/v1/projects/preview', (req, res) => projectController.previewProject(req, res));
  app.get('/api/v1/projects/templates', (req, res) => projectController.getTemplates(req, res));

  // Legacy routes (for backward compatibility)
  app.post('/api/v1/create-project', (req, res) => projectController.createProject(req, res));
  app.post('/api/v1/preview-project', (req, res) => projectController.previewProject(req, res));
}
