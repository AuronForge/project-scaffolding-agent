#!/usr/bin/env node
/**
 * Simplified test to check if private repository creation works
 */

import { config } from 'dotenv';
import { GitHubService } from '../src/services/github-service.js';

config();

async function testPrivateRepoSimple() {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    console.error('❌ GITHUB_TOKEN not found in environment');
    process.exit(1);
  }

  console.log('🔒 Testing Private Repository Creation\n');
  
  const githubService = new GitHubService(token);
  const repoName = 'test-private-repo-' + Date.now();
  
  try {
    console.log(`📦 Creating private repository: ${repoName}`);
    const repo = await githubService.createRepository({
      name: repoName,
      description: 'Test private repository',
      isPrivate: true,
    });
    
    console.log('✅ Repository created successfully!');
    console.log(`   Name: ${repo.name}`);
    console.log(`   Private: ${repo.private}`);
    console.log(`   URL: ${repo.html_url}`);
    console.log(`   Clone URL: ${repo.clone_url}`);
    
    console.log('\n⏳ Waiting 3 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📝 Testing file upload...');
    await githubService.createOrUpdateFile({
      owner: repo.owner.login,
      repo: repo.name,
      path: 'README.md',
      content: '# Test Private Repository\n\nThis is a test.',
      message: 'Initial commit',
      branch: 'main',
    });
    
    console.log('✅ File uploaded successfully!');
    console.log(`\n🎉 Private repository test PASSED!`);
    console.log(`\nRepository URL: ${repo.html_url}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status) {
      console.error(`   Status: ${error.status}`);
    }
    process.exit(1);
  }
}

testPrivateRepoSimple();
