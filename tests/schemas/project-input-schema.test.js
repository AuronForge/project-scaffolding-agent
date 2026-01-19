import { describe, it, expect } from '@jest/globals';
import { projectInputSchema } from '../../src/schemas/project-input-schema.js';

describe('Project Input Schema', () => {
  describe('GitHub Mode', () => {
    it('should validate GitHub project with all required fields', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        repositoryUrl: 'https://github.com/user/test-project',
        githubToken: 'ghp_1234567890abcdefghij',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.isPrivate).toBe(false); // default value
    });

    it('should validate GitHub project with isPrivate true', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        repositoryUrl: 'https://github.com/user/test-project',
        githubToken: 'ghp_1234567890abcdefghij',
        isPrivate: true,
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.isPrivate).toBe(true);
    });

    it('should validate GitHub project with isPrivate false', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        repositoryUrl: 'https://github.com/user/test-project',
        githubToken: 'ghp_1234567890abcdefghij',
        isPrivate: false,
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.isPrivate).toBe(false);
    });

    it('should fail when githubToken is missing with repositoryUrl', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        repositoryUrl: 'https://github.com/user/test-project',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('Local Mode', () => {
    it('should validate local project with all required fields', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        localPath: '/home/user/projects',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should ignore isPrivate in local mode', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        localPath: '/home/user/projects',
        isPrivate: true, // Should be ignored in local mode
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.isPrivate).toBe(true); // Value is preserved but not used
    });
  });

  describe('Field Validation', () => {
    it('should fail with invalid project name', () => {
      const input = {
        projectName: 'ab', // Too short
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        localPath: '/home/user/projects',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail with invalid front value', () => {
      const input = {
        projectName: 'test-project',
        front: 'InvalidType', // Invalid value
        technology: 'Spring Boot',
        version: '3.2',
        localPath: '/home/user/projects',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should fail without GitHub or local path', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('Optional Fields', () => {
    it('should use default values for optional fields', () => {
      const input = {
        projectName: 'test-project',
        front: 'Backend',
        technology: 'Spring Boot',
        version: '3.2',
        localPath: '/home/user/projects',
      };

      const result = projectInputSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.includeTests).toBe(true);
      expect(result.data?.includeCICD).toBe(true);
      expect(result.data?.includeDocker).toBe(false);
      expect(result.data?.isPrivate).toBe(false);
      expect(result.data?.dependencies).toEqual([]);
    });
  });
});
