import { ProjectController } from '../../../src/controllers/project.controller.js';

const projectController = new ProjectController();

/**
 * API Handler for getting templates
 * Endpoint: GET /api/v1/projects/templates
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  // Use controller
  return projectController.getTemplates(req, res);
}
