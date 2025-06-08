import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface Annotation {
  id: string;
  text: string;
  position: { x: number; y: number };
  color: string;
}

interface DocumentViewerProps {
  content: string;
  title?: string;
  inputText: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputSubmit: () => void;
  isLoading: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #23272f;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const TopBar = styled.div`
  height: 56px;
  background: #181c23;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 10;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-height: 0;
  padding: 2rem;
`;

const TextInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const TextInput = styled.input`
  width: 350px;
  padding: 0.75rem 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  font-size: 1rem;
  background: #fff;
  color: #23272f;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }
`;

const DocumentArea = styled.div`
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 3rem;
  position: relative;
  min-width: 0;
  max-width: 800px;
  overflow-y: auto;
  height: calc(100vh - 5rem - 80px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AnnotationMarker = styled.div<{ x: number; y: number; color: string }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  width: 20px;
  height: 20px;
  background: ${(props) => props.color};
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const AnnotationPopup = styled.div<{ x: number; y: number }>`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    background: #0056b3;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 1.5rem 0;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.7);
  z-index: 10;
`;

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, title, inputText, onInputChange, onInputSubmit, isLoading }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  const handleDocumentClick = (e: React.MouseEvent) => {
    if (!isAddingAnnotation) return;
    const rect = documentRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      text: '',
      position: { x, y },
      color: '#ff4444',
    };
    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(newAnnotation);
    setIsAddingAnnotation(false);
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setSelectedAnnotation(annotation);
  };

  const handleAnnotationTextChange = (text: string) => {
    if (!selectedAnnotation) return;
    setAnnotations(annotations.map(ann =>
      ann.id === selectedAnnotation.id ? { ...ann, text } : ann
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onInputSubmit();
    }
  };

  return (
    <Container>
      <TopBar>
        <Title>{title || 'Scrutinize: Powered by DeepSeek'}</Title>
        <Controls>
          <Button onClick={() => setIsAddingAnnotation(true)}>
            Add Annotation
          </Button>
        </Controls>
      </TopBar>
      <MainArea>
        <TextInputWrapper>
          <TextInput
            type="text"
            placeholder="Enter your essay topic..."
            value={inputText}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            style={{ marginLeft: 12 }}
            onClick={onInputSubmit}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate Essay'}
          </Button>
        </TextInputWrapper>
        <DocumentArea ref={documentRef} onClick={handleDocumentClick} style={{ position: 'relative', pointerEvents: isLoading ? 'none' : 'auto' }}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.1rem', color: '#23272f', filter: isLoading ? 'blur(2px)' : 'none', transition: 'filter 0.2s' }}>
            {content}
          </div>
          {isLoading && (
            <LoadingOverlay>
              <Spinner />
              <div style={{ color: '#23272f', marginTop: 8, fontWeight: 500 }}>Generating your essay...</div>
            </LoadingOverlay>
          )}
          {annotations.map(annotation => (
            <AnnotationMarker
              key={annotation.id}
              x={annotation.position.x}
              y={annotation.position.y}
              color={annotation.color}
              onClick={() => handleAnnotationClick(annotation)}
            />
          ))}
          {selectedAnnotation && (
            <AnnotationPopup
              x={selectedAnnotation.position.x}
              y={selectedAnnotation.position.y}
            >
              <textarea
                value={selectedAnnotation.text}
                onChange={(e) => handleAnnotationTextChange(e.target.value)}
                style={{ width: '100%', minHeight: '100px' }}
                placeholder="Add your annotation here..."
              />
            </AnnotationPopup>
          )}
        </DocumentArea>
      </MainArea>
    </Container>
  );
};

export default DocumentViewer; 