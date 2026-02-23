import React from 'react';
import ModalOverlay from './ModalOverlay';

interface MobileWarningProps {
  onDismiss: () => void;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ onDismiss }) => (
  <ModalOverlay
    title="Mobile Experience Notice"
    message="This application is optimized for larger screens. While you can use it on mobile, we recommend using a desktop or tablet for the best experience."
    buttonLabel="Continue Anyway"
    onButtonClick={onDismiss}
  />
);

export default MobileWarning;
