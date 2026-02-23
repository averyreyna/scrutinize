import React, { useState } from 'react';
import DocumentViewer from '../components/DocumentViewer';
import { generateEssay } from '../services/deepseek';
import ExperimentInfoModal from '../components/ExperimentInfoModal';
import styled from 'styled-components';
import { DEFAULT_SAMPLE_ESSAY, theme } from '../theme';

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e9eef7;
  color: #3b4a6b;
  font-size: 0.85rem;
  font-weight: 700;
  margin-right: 0.5em;
  border: 1px solid #d1d7e0;
`;

const FloatingButton = styled.button`
  position: fixed;
  left: 24px;
  bottom: 24px;
  background: #fff;
  color: ${theme.colors.text};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  padding: 0.4rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: ${theme.zIndex.toolbar};
  transition: background 0.15s;
  &:hover {
    background: #f5f6fa;
  }
`;

const DocumentPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [content, setContent] = useState(DEFAULT_SAMPLE_ESSAY);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const essay = await generateEssay(inputText);
      setContent(essay);
    } catch (err) {
      setContent('Failed to generate essay. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DocumentViewer
        content={content}
        inputText={inputText}
        onInputChange={handleInputChange}
        onInputSubmit={handleInputSubmit}
        isLoading={isLoading}
      />
      <FloatingButton onClick={() => setShowInfo(true)}>
        <InfoIcon>i</InfoIcon>
        More about this experiment
      </FloatingButton>
      <ExperimentInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
};

export default DocumentPage; 