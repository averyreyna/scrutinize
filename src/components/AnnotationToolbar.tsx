import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

export const ANNOTATION_GROUPS = {
  STRUCTURE: {
    name: 'Structure & Flow',
    color: '#4A90E2',
    codes: [
      { code: 'LEDE', description: 'Lead with the main point' },
      { code: 'FLOW', description: 'Improve logical flow' },
      { code: 'SPFIC', description: 'Make more specific' },
      { code: 'WALL', description: 'Break up text wall' }
    ]
  },
  CLARITY: {
    name: 'Clarity & Precision',
    color: '#50E3C2',
    codes: [
      { code: 'CLEAR', description: 'Clarify meaning' },
      { code: 'AMBIG', description: 'Remove ambiguity' },
      { code: 'TERM', description: 'Define technical terms' },
      { code: 'DIR', description: 'Use direct language' }
    ]
  },
  STYLE: {
    name: 'Style & Tone',
    color: '#F5A623',
    codes: [
      { code: 'TONE', description: 'Adjust tone' },
      { code: 'BRAND', description: 'Match brand voice' },
      { code: 'COLOR', description: 'Add energy' },
      { code: 'FRESH', description: 'Avoid clichés' }
    ]
  },
  INCLUSION: {
    name: 'Inclusion & Impact',
    color: '#BD10E0',
    codes: [
      { code: 'INCL', description: 'Use inclusive language' },
      { code: 'EMPATH', description: 'Consider audience' },
      { code: 'WIIFM', description: 'Highlight benefits' },
      { code: 'A11Y', description: 'Improve accessibility' }
    ]
  },
  ACCURACY: {
    name: 'Accuracy & Evidence',
    color: '#D0021B',
    codes: [
      { code: 'FACT', description: 'Support with evidence' },
      { code: 'EXMPL', description: 'Add examples' },
      { code: 'QUOTE', description: 'Include expert quotes' },
      { code: 'HYPER', description: 'Avoid hyperbole' }
    ]
  }
};

interface AnnotationToolbarProps {
  onSelectAnnotation: (code: string, description: string, color: string) => void;
  selectedAnnotation?: { code: string; description: string; color: string } | null;
}

const SIDEBAR_OFFSET_VISIBLE = 64;
const SIDEBAR_OFFSET_TOGGLE = '1rem';
const SIDEBAR_WIDTH = 170;
const SIDEBAR_MAX_HEIGHT = '80vh';

const ToolbarContainer = styled.div<{ isVisible: boolean }>`
  position: fixed;
  right: ${props => props.isVisible ? `${SIDEBAR_OFFSET_VISIBLE}px` : `-${SIDEBAR_WIDTH + 24}px`};
  top: 50%;
  transform: translateY(-50%);
  height: auto;
  min-width: 120px;
  max-width: ${SIDEBAR_WIDTH}px;
  max-height: ${SIDEBAR_MAX_HEIGHT};
  overflow-y: auto;
  background: ${theme.colors.surface};
  border-left: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 1.5rem 0.3rem 0.3rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  z-index: ${theme.zIndex.toolbar};
  font-size: 0.85rem;
  align-items: flex-start;
  transition: right 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-family: 'ABC Diatype', sans-serif;
`;

const ToggleButton = styled.button`
  position: fixed;
  right: ${SIDEBAR_OFFSET_TOGGLE};
  top: 50%;
  transform: translateY(-50%);
  background: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  z-index: ${theme.zIndex.toolbarToggle};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s;

  &:hover {
    background: ${theme.colors.white};
  }

  svg {
    width: 20px;
    height: 20px;
    fill: ${theme.colors.text};
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

const GroupTitle = styled.div<{ color: string }>`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.color};
  padding: 0.25rem 0 0.15rem 0.25rem;
  border-left: 3px solid ${props => props.color};
  margin-bottom: 0.15rem;
  background: none;
`;

const AnnotationButton = styled.button<{ color: string; isSelected: boolean }>`
  background: ${props => props.isSelected ? props.color + '20' : '#fff'};
  color: ${props => props.color};
  border: 1.5px solid ${props => props.isSelected ? props.color : props.color + '30'};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.15s, border 0.15s;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-height: 32px;
  box-shadow: ${props => props.isSelected ? `0 0 0 1px ${props.color}40` : 'none'};
  margin-bottom: 1px;

  &:hover {
    background: ${props => props.color}10;
    border: 1.5px solid ${props => props.color}80;
  }

  .code {
    font-weight: 600;
    font-size: 0.85em;
    letter-spacing: 0.5px;
  }

  .description {
    font-size: 0.72em;
    opacity: 0.8;
    line-height: 1.2;
  }
`;

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = React.memo(({ onSelectAnnotation, selectedAnnotation }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <ToggleButton onClick={() => setIsVisible(!isVisible)} aria-label={isVisible ? "Hide annotation toolbar" : "Show annotation toolbar"}>
        <svg viewBox="0 0 24 24">
          {isVisible ? (
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          ) : (
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          )}
        </svg>
      </ToggleButton>
      <ToolbarContainer isVisible={isVisible}>
        {Object.entries(ANNOTATION_GROUPS).map(([key, group]) => (
          <Group key={key}>
            <GroupTitle color={group.color}>{group.name}</GroupTitle>
            {group.codes.map(({ code, description }) => (
              <AnnotationButton
                key={code}
                color={group.color}
                isSelected={selectedAnnotation?.code === code}
                onClick={() => onSelectAnnotation(code, description, group.color)}
              >
                <span className="code">{code}</span>
                <span className="description">{description}</span>
              </AnnotationButton>
            ))}
          </Group>
        ))}
      </ToolbarContainer>
    </>
  );
});

AnnotationToolbar.displayName = 'AnnotationToolbar';

export default AnnotationToolbar; 