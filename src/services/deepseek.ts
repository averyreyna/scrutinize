import axios from 'axios';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
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
            content: 'You are an expert essay writer. Write a well-structured, engaging essay on the given topic. Include an introduction, body paragraphs, and a conclusion.'
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
    console.error('Error generating essay:', error);
    throw new Error('Failed to generate essay');
  }
}; 