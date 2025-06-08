import React, { useState } from 'react';
import styled from 'styled-components';
import { generateEssay } from '../services/deepseek';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const EssayContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #666;
  margin: 2rem 0;
`;

const EssayGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const generatedEssay = await generateEssay(topic);
      setEssay(generatedEssay);
    } catch (err) {
      setError('Failed to generate essay. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter your essay topic..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !topic.trim()}>
          {isLoading ? 'Generating...' : 'Generate Essay'}
        </Button>
      </Form>

      {isLoading && <LoadingMessage>Generating your essay...</LoadingMessage>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {essay && <EssayContent>{essay}</EssayContent>}
    </Container>
  );
};

export default EssayGenerator; 