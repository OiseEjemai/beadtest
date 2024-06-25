// src/services/vtpassService.js
import axios from 'axios';

const VTpassService = {
  buyElectricity: async (data) => {
    try {
      const response = await axios.post('https://sandbox.vtpass.com/api/pay', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_VTPASS_API_KEY}`,
          'api-key': `${import.meta.env.VITE_VTPASS_API_KEY}`,
          'secret-key': `${import.meta.env.VITE_VTPASS_SECRET_KEY}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error buying electricity:', error);
      throw error;
    }
  },
  // Add other API methods here if needed
};

export default VTpassService;
