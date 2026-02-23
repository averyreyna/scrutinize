import React from 'react';
import type { Annotation } from '../types/annotation';
import { theme } from '../theme';
import { SmallPrimaryButton, SmallSecondaryButton } from './Button';

interface AnnotationPopupCardProps {
  annotation: Annotation;
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isEditing: boolean;
  editText: string;
  onEditTextChange: (value: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
}

const AnnotationPopupCard: React.FC<AnnotationPopupCardProps> = ({
  annotation,
  style,
  onMouseEnter,
  onMouseLeave,
  isEditing,
  editText,
  onEditTextChange,
  onSaveEdit,
  onCancelEdit,
  onStartEdit,
}) => (
  <div style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <div style={{ color: annotation.color, fontWeight: 700, marginBottom: 2 }}>{annotation.code}</div>
    <div style={{ fontSize: '0.92em', color: theme.colors.textMuted, marginBottom: 6 }}>{annotation.description}</div>
    {isEditing ? (
      <>
        <textarea
          value={editText}
          onChange={e => onEditTextChange(e.target.value)}
          style={{ width: '100%', minHeight: 60, marginBottom: 8, borderRadius: 4, border: '1px solid #ddd', padding: 6, fontSize: '1em' }}
          placeholder="Add specific feedback..."
          autoFocus
        />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <SmallPrimaryButton onClick={onSaveEdit} style={{ background: annotation.color }}>Save</SmallPrimaryButton>
          <SmallSecondaryButton onClick={onCancelEdit}>Cancel</SmallSecondaryButton>
        </div>
      </>
    ) : (
      <>
        {annotation.text && (
          <div style={{ fontSize: '0.95em', color: theme.colors.text, margin: '8px 0 0 0', whiteSpace: 'pre-wrap' }}>{annotation.text}</div>
        )}
        <SmallPrimaryButton onClick={onStartEdit} style={{ marginTop: 10, background: annotation.color }}>
          Edit
        </SmallPrimaryButton>
      </>
    )}
  </div>
);

export default React.memo(AnnotationPopupCard);
