import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Content = styled.div`
  background: ${theme.colors.white};
  padding: 2rem;
  border-radius: 8px;
  max-width: 90%;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2<{ variant: 'error' | 'neutral' }>`
  margin: 0 0 1rem 0;
  color: ${props => props.variant === 'error' ? '#dc3545' : theme.colors.text};
  font-size: 1.5rem;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  line-height: 1.5;
`;

const Button = styled.button<{ variant: 'error' | 'neutral' }>`
  background: ${props => props.variant === 'error' ? '#dc3545' : theme.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.variant === 'error' ? '#c82333' : theme.colors.primaryHover};
  }
`;

export interface ModalOverlayProps {
  title: string;
  message: React.ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
  variant?: 'error' | 'neutral';
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  title,
  message,
  buttonLabel,
  onButtonClick,
  variant = 'neutral',
}) => (
  <Overlay>
    <Content>
      <Title variant={variant}>{title}</Title>
      <Message>{message}</Message>
      <Button variant={variant} onClick={onButtonClick}>{buttonLabel}</Button>
    </Content>
  </Overlay>
);

export default ModalOverlay;
