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
  flex: 1;
  min-height: 0;
`;

const Sidebar = styled.div`
  width: 80px;
  background: #23272f;
  color: #b0b4bb;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #22252b;
`;

const PageNumber = styled.div<{active?: boolean}>`
  width: 48px;
  height: 64px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: ${({active}) => active ? '#fff' : 'transparent'};
  color: ${({active}) => active ? '#23272f' : '#b0b4bb'};
  font-weight: 600;
  font-size: 1.2rem;
  box-shadow: ${({active}) => active ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};
  cursor: pointer;
  border: ${({active}) => active ? '1.5px solid #007bff' : '1.5px solid transparent'};
`;

const DocumentArea = styled.div`
  flex: 1;
  margin: 2.5rem auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 3rem;
  position: relative;
  min-width: 0;
  max-width: 800px;
  overflow-y: auto;
  height: calc(100vh - 5rem);
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

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, title }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  // For now, just one page
  const pages = [1];
  const [currentPage] = useState(1);

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

  return (
    <Container>
      <TopBar>
        <Title>{title || 'Untitled Document'}</Title>
        <Controls>
          <Button onClick={() => setIsAddingAnnotation(true)}>
            Add Annotation
          </Button>
          {/* Placeholder controls */}
          <Button disabled style={{background:'#23272f',color:'#b0b4bb',cursor:'default'}}>Zoom</Button>
          <Button disabled style={{background:'#23272f',color:'#b0b4bb',cursor:'default'}}>Download</Button>
        </Controls>
      </TopBar>
      <MainArea>
        <Sidebar>
          {pages.map((page) => (
            <PageNumber key={page} active={page === currentPage}>{page}</PageNumber>
          ))}
        </Sidebar>
        <DocumentArea ref={documentRef} onClick={handleDocumentClick}>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.1rem', color: '#23272f' }}>
            {content}
          </div>
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