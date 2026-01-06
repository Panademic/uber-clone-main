const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await axios.get(url, {
        headers: { 'User-Agent': 'UberCloneApp/1.0 (your.email@example.com)' }
    });
    if (response.data.length > 0) {
        return {
            ltd: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon)
        };
    } else {
        throw new Error('Unable to fetch coordinates');
    }
}


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }
    const url = `http://router.project-osrm.org/route/v1/driving/${encodeURIComponent(origin)};${encodeURIComponent(destination)}?overview=false`;
    try {

        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return { distance: response.data.routes[0].distance, duration: response.data.routes[0].duration };
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&featureType=address`;

    try {
        const response = await axios.get(url, { headers: { 'User-Agent': '...' } });
        if (response.data.status === 'OK') {
            return response.data.map(item => item.display_name).filter(Boolean);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}