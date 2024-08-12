import React from 'react';
import { useSelector } from 'react-redux';

function AppPage() {
  const isMobile = useSelector(state => state.user.isMobile);

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Высота контейнера на всю высоту экрана
    textAlign: 'center',
    fontSize: isMobile ? '12px' : '26px',
  };

  return (
    <div style={containerStyle}>
      Android app is in development and will be available soon...
    </div>
  );
}

export default AppPage;

