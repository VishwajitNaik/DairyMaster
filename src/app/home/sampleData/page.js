'use client'
import React, { useState } from 'react';

const Page = () => {
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');
  const [inputC, setInputC] = useState('');

  const handleInputChange = (e, setter) => {
    setter(e.target.value);

    const a = parseFloat(e.target.name === 'inputA' ? e.target.value : inputA) || 0;
    const b = parseFloat(e.target.name === 'inputB' ? e.target.value : inputB) || 0;

    setInputC((a + b).toString());
  };

  return (
    <div>
      <label htmlFor="inputA" className="grid-flow-col">Input a</label>
      <input
        type="text"
        name="inputA"
        className="text-black"
        value={inputA}
        onChange={(e) => handleInputChange(e, setInputA)}
      />
      <label htmlFor="inputB">Input b</label>
      <input
        type="text"
        name="inputB"
        className="text-black"
        value={inputB}
        onChange={(e) => handleInputChange(e, setInputB)}
      />
      <label htmlFor="inputC">Input c</label>
      <input
        type="text"
        name="inputC"
        className="text-black"
        value={inputC}
        readOnly
      />
    </div>
  );
};

export default Page;
