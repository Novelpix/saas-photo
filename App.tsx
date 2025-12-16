import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { StudioPage } from './components/StudioPage';
import { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      {currentPage === 'landing' && <LandingPage onNavigate={navigateTo} />}
      {currentPage === 'studio' && <StudioPage onNavigate={navigateTo} />}
    </>
  );
}

export default App;