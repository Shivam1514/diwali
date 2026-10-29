import React, { useState, useEffect, useCallback } from 'react';
import EnvelopeScene from './components/EnvelopeScene';
import InvitationCard from './components/InvitationCard';
import ParticleBackground from './components/ParticleBackground';
import FireworksEffect from './components/FireworksEffect';
import RamayanaDroneShow from './components/RamayanaDroneShow';

function App() {
  const [cardOpen, setCardOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showDroneShow, setShowDroneShow] = useState(false);

  const handleEnvelopeClick = useCallback(() => {
    setCardOpen(true);
    setShowFireworks(true);
    setTimeout(() => setShowFireworks(false), 3500);
  }, []);

  const handleCloseCard = useCallback(() => {
    setCardOpen(false);
  }, []);

  const handleCelebrateClick = useCallback(() => {
    setShowDroneShow(true);
  }, []);

  const handleCloseDroneShow = useCallback(() => {
    setShowDroneShow(false);
  }, []);

  // Prevent background scroll when overlays are active
  useEffect(() => {
    if (cardOpen || showDroneShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [cardOpen, showDroneShow]);

  return (
    <div className="app-bg">
      <ParticleBackground />

      <div className="scene">
        <EnvelopeScene onClick={handleEnvelopeClick} isOpen={cardOpen} />
      </div>

      {cardOpen && (
        <InvitationCard
          onClose={handleCloseCard}
          onCelebrate={handleCelebrateClick}
        />
      )}

      {showFireworks && !showDroneShow && <FireworksEffect />}

      {showDroneShow && (
        <RamayanaDroneShow onClose={handleCloseDroneShow} />
      )}
    </div>
  );
}

export default App;
