'use client'
import React, { useState } from 'react';

const MilkEntryForm = () => {
  // State variables for form inputs
  const [liter, setLiter] = useState('');
  const [fat, setFat] = useState('');
  const [snf, setSnf] = useState('');
  const [rate, setRate] = useState('');
  const [total, setTotal] = useState(0);
  const [milkType, setMilkType] = useState('buffalo'); // Default milk type

  // SNF ranges for Buffalo and Cow milk
  const BUFFALO_SNF_RANGES = {
    HF: { min: 7.5, max: 8.5 },
    R1: { min: 8.0, max: 9.0 },
    LF: { min: 7.0, max: 7.5 },
    R2: { min: 8.5, max: 9.5 },
  };

  const COW_SNF_RANGES = {
    HF: { min: 7.0, max: 8.0 },
    R1: { min: 7.5, max: 8.5 },
    LF: { min: 6.5, max: 7.0 },
    R2: { min: 8.0, max: 9.0 },
  };

  // Function to get the correct SNF ranges based on selected milk type
  const getSNFRanges = () => (milkType === 'buffalo' ? BUFFALO_SNF_RANGES : COW_SNF_RANGES);

  // Function to calculate rate and total
  const calculateTotal = () => {
    const calculatedTotal = parseFloat(rate) * parseFloat(liter);
    setTotal(calculatedTotal || 0); // Handle NaN if inputs are not numbers
  };

  // Handle form submission (calculation)
  const handleSubmit = (e) => {
    e.preventDefault();
    calculateTotal();
  };

  return (
    <div>
      <h2>Milk Entry Form</h2>

      <form onSubmit={handleSubmit}>
        {/* Select Milk Type */}
        <div>
          <label htmlFor="milkType">Select Milk Type:</label>
          <select
            id="milkType"
            className='text-black'
            value={milkType}
            onChange={(e) => setMilkType(e.target.value)}
          >
            <option value="buffalo">Buffalo</option>
            <option value="cow">Cow</option>
          </select>
        </div>

        {/* Liter Input */}
        <div>
          <label htmlFor="liter">Liter:</label>
          <input
            type="number"
            className='text-black'
            id="liter"
            value={liter}
            onChange={(e) => setLiter(e.target.value)}
            required
          />
        </div>

        {/* Fat Input */}
        <div>
          <label htmlFor="fat">Fat (%):</label>
          <input
            type="number"
            className='text-black'
            id="fat"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
            required
          />
        </div>

        {/* SNF Input */}
        <div>
          <label htmlFor="snf">SNF:</label>
          <input
            type="number"
            className='text-black'
            id="snf"
            value={snf}
            onChange={(e) => setSnf(e.target.value)}
            required
          />
        </div>

        {/* Rate Input */}
        <div>
          <label htmlFor="rate">Rate:</label>
          <input
            type="number"
            className='text-black'
            id="rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            required
          />
        </div>

        {/* Display SNF Ranges */}
        <div>
          <h4>SNF Ranges for {milkType === 'buffalo' ? 'Buffalo' : 'Cow'} Milk</h4>
          <p>HF: {getSNFRanges().HF.min} - {getSNFRanges().HF.max}</p>
          <p>R1: {getSNFRanges().R1.min} - {getSNFRanges().R1.max}</p>
          <p>LF: {getSNFRanges().LF.min} - {getSNFRanges().LF.max}</p>
          <p>R2: {getSNFRanges().R2.min} - {getSNFRanges().R2.max}</p>
        </div>

        {/* Submit Button */}
        <button type="submit">Calculate Total</button>
      </form>

      {/* Output Total */}
      <div>
        <h3>Total Amount: ₹{total}</h3>
      </div>
    </div>
  );
};

export default MilkEntryForm;
