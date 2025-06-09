import React, { useState } from 'react';
import styled from 'styled-components';
import { generateEssay, APIError } from '../services/deepseek';
import ErrorNotification from './ErrorNotification';

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

const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
`;

const EssayGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [essay, setEssay] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorNotification, setShowErrorNotification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setShowErrorNotification(false);

    try {
      const generatedEssay = await generateEssay(topic);
      setEssay(generatedEssay);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
        if (err.statusCode === 500) {
          setShowErrorNotification(true);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
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
      {error && !showErrorNotification && <ErrorMessage>{error}</ErrorMessage>}
      {essay && <EssayContent>{essay}</EssayContent>}
      {showErrorNotification && (
        <ErrorNotification
          message={error || 'An unexpected error occurred'}
          onDismiss={() => setShowErrorNotification(false)}
        />
      )}
    </Container>
  );
};

export default EssayGenerator; 