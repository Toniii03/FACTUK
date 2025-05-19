import { createContext, useContext, useState } from 'react';

const MensajesContext = createContext();

export const MensajesProvider = ({ children }) => {
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const mostrarError = (msg) => setError(msg);
  const mostrarMensaje = (msg) => setMensaje(msg);
  const cerrarError = () => setError('');
  const cerrarMensaje = () => setMensaje('');

  return (
    <MensajesContext.Provider value={{
      error,
      mensaje,
      mostrarError,
      mostrarMensaje,
      cerrarError,
      cerrarMensaje
    }}>
      {children}
    </MensajesContext.Provider>
  );
};

export const useMensajes = () => useContext(MensajesContext);
