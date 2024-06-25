import React, { useEffect, useState } from 'react';
import tonConnect from './tonConnect';
import { useTonConnectUI } from '@tonconnect/ui-react';
import axios from 'axios';

const SendTon: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [inputValue, setInputValue] = useState('');

  const myWalletAddress = '0QCYM7d3gXybi1HNulFdLddRJvxECK2GruQRCeJmf9g7Rs7R';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (address && amount) {
        const wallet = tonConnect.getWallets();

        if (!wallet) {
          console.error('No wallet connected');
          return;
        }

        const purchaseResponse = { success: true, message: 'TON successfully transferred' };

        const userAmount = parseFloat(amount);
        const commission = userAmount * 0.01;
        const totalAmount = userAmount + commission;

        const userAmountInNanotons = (userAmount * 1e9).toString();
        const commissionInNanotons = (commission * 1e9).toString();
        const totalAmountInNanotons = (totalAmount * 1e9).toString();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              address,
              amount: totalAmountInNanotons,
            },
            {
              address: myWalletAddress,
              amount: commissionInNanotons,
            },
          ],
        };

        await tonConnectUI.sendTransaction(transaction);
        alert('Transaction sent successfully!');

        const transactionDetails = {
          type: 'Transfer',
          provider: address,
          phoneNumber: null,
          amount: userAmount,
          success: purchaseResponse.success,
        };

        await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
      } else {
        document.querySelector('#error-text')?.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      const transactionDetails = {
        type: 'Transfer',
        provider: address,
        phoneNumber: null,
        amount,
        success: false,
      };

      await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
    }
  };

  const isAnyFieldEmpty = () => !address || !amount;

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <h2 className="text-2xl mb-4 text-black">Send TON</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Wallet Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Receiver's Address"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              step="0.000000001"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10 TON"
            />
            <p className="text-black">
              <em>A commission fee of 1% will be deducted</em>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              disabled={isAnyFieldEmpty()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Send
            </button>
            <div className="text-red-500 hidden" id="error-text">
              Complete the form
            </div>
            <button
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              type="button"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendTon;
