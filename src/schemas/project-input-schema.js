import { z } from 'zod';

/**
 * Schema for project creation input
 */
export const projectInputSchema = z.object({
  projectName: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Project name can only contain letters, numbers, hyphens and underscores'),

  front: z.enum(['Frontend', 'Backend', 'Fullstack'], {
    errorMap: () => ({ message: 'Front must be Frontend, Backend, or Fullstack' }),
  }),

  technology: z
    .string()
    .min(2, 'Technology must be specified')
    .max(50, 'Technology name too long'),

  version: z
    .string()
    .min(1, 'Version must be specified')
    .max(20, 'Version string too long'),

  dependencies: z
    .array(z.string())
    .min(0, 'Dependencies must be an array')
    .optional()
    .default([]),

  // GitHub options (optional if localPath is provided)
  repositoryUrl: z
    .string()
    .url('Invalid repository URL')
    .regex(
      /^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-_]+$/,
      'Must be a valid GitHub repository URL'
    )
    .optional(),

  githubToken: z
    .string()
    .min(20, 'GitHub token is required')
    .regex(/^(ghp_|github_pat_)[a-zA-Z0-9]+$/, 'Invalid GitHub token format')
    .optional(),

  isPrivate: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether the GitHub repository should be private (default: false)'),

  // Local path option (alternative to GitHub)
  localPath: z
    .string()
    .min(1, 'Local path cannot be empty')
    .optional(),

  description: z
    .string()
    .max(500, 'Description too long')
    .optional(),

  includeTests: z.boolean().optional().default(true),
  includeCICD: z.boolean().optional().default(true),
  includeDocker: z.boolean().optional().default(false),
}).refine(
  (data) => {
    // Either GitHub options OR local path must be provided
    const hasGitHub = data.repositoryUrl && data.githubToken;
    const hasLocal = data.localPath;
    return hasGitHub || hasLocal;
  },
  {
    message: 'Either provide both repositoryUrl and githubToken for GitHub creation, or provide localPath for local creation',
  }
).refine(
  (data) => {
    // If repositoryUrl is provided, githubToken must also be provided
    if (data.repositoryUrl && !data.githubToken) {
      return false;
    }
    return true;
  },
  {
    message: 'githubToken is required when repositoryUrl is provided',
  }
).refine(
  (data) => {
    // If githubToken is provided, repositoryUrl must also be provided
    if (data.githubToken && !data.repositoryUrl) {
      return false;
    }
    return true;
  },
  {
    message: 'repositoryUrl is required when githubToken is provided',
  }
);

/**
 * Validate project input
 * @param {Object} data - Project data to validate
 * @returns {Object} Validated project data
 * @throws {Error} If validation fails
 */
export function validateProjectInput(data) {
  try {
    return projectInputSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
    }
    throw error;
  }
}

/**
 * Safe validation that returns success/error object
 * @param {Object} data - Project data to validate
 * @returns {Object} { success: boolean, data?: Object, errors?: Array }
 */
export function safeValidateProjectInput(data) {
  const result = projectInputSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}
