import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottiePlayer = () => {
  return (
    <div style={{ width: 40, height: 40, margin: 'auto' }}>
      <DotLottieReact
        src="https://lottie.host/ffce4b47-5c53-4b8b-865b-3a121038a684/TQ6Mhvy0QE.lottie"
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottiePlayer;
