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
  // Health check
  app.get('/api/health', (req, res) => projectController.healthCheck(req, res));

  // Project routes
  app.post('/api/projects', (req, res) => projectController.createProject(req, res));
  app.post('/api/projects/preview', (req, res) => projectController.previewProject(req, res));
  app.get('/api/projects/templates', (req, res) => projectController.getTemplates(req, res));

  // Legacy routes (for backward compatibility)
  app.post('/api/create-project', (req, res) => projectController.createProject(req, res));
  app.post('/api/preview-project', (req, res) => projectController.previewProject(req, res));
}
