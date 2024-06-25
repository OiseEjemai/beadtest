// src/ElectricityForm.tsx
import React, { useState, useEffect } from 'react';
import VTpassService from './services/vtpassService';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import utc from 'dayjs/plugin/utc';
import tonConnect from './tonConnect';
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import timezone from 'dayjs/plugin/timezone';
import nodemailer from 'nodemailer'
import feather from 'feather-icons'
import axios from 'axios';
import TONConnectComponent from './TONConnectComponent';

const FIXED_EXCHANGE_RATE_NGN_TO_TON = 0.0001;


dayjs.extend(utc);
dayjs.extend(timezone);

const LightPayment = () => {
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
    useEffect(() => {
        feather.replace();
    }, []);

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

            await axios.post(`${import.meta.env.VITE_URL}/transaction`, transactionDetails);
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
        <div className="min-h-screen flex items-center justify-center w-full">
            <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 w-full max-w-3xl">
                <a href="/">
                    <i data-feather="arrow-left" className="text-white m-4"></i></a>
                    <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Purchase Light Bill</h1>

                        <div>
                            <label className="block text-white text-sm font-bold mb-2">
                                Location
                            </label>
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
                        </div>
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">
                                Account/ Meter Type
                            </label>
                            <select value={variationCode} onChange={(e) => setVariationCode(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option value="prepaid">Prepaid</option>
                                <option value="postpaid">Postpaid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">
                                Meter Number:
                            </label>
                            <input
                                type="text"
                                placeholder="Meter Number"
                                value={meterNumber}
                                onChange={(e) => setMeterNumber(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">
                                Amount:
                            </label>
                            <input
                                type="text"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white text-sm font-bold mb-2">
                                Phone Number:
                            </label>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
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
                        <button onClick={handleBuyElectricity} disabled={loading && isAnyFieldEmpty()} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {loading ? 'Processing...' : 'Pay with TON'}
                        </button>
                        <div className="text-red-500 hidden" id='error-text'>Complete the form</div>
                        <p id="token-num" className='text-white'></p>
                        {response && <div className='text-white'><p>{JSON.stringify(response.response_description)}</p></div>}
                        {/* {purchaseSuccess && (
                                <TONConnectComponent
                                    totalAmountInNanotons={totalAmountInNanotons}
                                    // payload={JSON.stringify(response)}
                                    onTransactionSuccess={() => alert('Transaction completed successfully!')}
                                />
                            )} */}

                    </div>
                </div>
    );
};

export default LightPayment;
