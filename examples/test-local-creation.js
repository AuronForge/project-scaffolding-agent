#!/usr/bin/env node
/**
 * Test script for local project creation
 * This demonstrates how to create a project in a local directory without GitHub
 * 
 * Usage: node examples/test-local-creation.js
 */

import { config } from 'dotenv';
import { ProjectScaffoldingAgent } from '../src/agents/scaffolding-agent.js';
import path from 'path';
import { fileURLToPath } from 'url';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test project configuration for local creation
const localProject = {
  projectName: 'test-angular-local',
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
  description: 'Test Angular project created locally',
  includeTests: true,
  includeCICD: false,
  includeDocker: false,
  // Local path - will create project in examples/output directory
  localPath: path.join(__dirname, 'output')
};

async function testLocalCreation() {
  console.log('🚀 Project Scaffolding Agent - Local Creation Test');
  console.log('━'.repeat(80));
  
  // Check environment variables
  const aiProvider = process.env.AI_PROVIDER || 'github';
  console.log(`\n🤖 AI Provider: ${aiProvider.toUpperCase()}`);
  
  if (aiProvider === 'github' && !process.env.GITHUB_TOKEN) {
    console.error('\n❌ GITHUB_TOKEN not found in environment variables');
    console.log('Please set GITHUB_TOKEN in your .env file');
    process.exit(1);
  }

  console.log('\n' + '='.repeat(80));
  console.log('🧪 Testing: Local Project Creation');
  console.log('='.repeat(80));
  console.log('\n📋 Project Input:');
  console.log(JSON.stringify(localProject, null, 2));

  try {
    const agent = new ProjectScaffoldingAgent(aiProvider);
    
    console.log('\n⏳ Creating project locally...');
    const startTime = Date.now();
    
    const result = await agent.createProject(localProject);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (result.success) {
      console.log(`\n✅ Project created successfully in ${duration}s`);
      
      console.log('\n📊 Result:');
      console.log(`Mode: ${result.data.mode}`);
      console.log(`Path: ${result.data.projectPath}`);
      console.log(`Files Created: ${result.data.filesCreated}`);
      
      if (result.data.dependencyConfiguration) {
        console.log('\n📦 Dependency Configuration:');
        console.log(JSON.stringify(result.data.dependencyConfiguration, null, 2));
      }
      
      console.log('\n📁 Files:');
      result.data.files.slice(0, 15).forEach(file => {
        console.log(`  ✓ ${file}`);
      });
      
      if (result.data.files.length > 15) {
        console.log(`  ... and ${result.data.files.length - 15} more files`);
      }
      
      console.log('\n🎉 Success! You can now navigate to:');
      console.log(`   ${result.data.projectPath}`);
      console.log('\n💡 Next steps:');
      console.log('   1. cd ' + result.data.projectPath);
      console.log('   2. npm install');
      console.log('   3. npm start');
      
    } else {
      console.error('\n❌ Error:', result.error);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    process.exit(1);
  }
}

// Run test
testLocalCreation().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
