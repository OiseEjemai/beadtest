// src/vtpassService.js
import axios from 'axios';
import { FIXED_EXCHANGE_RATE_NGN_TO_TON } from './exchangeRate';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VT_PASS_BASE_URL = 'https://sandbox.vtpass.com/api/'; // Replace with the actual base URL from VT Pass documentation

// Replace with your actual VT Pass API credentials
const API_USERNAME = import.meta.env.VITE_VTPASS_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_VTPASS_API_PASSWORD;
const apiKey = import.meta.env.VITE_VTPASS_API_KEY;
const secretKey = import.meta.env.VITE_VTPASS_SECRET_KEY

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
// Encoding the credentials in Base64
const authHeader = `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`;

const vtpassApi = axios.create({
  baseURL: VT_PASS_BASE_URL,
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
  },
});

const vtdataApi = axios.create({
  baseURL: VT_PASS_BASE_URL,
});
const requestID = getRequestID(); // Generate a compliant request ID


export const purchaseAirtime = async (provider, phoneNumber, amount) => {
  try {
    const response = await vtpassApi.post('/pay', {
      serviceID: provider,
      phone: phoneNumber,
      amount: amount,
      request_id: requestID, // Generate a unique request ID
      // billersCode: phoneNumber,
      
    });
    return response.data;
  } catch (error) {
    console.error('Error purchasing airtime:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createTONTransaction = async (amount, payload) => {
  try {
    // Use the fixed exchange rate to convert Naira to TON
    const totalAmountInTON = amount * FIXED_EXCHANGE_RATE_NGN_TO_TON;
    const totalAmountInNanotons = totalAmountInTON * 1e9; // Convert TON to Nanotons

    // Validate the conversion
    if (isNaN(totalAmountInNanotons) || totalAmountInNanotons <= 0) {
      throw new Error('Invalid amount after conversion');
    }

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

    return transaction;
  } catch (error) {
    console.error('Error creating TON transaction:', error.message);
    throw error;
  }
};

export const purchaseTVSubscription = async (provider, decoderNumber, amount, phoneNumber, renewtype) => {
  try {
    const response = await vtpassApi.post('/pay', {
      request_id: requestID,
      serviceID: provider,
      billersCode: decoderNumber,
      phone: phoneNumber,
      variation_code: amount,
      subscription_type: renewtype,
      quantity: '1'
    });
    return response.data;
  } catch (error) {
    console.error('Error purchasing TV subscription:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchTVPlans = async (provider) => {
  try {
    const response = await fetch(`https://sandbox.vtpass.com/api/service-variations?serviceID=${provider}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${API_USERNAME}:${API_PASSWORD}`),
      },
    });
    const data = await response.json();
    if (response.ok) {
      return data.content.varations;  // Ensure this matches the actual structure of the API response
    } else {
      throw new Error(data.response_description || 'Failed to fetch plans');
    }
  } catch (error) {
    throw error;
  }
};
export const fetchDataBundlePlans = async (provider) => {
  try {
    const response = await vtpassApi.get(`/service-variations?serviceID=${provider}`);
    return response.data.content.varations; // Adjust based on actual response structure
  } catch (error) {
    console.error('Error fetching data bundles:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Function to initiate a data bundle purchase
export const purchaseDataBundle = async (provider, phoneNumber, planId) => {
  try {
    const credentials = `${apiKey}:${secretKey}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');

    // Make a POST request to the VTpass API to initiate the data bundle purchase
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${encodedCredentials}`,
    };
    const response = await vtdataApi.post('pay', {
      request_id: requestID,
      serviceID: provider,
      billersCode: phoneNumber,
      variation_code: planId,
      // amount: planId,
      phone: phoneNumber,
      // reference: 'unique_reference_here', // Generate a unique reference for the transaction
    }, {headers});
    // Return the purchase response
    return response.data;
  } catch (error) {
    // Handle errors (e.g., network error, API error)
    throw new Error('Failed to initiate data bundle purchase');
  }
};