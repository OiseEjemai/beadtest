import React, { useState, useEffect } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { fetchTVPlans, purchaseTVSubscription } from '../vtpassService';
import { useTonWallet } from '../TonWalletProvider';
import tonConnect from '../tonConnect';
import { useTonConnectUI, TonConnectUiOptions, useTonAddress } from '@tonconnect/ui-react';

const FIXED_EXCHANGE_RATE_NGN_TO_TON = 0.0001;

const providers = ['dstv', 'gotv', 'startimes', 'showmax'];
const renews = ['change', 'renew'];


const parseAmount = (name) => {
  console.log("Parsing amount from plan name:", name);
  const parts = name.split('N');
  if (parts.length > 1) {
    const pricePart = parts[1].trim();
    const price = parseFloat(pricePart.replace(/,/g, '')); // Remove commas and parse as float
    console.log("Parsed price:", price);
    return isNaN(price) ? 0 : price; // Return 0 if price cannot be parsed
  }
  console.warn("Unexpected plan name format:", name);
  return 0;
};

const TVSubscriptionForm = ({ closePopup }) => {
  const userFriendlyAddress = useTonAddress();

  const [provider, setProvider] = useState('');
  const [email, setEmail] = useState('');
  const [renewtype, setRenewType] = useState('')
  const [name, setName] = useState('');
  const [decoderNumber, setDecoderNumber] = useState('');
  const [plans, setPlans] = useState([]);
  const [amount, setAmount] = useState(0); // State to store the amount of the selected plan
  const [selectedPlan, setSelectedPlan] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  //   const  = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

  useEffect(() => {
    if (provider) {
      fetchTVPlans(provider)
        .then((fetchedPlans) => {
          console.log("Fetched plans:", fetchedPlans);
          setPlans(fetchedPlans);
        })
        .catch((err) => setError(err.message));
    }
  }, [provider]);

  const handlePlanChange = (event) => {
    const selectedPlanAmount = event.target.value;
    console.log("Selected plan amount:", selectedPlanAmount);
    setSelectedPlan(selectedPlanAmount);

    // Debugging: Log the plans array to verify its content
    console.log("Plans array before find:", plans);

    const selectedPlanDetails = plans.find((plan) => plan.variation_amount === selectedPlanAmount);
    console.log("Selected plan details:", selectedPlanDetails);

    if (selectedPlanDetails) {
      const parsedAmount = parseFloat(selectedPlanAmount);
      console.log("Parsed amount set to:", parsedAmount);
      setAmount(parsedAmount);
    } else {
      console.error("Selected plan details not found for amount:", selectedPlanAmount);
    }
  };

  const handlePurchase = async () => {
    try {
      if (email && decoderNumber && amount && provider && renewtype && name && phoneNumber && selectedPlan) {
      const wallet = tonConnect.getWallets();
      if (!wallet) {
        alert('No wallet connected');
        return;
      }

      if (!selectedPlan) {
        alert('Please select a plan');
        return;
      }
      const subscriptionResponse = await purchaseTVSubscription(provider, decoderNumber, selectedPlan, phoneNumber, renewtype);
      setResponse(subscriptionResponse);
      setError(null);

      const userAmount = parseFloat(amount);
      const userAmountConv = userAmount * FIXED_EXCHANGE_RATE_NGN_TO_TON

      const userAmountInNanotons = (userAmountConv * 1e9).toString();
      console.dir(selectedPlan)

      // const amountInNanotons = (userAmountConv * 1e9).toString(); // Convert amount to nanotons
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: '0QCYM7d3gXybi1HNulFdLddRJvxECK2GruQRCeJmf9g7Rs7R', // Replace with actual Ton address
            amount: userAmountInNanotons,
          },
        ],
      };
      // await connect(); // Connect to the Ton wallet

      // Send transaction
      await tonConnectUI.sendTransaction(transaction);

      alert('Transaction sent successfully!');
      closePopup(); // Close the popup on success
    } else {
      console.log('Not going')
      document.querySelector('#error-text')?.classList.remove('hidden')
  }
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
      setResponse(null);
    }
  };

  const handleFlutterwavePayment = async (response) => {
    console.log(response);
    if (response.status === 'successful') {
      try {
        const subscriptionResponse = await purchaseTVSubscription(provider, decoderNumber, selectedPlan, phoneNumber, renewtype);
        console.log('Subscription successful:', subscriptionResponse);
        alert('Subscription successful!');
      } catch (err) {
        console.error('Subscription failed:', err);
        alert('Subscription failed. Please try again.');
      }
    }
    closePaymentModal(); // this will close the modal programmatically
  };

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY, // Replace with your Flutterwave public key
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

  const isAnyFieldEmpty = () => {
    return !email || !decoderNumber || !amount || !provider || !renewtype || !name || !phoneNumber || !selectedPlan;
};


  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Purchase TV Subscription</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={closePopup}>X</button>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Provider:
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select a provider</option>
              {providers.map((provider) => (
                <option key={provider} value={provider}>
                  {provider.toUpperCase()}
                </option>
              ))}
            </select>          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Decoder Number:
            <input type="text" placeholder="Decoder Number" value={decoderNumber} onChange={(e) => setDecoderNumber(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Subscription Type:
            <select value={renewtype} onChange={(e) => setRenewType(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select Your Subscription type</option>
              {renews.map((renew) => (
                <option key={renew} value={renew}>
                  {renew.toUpperCase()}
                </option>
              ))}
            </select>          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Plan:
            <select value={selectedPlan} onChange={handlePlanChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
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

          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
            <input type="text" placeholder='070*......' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          </label>
        </div>
        <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className='mb-4'>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name:
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <p className="text-gray-700">Amount: N{amount.toLocaleString()}</p>
        </div>
        <button
          onClick={() => {
            handleFlutterPayment({
              callback: handleFlutterwavePayment,
              onClose: () => {},
            });
          }}
          disabled={isAnyFieldEmpty()}
          type='button'
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Pay with Naira
        </button>
        <button type='button' onClick={handlePurchase} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Pay with TON</button>
        <div className="text-red-500 hidden" id='error-text'>Complete the form</div>
        {response && <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded">Success: {JSON.stringify(response)}</div>}
        {error && <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">Error: {JSON.stringify(error)}</div>}
      </div>
    </div>
  );
};

export default TVSubscriptionForm;
