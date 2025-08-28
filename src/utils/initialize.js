const mysql = require('mysql2/promise')
const path = require('path')

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') })
async function initializeDB() {
  
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        })

        console.info("server|db up...!")

        await connection.end();

    } catch (error) {
        console.error("Error connecting to DB:", error)   
        process.exit(1);
    }
}

initializeDB()