/**
 * Server entry point
 * Starts the Express server for local development
 */
import { config } from 'dotenv';
import { createApp } from './app.js';

// Load environment variables
config();

const PORT = process.env.PORT || 3002;
const app = createApp();

app.listen(PORT, () => {
  console.log('🚀 Project Scaffolding Agent API');
  console.log('━'.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log('━'.repeat(50));
  console.log('\n📚 Available endpoints:');
  console.log(`  GET    /api/health`);
  console.log(`  POST   /api/projects`);
  console.log(`  POST   /api/projects/preview`);
  console.log(`  GET    /api/projects/templates`);
  console.log('\n💡 Press Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
