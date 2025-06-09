import React, { useState, useEffect } from 'react';
import DocumentPage from './pages/DocumentPage';
import MobileWarning from './components/MobileWarning';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setShowMobileWarning(true);
    }
  }, []);

  return (
    <AppContainer>
      {showMobileWarning && <MobileWarning onDismiss={() => setShowMobileWarning(false)} />}
      <DocumentPage />
    </AppContainer>
  );
}

export default App;
