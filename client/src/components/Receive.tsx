import React, { useEffect } from 'react';
import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import QRCode from 'qrcode.react';
import feather from 'feather-icons'

const Receive: React.FC = () => {
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  // const { wallet } = useTonWallet();
  const userAddress = userFriendlyAddress

  const handleCopyAddress = () => {
    if (userAddress) {
      navigator.clipboard.writeText(userAddress);
      alert('Address copied to clipboard!');
    }
  };

  useEffect(() => {
    feather.replace();
  }, []);

  return (
    <div className='bg-gray-800'>
      <a href="/">
        <i data-feather="arrow-left" className="text-white m-4 text-2xl"></i>
      </a>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-4">Receive TON</h1>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 py-6 w-full max-w-lg">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-bold mb-2" htmlFor="address">
              Your Wallet Address
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2">
              {userAddress || 'Connecting...'}
            </div>
          </div>
          {userAddress ? (
            <div className="flex flex-col items-center">
              <QRCode value={userAddress} size={256} />
              <button
                onClick={handleCopyAddress}
                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
              >
                Copy Address
              </button>
            </div>
          ) : (
            <button
              disabled
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-gray-300 text-gray-500"
            >
              Connecting to Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receive;

