import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import AnnotationToolbar from './AnnotationToolbar';

interface Annotation {
  id: string;
  code: string;
  description: string;
  text: string;
  color: string;
  start: number;
  end: number;
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
  const [selectedAnnotationType, setSelectedAnnotationType] = useState<{ code: string; description: string; color: string } | null>(null);
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [popupAnnotation, setPopupAnnotation] = useState<Annotation | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);

  // Update highlight mouse leave to delay hiding if tooltip is hovered
  const handleHighlightMouseLeave = () => {
    setTimeout(() => {
      if (!isTooltipHovered) {
        setHoveredAnnotationId(null);
        setShowPopup(false);
      }
    }, 80);
  };

  // Helper: Render content with highlights
  const renderContentWithHighlights = () => {
    if (annotations.length === 0) return content;
    // Sort annotations by start index
    const sorted = [...annotations].sort((a, b) => a.start - b.start);
    let lastIdx = 0;
    const nodes: React.ReactNode[] = [];
    sorted.forEach((ann, i) => {
      if (ann.start > lastIdx) {
        nodes.push(content.slice(lastIdx, ann.start));
      }
      nodes.push(
        <span
          key={ann.id}
          style={{ background: ann.color + '33', borderRadius: 3, cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={e => {
            setHoveredAnnotationId(ann.id);
            setPopupAnnotation(ann);
            const rect = (e.target as HTMLElement).getBoundingClientRect();
            setPopupPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setShowPopup(true);
          }}
          onMouseLeave={handleHighlightMouseLeave}
        >
          {content.slice(ann.start, ann.end)}
        </span>
      );
      lastIdx = ann.end;
    });
    if (lastIdx < content.length) {
      nodes.push(content.slice(lastIdx));
    }
    return nodes;
  };

  // Handle text selection and annotation creation
  const handleTextSelection = () => {
    if (!selectedAnnotationType) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
    // Find start and end indices relative to content
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!anchorNode || !focusNode) return;
    // Only support selection within the main content div
    const contentText = content;
    const anchorOffset = selection.anchorOffset;
    const focusOffset = selection.focusOffset;
    let start = Math.min(anchorOffset, focusOffset);
    let end = Math.max(anchorOffset, focusOffset);
    // Try to find the selected text in the content
    const idx = contentText.indexOf(selectedText);
    if (idx !== -1) {
      start = idx;
      end = idx + selectedText.length;
    }
    // Prevent overlapping highlights
    if (annotations.some(a => (start < a.end && end > a.start))) {
      selection.removeAllRanges();
      setSelectedAnnotationType(null);
      return;
    }
    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      code: selectedAnnotationType.code,
      description: selectedAnnotationType.description,
      text: '',
      color: selectedAnnotationType.color,
      start,
      end,
    };
    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotationType(null);
    selection.removeAllRanges();
  };

  // Handle annotation type selection
  const handleSelectAnnotation = (code: string, description: string, color: string) => {
    setSelectedAnnotationType({ code, description, color });
  };

  // Start editing annotation
  const handleEditAnnotation = (annotation: Annotation) => {
    setEditingAnnotationId(annotation.id);
    setEditText(annotation.text || '');
  };

  // Save annotation feedback
  const handleSaveEdit = () => {
    setAnnotations(prev => {
      const updated = prev.map(ann =>
        ann.id === editingAnnotationId ? { ...ann, text: editText } : ann
      );
      // If the popup annotation is being edited, update it as well
      if (popupAnnotation && editingAnnotationId === popupAnnotation.id) {
        setPopupAnnotation({ ...popupAnnotation, text: editText });
      }
      return updated;
    });
    setEditingAnnotationId(null);
    setEditText('');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingAnnotationId(null);
    setEditText('');
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
        <DocumentArea ref={documentRef} style={{ position: 'relative', pointerEvents: isLoading ? 'none' : 'auto' }}>
          <div
            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.1rem', color: '#23272f', filter: isLoading ? 'blur(2px)' : 'none', transition: 'filter 0.2s' }}
            onMouseUp={handleTextSelection}
          >
            {renderContentWithHighlights()}
          </div>
          {isLoading && (
            <LoadingOverlay>
              <Spinner />
              <div style={{ color: '#23272f', marginTop: 8, fontWeight: 500 }}>Generating your essay...</div>
            </LoadingOverlay>
          )}
          {/* Annotation popup on highlight hover, keep visible if tooltip hovered */}
          {showPopup && popupAnnotation && popupPosition && (
            <div
              style={{
                position: 'fixed',
                left: popupPosition.x,
                top: popupPosition.y - 48,
                background: '#fff',
                border: `1.5px solid ${popupAnnotation.color}`,
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                padding: '0.7rem 1rem',
                minWidth: 200,
                zIndex: 2000,
                pointerEvents: 'auto',
              }}
              onMouseEnter={() => setIsTooltipHovered(true)}
              onMouseLeave={() => {
                setIsTooltipHovered(false);
                setHoveredAnnotationId(null);
                setShowPopup(false);
              }}
            >
              <div style={{ color: popupAnnotation.color, fontWeight: 700, marginBottom: 2 }}>{popupAnnotation.code}</div>
              <div style={{ fontSize: '0.92em', color: '#444', marginBottom: 6 }}>{popupAnnotation.description}</div>
              {editingAnnotationId === popupAnnotation.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    style={{ width: '100%', minHeight: 60, marginBottom: 8, borderRadius: 4, border: '1px solid #ddd', padding: 6, fontSize: '1em' }}
                    placeholder="Add specific feedback..."
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={handleSaveEdit} style={{ background: popupAnnotation.color, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500, cursor: 'pointer' }}>Save</button>
                    <button onClick={handleCancelEdit} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  {popupAnnotation.text && (
                    <div style={{ fontSize: '0.95em', color: '#23272f', margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{popupAnnotation.text}</div>
                  )}
                  <button
                    onClick={() => handleEditAnnotation(popupAnnotation)}
                    style={{ marginTop: 10, background: popupAnnotation.color, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontWeight: 500, cursor: 'pointer', fontSize: '0.97em' }}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          )}
        </DocumentArea>
        {/* Floating annotation toolbar outside the document */}
        <AnnotationToolbar onSelectAnnotation={handleSelectAnnotation} />
      </MainArea>
    </Container>
  );
};

export default DocumentViewer; 