import express from 'express';
import * as controller from './controller.js'

const router = express.Router();

/**
 * @swagger
 * /airlines:
 *   get:
 *     summary: Get a list of airlines.Default pageNum is 1 and default sortType is publicName
 *     description: Retrieve a list of airlines from the API.
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
 *       500:
 *         description: An error occurred.
 */
router.get('/airlines', controller.getAirlines);

/**
 * @swagger
 * /airline/{code}:
 *   get:
 *     summary: Get information about a specific airline.
 *     description: Retrieve information about a specific airline by its code.IATA or ICAO codes supported.
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
router.get('/airline/:code', controller.getAirline);

/**
 * @swagger
 * /destinations:
 *   get:
 *     summary: Get a list of destinations.Default pageNum is 1 and default sortType is country
 *     description: Retrieve a list of destinations from the API.
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
 *       500:
 *         description: An error occurred.
 */
router.get('/destinations', controller.getDestinations);

/**
 * @swagger
 * /destination/{code}:
 *   get:
 *     summary: Get information about a specific destination. Code is IATA.
 *     description: Retrieve information about a specific destination by its code.
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
router.get('/destination/:code', controller.getDestination);

/**
 * @swagger
 * /flights:
 *   get:
 *     summary: Get a list of flights with optional filters.
 *     description: Retrieve a list of flights with optional filters based on date, direction, airline, airline code, route, page, and sort.
 *     parameters:
 *       - in: query
 *         name: date
 *         description: The date to filter flights ('yyyy-mm-dd').
 *         schema:
 *           type: string
 *       - in: query
 *         name: direction
 *         description: The flight direction ('A' for arrival, 'D' for departure).
 *         schema:
 *           type: string
 *       - in: query
 *         name: airline
 *         description: The airline IATA or ICAO code.
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         description: The page number for paginated results.Default is 1.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of flights based on the specified filters.
 *       500:
 *         description: An error occurred.
 */
router.get('/flights', controller.getFlights);

/**
 * @swagger
 * /flight/{id}:
 *   get:
 *     summary: Get information about a specific flight.
 *     description: Retrieve information about a specific flight by its ID.
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
 *         description: The flight was not found.
 */
router.get('/flight/:id', controller.getFlight);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get a list of reservations.
 *     description: Retrieve a list of reservations from the database.
 *     responses:
 *       200:
 *         description: A list of reservations.
 *       500:
 *         description: An error occurred.
 */
router.get('/reservations', controller.getReservations);

/**
 * @swagger
 * /reservation/{user_id}:
 *   get:
 *     summary: Get reservations for a specific user.
 *     description: Retrieve a list of reservations for the specified user.
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
router.get('/reservation/:user_id', controller.getReservation);

/**
 * @swagger
 * /makeReservation:
 *   post:
 *     summary: Make a reservation.
 *     description: Make a reservation for a user on a flight.
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

router.post('/makeReservation', controller.makeReservation);

export default router;