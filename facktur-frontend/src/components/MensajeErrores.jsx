import React, { useEffect, useState, useRef } from 'react';

export const MensajeErrores = ({ mensaje, onClose }) => {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(100);
  const progressRef = useRef(progress);
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
            setShow(false);
            if (onClose) onClose();
            return 0;
          }
          return prevProgress - 1;
        });
      }, 35); //duracion del alert de error

      return () => clearInterval(timerRef.current);
    }
  }, [show, onClose]);

  if (!mensaje || !show) return null;

  return (
    <div
      className="alert alert-danger position-absolute top-0 start-0 w-90"
      role="alert"
      style={{ zIndex: 9999 }}
    >
      <div className="d-flex justify-content-between">
        <span>{mensaje}</span>
        <button
          type="button"
          className="btn-close btn-close-white"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </div>

      <div className="progress" style={{ height: '5px' }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
