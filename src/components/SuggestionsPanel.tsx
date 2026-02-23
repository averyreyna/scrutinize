import React, { useState } from 'react';
import styled from 'styled-components';
import type { Annotation } from '../types/annotation';
import { theme } from '../theme';
import SuggestionItem, { type SuggestionData } from './SuggestionItem';

const PanelContainer = styled.div`
  position: fixed;
  top: 72px;
  left: 28px;
  width: 240px;
  min-width: 0;
  max-width: 260px;
  background: ${theme.colors.surface};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  border: 1px solid ${theme.colors.border};
  padding: 1rem 1rem 0.8rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  z-index: ${theme.zIndex.toolbarToggle};
  font-family: 'ABC Diatype', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1rem;
  box-sizing: border-box;
  overflow: visible;
  @media (max-width: ${theme.breakpoints.panelHidden}px) {
    display: none;
  }
`;

const Title = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 0.2rem;
`;

const SuggestionInputRow = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const SuggestionInput = styled.input`
  max-width: 145px;
  padding: 0.45rem 0.7rem;
  border: 1px solid ${theme.colors.border};
  border-radius: 5px;
  font-size: 1rem;
  background: ${theme.colors.white};
  color: ${theme.colors.text};
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(0,123,255,0.10);
  }
`;

const AddButton = styled.button`
  background: ${theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 0.45rem 1rem;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2rem;
  min-width: 2.2rem;
  &:hover {
    background: ${theme.colors.primaryHover};
  }
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const EmptyText = styled.div`
  color: #888;
  font-size: 0.97em;
  margin: 0.3rem 0 0 0;
`;

interface SuggestionsPanelProps {
  annotations: Annotation[];
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = React.memo(({ annotations }) => {
  const [suggestions, setSuggestions] = useState<SuggestionData[]>([]);
  const [input, setInput] = useState('');
  const [editingEvidenceId, setEditingEvidenceId] = useState<string | null>(null);
  const [evidenceInput, setEvidenceInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSuggestions(prev => [...prev, { id: Date.now().toString(), text: input.trim() }]);
      setInput('');
    }
  };

  const handleAddEvidence = (id: string) => {
    setEditingEvidenceId(id);
    setEvidenceInput('');
  };

  const handleSaveEvidence = (id: string) => {
    if (evidenceInput.trim()) {
      setSuggestions(prev => prev.map(s =>
        s.id === id ? { ...s, evidence: evidenceInput.trim() } : s
      ));
    }
    setEditingEvidenceId(null);
    setEvidenceInput('');
  };

  const handleCancelEvidence = () => {
    setEditingEvidenceId(null);
    setEvidenceInput('');
  };

  const handleAnnotationChange = (suggestionId: string, annotationId: string) => {
    setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, annotationId } : s));
  };

  return (
    <PanelContainer>
      <Title>Suggestions</Title>
      <SuggestionInputRow onSubmit={handleAdd}>
        <SuggestionInput
          type="text"
          placeholder="Add..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <AddButton type="submit">+</AddButton>
      </SuggestionInputRow>
      <SuggestionsList>
        {suggestions.length === 0 ? (
          <EmptyText>No suggestions yet.</EmptyText>
        ) : (
          suggestions.map((s) => (
            <SuggestionItem
              key={s.id}
              suggestion={s}
              annotations={annotations}
              isEditingEvidence={editingEvidenceId === s.id}
              evidenceInput={evidenceInput}
              onEvidenceInputChange={setEvidenceInput}
              onAddEvidence={() => handleAddEvidence(s.id)}
              onSaveEvidence={() => handleSaveEvidence(s.id)}
              onCancelEvidence={handleCancelEvidence}
              onAnnotationChange={(annotationId) => handleAnnotationChange(s.id, annotationId)}
            />
          ))
        )}
      </SuggestionsList>
    </PanelContainer>
  );
});

SuggestionsPanel.displayName = 'SuggestionsPanel';

export default SuggestionsPanel; 