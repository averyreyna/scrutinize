import axios, { AxiosError } from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const generateEssay = async (topic: string): Promise<string> => {
  try {
    const response = await axios.post<DeepSeekResponse>(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are an expert essay writer. Write a well-structured, engaging essay on the given topic. Include an introduction, body paragraphs, and a conclusion. Return the essay in plain text format without any markdown formatting or special characters.'
          },
          {
            role: 'user',
            content: `Write an essay about: ${topic}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 500) {
        throw new APIError(
          'The server encountered an unexpected error. Please try again in a few moments.',
          500,
          error
        );
      }
      
      if (error.response?.status === 401) {
        throw new APIError(
          'Authentication failed. Please check your API key.',
          401,
          error
        );
      }

      if (error.response?.status === 429) {
        throw new APIError(
          'Rate limit exceeded. Please try again in a few moments.',
          429,
          error
        );
      }

      throw new APIError(
        `API request failed: ${error.message}`,
        error.response?.status,
        error
      );
    }

    console.error('Error generating essay:', error);
    throw new APIError(
      'An unexpected error occurred while generating the essay.',
      undefined,
      error
    );
  }
}; 