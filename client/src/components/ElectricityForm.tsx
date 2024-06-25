// src/ElectricityForm.tsx
import React, { useState } from 'react';
import VTpassService from '../services/vtpassService';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import utc from 'dayjs/plugin/utc';
import tonConnect from '../tonConnect';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import timezone from 'dayjs/plugin/timezone';
import nodemailer from 'nodemailer'
import axios from 'axios';
import TONConnectComponent from '../TONConnectComponent';

const FIXED_EXCHANGE_RATE_NGN_TO_TON = 0.0001;


dayjs.extend(utc);
dayjs.extend(timezone);

const ElectricityForm = ({ isOpen, onClose }) => {
    const [meterNumber, setMeterNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [serviceID, setServiceID] = useState('portharcourt-electric'); // default value
    const [variationCode, setVariationCode] = useState('prepaid'); // default value
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [name, setName] = useState('')
    const [success, setSuccess] = useState(false);
    const [response, setResponse] = useState(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const conversionRate = 0.0001; // Fixed conversion rate from local currency to TON


    const getRequestID = () => {
        // Get current time in 'Africa/Lagos' time zone
        const now = dayjs().tz('Africa/Lagos'); // GMT+1
        const dateString = now.format('YYYYMMDDHHmmss'); // YYYYMMDDHHMMSS format

        // Generate a UUID and limit to 12 characters
        const uuid = uuidv4().replace(/-/g, '').slice(0, 12);

        // Create a random string component for additional uniqueness
        const randomComponent = Math.random().toString(36).substring(2, 8);

        // Combine all parts to form the request ID
        return `${dateString}${uuid}${randomComponent}`;
    };
    const requestID = getRequestID();

    const data = {
        request_id: requestID, // Generate a unique request ID
        serviceID: serviceID.toLowerCase(),
        billersCode: meterNumber,
        variation_code: variationCode,
        amount: amount,
        phone: phone,
    };

    const handleBuyElectricity = async () => {
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            if (email && meterNumber && amount && phone) {
                const result = await VTpassService.buyElectricity(data);
                setResponse(result);
                const token = result.token
                if (result.code !== '000') {
                    setPurchaseSuccess(false)
                }
                else {
                    setPurchaseSuccess(true)
                    const purchaseResponse = { success: true, message: 'Light Purchased successfully' };
                    try {
                        const wallet = tonConnect.getWallets();
                        if (!wallet) {
                            alert('No wallet connected');
                            return;
                        }

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
                        document.querySelector('#token-num').textContent = `Your token number is ${result.token}`

                        const transactionDetails = {
                            type: 'Light',
                            provider: serviceID,
                            phoneNumber: meterNumber,
                            amount,
                            success: purchaseResponse.success,
                        };
                        setSuccess(true);
                        await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
                    } catch (error) {
                        if (error.response) {
                            // The request was made and the server responded with a status code that falls out of the range of 2xx
                            setError(`Error: ${error.response.data}`);
                            console.error('Error response data:', error.response.data);
                        } else if (error.request) {
                            // The request was made but no response was received
                            setError('Error: No response from server.');
                            console.error('Error request:', error.request);
                        } else {
                            // Something happened in setting up the request that triggered an Error
                            setError(`Error: ${error.message}`);
                            console.error('Error message:', error.message);
                        }
                    }
                    // await sendEmail(email, token);
                }
            } else {
                console.log('Not going')
                document.querySelector('#error-text')?.classList.remove('hidden')
            }
        } catch (error) {
            console.error('Error:', error);
            const transactionDetails = {
                type: 'Light',
                provider: serviceID.toLowerCase(),
                phoneNumber: phone,
                amount,
                success: false,
            };

            await axios.post(`${import.meta.env.VITE_URL}/transactions`, transactionDetails);
        } finally {
            setLoading(false);
        }
    };
    // const totalAmountInTONs = parseFloat(amount) * conversionRate;
    // const totalAmountInNanotons = Math.round(totalAmountInTONs * 1e9);

    const handleFlutterwavePayment = async (response) => {
        console.log(response);
        if (response.status === 'successful') {
            try {
                const paymentResponse = await VTpassService.buyElectricity(data);
                console.log('Subscription successful:', paymentResponse);
                alert('Subscription successful!');
                document.querySelector('#token-num').textContent = `Your token number is ${paymentResponse.token}`
            } catch (err) {
                console.error('Subscription failed:', err);
                // alert('Subscription failed. Please try again.');
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
            phone_number: phone,
            name,
        },
        customizations: {
            title: 'Light Bill',
            description: `Payment for ${serviceID} subscription`,
            logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
        },
    };
    const handleFlutterPayment = useFlutterwave(config);

    const isAnyFieldEmpty = () => {
        return !email || !meterNumber || !amount || !phone;
    };

    return (
        <>
            {isOpen && (
                <div className='fixed inset-0 z-10 overflow-y-auto'>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                        </div>
                        <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={onClose}
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h1>Buy Electricity</h1>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Location
                                    <select value={serviceID} onChange={(e) => setServiceID(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                        <option value="portharcourt-electric">Port Harcourt</option>
                                        <option value="kano-electric">Kano</option>
                                        <option value="ikeja-electric">Lagos-Ikeja</option>
                                        <option value="eko-electric">Lagos-Eko</option>
                                        <option value="jos-electric">Jos</option>
                                        <option value="ibadan-electric">Ibadan</option>
                                        <option value="kaduna-electric">Kaduna</option>
                                        <option value="abuja-electric">Abuja</option>
                                        <option value="enugu-electric">Enugu</option>
                                        <option value="benin-electric">Benin</option>
                                        <option value="aba-electric">ABA</option>
                                        <option value="yola-electric">Yola</option>
                                        {/* Add more options as needed */}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Account/ Meter Type
                                    <select value={variationCode} onChange={(e) => setVariationCode(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                        <option value="prepaid">Prepaid</option>
                                        <option value="postpaid">Postpaid</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Meter Number:
                                    <input
                                        type="text"
                                        placeholder="Meter Number"
                                        value={meterNumber}
                                        onChange={(e) => setMeterNumber(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Amount:
                                    <input
                                        type="text"
                                        placeholder="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Phone Number:
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </label>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Email Address:
                                    <input
                                        type="text"
                                        placeholder="email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
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
                            <button
                                onClick={() => {
                                    handleFlutterPayment({
                                        callback: handleFlutterwavePayment,
                                        onClose: () => { },
                                    });
                                }}
                                disabled={isAnyFieldEmpty()}
                                type='button'
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Pay with Naira
                            </button>
                            <button onClick={handleBuyElectricity} disabled={loading && isAnyFieldEmpty()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                {loading ? 'Processing...' : 'Pay with TON'}
                            </button>
                            <div className="text-red-500 hidden" id='error-text'>Complete the form</div>
                            <p id="token-num" className='text-black'></p>
                            {response && <div className='text-black'><p>{JSON.stringify(response.response_description)}</p></div>}
                            {/* {purchaseSuccess && (
                                <TONConnectComponent
                                    totalAmountInNanotons={totalAmountInNanotons}
                                    // payload={JSON.stringify(response)}
                                    onTransactionSuccess={() => alert('Transaction completed successfully!')}
                                />
                            )} */}

                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ElectricityForm;
