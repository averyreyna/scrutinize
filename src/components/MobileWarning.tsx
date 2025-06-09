import React from 'react';
import styled from 'styled-components';

const WarningOverlay = styled.div`
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

const WarningContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 90%;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  color: #23272f;
  font-size: 1.5rem;
`;

const Message = styled.p`
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  line-height: 1.5;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

interface MobileWarningProps {
  onDismiss: () => void;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ onDismiss }) => {
  return (
    <WarningOverlay>
      <WarningContent>
        <Title>Mobile Experience Notice</Title>
        <Message>
          This application is optimized for larger screens. While you can use it on mobile,
          we recommend using a desktop or tablet for the best experience.
        </Message>
        <Button onClick={onDismiss}>Continue Anyway</Button>
      </WarningContent>
    </WarningOverlay>
  );
};

export default MobileWarning; 