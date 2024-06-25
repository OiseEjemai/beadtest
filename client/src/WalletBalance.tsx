// src/WalletBalance.js
import React, { useEffect, useState } from 'react';
import TonWeb from 'tonweb';
import { useTonAddress } from '@tonconnect/ui-react';
import axios from 'axios';


// Initialize TonWeb
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'));

const WalletBalance = () => {
  const address = useTonAddress(); // Hook to get the user's friendly address
  const [balance, setBalance] = useState(null);
  const [usdBalance, setUsdBalance] = useState(null);


  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        try {
          const balanceResult = await tonweb.provider.getBalance(address);
          const tonBalance = tonweb.utils.fromNano(balanceResult);
          setBalance(tonBalance);

          // Fetch TON to USD exchange rate
          const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
          const exchangeRate = response.data['the-open-network'].usd;
          setUsdBalance(tonBalance * exchangeRate);
        } catch (error) {
          console.error('Failed to fetch balance or exchange rate:', error);
        }
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <div>
      {address ? (
        <>
          <p className='text-5xl pt-4 text-center'>{usdBalance !== null ? `$${usdBalance.toFixed(2)}` : 'Fetching USD balance...'}</p>

          <p className='text-center text-xl'>{balance !== null ? `${balance} TON` : 'Fetching balance...'}</p>
        </>
      ) : (
        <p>Connecting to wallet...</p>
      )}
    </div>
  );
};

export default WalletBalance;
