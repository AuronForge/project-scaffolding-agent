import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import {
  buildDependencyAnalysisPrompt,
  buildProjectStructurePrompt,
  SYSTEM_MESSAGE,
} from '../prompts/project-scaffolding-prompts.js';

/**
 * AI Service for generating project structures
 */
export class AIService {
  constructor(provider = 'github') {
    this.provider = provider;
    this._client = null;
    this.model = null;
  }

  get client() {
    if (!this._client) {
      this.initializeClient();
    }
    return this._client;
  }

  initializeClient() {
    switch (this.provider) {
      case 'github':
        this._client = new OpenAI({
          baseURL: 'https://models.inference.ai.azure.com',
          apiKey: process.env.GITHUB_TOKEN,
        });
        this.model = process.env.GITHUB_MODEL || 'gpt-4o';
        break;

      case 'openai':
        this._client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4o';
        break;

      case 'anthropic':
        this._client = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
        break;

      default:
        throw new Error(`Unsupported AI provider: ${this.provider}`);
    }
  }

  /**
   * Analyze dependencies and generate compatible configurations
   * @param {Object} projectConfig - Project configuration
   * @returns {Promise<Object>} Compatible versions and configurations
   */
  async analyzeDependencies(projectConfig) {
    const prompt = buildDependencyAnalysisPrompt(projectConfig);

    try {
      if (this.provider === 'anthropic') {
        return await this.generateWithAnthropic(prompt);
      } else {
        return await this.generateWithOpenAI(prompt);
      }
    } catch (error) {
      throw new Error(`Dependency Analysis Error: ${error.message}`);
    }
  }

  /**
   * Generate project structure using AI
   * @param {Object} projectConfig - Project configuration
   * @param {Object} dependencyConfig - Pre-analyzed dependency configuration
   * @returns {Promise<Object>} Generated project structure
   */
  async generateProjectStructure(projectConfig, dependencyConfig) {
    const prompt = buildProjectStructurePrompt(projectConfig, dependencyConfig);

    try {
      if (this.provider === 'anthropic') {
        return await this.generateWithAnthropic(prompt);
      } else {
        return await this.generateWithOpenAI(prompt);
      }
    } catch (error) {
      throw new Error(`AI Service Error: ${error.message}`);
    }
  }

  async generateWithOpenAI(prompt) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 16000,
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  }

  async generateWithAnthropic(prompt) {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 16000,
      temperature: 0.7,
      system: SYSTEM_MESSAGE,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = response.content[0].text;
    return JSON.parse(content);
  }
}
