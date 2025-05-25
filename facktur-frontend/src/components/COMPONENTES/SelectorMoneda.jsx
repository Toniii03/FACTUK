import React from 'react';
import { useMoneda } from './MonedaContext';
import "../../styles/componentes/selectorMonedas.css"

const SelectorMoneda = () => {
  const { moneda, cambiarMoneda } = useMoneda();

  return (
    <select
      className="selector-moneda"
      value={moneda}
      onChange={(e) => cambiarMoneda(e.target.value)}
    >
      <option value="EUR">EUR (€)</option>
      <option value="USD">USD ($)</option>
      <option value="GBP">GBP (£)</option>
    </select>
  );
};

export default SelectorMoneda;
