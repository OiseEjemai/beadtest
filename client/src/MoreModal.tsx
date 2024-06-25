import React, { useEffect, useState } from 'react';

const MoreModal = ({ isOpen, onClose, children, onItemClick }) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setTimeout(() => setShow(false), 300); // Match the duration of fade-out animation
    }
  }, [isOpen]);

  if (!show) return null;

  const handleItemClick = () => {
    onItemClick();
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg">
        <button onClick={onClose} className="absolute top-0 right-0 -mt-4 -mr-4 p-2 rounded-full bg-black text-white hover:bg-black focus:outline-none focus:bg-black">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">List of Items</h2>
          <ul className="divide-y divide-gray-200 w-full">
            {React.Children.map(children, (child, index) => (
              React.cloneElement(child, {
                onClick: handleItemClick // Attach click handler to each list item
              })
            ))}
          </ul>
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="w-full px-4 py-2 text-base font-semibold text-white bg-black rounded-md hover:bg-black focus:outline-none focus:bg-black">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreModal;
