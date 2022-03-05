import config from '../config/config';
import axios from 'axios';
import sequelize from '../src/db/sequelize';

module.exports = async () => {
    console.log('Jest global setup');
    await checkServerIsUp();
    
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database');
    }
};

async function checkServerIsUp() {
    const MAX_REQUESTS = 20;
    const delay = 3000;
    let serverReady = false;

    for (let i = 0; i <= MAX_REQUESTS; i++) {
        try {
            console.log('Checking server is up, try ' + (i + 1));
            const result = await axios(config.apiUrl + '/health');
            console.log('Server is up, status code', result.status);
            serverReady = true;
            break;
        } catch (err) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
        }
    }

    if (!serverReady) throw new Error('Server never became ready.');
}
