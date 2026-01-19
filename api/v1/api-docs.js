import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../swagger.js';

/**
 * Swagger UI Documentation Endpoint
 * Endpoint: GET /api/v1/api-docs
 */
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Generate Swagger UI HTML
  const html = swaggerUi.generateHTML(swaggerSpec, {
    customSiteTitle: 'Project Scaffolding Agent API',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
