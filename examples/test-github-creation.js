#!/usr/bin/env node
/**
 * Test script for GitHub project creation
 * This demonstrates how to create a project directly in a GitHub repository
 * 
 * Usage: GITHUB_TOKEN=your_token node examples/test-github-creation.js
 */

import { config } from 'dotenv';
import { ProjectScaffoldingAgent } from '../src/agents/scaffolding-agent.js';

config();

// Test project configuration for GitHub creation
const githubProject = {
  projectName: 'test-angular-github',
  front: 'Frontend',
  technology: 'Angular',
  version: '18',
  dependencies: [
    'Prettier',
    'ESLint',
    'Husky',
    'Lint-Staged',
    'Commitlint',
    'Commitizen'
  ],
  description: 'Test Angular project created on GitHub',
  includeTests: true,
  includeCICD: false,
  includeDocker: false,
  isPrivate: false, // Set to true to create a private repository
  // GitHub configuration
  repositoryUrl: 'https://github.com/Eduk29/test-angular-github',
  githubToken: process.env.GITHUB_TOKEN || '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'
};

async function testGitHubCreation() {
  console.log('🚀 Project Scaffolding Agent - GitHub Creation Test');
  console.log('━'.repeat(80));
  
  // Check environment variables
  const aiProvider = process.env.AI_PROVIDER || 'github';
  console.log(`\n🤖 AI Provider: ${aiProvider.toUpperCase()}`);
  
  if (!githubProject.githubToken) {
    console.error('\n❌ GITHUB_TOKEN not found');
    console.log('Please provide GITHUB_TOKEN as environment variable');
    console.log('Usage: GITHUB_TOKEN=your_token node examples/test-github-creation.js');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(80));
  console.log('🧪 Testing: GitHub Project Creation');
  console.log('='.repeat(80));
  console.log('\n📋 Project Input:');
  const displayProject = { ...githubProject, githubToken: '***hidden***' };
  console.log(JSON.stringify(displayProject, null, 2));

  try {
    console.log('\n⏳ Creating project on GitHub...');
    const startTime = Date.now();
    
    const agent = new ProjectScaffoldingAgent();
    const result = await agent.createProject(githubProject);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`✅ Project created successfully in ${duration}s\n`);
    console.log('📊 Result:');
    console.log(`Mode: ${result.mode}`);
    console.log(`Repository: ${result.repositoryUrl}`);
    console.log(`Files Created: ${result.filesCreated}`);
    
    if (result.dependencyConfig) {
      console.log('\n📦 Dependency Configuration:');
      console.log(JSON.stringify(result.dependencyConfig, null, 2));
    }
    
    console.log('\n📁 Files:');
    result.structure.slice(0, 15).forEach(file => {
      console.log(`  ✓ ${file.path}`);
    });
    if (result.structure.length > 15) {
      console.log(`  ... and ${result.structure.length - 15} more files`);
    }
    
    console.log('\n🎉 Success! Your project is available at:');
    console.log(`   ${result.repositoryUrl}`);
    console.log('\n💡 Next steps:');
    console.log(`   1. git clone ${result.repositoryUrl}`);
    console.log(`   2. cd ${githubProject.projectName}`);
    console.log('   3. npm install');
    console.log('   4. npm start');
    
  } catch (error) {
    console.error('\n❌ Error creating project:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testGitHubCreation().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
