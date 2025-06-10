import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: fixed;
  top: 72px;
  left: 28px;
  width: 240px;
  min-width: 0;
  max-width: 260px;
  background: #f8f9fbf7;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  border: 1px solid #e1e4e8;
  padding: 1rem 1rem 0.8rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  z-index: 1201;
  font-family: 'ABC Diatype', 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 1rem;
  box-sizing: border-box;
  overflow: visible;
  @media (max-width: 900px) {
    display: none;
  }
`;

const Title = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #23272f;
  margin-bottom: 0.2rem;
`;

const SuggestionInputRow = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const SuggestionInput = styled.input`
  max-width: 145px;
  padding: 0.45rem 0.7rem;
  border: 1px solid #e1e4e8;
  border-radius: 5px;
  font-size: 1rem;
  background: #fff;
  color: #23272f;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0,123,255,0.10);
  }
`;

const AddButton = styled.button`
  background: #007bff;
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
    background: #0056b3;
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

const SuggestionItem = styled.li`
  background: #fff;
  border: 1px solid #e1e4e8;
  border-radius: 5px;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: #23272f;
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
  color: #007bff;
  font-size: 0.85rem;
  padding: 0.2rem 0;
  cursor: pointer;
  text-align: left;
  width: fit-content;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyText = styled.div`
  color: #888;
  font-size: 0.97em;
  margin: 0.3rem 0 0 0;
`;

interface Annotation {
  id: string;
  code: string;
  description: string;
  text: string;
  color: string;
  start: number;
  end: number;
}

interface Suggestion {
  id: string;
  text: string;
  evidence?: string;
  annotationId?: string;
}

interface SuggestionsPanelProps {
  annotations: Annotation[];
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ annotations }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
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
            <SuggestionItem key={s.id}>
              <div>{s.text}</div>
              {editingEvidenceId === s.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <input
                    type="text"
                    value={evidenceInput}
                    onChange={e => setEvidenceInput(e.target.value)}
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
                    <button
                      onClick={() => handleSaveEvidence(s.id)}
                      style={{
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEvidence}
                      style={{
                        background: '#eee',
                        color: '#333',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {s.evidence ? (
                    <EvidenceTag>
                      <span>📝</span>
                      {s.evidence}
                    </EvidenceTag>
                  ) : (
                    <AddEvidenceButton onClick={() => handleAddEvidence(s.id)}>
                      + Add evidence
                    </AddEvidenceButton>
                  )}
                  <div style={{ marginTop: 4 }}>
                    {s.annotationId ? (
                      (() => {
                        const ann = annotations.find(a => a.id === s.annotationId);
                        if (!ann) return null;
                        return (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: ann.color + '22', color: ann.color, borderRadius: 4, padding: '2px 8px', fontSize: '0.85em', fontWeight: 500 }}>
                            <span style={{ fontWeight: 700 }}>{ann.code}</span>
                            <span style={{ color: '#444', fontWeight: 400 }}>{ann.description}</span>
                          </div>
                        );
                      })()
                    ) : (
                      annotations.length > 0 && (
                        <select
                          style={{ fontSize: '0.85em', padding: '2px 6px', borderRadius: 3, border: '1px solid #ddd', marginTop: 2 }}
                          defaultValue=""
                          onChange={e => {
                            const annotationId = e.target.value;
                            setSuggestions(prev => prev.map(sugg =>
                              sugg.id === s.id ? { ...sugg, annotationId } : sugg
                            ));
                          }}
                        >
                          <option value="" disabled>
                            Attach annotation…
                          </option>
                          {annotations.map(ann => (
                            <option key={ann.id} value={ann.id}>
                              {ann.code}: {ann.description}
                            </option>
                          ))}
                        </select>
                      )
                    )}
                  </div>
                </>
              )}
            </SuggestionItem>
          ))
        )}
      </SuggestionsList>
    </PanelContainer>
  );
};

export default SuggestionsPanel; 