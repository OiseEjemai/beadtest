import React, { useEffect, useState } from 'react';

const NewDiv: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`text-center text-2xl p-4 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      This is the new div.
    </div>
  );
};

export default NewDiv;
