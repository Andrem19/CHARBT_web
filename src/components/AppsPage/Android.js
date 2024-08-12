import React from 'react';
import { useSelector } from 'react-redux';

function AppPage() {
  const isMobile = useSelector(state => state.user.isMobile);

  const textStyle = {
    textAlign: 'center',
    fontSize: isMobile ? '12px' : '16px',
  };

  return (
    <div style={textStyle}>
      Android app is in development and will be available soon...
    </div>
  );
}

export default AppPage;
