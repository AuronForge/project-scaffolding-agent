import fs from 'fs/promises';
import path from 'path';

/**
 * Service for local filesystem operations
 */
export class FileSystemService {
  /**
   * Create project files in a local directory
   * @param {string} basePath - The base directory path where the project will be created
   * @param {string} projectName - The name of the project (used as subdirectory name)
   * @param {Array<{path: string, content: string}>} files - Array of files to create
   * @returns {Promise<{path: string, filesCreated: number}>}
   */
  async createProjectLocally({ basePath, projectName, files }) {
    try {
      // Resolve and normalize the base path
      const resolvedBasePath = path.resolve(basePath);
      const projectPath = path.join(resolvedBasePath, projectName);

      // Check if directory already exists
      try {
        await fs.access(projectPath);
        throw new Error(`Directory already exists: ${projectPath}`);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error;
        }
        // Directory doesn't exist, which is what we want
      }

      // Create the project directory
      await fs.mkdir(projectPath, { recursive: true });

      // Create all files
      let filesCreated = 0;
      for (const file of files) {
        const filePath = path.join(projectPath, file.path);
        const fileDir = path.dirname(filePath);

        // Create directory if it doesn't exist
        await fs.mkdir(fileDir, { recursive: true });

        // Ensure content is a string
        const content = typeof file.content === 'string' 
          ? file.content 
          : JSON.stringify(file.content, null, 2);

        // Write file content
        await fs.writeFile(filePath, content, 'utf-8');
        filesCreated++;
      }

      return {
        path: projectPath,
        filesCreated,
      };
    } catch (error) {
      throw new Error(`Failed to create project locally: ${error.message}`);
    }
  }

  /**
   * Check if a directory exists and is writable
   * @param {string} dirPath - The directory path to check
   * @returns {Promise<{exists: boolean, writable: boolean}>}
   */
  async checkDirectory(dirPath) {
    try {
      const resolvedPath = path.resolve(dirPath);
      
      // Check if directory exists
      try {
        const stats = await fs.stat(resolvedPath);
        if (!stats.isDirectory()) {
          return { exists: false, writable: false, error: 'Path exists but is not a directory' };
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          return { exists: false, writable: false };
        }
        throw error;
      }

      // Check if directory is writable
      try {
        await fs.access(resolvedPath, fs.constants.W_OK);
        return { exists: true, writable: true };
      } catch (error) {
        return { exists: true, writable: false, error: 'Directory is not writable' };
      }
    } catch (error) {
      return { exists: false, writable: false, error: error.message };
    }
  }

  /**
   * Get the full resolved path
   * @param {string} basePath - The base path
   * @param {string} projectName - The project name
   * @returns {string} Full resolved path
   */
  getProjectPath(basePath, projectName) {
    return path.resolve(path.join(basePath, projectName));
  }

  /**
   * Delete a directory and all its contents (use with caution!)
   * @param {string} dirPath - The directory path to delete
   * @returns {Promise<void>}
   */
  async deleteDirectory(dirPath) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (error) {
      throw new Error(`Failed to delete directory: ${error.message}`);
    }
  }

  /**
   * List all files in a directory recursively
   * @param {string} dirPath - The directory path
   * @returns {Promise<Array<string>>} Array of file paths relative to dirPath
   */
  async listFiles(dirPath) {
    const files = [];
    
    async function traverse(currentPath, relativePath = '') {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.join(relativePath, entry.name);
        
        if (entry.isDirectory()) {
          await traverse(fullPath, relPath);
        } else {
          files.push(relPath);
        }
      }
    }
    
    await traverse(dirPath);
    return files;
  }
}
