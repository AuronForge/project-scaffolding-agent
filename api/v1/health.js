/**
 * Vercel Serverless Function for health check
 * Endpoint: GET /api/v1/health
 */
import { ProjectController } from '../../src/controllers/project.controller.js';

const projectController = new ProjectController();

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
  return projectController.healthCheck(req, res);
}
