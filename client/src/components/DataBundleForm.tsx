import React, { useState, useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import dataService from '../DataService/dataServices';
import { useTonConnectUI } from '@tonconnect/ui-react';
import feather from 'feather-icons'

import axios from 'axios';

const providers = ['mtn-data', 'glo-data', 'airtel-data', 'etisalat-data'];
const FIXED_EXCHANGE_RATE_NGN_TO_TON = 0.0001;

const DataBundleForm = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [amount, setAmount] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [tonConnectUI, connect] = useTonConnectUI();
  useEffect(() => {
    feather.replace();
  }, []);

  useEffect(() => {
    if (provider) {
      dataService.getDataBundle(provider)
        .then((fetchedPlans) => setPlans(fetchedPlans))
        .catch((err) => setError(err.message));
    }
  }, [provider]);

  const handlePlanChange = (event) => {
    const selectedPlanAmount = event.target.value;
    setSelectedPlan(selectedPlanAmount); // Update selectedPlan state with the selected amount

    // Optionally, update additional details based on the selected plan
    const selectedPlanDetails = plans.find((plan) => plan.variation_amount === selectedPlanAmount);
    // Update other states if needed, such as amount
    if (selectedPlanDetails) {
      const parsedAmount = parseFloat(selectedPlanAmount);
      setAmount(parsedAmount);
    }
  };


  const handlePurchase = async () => {
    try {
      if (provider && phoneNumber && selectedPlan) {
        const purchaseResponse = await dataService.buyData(provider, phoneNumber, selectedPlan);
        setResponse(purchaseResponse);
        setError(null);

        const amountInTON = amount * FIXED_EXCHANGE_RATE_NGN_TO_TON;
        const amountInNanotons = (amountInTON * 1e9).toString();
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
            {
              address: '0QCYM7d3gXybi1HNulFdLddRJvxECK2GruQRCeJmf9g7Rs7R',
              amount: amountInNanotons,
            },
          ],
        };

        await tonConnectUI.sendTransaction(transaction);
        const transactionDetails = {
          type: 'Data Bundle',
          provider,
          phoneNumber,
          planId: selectedPlan,
          amount: amount,
          success: true,
        };

        await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);

        onClose();
      } else {
        document.querySelector('#error-text')?.classList.remove('hidden');
      }
    } catch (err) {
      setError(err.message);
      setResponse(null);

      const transactionDetails = {
        type: 'Data Bundle',
        provider,
        phoneNumber,
        planId: selectedPlan,
        amount: amount,
        success: false,
      };

      await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
    }
  };

  const handleFlutterwavePayment = async (response) => {
    if (response.status === 'successful') {
      try {
        const subscriptionResponse = await dataService.buyData(provider, phoneNumber, selectedPlan);
        console.log('Subscription successful!', subscriptionResponse);
      } catch (err) {
        alert('Subscription failed. Please try again.');
      }
    }
    closePaymentModal();
  };

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: Date.now(),
    amount: parseFloat(amount),
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email,
      phone_number: phoneNumber,
      name,
    },
    customizations: {
      title: 'TV Subscription',
      description: `Payment for ${provider} subscription`,
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };
  const handleFlutterPayment = useFlutterwave(config);

  const isAnyFieldEmpty = () => !provider || !phoneNumber || !selectedPlan;

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 w-full max-w-3xl">
      <a href="/more">
      <i data-feather="arrow-left" className="text-white"></i></a>
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Buy Data</h1>
        <div>
          <label className="block text-white">
            Provider:
            <select
              value={provider}  // Set the value attribute to provider
              onChange={(e) => setProvider(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a provider</option>
              {providers.map((providerOption) => (
                <option key={providerOption} value={providerOption}>
                  {providerOption.toUpperCase()}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">Select Plan</label>
          <select
            value={selectedPlan}
            onChange={handlePlanChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a plan</option>
            {plans && plans.length > 0 ? (
              plans.map((plan) => (
                <option key={plan.variation_amount} value={plan.variation_amount}>
                  {plan.name}
                </option>
              ))
            ) : (
              <option value="">No plans available</option>
            )}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">Phone Number</label>
          <input type="text" placeholder='070****' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">Email Address</label>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-white dark:text-gray-300 mb-2">Name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button
          onClick={() => {
            handleFlutterPayment({
              callback: handleFlutterwavePayment,
              onClose: () => { },
            });
          }}
          disabled={isAnyFieldEmpty()}
          type='button'
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
        >
          Pay with Naira
        </button>
        <button onClick={handlePurchase} disabled={isAnyFieldEmpty()} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Pay with TON</button>
        <div className="text-red-500 hidden" id='error-text'>Complete the form</div>
        {response && <div>Success: {JSON.stringify(response.response_description)}</div>}
        {error && <div>Error: {JSON.stringify(error.message)}</div>}
      </div>
    </div>

  );
};

export default DataBundleForm;
