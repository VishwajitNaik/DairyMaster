// context/OrderContext.js
'use client';

import React, { createContext, useContext, useState } from 'react';

// Create the context
const OrderContext = createContext();

// Create the provider component
export const OrderProvider = ({ children }) => {
  const [netPayment, setNetPayment] = useState(null);

  return (
    <OrderContext.Provider value={{ netPayment, setNetPayment }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook for using the context easily
export const useOrderContext = () => useContext(OrderContext);
