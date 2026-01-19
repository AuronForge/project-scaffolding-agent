#!/usr/bin/env node
/**
 * Direct test of the updated controller
 */
import { ProjectController } from './src/controllers/project.controller.js';

const controller = new ProjectController();

// Mock request and response
const mockReq = {
  body: {
    projectName: 'test-api',
    front: 'Backend',
    technology: 'Node.js',
    version: '20',
  }
};

const mockRes = {
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    console.log('Status:', this.statusCode);
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

console.log('🧪 Testing ProjectController.previewProject directly...\n');
console.log('Request body:', JSON.stringify(mockReq.body, null, 2));
console.log('\n---\n');

await controller.previewProject(mockReq, mockRes);
