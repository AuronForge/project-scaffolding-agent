#!/usr/bin/env node
/**
 * Test script for creating a PRIVATE GitHub repository
 * This demonstrates how to create a private project repository
 * 
 * Usage: node examples/test-private-repo-creation.js
 */

import { config } from 'dotenv';
import { ProjectScaffoldingAgent } from '../src/agents/scaffolding-agent.js';

config();

// Test project configuration for PRIVATE GitHub repository
const privateProject = {
  projectName: 'my-private-nodejs-api',
  front: 'Backend',
  technology: 'Node.js',
  version: '20',
  dependencies: [
    'Express',
    'Prisma',
    'Jest',
    'ESLint',
    'Prettier'
  ],
  description: 'Private test project - Node.js API with Express and Prisma',
  includeTests: true,
  includeCICD: true,
  includeDocker: true,
  isPrivate: true, // 🔒 Creating a PRIVATE repository
  // GitHub configuration  
  // NOTE: The repository will be created in YOUR account (token owner)
  // Update the URL to match your GitHub username
  repositoryUrl: 'https://github.com/Eduk29/my-private-nodejs-api',
  githubToken: process.env.GITHUB_TOKEN
};

async function testPrivateRepoCreation() {
  console.log('🔒 Project Scaffolding Agent - Private Repository Creation Test');
  console.log('━'.repeat(80));
  
  // Check environment variables
  const aiProvider = process.env.AI_PROVIDER || 'github';
  console.log(`\n🤖 AI Provider: ${aiProvider.toUpperCase()}`);
  
  if (!privateProject.githubToken) {
    console.error('\n❌ GITHUB_TOKEN not found');
    console.log('Please set GITHUB_TOKEN in .env file or as environment variable');
    console.log('Example: GITHUB_TOKEN=ghp_your_token_here node examples/test-private-repo-creation.js');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(80));
  console.log('🧪 Testing: PRIVATE GitHub Repository Creation');
  console.log('='.repeat(80));
  console.log('\n📋 Project Input:');
  const displayProject = { ...privateProject, githubToken: '***hidden***' };
  console.log(JSON.stringify(displayProject, null, 2));

  try {
    console.log('\n⏳ Creating PRIVATE project on GitHub...');
    console.log('🔒 Note: The repository will be PRIVATE (not visible to others)');
    
    const startTime = Date.now();
    const agent = new ProjectScaffoldingAgent();
    const result = await agent.createProject(privateProject);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n' + '✅'.repeat(40));
    console.log('✅ SUCCESS - Private Repository Created!');
    console.log('✅'.repeat(40));
    
    console.log('\n📊 Result Summary:');
    console.log(`   Repository: ${result.repositoryUrl}`);
    console.log(`   Visibility: 🔒 PRIVATE`);
    console.log(`   Files Created: ${result.filesCount}`);
    console.log(`   Duration: ${duration}s`);
    
    console.log('\n📁 Project Structure:');
    result.files.slice(0, 15).forEach(file => {
      console.log(`   ├─ ${file}`);
    });
    if (result.filesCount > 15) {
      console.log(`   └─ ... and ${result.filesCount - 15} more files`);
    }

    console.log('\n🔒 Private Repository Details:');
    console.log(`   • Only you (and collaborators you add) can see this repository`);
    console.log(`   • The repository is not visible in public searches`);
    console.log(`   • You can change visibility later in repository settings`);

    console.log('\n🚀 Next Steps:');
    console.log(`   1. Clone the repository:`);
    console.log(`      git clone ${result.repositoryUrl}`);
    console.log(`   2. Navigate to the project:`);
    console.log(`      cd ${privateProject.projectName}`);
    console.log(`   3. Install dependencies:`);
    console.log(`      npm install`);
    console.log(`   4. Start development:`);
    console.log(`      npm run dev`);

    console.log('\n💡 Repository Management:');
    console.log(`   • View online: ${result.repositoryUrl}`);
    console.log(`   • Settings: ${result.repositoryUrl}/settings`);
    console.log(`   • Add collaborators: ${result.repositoryUrl}/settings/access`);
    console.log(`   • Change visibility: ${result.repositoryUrl}/settings (scroll to "Danger Zone")`);

    return result;

  } catch (error) {
    console.error('\n❌ Error creating private repository:');
    console.error(error.message);
    
    if (error.message.includes('validation')) {
      console.log('\n💡 Validation Error - Check your input:');
      console.log('   • Ensure all required fields are provided');
      console.log('   • Verify repository URL format');
      console.log('   • Check that GitHub token is valid');
    } else if (error.message.includes('already exists')) {
      console.log('\n💡 Repository already exists');
      console.log('   • Try a different repository name');
      console.log('   • Or delete the existing repository first');
    } else if (error.message.includes('token')) {
      console.log('\n💡 GitHub Token Error:');
      console.log('   • Verify your token has correct permissions');
      console.log('   • Token needs: repo (full control)');
      console.log('   • Generate new token: https://github.com/settings/tokens');
    }
    
    throw error;
  }
}

// Run the test
testPrivateRepoCreation()
  .then(() => {
    console.log('\n✅ Test completed successfully!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed!\n');
    process.exit(1);
  });
