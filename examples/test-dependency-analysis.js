#!/usr/bin/env node
/**
 * Test script for dependency analysis
 * This demonstrates how the AI analyzes dependencies and generates compatible configurations
 * 
 * Usage: node examples/test-dependency-analysis.js
 */

import { config } from 'dotenv';
import { ScaffoldingAgent } from '../src/agents/scaffolding-agent.js';

config();

// Example 1: Angular 18 with development tools
const angularProject = {
  projectName: 'my-angular-app',
  front: 'Frontend',
  technology: 'Angular',
  version: '18',
  dependencies: [
    'Prettier',
    'ESLint',
    'Husky',
    'Lint-Staged',
    'Commitlint'
  ],
  description: 'Modern Angular 18 application with code quality tools',
  includeTests: true,
  includeCICD: true,
  includeDocker: false
};

// Example 2: React with TypeScript
const reactProject = {
  projectName: 'my-react-app',
  front: 'Frontend',
  technology: 'React',
  version: '18',
  dependencies: [
    'TypeScript',
    'Prettier',
    'ESLint',
    'Jest',
    'Testing Library'
  ],
  description: 'React 18 application with TypeScript and testing setup',
  includeTests: true,
  includeCICD: false,
  includeDocker: true
};

// Example 3: Spring Boot Backend
const springProject = {
  projectName: 'my-spring-api',
  front: 'Backend',
  technology: 'Spring Boot',
  version: '3.2',
  dependencies: [
    'Spring Web',
    'Spring Data JPA',
    'PostgreSQL',
    'Lombok',
    'MapStruct'
  ],
  description: 'Spring Boot REST API with JPA and PostgreSQL',
  includeTests: true,
  includeCICD: true,
  includeDocker: true
};

async function testDependencyAnalysis(projectInput, exampleName) {
  console.log('\n' + '='.repeat(80));
  console.log(`🧪 Testing: ${exampleName}`);
  console.log('='.repeat(80));
  console.log('\n📋 Project Input:');
  console.log(JSON.stringify(projectInput, null, 2));

  try {
    const agent = new ScaffoldingAgent();
    
    console.log('\n⏳ Analyzing dependencies and generating project preview...');
    const startTime = Date.now();
    
    const result = await agent.previewProject(projectInput);
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✅ Analysis completed in ${duration}s`);
    
    console.log('\n📊 Dependency Configuration:');
    console.log(JSON.stringify(result.dependencyConfiguration, null, 2));
    
    console.log('\n📁 Project Structure:');
    console.log(`Total files: ${result.structure.filesCount}`);
    result.structure.files.slice(0, 10).forEach(file => {
      console.log(`  ${file.path} (${file.size} bytes)`);
    });
    
    if (result.structure.files.length > 10) {
      console.log(`  ... and ${result.structure.files.length - 10} more files`);
    }
    
    return { success: true, result };
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
    return { success: false, error };
  }
}

async function runTests() {
  console.log('🚀 Project Scaffolding Agent - Dependency Analysis Test');
  console.log('━'.repeat(80));
  
  // Check environment variables
  const aiProvider = process.env.AI_PROVIDER || 'github';
  console.log(`\n🤖 AI Provider: ${aiProvider.toUpperCase()}`);
  
  if (aiProvider === 'github' && !process.env.GITHUB_TOKEN) {
    console.error('\n❌ GITHUB_TOKEN not found in environment variables');
    console.log('Please set GITHUB_TOKEN in your .env file');
    process.exit(1);
  }
  
  if (aiProvider === 'openai' && !process.env.OPENAI_API_KEY) {
    console.error('\n❌ OPENAI_API_KEY not found in environment variables');
    console.log('Please set OPENAI_API_KEY in your .env file');
    process.exit(1);
  }
  
  if (aiProvider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    console.error('\n❌ ANTHROPIC_API_KEY not found in environment variables');
    console.log('Please set ANTHROPIC_API_KEY in your .env file');
    process.exit(1);
  }

  const results = [];

  // Test Angular project
  results.push(await testDependencyAnalysis(angularProject, 'Angular 18 with Development Tools'));

  // Uncomment to test other projects
  // results.push(await testDependencyAnalysis(reactProject, 'React 18 with TypeScript'));
  // results.push(await testDependencyAnalysis(springProject, 'Spring Boot 3.2 API'));

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Test Summary');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`\n✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Total: ${results.length}`);
  
  if (failed > 0) {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 All tests passed!');
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});
