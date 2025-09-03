import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

const LoadingScreen = ({ onLoaded }) => {
  const loadingScreenRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.to(loadingScreenRef.current, {
      x: '100%',
      duration: 1,
      delay: 0.5,
      ease: "expo.inOut",
      onComplete: () => {
        onLoaded();
      },
    });
  }, [onLoaded]);

  return (
    <div 
      ref={loadingScreenRef}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[1000]"
    >
      <Bouncy
        size="60"
        speed="1.75"
        color="white"
      />
    </div>
  );
};

export default LoadingScreen; 