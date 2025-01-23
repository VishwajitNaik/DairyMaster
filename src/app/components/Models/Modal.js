import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="p-6 bg-blue-200 rounded-lg shadow-lg w-auto">
        <button className=" text-gray-600 bg-red-500 hover:bg-red-800 font-bold rounded" onClick={onClose}>✖️</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
