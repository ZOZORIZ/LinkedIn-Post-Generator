import React, { useEffect, useState } from 'react';

const CustomAlertDialog = ({ isOpen, onClose, onConfirm, title, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) {
      setIsMounted(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleAnimationEnd}
    >
      <div
        className={`bg-black rounded-2xl border-2 border-[#7f8cff] p-6 shadow-lg w-full max-w-lg mx-4 transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-70 opacity-0'}`}
      >
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="text-sm italic text-gray-300 mt-2">
          {children}
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black rounded-lg text-[#808080] border-0 shadow-white transition-all duration-300 hover:shadow-transparent hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-black shadow-white rounded-lg transition-all duration-300 hover:shadow-transparent hover:bg-gradient-to-r from-[#7f8cff] to-[#000000] text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomAlertDialog; 