import pg from 'pg';
import * as service from './service.js'

const {Client} = pg;
const client = new Client({
    user: 'postgres', host: 'localhost', password: 'root', port: 5432, database: 'flight_api'
});

async function setupDb() {
    const client_temp = new Client({
        user: 'postgres', host: 'localhost', password: 'root', port: 5432, database: 'postgres'
    });
    await client_temp.connect()
    const res = await client_temp.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = 'flight_api'`);
    if (res.rowCount === 0) {
        console.log(`flight_api database not found, creating it.`);
        await client_temp.query(`CREATE DATABASE flight_api;`);
        console.log(`created database flight_api`);
    } else {
        console.log(`flight_api database already exists.`);
    }
    await client_temp.end()

    await client.connect()
    client.query(`CREATE TABLE IF NOT EXISTS users(
user_id VARCHAR(30) PRIMARY KEY, 
user_name VARCHAR(30) NOT NULL)
`)

    client.query(`CREATE TABLE IF NOT EXISTS flights(
flight_id VARCHAR(30) PRIMARY KEY, 
flight_name VARCHAR(30) NOT NULL)
`)

    client.query(`CREATE TABLE IF NOT EXISTS reservations(
reservation_id INT GENERATED ALWAYS AS IDENTITY,
user_id VARCHAR(30),
user_name VARCHAR(30),
flight_id VARCHAR(30),
flight_name VARCHAR(30),
seat VARCHAR(30),
PRIMARY KEY(reservation_id),
CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id),
CONSTRAINT fk_flight FOREIGN KEY(flight_id) REFERENCES flights(flight_id)
)
`)
}


async function addUser(user_id, user_name) {
    try {
        const queryText = 'INSERT INTO users (user_id,user_name) VALUES ($1,$2)';
        const values = [user_id, user_name];
        client.query(queryText, values);
    } catch (error) {
        console.error('Error adding user:', error);
    }

}

async function checkUser(user_id) {
    try {
        const queryText = 'SELECT COUNT(*) FROM users WHERE user_id = $1';
        const values = [user_id];
        const result = await client.query(queryText, values);
        return result.rows[0].count > 0;
    } catch (error) {
        console.error('Error checking if user exists:', error);
        return false;
    }
}

async function addFlight(flight_id, flight_name) {
    try {
        const queryText = 'INSERT INTO flights (flight_id,flight_name) VALUES ($1,$2)';
        const values = [flight_id, flight_name];
        client.query(queryText, values);
    } catch (error) {
        console.error('Error adding flight:', error);
    }
}

async function checkFlight(flight_id) {
    try {
        const queryText = 'SELECT COUNT(*) FROM flights WHERE flight_id = $1';
        const values = [flight_id];
        const result = await client.query(queryText, values);
        return result.rows[0].count > 0;
    } catch (error) {
        console.error('Error checking if flight exists:', error);
        return false;
    }
}

async function makeReservation(user_id, user_name, flight_id, seat) {
    if (!await checkUser(user_id)) {
        await addUser(user_id, user_name);
    }

    const flightResponse = await service.getFlight(flight_id);

    if (flightResponse.status === 204) {
        console.log('No content for flight data. Reservation not made.');
        return;
    }

    const flight_name = flightResponse.flightName; // Assuming flightName is the correct property name

    if (!await checkFlight(flight_id)) {
        await addFlight(flight_id, flight_name);
    }

    const queryText = 'INSERT INTO reservations (user_id, user_name, flight_id, flight_name, seat) VALUES ($1, $2, $3, $4, $5)';
    const values = [user_id, user_name, flight_id, flight_name, seat];

    try {
        await client.query(queryText, values);
    } catch (error) {
        console.error('Error making reservation:', error);
        throw new Error('An error occurred while making the reservation');
    }
}

function getReservations() {
    const queryText = 'SELECT user_id, flight_id, seat FROM reservations';
    return client.query(queryText)
        .then((result) => result.rows);
}

function getReservation(user_id) {
    const queryText = 'SELECT user_id, flight_id, seat FROM reservations WHERE user_id = $1';
    return client.query(queryText, [user_id])
        .then((result) => result.rows);
}

export {setupDb, addUser, checkUser, addFlight, checkFlight, makeReservation, getReservations, getReservation}