import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';

const Modal = ({ isOpen, onClose, title, content, acceptTerms, date }) => {
  const theme = useSelector((state) => state.data.theme);
  if (!isOpen) return null;
  

  const accept = () => {
    onClose()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: theme === 'dark' ? 'rgb(37, 36, 36)' : 'rgb(237, 236, 236)',
        padding: '1em',
        width: '80%',
        maxHeight: '80%',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {acceptTerms ? null : (
          <button onClick={onClose} style={{
            position: 'absolute',
            right: '1em',
            top: '1em',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '1.5em'
          }}>×</button>
        )}
        <h2>{title}</h2>
        <p>Last Updated: {date}</p>
        <div style={{border: '1px solid #ccc', padding: '1em', margin: '1em'}}>
          <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-word'}}>{content}</pre>
        </div>
        {acceptTerms ? (
          <div style={{marginLeft: 15, display: 'flex', justifyContent: 'flex-start', gap: '10px'}}>
            <button className="btn btn-primary" onClick={accept}>Accept</button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Modal;
