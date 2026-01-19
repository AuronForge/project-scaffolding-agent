import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { GitHubService } from '../../src/services/github-service.js';

describe('GitHub Service', () => {
  let githubService;
  let mockOctokit;

  beforeEach(() => {
    mockOctokit = {
      repos: {
        createForAuthenticatedUser: jest.fn(),
        get: jest.fn(),
        getContent: jest.fn(),
        createOrUpdateFileContents: jest.fn(),
      },
      git: {
        getRef: jest.fn(),
        getCommit: jest.fn(),
        createBlob: jest.fn(),
        createTree: jest.fn(),
        createCommit: jest.fn(),
        updateRef: jest.fn(),
      },
    };

    githubService = new GitHubService('ghp_test_token');
    githubService.octokit = mockOctokit;
  });

  describe('parseRepositoryUrl', () => {
    it('should parse valid GitHub repository URL', () => {
      const url = 'https://github.com/owner/repo';
      const result = githubService.parseRepositoryUrl(url);

      expect(result).toEqual({
        owner: 'owner',
        repo: 'repo',
      });
    });

    it('should remove .git extension from repo name', () => {
      const url = 'https://github.com/owner/repo.git';
      const result = githubService.parseRepositoryUrl(url);

      expect(result).toEqual({
        owner: 'owner',
        repo: 'repo',
      });
    });

    it('should throw error for invalid URL', () => {
      const url = 'https://invalid.com/owner/repo';

      expect(() => githubService.parseRepositoryUrl(url)).toThrow(
        'Invalid GitHub repository URL'
      );
    });
  });

  describe('createRepository', () => {
    it('should create public repository by default', async () => {
      mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({
        data: { id: 123, name: 'test-repo', private: false },
      });

      const result = await githubService.createRepository({
        name: 'test-repo',
        description: 'Test repository',
      });

      expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
        name: 'test-repo',
        description: 'Test repository',
        private: false,
        auto_init: false,
      });

      expect(result).toEqual({
        id: 123,
        name: 'test-repo',
        private: false,
      });
    });

    it('should create public repository when isPrivate is false', async () => {
      mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({
        data: { id: 123, name: 'test-repo', private: false },
      });

      const result = await githubService.createRepository({
        name: 'test-repo',
        description: 'Test repository',
        isPrivate: false,
      });

      expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
        name: 'test-repo',
        description: 'Test repository',
        private: false,
        auto_init: false,
      });

      expect(result.private).toBe(false);
    });

    it('should create private repository when isPrivate is true', async () => {
      mockOctokit.repos.createForAuthenticatedUser.mockResolvedValue({
        data: { id: 456, name: 'private-repo', private: true },
      });

      const result = await githubService.createRepository({
        name: 'private-repo',
        description: 'Private repository',
        isPrivate: true,
      });

      expect(mockOctokit.repos.createForAuthenticatedUser).toHaveBeenCalledWith({
        name: 'private-repo',
        description: 'Private repository',
        private: true,
        auto_init: false,
      });

      expect(result.private).toBe(true);
    });

    it('should throw error when creation fails', async () => {
      mockOctokit.repos.createForAuthenticatedUser.mockRejectedValue(
        new Error('API Error')
      );

      await expect(
        githubService.createRepository({
          name: 'test-repo',
          description: 'Test repository',
        })
      ).rejects.toThrow('Failed to create repository: API Error');
    });
  });

  describe('repositoryExists', () => {
    it('should return true when repository exists', async () => {
      mockOctokit.repos.get.mockResolvedValue({
        data: { id: 123 },
      });

      const result = await githubService.repositoryExists('owner', 'repo');

      expect(result).toBe(true);
      expect(mockOctokit.repos.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'repo',
      });
    });

    it('should return false when repository does not exist', async () => {
      mockOctokit.repos.get.mockRejectedValue({ status: 404 });

      const result = await githubService.repositoryExists('owner', 'repo');

      expect(result).toBe(false);
    });

    it('should throw error for non-404 errors', async () => {
      mockOctokit.repos.get.mockRejectedValue({ status: 500 });

      await expect(
        githubService.repositoryExists('owner', 'repo')
      ).rejects.toEqual({ status: 500 });
    });
  });

  describe('getRepository', () => {
    it('should return repository information', async () => {
      const mockRepoData = {
        id: 123,
        name: 'test-repo',
        private: false,
        description: 'Test repository',
      };

      mockOctokit.repos.get.mockResolvedValue({
        data: mockRepoData,
      });

      const result = await githubService.getRepository('owner', 'test-repo');

      expect(result).toEqual(mockRepoData);
      expect(mockOctokit.repos.get).toHaveBeenCalledWith({
        owner: 'owner',
        repo: 'test-repo',
      });
    });

    it('should throw error when get fails', async () => {
      mockOctokit.repos.get.mockRejectedValue(new Error('Not found'));

      await expect(
        githubService.getRepository('owner', 'test-repo')
      ).rejects.toThrow('Failed to get repository: Not found');
    });
  });
});
