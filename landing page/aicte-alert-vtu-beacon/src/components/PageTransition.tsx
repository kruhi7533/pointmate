import React from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = React.useState(location);
  const [transitionStage, setTransitionStage] = React.useState('enter');

  React.useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('exit');
      setTimeout(() => {
        setTransitionStage('enter');
        setDisplayLocation(location);
      }, 50);
    }
  }, [location, displayLocation]);

  return (
    <div
      className="min-h-screen bg-white z-50"
      style={{
        willChange: 'transform',
        transform: transitionStage === 'exit' ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        animation: transitionStage === 'enter' ? 'slideIn 600ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            to {
              transform: translateX(0);
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
          }
        `}
      </style>
      {children}
    </div>
  );
};

export default PageTransition; 