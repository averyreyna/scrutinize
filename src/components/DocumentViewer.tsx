import React, { useState, useRef, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import AnnotationToolbar from './AnnotationToolbar';
import SuggestionsPanel from './SuggestionsPanel';
import AnnotationPopupCard from './AnnotationPopupCard';
import type { Annotation } from '../types/annotation';
import { theme, TOOLTIP_LEAVE_DELAY_MS } from '../theme';

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
  background: ${theme.colors.background};
  font-family: 'ABC Diatype', 'Inter', 'Segoe UI', Arial, sans-serif;
`;

const TopBar = styled.div`
  height: 56px;
  background: ${theme.colors.backgroundDark};
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: ${theme.zIndex.topBar};

  @media (max-width: ${theme.breakpoints.mobile}px) {
    padding: 0 1rem;
    height: 48px;
  }
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;

  @media (max-width: ${theme.breakpoints.mobile}px) {
    font-size: 1rem;
  }
`;

const MainArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex: 1;
  min-height: 0;
  padding: 2rem;

  @media (max-width: ${theme.breakpoints.panelHidden}px) {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }
`;

const ContentColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const TextInputWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;

  @media (max-width: ${theme.breakpoints.mobile}px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

const TextInput = styled.input`
  width: 350px;
  padding: 0.75rem 1rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: ${theme.colors.white};
  color: ${theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
  }

  @media (max-width: ${theme.breakpoints.mobile}px) {
    width: 100%;
    font-size: 0.95rem;
    padding: 0.6rem 0.75rem;
  }
`;

const DocumentArea = styled.div`
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 2.5rem 3rem;
  position: relative;
  width: 600px;
  min-width: 400px;
  max-width: 600px;
  overflow-y: auto;
  height: calc(100vh - 5rem - 80px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: ${theme.breakpoints.mobile}px) {
    padding: 1.25rem 1rem;
    height: calc(100vh - 4rem - 120px);
    border-radius: 6px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${theme.colors.primaryHover};
  }

  @media (max-width: ${theme.breakpoints.mobile}px) {
    width: 100%;
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
  }
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid ${theme.colors.primary};
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
  z-index: ${theme.zIndex.overlay};
`;

const DocumentViewer: React.FC<DocumentViewerProps> = ({ content, title, inputText, onInputChange, onInputSubmit, isLoading }) => {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotationType, setSelectedAnnotationType] = useState<{ code: string; description: string; color: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [popupAnnotation, setPopupAnnotation] = useState<Annotation | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const [editingAnnotationId, setEditingAnnotationId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const isTooltipHoveredRef = useRef(isTooltipHovered);
  isTooltipHoveredRef.current = isTooltipHovered;

  const handleHighlightMouseLeave = useCallback(() => {
    setTimeout(() => {
      if (!isTooltipHoveredRef.current) {
        setShowPopup(false);
      }
    }, TOOLTIP_LEAVE_DELAY_MS);
  }, []);

  const handleHighlightMouseEnter = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const id = (e.currentTarget as HTMLElement).getAttribute('data-annotation-id');
    if (!id) return;
    const ann = annotations.find(a => a.id === id);
    if (!ann) return;
    setPopupAnnotation(ann);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPopupPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setShowPopup(true);
  }, [annotations]);

  const highlightedContent = useMemo(() => {
    if (annotations.length === 0) return content;
    const sorted = [...annotations].sort((a, b) => a.start - b.start);
    let lastIdx = 0;
    const nodes: React.ReactNode[] = [];
    sorted.forEach((ann) => {
      if (ann.start > lastIdx) {
        nodes.push(content.slice(lastIdx, ann.start));
      }
      nodes.push(
        <span
          key={ann.id}
          data-annotation-id={ann.id}
          style={{ background: ann.color + '33', borderRadius: 3, cursor: 'pointer', transition: 'background 0.2s' }}
          onMouseEnter={handleHighlightMouseEnter}
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
  }, [content, annotations, handleHighlightMouseEnter, handleHighlightMouseLeave]);

  const handleTextSelection = useCallback(() => {
    if (!selectedAnnotationType) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const selectedText = selection.toString();
    if (!selectedText) return;
    const anchorNode = selection.anchorNode;
    const focusNode = selection.focusNode;
    if (!anchorNode || !focusNode) return;
    const contentText = content;
    const anchorOffset = selection.anchorOffset;
    const focusOffset = selection.focusOffset;
    let start = Math.min(anchorOffset, focusOffset);
    let end = Math.max(anchorOffset, focusOffset);

    const idx = contentText.indexOf(selectedText);
    if (idx !== -1) {
      start = idx;
      end = idx + selectedText.length;
    }
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
    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedAnnotationType(null);
    selection.removeAllRanges();
  }, [content, annotations, selectedAnnotationType]);

  const handleSelectAnnotation = useCallback((code: string, description: string, color: string) => {
    setSelectedAnnotationType({ code, description, color });
  }, []);

  const handleEditAnnotation = useCallback((annotation: Annotation) => {
    setEditingAnnotationId(annotation.id);
    setEditText(annotation.text || '');
  }, []);

  const handleSaveEdit = useCallback(() => {
    const updated = annotations.map(ann =>
      ann.id === editingAnnotationId ? { ...ann, text: editText } : ann
    );
    setAnnotations(updated);
    if (popupAnnotation && editingAnnotationId === popupAnnotation.id) {
      setPopupAnnotation({ ...popupAnnotation, text: editText });
    }
    setEditingAnnotationId(null);
    setEditText('');
  }, [annotations, editingAnnotationId, editText, popupAnnotation]);

  const handleCancelEdit = useCallback(() => {
    setEditingAnnotationId(null);
    setEditText('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onInputSubmit();
    }
  }, [onInputSubmit]);

  const popupStyle = useMemo(() => (showPopup && popupAnnotation && popupPosition ? {
    position: 'fixed' as const,
    left: popupPosition.x,
    top: popupPosition.y - 48,
    background: theme.colors.white,
    border: `1.5px solid ${popupAnnotation.color}`,
    borderRadius: 6,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    padding: '0.7rem 1rem',
    minWidth: 200,
    zIndex: theme.zIndex.popup,
    pointerEvents: 'auto' as const,
  } : null), [showPopup, popupAnnotation, popupPosition]);

  const handlePopupMouseEnter = useCallback(() => setIsTooltipHovered(true), []);
  const handlePopupMouseLeave = useCallback(() => {
    setIsTooltipHovered(false);
    setShowPopup(false);
  }, []);

  return (
    <Container>
      <TopBar>
        <Title>{title || 'Scrutinize: Powered by DeepSeek'}</Title>
      </TopBar>
      <MainArea>
        <SuggestionsPanel annotations={annotations} />
        <ContentColumn>
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
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.1rem', color: theme.colors.text, filter: isLoading ? 'blur(2px)' : 'none', transition: 'filter 0.2s' }}
              onMouseUp={handleTextSelection}
            >
              {highlightedContent}
            </div>
            {isLoading && (
              <LoadingOverlay>
                <Spinner />
                <div style={{ color: theme.colors.text, marginTop: 8, fontWeight: 500 }}>Generating your essay...</div>
              </LoadingOverlay>
            )}
            {popupStyle && popupAnnotation && (
              <AnnotationPopupCard
                annotation={popupAnnotation}
                style={popupStyle}
                onMouseEnter={handlePopupMouseEnter}
                onMouseLeave={handlePopupMouseLeave}
                isEditing={editingAnnotationId === popupAnnotation.id}
                editText={editText}
                onEditTextChange={setEditText}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                onStartEdit={() => handleEditAnnotation(popupAnnotation)}
              />
            )}
          </DocumentArea>
          <AnnotationToolbar 
            onSelectAnnotation={handleSelectAnnotation} 
            selectedAnnotation={selectedAnnotationType}
          />
        </ContentColumn>
      </MainArea>
    </Container>
  );
};

export default DocumentViewer; 