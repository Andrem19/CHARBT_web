import React from 'react';

function PleaseConfirmEmail() {

  const style = {
    backgroundColor: 'var(--bg-color)',
    color: 'var(--text-color)',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 20px',
  };

  return (
    <div style={style}>
      <h1>Welcome!</h1>
      <p style={{fontSize: '1.5em'}}>
        Your registration was successful. Please confirm your email to continue.
      </p>
    </div>
  );
}

export default PleaseConfirmEmail;
