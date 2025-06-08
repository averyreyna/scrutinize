import React, { useState } from 'react';
import DocumentViewer from '../components/DocumentViewer';
import { generateEssay } from '../services/deepseek';
import ExperimentInfoModal from '../components/ExperimentInfoModal';
import styled from 'styled-components';

const InfoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e9eef7;
  color: #3b4a6b;
  font-size: 1.1rem;
  font-weight: 700;
  margin-right: 0.7em;
  border: 1px solid #d1d7e0;
`;

const FloatingButton = styled.button`
  position: fixed;
  left: 32px;
  bottom: 32px;
  background: #fff;
  color: #23272f;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  padding: 0.7rem 1.3rem;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: 1200;
  transition: background 0.15s;
  &:hover {
    background: #f5f6fa;
  }
`;

const DocumentPage: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [content, setContent] = useState(`# Sample Essay\n\nThis is a sample essay that demonstrates the document viewer functionality. You can click the "Add Annotation" button in the toolbar and then click anywhere in the document to add annotations.\n\nThe document viewer supports:\n- Adding annotations at specific points\n- Editing annotation text\n- Viewing all annotations\n- Clean and modern UI\n\nFeel free to experiment with the annotation features!`);
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