// src/TONConnectComponent.tsx
import React from 'react';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

const TONConnectComponent = ({ totalAmountInNanotons, payload, onTransactionSuccess }) => {
    const [tonConnectUI, setOptions] = useTonConnectUI();

  const handleTransaction = async () => {
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
      messages: [
        {
          address: '0QCIU4p4upDd_cD8swzvxbcfiP_IvjKR9YIIClp_E5e3rAVi', // Replace with actual TON wallet address
          amount: totalAmountInNanotons.toString(), // Ensure the amount is in string format
          payload,
        },
      ],
    };

    try {
      await tonConnectUI.sendTransaction(transaction);
      onTransactionSuccess();
    } catch (error) {
      console.error('Transaction failed', error);
    }
  };

  return (
    <div>
      <button onClick={handleTransaction} className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-4'>Complete TON Transaction</button>
    </div>
  );
};

export default TONConnectComponent;
