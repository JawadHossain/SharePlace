const axios  = require('axios');
const HttpError = require('../models/http-error');

/**
 * Lookup lat lng with google api from address
 * @param {string} address address to check
 * @returns object containing lat and lng coordinates
 */
const getCoordsForAddress = async ( address ) => {
    const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${process.env.GOOGLE_MAP_API_KEY}`
      );
    
    
    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS' || !data.results[0]) {
      const error = new HttpError(
        'Could not find location for the specified address.',
        422
      );
      throw error;
    }
    
    const coordinates = data.results[0].geometry.location;
  
    return coordinates;
}

module.exports = getCoordsForAddress