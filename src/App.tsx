import React, { useState, useEffect } from 'react';
import DocumentPage from './pages/DocumentPage';
import MobileWarning from './components/MobileWarning';
import PasswordGate from './components/PasswordGate';
import styled from 'styled-components';
import { theme } from './theme';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= theme.breakpoints.mobile;
    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, []);

  if (!isUnlocked) {
    return (
      <AppContainer>
        <PasswordGate onUnlock={() => setIsUnlocked(true)} />
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      {showMobileWarning && (
        <MobileWarning onDismiss={() => setShowMobileWarning(false)} />
      )}
      <DocumentPage />
    </AppContainer>
  );
}

export default App;
