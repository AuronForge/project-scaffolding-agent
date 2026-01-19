import { Octokit } from '@octokit/rest';

/**
 * GitHub Service for repository operations
 */
export class GitHubService {
  constructor(token) {
    this.octokit = new Octokit({ auth: token });
    this.token = token;
  }

  /**
   * Extract owner and repo name from GitHub URL
   * @param {string} repositoryUrl - GitHub repository URL
   * @returns {Object} { owner, repo }
   */
  parseRepositoryUrl(repositoryUrl) {
    const match = repositoryUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new Error('Invalid GitHub repository URL');
    }
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
    };
  }

  /**
   * Check if repository exists
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<boolean>}
   */
  async repositoryExists(owner, repo) {
    try {
      await this.octokit.repos.get({ owner, repo });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Create a new repository
   * @param {Object} options - Repository options
   * @returns {Promise<Object>} Created repository data
   */
  async createRepository({ name, description, isPrivate = false }) {
    try {
      const response = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: false,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create repository: ${error.message}`);
    }
  }

  /**
   * Create or update file in repository
   * @param {Object} params - File parameters
   * @returns {Promise<Object>} Commit data
   */
  async createOrUpdateFile({ owner, repo, path, content, message, branch = 'main' }) {
    try {
      // Check if file exists
      let sha;
      try {
        const { data } = await this.octokit.repos.getContent({
          owner,
          repo,
          path,
          ref: branch,
        });
        sha = data.sha;
      } catch (error) {
        // File doesn't exist, will create
        sha = undefined;
      }

      const response = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
        ...(sha && { sha }),
      });

      return response.data;
    } catch (error) {
      throw new Error(`Failed to create/update file ${path}: ${error.message}`);
    }
  }

  /**
   * Create multiple files in a repository (batch commit)
   * @param {Object} params - Batch commit parameters
   * @returns {Promise<Object>} Commit data
   */
  async createFilesInBatch({ owner, repo, files, message, branch = 'main' }) {
    try {
      // Check if repository is empty (no commits yet)
      let isEmpty = false;
      
      try {
        await this.octokit.git.getRef({
          owner,
          repo,
          ref: `heads/${branch}`,
        });
      } catch (error) {
        // Repository is empty, first commit
        isEmpty = true;
        console.log('📝 Creating initial commit (empty repository)');
      }

      // For empty repositories, create files one by one using contents API
      if (isEmpty) {
        console.log(`📤 Uploading ${files.length} files individually...`);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            // Ensure content is a string
            const content = typeof file.content === 'string' 
              ? file.content 
              : JSON.stringify(file.content, null, 2);
            
            await this.octokit.repos.createOrUpdateFileContents({
              owner,
              repo,
              path: file.path,
              message: `feat: add ${file.path}`,
              content: Buffer.from(content).toString('base64'),
              branch,
            });
            console.log(`   ✓ ${i + 1}/${files.length} - ${file.path}`);
          } catch (error) {
            console.error(`   ✗ Failed to upload ${file.path}: ${error.message}`);
            console.error(`     Status: ${error.status}, Owner: ${owner}, Repo: ${repo}`);
            throw error;
          }
        }
        
        console.log('✅ All files uploaded successfully');
        return { message: 'Files created successfully' };
      }

      // For repositories with commits, use the efficient batch method
      const { data: refData } = await this.octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });
      const currentCommitSha = refData.object.sha;
      
      const { data: commitData } = await this.octokit.git.getCommit({
        owner,
        repo,
        commit_sha: currentCommitSha,
      });
      const treeSha = commitData.tree.sha;

      // Create blobs for each file
      const blobs = await Promise.all(
        files.map(async (file) => {
          const { data } = await this.octokit.git.createBlob({
            owner,
            repo,
            content: Buffer.from(file.content).toString('base64'),
            encoding: 'base64',
          });
          return {
            path: file.path,
            mode: '100644',
            type: 'blob',
            sha: data.sha,
          };
        })
      );

      // Create new tree
      const { data: newTree } = await this.octokit.git.createTree({
        owner,
        repo,
        base_tree: treeSha,
        tree: blobs,
      });

      // Create new commit
      const { data: newCommit } = await this.octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: newTree.sha,
        parents: [currentCommitSha],
      });

      // Update reference
      await this.octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommit.sha,
      });

      return newCommit;
    } catch (error) {
      throw new Error(`Failed to create files in batch: ${error.message}`);
    }
  }

  /**
   * Initialize repository with README
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {string} content - README content
   * @returns {Promise<Object>}
   */
  async initializeRepository(owner, repo, content) {
    return this.createOrUpdateFile({
      owner,
      repo,
      path: 'README.md',
      content,
      message: 'Initial commit: Add README',
    });
  }

  /**
   * Get repository information
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @returns {Promise<Object>}
   */
  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.repos.get({ owner, repo });
      return data;
    } catch (error) {
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }

  /**
   * Add topics to repository
   * @param {string} owner - Repository owner
   * @param {string} repo - Repository name
   * @param {Array<string>} topics - Topics to add
   * @returns {Promise<Object>}
   */
  async addTopics(owner, repo, topics) {
    try {
      const { data } = await this.octokit.repos.replaceAllTopics({
        owner,
        repo,
        names: topics,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to add topics: ${error.message}`);
    }
  }
}
