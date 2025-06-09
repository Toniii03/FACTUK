import React, { createContext, useContext, useState, useEffect } from "react";

const MonedaContext = createContext();

export const MonedaProvider = ({ children }) => {
  const [moneda, setMoneda] = useState(() => {
    return localStorage.getItem("moneda") || "EUR";
  });

  useEffect(() => {
    localStorage.setItem("moneda", moneda);
  }, [moneda]);

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
