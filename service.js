import fetch from "node-fetch";

const app_id = "d7e38ec0";
const app_key = "d97bbc3ccf092d76e64ceb4ecec7474c";

function getAirlines(pageNum = 1, sortType = 'publicName') {
    const url = `https://api.schiphol.nl/public-flights/airlines?page=${pageNum}&sort=${sortType}`;
    return fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json', 'app_id': app_id, 'app_key': app_key, 'ResourceVersion': 'v4'
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            return responseData;
        })
        .catch(error => console.warn(error));
}

function getAirline(code) {
    const url = `https://api.schiphol.nl/public-flights/airlines/${code}`;
    return fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json', 'app_id': app_id, 'app_key': app_key, 'ResourceVersion': 'v4'
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            return responseData;
        })
        .catch(error => console.warn(error));
}

function getDestinations(pageNum = 1, sortType = 'country') {
    const url = `https://api.schiphol.nl/public-flights/destinations?page=${pageNum}&sort=${sortType}`;
    return fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json', 'app_id': app_id, 'app_key': app_key, 'ResourceVersion': 'v4'
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            return responseData;
        })
        .catch(error => console.warn(error));
}

function getDestination(code) {
    const url = `https://api.schiphol.nl/public-flights/destinations/${code}`;
    return fetch(url, {
        method: 'GET', headers: {
            'Accept': 'application/json', 'app_id': app_id, 'app_key': app_key, 'ResourceVersion': 'v4'
        }
    })
        .then((response) => response.json())
        .then((responseData) => {
            return responseData;
        })
        .catch(error => console.warn(error));
}
async function getFlights(scheduleDate, flightDirection, airline, page = 1) {
    const queryParams = new URLSearchParams();

    if (scheduleDate) queryParams.set('scheduleDate', scheduleDate);
    if (flightDirection) queryParams.set('flightDirection', flightDirection);
    if (airline) queryParams.set('airline', airline);
    if (page !== 1) queryParams.set('page', String(page));
    const url = `https://api.schiphol.nl/public-flights/flights${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'app_id': app_id, // Replace with your app ID
                'app_key': app_key, // Replace with your app key
                'ResourceVersion': 'v4',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch flights');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw new Error('An error occurred while fetching flights');
    }
}

async function getFlight(id) {
    const url = `https://api.schiphol.nl/public-flights/flights/${id}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'app_id': app_id,
            'app_key': app_key,
            'ResourceVersion': 'v4'
        }
    })
        .then(async (response) => {
            if (response.status === 204) {
                return {status: 204};
            }
            if (!response.ok) {
                throw new Error('Flight not found');
            }
            return response.json();
        })
        .then((responseData) => {
            return responseData;
        })
        .catch(error => {
            console.warn(error);
            throw new Error('An error occurred while fetching flight data');
        });
}

export {
    getAirlines,
    getAirline,
    getDestinations,
    getDestination,
    getFlights,
    getFlight,
}
