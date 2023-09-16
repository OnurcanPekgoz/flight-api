import * as service from './service.js'
import * as db from './databasepg.js'

/**
 * @swagger
 * /airlines:
 *   get:
 *     summary: Get a list of airlines.
 *     parameters:
 *       - in: query
 *         name: pageNum
 *         required: false
 *         description: The page number.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortType
 *         required: false
 *         description: The sort type.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of airlines.
 */
function getAirlines(req, res) {
    const {pageNum, sortType} = req.query;
    service.getAirlines(pageNum, sortType)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({error: 'An error occurred'});
        });
}

/**
 * @swagger
 * /airline/{code}:
 *   get:
 *     summary: Get information about a specific airline.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: The airline code.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Information about the airline.
 *       404:
 *         description: The airline was not found.
 */
function getAirline(req, res) {
    const {code} = req.params;
    service.getAirline(code)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({error: 'An error occurred'});
        });
}

/**
 * @swagger
 * /destinations:
 *   get:
 *     summary: Get a list of destinations.
 *     parameters:
 *       - in: query
 *         name: pageNum
 *         required: false
 *         description: The page number.
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortType
 *         required: false
 *         description: The sort type.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of destinations.
 */
function getDestinations(req, res) {
    const {pageNum, sortType} = req.query;
    service.getDestinations(pageNum, sortType)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({error: 'An error occurred'});
        });
}

/**
 * @swagger
 * /destination/{code}:
 *   get:
 *     summary: Get information about a specific destination.
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: The destination code.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Information about the destination.
 *       404:
 *         description: The destination was not found.
 */
function getDestination(req, res) {
    const {code} = req.params;
    service.getDestination(code)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({error: 'An error occurred'});
        });
}

/**
 * @swagger
 * /flights:
 *   get:
 *     summary: Get a list of flights.
 *     responses:
 *       200:
 *         description: A list of flights.
 */
function getFlights(req, res) {
    const {date, direction, airline, page, sort} = req.query;
    service.getFlights(date, direction, airline, page, sort)
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.status(500).json({error: 'An error occurred'});
        });
}

/**
 * @swagger
 * /flight/{id}:
 *   get:
 *     summary: Get information about a specific flight.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The flight ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Information about the flight.
 *       204:
 *         description: The flight was not found
 */
async function getFlight(req, res) {
    const {id} = req.params;

    try {
        const flightResponse = await service.getFlight(id);

        if (flightResponse.status === 204) {
            // Flight doesn't exist, return a 404 error response
            return res.status(204).json({error: 'Flight not found'});
        }

        res.json(flightResponse);
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).json({error: 'An error occurred'});
    }
}

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get a list of reservations.
 *     responses:
 *       200:
 *         description: A list of reservations.
 */
function getReservations(req, res) {
    try {
        db.getReservations()
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error);
                res.status(500).json({error: 'An error occurred'});
            });
    } catch (error) {
        console.error('Error making reservation:', error);
        res.status(500).json({error: 'An error occurred'});
    }
}

/**
 * @swagger
 * /reservation/{user_id}:
 *   get:
 *     summary: Get reservations for a specific user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         description: The user ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of reservations for the specified user.
 *       404:
 *         description: No reservations found for the specified user.
 */
function getReservation(req, res) {
    const {user_id} = req.params;
    try {
        db.getReservation(user_id)
            .then((data) => {
                if (data.length === 0) {
                    res.status(404).json({error: 'No reservations found for the specified user'});
                } else {
                    res.json(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching reservations:', error);
                res.status(500).json({error: 'An error occurred'});
            });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({error: 'An error occurred'});
    }
}

/**
 * @swagger
 * /makeReservation:
 *   post:
 *     summary: Make a reservation.
 *     description: Make a reservation for a user on a flight using query parameters.
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         description: The user ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: user_name
 *         required: true
 *         description: The user's name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: flight_id
 *         required: true
 *         description: The flight ID.
 *         schema:
 *           type: string
 *       - in: query
 *         name: flight_name
 *         required: true
 *         description: The flight name.
 *         schema:
 *           type: string
 *       - in: query
 *         name: seat
 *         required: true
 *         description: The seat number.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reservation successful.
 *       204:
 *         description: The flight was not found.
 *       500:
 *         description: An error occurred.
 */

async function makeReservation(req, res) {
    try {
        const {user_id, user_name, flight_id, seat} = req.query;

        // Check if flight exists before making a reservation
        const flightResponse = await service.getFlight(flight_id);

        if (flightResponse.status === 204) {
            return res.status(204).json({error: 'Flight not found'});
        }

        const currentDateTime = new Date();
        const scheduleTimeParts = flightResponse.scheduleDate.split('-');
        const year = parseInt(scheduleTimeParts[0]);
        const month = parseInt(scheduleTimeParts[1]) - 1; // Months are 0-indexed in JavaScript
        const day = parseInt(scheduleTimeParts[2]);

        const flightDateTime = new Date(year, month, day);
        if (flightDateTime <= currentDateTime) {
            return res.status(400).json({ error: 'Cannot reserve past flights' });
        }

        // Check if the flight is a departure (adjust based on your flightResponse structure)
        if (flightResponse.flightDirection !== 'D') {
            return res.status(400).json({ error: 'Can only reserve departure flights' });
        }

        await db.makeReservation(user_id, user_name, flight_id, seat);
        res.status(200).json({message: 'Reservation successful'});
    } catch (error) {
        console.error('Error making reservation:', error);
        res.status(500).json({error: 'An error occurred'});
    }
}

export {
    getAirlines,
    getAirline,
    getDestinations,
    getDestination,
    getFlights,
    getFlight,
    makeReservation,
    getReservations,
    getReservation
}

