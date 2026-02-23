import React from 'react';
import ModalOverlay from './ModalOverlay';

interface ErrorNotificationProps {
  message: string;
  onDismiss: () => void;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message, onDismiss }) => (
  <ModalOverlay
    title="Error"
    message={message}
    buttonLabel="Dismiss"
    onButtonClick={onDismiss}
    variant="error"
  />
);

export default ErrorNotification;
