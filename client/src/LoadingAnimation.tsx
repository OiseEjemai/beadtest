import React, { useEffect, useState } from 'react';
import './index.css'

const LoadingAnimation = ({ children }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 0),    // First bead
      setTimeout(() => setStage(2), 1000), // Second bead
      setTimeout(() => setStage(3), 2000), // Third bead
      setTimeout(() => setStage(4), 3000), // Text appears
      setTimeout(() => setStage(5), 7000), // Text disappears, content shows
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <>
      {stage < 5 ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="flex space-x-2">
            {stage > 0 && <div className="animate-fallDown">🔴</div>}
            {stage > 1 && <div className="animate-fallDown">🔴</div>}
            {stage > 2 && <div className="animate-fallDown">🔴</div>}
          </div>
          {stage > 3 && (
            <div className="mt-4 animate-fadeInRight">
              <h1 className="text-4xl font-bold barlow-semi-condensed-light">Bead Pay</h1>
            </div>
          )}
        </div>
      ) : (
        <div className="opacity-100 transition-opacity duration-1000">
          {children}
        </div>
      )}
    </>
  );
};

export default LoadingAnimation;
