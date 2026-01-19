/**
 * Project Repository
 * Data access layer for project metadata
 */
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProjectRepository {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.projectsFile = path.join(this.dataDir, 'projects.json');
  }

  /**
   * Initialize data directory and file
   * @private
   */
  async _initialize() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
      
      try {
        await fs.access(this.projectsFile);
      } catch {
        // File doesn't exist, create it
        await fs.writeFile(this.projectsFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('Error initializing repository:', error);
    }
  }

  /**
   * Save project metadata
   * @param {Object} project - Project metadata
   * @returns {Promise<Object>} Saved project
   */
  async save(project) {
    try {
      await this._initialize();

      const projects = await this.findAll();
      
      const newProject = {
        id: this._generateId(),
        ...project,
        createdAt: project.createdAt || new Date().toISOString(),
      };

      projects.push(newProject);

      await fs.writeFile(
        this.projectsFile,
        JSON.stringify(projects, null, 2)
      );

      return newProject;

    } catch (error) {
      console.error('Error saving project:', error);
      throw new Error(`Failed to save project: ${error.message}`);
    }
  }

  /**
   * Find all projects
   * @returns {Promise<Array>} List of projects
   */
  async findAll() {
    try {
      await this._initialize();

      const data = await fs.readFile(this.projectsFile, 'utf-8');
      return JSON.parse(data);

    } catch (error) {
      console.error('Error reading projects:', error);
      return [];
    }
  }

  /**
   * Find project by ID
   * @param {string} id - Project ID
   * @returns {Promise<Object|null>} Project or null
   */
  async findById(id) {
    try {
      const projects = await this.findAll();
      return projects.find(p => p.id === id) || null;

    } catch (error) {
      console.error('Error finding project:', error);
      return null;
    }
  }

  /**
   * Find projects by name
   * @param {string} name - Project name
   * @returns {Promise<Array>} List of matching projects
   */
  async findByName(name) {
    try {
      const projects = await this.findAll();
      return projects.filter(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
      );

    } catch (error) {
      console.error('Error finding projects by name:', error);
      return [];
    }
  }

  /**
   * Delete project by ID
   * @param {string} id - Project ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteById(id) {
    try {
      const projects = await this.findAll();
      const filtered = projects.filter(p => p.id !== id);

      if (filtered.length === projects.length) {
        return false; // Project not found
      }

      await fs.writeFile(
        this.projectsFile,
        JSON.stringify(filtered, null, 2)
      );

      return true;

    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  /**
   * Get statistics
   * @returns {Promise<Object>} Repository statistics
   */
  async getStats() {
    try {
      const projects = await this.findAll();

      const stats = {
        total: projects.length,
        byMode: {
          github: projects.filter(p => p.mode === 'github').length,
          local: projects.filter(p => p.mode === 'local').length,
        },
        byType: {},
        byTechnology: {},
        private: projects.filter(p => p.isPrivate).length,
        public: projects.filter(p => !p.isPrivate).length,
      };

      // Count by type
      projects.forEach(p => {
        stats.byType[p.type] = (stats.byType[p.type] || 0) + 1;
        stats.byTechnology[p.technology] = (stats.byTechnology[p.technology] || 0) + 1;
      });

      return stats;

    } catch (error) {
      console.error('Error getting stats:', error);
      return null;
    }
  }

  /**
   * Generate unique ID
   * @private
   */
  _generateId() {
    return `prj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
