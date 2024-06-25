// src/App.jsx
import React, { useState } from 'react';
import { purchaseAirtime, createTONTransaction } from './vtpassService';

import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';


function AirtimePayment() {
  const [network, setNetwork] = useState('');
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    try {
      // Purchase Airtime
      const airtimeResponse = await purchaseAirtime(network, phoneNumber, amount);
      setResponse(airtimeResponse);
      setError(null);

      // Create TON Transaction
      const payload = 'Airtime purchase'; // Custom payload or description
      const transaction = await createTONTransaction(amount, payload);

      // Open TON Wallet
      // if (window.ton) {
      //   window.ton.send('ton_sendTransaction', [transaction])
      //     .then((res) => {
      //       console.log('Transaction successful:', res);
      //     })
      //     .catch((err) => {
      //       console.error('Transaction error:', err);
      //     });
      // } else {
      //   console.error('TON wallet is not available');
      // }
      await tonConnectUI.sendTransaction(transaction);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    }
  };

  return (
    <div>
      <h1>Purchase Airtime</h1>
      <div>
        <label>
          Network:
          <input type="text" value={network} onChange={(e) => setNetwork(e.target.value)} className='text-black' />
        </label>
      </div>
      <div>
        <label>
          Phone Number:
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='text-black' />
        </label>
      </div>
      <div>
        <label>
          Amount:
          <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className='text-black'/>
        </label>
      </div>
      <button onClick={handlePurchase}>Purchase</button>
      {response && <div>Success: {JSON.stringify(response)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  );
}

export default AirtimePayment;
