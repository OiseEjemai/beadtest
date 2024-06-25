// src/services/dataService.js
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const API_USERNAME = import.meta.env.VITE_VTPASS_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_VTPASS_API_PASSWORD;
const authHeader = `Basic ${btoa(`${API_USERNAME}:${API_PASSWORD}`)}`;


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


const vtpassApi = axios.create({
  baseURL: 'https://sandbox.vtpass.com/api/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_VTPASS_API_KEY}`,
    'api-key': `${import.meta.env.VITE_VTPASS_API_KEY}`,
    'secret-key': `${import.meta.env.VITE_VTPASS_SECRET_KEY}`
  },
});

const vtpassDataApi = axios.create({
  baseURL: 'https://sandbox.vtpass.com/api/',
  headers: {
    Authorization: authHeader,
    'Content-Type': 'application/json',
},
})

const requestID = getRequestID(); // Generate a compliant request ID

const dataService = {
  buyData: async (provider, phoneNumber, selectedPlan) => {
    try {
      const response = await vtpassApi.post('pay', {
        request_id: requestID,
        serviceID: provider,
        billersCode: phoneNumber,
        variation_code: selectedPlan,
        // amount: planId,
        phone: phoneNumber,
        // reference: 'unique_reference_here', // Generate a unique reference for the transaction
      });
      return response.data;
    } catch (error) {
      console.error('Error buying Data:', error);
      throw error;
    }
  },
  getDataBundle: async (provider) => {
    try {
      const response = await vtpassDataApi.get(`/service-variations?serviceID=${provider}`);
      return response.data.content.varations; // Adjust based on actual response structure
    } catch (error) {
      console.error('Error fetching data bundles:', error.response ? error.response.data : error.message);
      throw error;
    }
  },
  // Add other API methods here if needed
};

export default dataService;
