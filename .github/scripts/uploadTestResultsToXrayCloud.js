const axios = require('axios');
const fs = require('fs');

//to handle commandline arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const authUrl = 'https://xray.cloud.getxray.app/api/v2/authenticate';

main();
function main() {
    if (argv.xrayClientId && argv.xrayClientSecret) {
        console.log(`Upload test results to Xray Cloud`);
        Promise.all([uploadToXrayCloud(argv.xrayClientId, argv.xrayClientSecret)]);
        console.log('done');
    } else {
        console.log(`parameters missing, please add --xrayClientId='xxxx' --xrayClientSecret='xxxx'`);
    }
}

async function authenticate(clientId, clientSecret) {
    try {
        const response = await axios.post(authUrl, {
            client_id: clientId,
            client_secret: clientSecret
        });

        // Token aus der Antwort abrufen
        const token = response.data;

        return token;
    } catch (error) {
        console.error('Fehler bei der Authentifizierung:', error.response?.data || error.message);
        throw error;
    }
}

async function uploadCucumberJson(token, cucumberJsonPath) {
    const apiUrl = 'https://xray.cloud.getxray.app/api/v2/import/execution/cucumber';

    try {
        // 1. Datei lesen
        const fileContent = fs.readFileSync(cucumberJsonPath, 'utf8');

        // 2. POST-Anfrage zum Hochladen
        const response = await axios.post(apiUrl, fileContent, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Upload erfolgreich:', response.data);
    } catch (error) {
        console.error('Fehler beim Hochladen:', error.response?.data || error.message);
    }
}


async function uploadToXrayCloud(xrayClientId, xrayClientSecret) {

    const cucumberJsonPath = './cypress/results/report.json'; // Pfad zur JSON-Datei
    //first get a token for Xray Cloud
    authenticate(xrayClientId, xrayClientSecret).then(token => {
        //then upload the test cases
        uploadCucumberJson(token, cucumberJsonPath);
    });

}