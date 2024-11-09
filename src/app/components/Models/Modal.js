import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-auto">
        <button className=" text-gray-600 bg-red-600 " onClick={onClose}>✖️</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
