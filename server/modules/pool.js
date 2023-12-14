// Configure a tool that will allow us to:
// 1. Connect to our database.
// 2. Send queries to our database.
// 3. Receive query results from our database.

// Boilerplate....
// Import the pg library:
const pg = require('pg');
// Create a vending machine that dispenses
// pool objects:
const Pool = pg.Pool;

// Import your secret database info from the environment variables.
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// Interesting Boilerplate!
// 1. Use the pool-dispening machine to obtain a
//    pool object.
// 2. Configure the "pool" object to be able
//    to connect to our database, which is running
//    at localhost:5432
const pool = new Pool({
    host: PGHOST,
    port: 5432,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
})

// Spit out a console log when the pool connects
// successfully:
pool.on('connect', () => {
    console.log('The magical pool thing connected to your postgres database. :)');
})

// Spit out a console log when the pool errors:
pool.on('error', (error) => {
    console.log('The magical pool has errored. Bummer.', error);
})

module.exports = pool;
