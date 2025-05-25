import React, { createContext, useContext, useState } from "react";

const MonedaContext = createContext();

export const MonedaProvider = ({ children }) => {
  const [moneda, setMoneda] = useState("EUR");

  const cambiarMoneda = (nuevaMoneda) => {
    setMoneda(nuevaMoneda);
  };

  return (
    <MonedaContext.Provider value={{ moneda, cambiarMoneda }}>
      {children}
    </MonedaContext.Provider>
  );
};

export const useMoneda = () => {
  const context = useContext(MonedaContext);
  if (!context) {
    throw new Error("useMoneda debe usarse dentro de un MonedaProvider");
  }
  return context;
};
