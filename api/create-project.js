import { ProjectScaffoldingAgent } from '../agents/scaffolding-agent.js';

/**
 * API Handler for creating projects
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

    // Validate required fields
    if (!projectInput) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required',
      });
    }

    // Get AI provider from header or use default
    const provider = req.headers['x-ai-provider'] || 'github';

    console.log(`📦 Creating project: ${projectInput.projectName}`);
    console.log(`🤖 Using provider: ${provider}`);

    // Create agent and generate project
    const agent = new ProjectScaffoldingAgent(provider);
    const result = await agent.createProject(projectInput);

    // Return appropriate status code
    if (result.success) {
      const mode = result.data.mode;
      const location = mode === 'github' 
        ? result.data.repositoryUrl 
        : result.data.projectPath;
      
      console.log(`✅ Project created successfully (${mode}): ${location}`);
      return res.status(201).json(result);
    } else {
      console.error(`❌ Project creation failed: ${result.error}`);
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      metadata: {
        agent: 'Project Scaffolding Agent',
        failedAt: new Date().toISOString(),
      },
    });
  }
}
