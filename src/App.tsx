import React from 'react';
import DocumentPage from './pages/DocumentPage';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function App() {
  return (
    <AppContainer>
      <DocumentPage />
    </AppContainer>
  );
}

export default App;
