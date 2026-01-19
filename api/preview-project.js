import { ProjectScaffoldingAgent } from '../agents/scaffolding-agent.js';

/**
 * API Handler for previewing project structure
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-ai-provider');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    });
  }

  try {
    const projectInput = req.body;

    // Get AI provider from header or use default
    const provider = req.headers['x-ai-provider'] || 'github';

    console.log(`🔍 Previewing project: ${projectInput.projectName}`);

    // Create agent and preview project
    const agent = new ProjectScaffoldingAgent(provider);
    const result = await agent.previewProject(projectInput);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
