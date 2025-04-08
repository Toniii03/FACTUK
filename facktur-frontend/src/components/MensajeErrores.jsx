import React, { useEffect, useState, useRef } from 'react';
import '../styles/MensajesAlertas/styleMensaje.css';

export const MensajeErrores = ({ mensaje, onClose }) => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef(null);

  const handleClose = () => {
    setShow(false);
    if (onClose) onClose();
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (show) {
      timerRef.current = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 0) {
            clearInterval(timerRef.current);
            setTimeout(() => {
              setShow(false);
              if (onClose) onClose();
            }, 250); // retraso para que de tiempo a terminar la animacion
            return 0;
          }
          return prevProgress - 1;
        });
      }, 50); //duracion de barra de progreso

      return () => clearInterval(timerRef.current);
    }
  }, [show, onClose]);

  if (!mensaje || !show) return null;

  return (
    <div
      className="custom-alert"
      role="alert"
      style={{ zIndex: 9999 }}
    >
      <div className="d-flex justify-content-between align-items-center"
      style={{
        marginBottom : '1rem'
      }}>
        <span>{mensaje}</span>
        <button
          type="button"
          className="btn-close btn-close-black"
          aria-label="Close"
          onClick={handleClose}
          style={{
            marginLeft : '1.2em'
          }}
        ></button>
      </div>

      <div
        className="progress"
        style={{
          height: '5px',
          backgroundColor: 'rgba(255, 0, 0, 0)',
        }}
      >
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${progress}%`,
            backgroundColor: '#6c757d',
          }}
        ></div>
      </div>
    </div>
  );
};
