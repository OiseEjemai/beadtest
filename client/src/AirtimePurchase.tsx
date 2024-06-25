// src/App.jsx
import React, { useState, useEffect } from 'react';
import feather from 'feather-icons'

import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { purchaseAirtime, createTONTransaction } from './vtpassService';
import axios from 'axios';
import tonConnect from './tonConnect';

import { useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
const providers = ['mtn', 'glo', 'airtel', 'etisalat'];


const FIXED_EXCHANGE_RATE_NGN_TO_TON = 0.0001;

const AirtimePurchase = () => {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [provider, setProvider] = useState('');
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        feather.replace();
    }, []);

    const handlePurchase = async () => {
        try {
            if (provider && phoneNumber && amount) {
                const wallet = tonConnect.getWallets();
                if (!wallet) {
                    alert('No wallet connected');
                    return;
                }

                const normalizedProvider = provider.toLowerCase();

                // Purchase Airtime
                const purchaseResponse = { success: true, message: 'Airtime purchased successfully' };

                const airtimeResponse = await purchaseAirtime(provider, phoneNumber, amount);
                setResponse(airtimeResponse);
                setError(null);

                // Create TON Transaction
                const payload = 'Airtime purchase'; // Custom payload or description
                // const transaction = await createTONTransaction(amount, payload);
                const userAmount = parseFloat(amount);
                const userAmountConv = userAmount * FIXED_EXCHANGE_RATE_NGN_TO_TON

                const userAmountInNanotons = (userAmountConv * 1e9).toString();

                const transaction = {
                    validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
                    messages: [
                        {
                            address: '0QCYM7d3gXybi1HNulFdLddRJvxECK2GruQRCeJmf9g7Rs7R',
                            amount: userAmountInNanotons,
                        },
                    ]
                };
                await tonConnectUI.sendTransaction(transaction);
                alert('Transaction sent successfully!');

                const transactionDetails = {
                    type: 'Airtime',
                    provider: normalizedProvider,
                    phoneNumber,
                    amount,
                    success: purchaseResponse.success,

                };

                await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
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
            } else {
                console.log('Not going')
                document.querySelector('#error-text')?.classList.remove('hidden')
            }
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
            setResponse(null);
            alert('Error', err.message)
            const transactionDetails = {
                type: 'Airtime',
                provider: provider.toLowerCase(),
                phoneNumber,
                amount,
                success: false,
            };

            await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
        }
    };

    const handleFlutterwavePayment = async (response) => {
        console.log(response);
        if (response.status === 'successful') {
            try {
                const airtimeResponse = await purchaseAirtime(provider, phoneNumber, amount);
                console.log('Subscription successful:', airtimeResponse);
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
            title: 'Airtime Subscription',
            description: `Payment for ${provider} subscription`,
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };
    const handleFlutterPayment = useFlutterwave(config);

    const isAnyFieldEmpty = () => {
        return !provider || !phoneNumber || !amount
    };

    return (
        <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 w-full max-w-3xl">
                <a href="/">
                    <i data-feather="arrow-left" className="text-white m-4"></i></a>
                <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Purchase Airtime</h1>
                <div>
                    <label>
                        Network:
                    </label>
                    <select value={provider} onChange={(e) => setProvider(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                        <option value="">Select a provider</option>
                        {providers.map((provider) => (
                            <option key={provider} value={provider}>
                                {provider.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>
                        Phone Number:
                    </label>
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div>
                    <label>
                        Amount:
                    </label>
                    <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className='mb-4'>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Name:
                    </label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                {response && <div className='text-black'>{JSON.stringify(response.response_description)}</div>}
            </div>
        </div>
    );
}

export default AirtimePurchase;
