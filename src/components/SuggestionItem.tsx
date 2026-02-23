import React from 'react';
import styled from 'styled-components';
import type { Annotation } from '../types/annotation';
import { theme } from '../theme';
import { SmallPrimaryButton, SmallSecondaryButton } from './Button';

export interface SuggestionData {
  id: string;
  text: string;
  evidence?: string;
  annotationId?: string;
}

const Item = styled.li`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 5px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: ${theme.colors.text};
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
  word-break: break-word;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const EvidenceTag = styled.div`
  font-size: 0.85rem;
  color: #666;
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  width: fit-content;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e9e9e9;
  }
`;

const AddEvidenceButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 0.85rem;
  padding: 0.2rem 0;
  cursor: pointer;
  text-align: left;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

interface SuggestionItemProps {
  suggestion: SuggestionData;
  annotations: Annotation[];
  isEditingEvidence: boolean;
  evidenceInput: string;
  onEvidenceInputChange: (value: string) => void;
  onAddEvidence: () => void;
  onSaveEvidence: () => void;
  onCancelEvidence: () => void;
  onAnnotationChange: (annotationId: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  suggestion,
  annotations,
  isEditingEvidence,
  evidenceInput,
  onEvidenceInputChange,
  onAddEvidence,
  onSaveEvidence,
  onCancelEvidence,
  onAnnotationChange,
}) => (
  <Item>
    <div>{suggestion.text}</div>
    {isEditingEvidence ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <input
          type="text"
          value={evidenceInput}
          onChange={e => onEvidenceInputChange(e.target.value)}
          placeholder="Add evidence..."
          style={{
            padding: '0.3rem 0.5rem',
            border: '1px solid #ddd',
            borderRadius: '3px',
            fontSize: '0.85rem'
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <SmallPrimaryButton onClick={onSaveEvidence}>Save</SmallPrimaryButton>
          <SmallSecondaryButton onClick={onCancelEvidence}>Cancel</SmallSecondaryButton>
        </div>
      </div>
    ) : (
      <>
        {suggestion.evidence ? (
          <EvidenceTag>
            <span>📝</span>
            {suggestion.evidence}
          </EvidenceTag>
        ) : (
          <AddEvidenceButton onClick={onAddEvidence}>+ Add evidence</AddEvidenceButton>
        )}
        <div style={{ marginTop: 4 }}>
          {suggestion.annotationId ? (
            (() => {
              const ann = annotations.find(a => a.id === suggestion.annotationId);
              if (!ann) return null;
              return (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ann.color + '22', color: ann.color, borderRadius: 4, padding: '2px 8px', fontSize: '0.85em', fontWeight: 500 }}>
                  <span style={{ fontWeight: 700 }}>{ann.code}</span>
                  <span style={{ color: theme.colors.textMuted, fontWeight: 400 }}>{ann.description}</span>
                </div>
              );
            })()
          ) : (
            annotations.length > 0 && (
              <select
                style={{ fontSize: '0.85em', padding: '2px 6px', borderRadius: 3, border: '1px solid #ddd', marginTop: 2 }}
                defaultValue=""
                onChange={e => onAnnotationChange(e.target.value)}
              >
                <option value="" disabled>Attach annotation…</option>
                {annotations.map(ann => (
                  <option key={ann.id} value={ann.id}>{ann.code}: {ann.description}</option>
                ))}
              </select>
            )
          )}
        </div>
      </>
    )}
  </Item>
);

export default React.memo(SuggestionItem);
