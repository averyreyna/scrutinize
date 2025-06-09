import React, { useState } from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: fixed;
  top: 72px;
  left: 28px;
  width: 220px;
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
  flex: 1;
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
`;

const EmptyText = styled.div`
  color: #888;
  font-size: 0.97em;
  margin: 0.3rem 0 0 0;
`;

const SuggestionsPanel: React.FC = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setSuggestions(prev => [...prev, input.trim()]);
      setInput('');
    }
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
          suggestions.map((s, i) => (
            <SuggestionItem key={i}>{s}</SuggestionItem>
          ))
        )}
      </SuggestionsList>
    </PanelContainer>
  );
};

export default SuggestionsPanel; 