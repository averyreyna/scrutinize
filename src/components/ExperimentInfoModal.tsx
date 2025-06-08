import React from 'react';
import styled from 'styled-components';

interface ExperimentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 420px;
  width: 100%;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #888;
  cursor: pointer;
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 1.2rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #23272f;
`;

const List = styled.ul`
  margin: 1.2rem 0 0 0;
  padding-left: 1.2rem;
  color: #23272f;
`;

const ExperimentInfoModal: React.FC<ExperimentInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">&times;</CloseButton>
        <Title>About This Experiment</Title>
        <div>
          <p>
            This tool is an experimental essay generator and annotation platform. It allows you to:
          </p>
          <List>
            <li>Generate essays on any topic using AI</li>
            <li>Add, edit, and view annotations directly on the generated document</li>
            <li>Experiment with interactive document review and feedback</li>
            <li>Explore new ways to engage with AI-generated content</li>
          </List>
          <p style={{marginTop: '1.2rem'}}>
            The goal is to explore how AI can support writing, reviewing, and collaborative annotation workflows. Your feedback and experimentation are welcome!
          </p>
        </div>
      </Modal>
    </Overlay>
  );
};

export default ExperimentInfoModal; 