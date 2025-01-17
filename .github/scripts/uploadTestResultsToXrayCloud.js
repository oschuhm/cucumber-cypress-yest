const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

//to handle commandline arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const authUrl = 'https://xray.cloud.getxray.app/api/v2/authenticate';

main();
function main() {
    if (argv.testPlanKey && argv.xrayClientId && argv.xrayClientSecret) {
        console.log(`Upload test results to Xray Cloud`);
        Promise.all([uploadToXrayCloud(argv.xrayClientId, argv.xrayClientSecret, argv.testPlanKey)]);
        console.log('done');
    } else {
        console.log(`parameters missing, please add --testPlanKey --xrayClientId='xxxx' --xrayClientSecret='xxxx'`);
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

async function uploadCucumberJsonMultipart(token, cucumberJsonPath, testPlanKey) {
    const apiUrl = 'https://xray.cloud.getxray.app/api/v2/import/execution/cucumber/multipart';

    try {
        // 1. Validiere den Datei-Pfad
        if (!fs.existsSync(cucumberJsonPath)) {
            throw new Error(`Die Datei unter dem Pfad ${cucumberJsonPath} existiert nicht.`);
        }

        // 2. Datei lesen
        const fileContent = fs.createReadStream(cucumberJsonPath);

        // 3. Überprüfen, ob die Datei erfolgreich gelesen wurde
        if (!fileContent) {
            throw new Error(`Die Datei ${cucumberJsonPath} konnte nicht gelesen werden oder ist leer.`);
        }

        // 4. Temporäre JSON-Datei für info erstellen
        const infoData = {
            "fields": {
                "project": { "id": "10004" },
                "summary": `Automated Test Execution - ${testPlanKey}`,
                "issuetype": { "id": "10011" }
            },
            "xrayFields": {
                "testPlanKey": testPlanKey
            }
        };
        const infoFilePath = './temp-info.json';
        fs.writeFileSync(infoFilePath, JSON.stringify(infoData));

        // 5. FormData erstellen
        const formData = new FormData();
        formData.append('results', fileContent);
        formData.append('info', fs.createReadStream(infoFilePath));

        // 6. Header mit Token und FormData generieren
        if (!token) {
            throw new Error('Authorization token is missing.');
        }
        const headers = {
            Authorization: `Bearer ${token}`,
            ...formData.getHeaders()
        };

        // 7. POST-Anfrage zum Hochladen
        const response = await axios.post(apiUrl, formData, { headers });
        console.log('Upload erfolgreich:', response.data);

        // 8. Temporäre Datei löschen
        fs.unlinkSync(infoFilePath);
    } catch (error) {
        console.error('Fehler beim Hochladen:', error.response?.data || error.message);
    }
}



async function uploadToXrayCloud(xrayClientId, xrayClientSecret, testPlanKey) {

    const cucumberJsonPath = './cypress/results/report.json'; // Pfad zur JSON-Datei
    //first get a token for Xray Cloud
    authenticate(xrayClientId, xrayClientSecret).then(token => {
        //then upload the test cases
        //uploadCucumberJson(token, cucumberJsonPath);
        uploadCucumberJsonMultipart(token, cucumberJsonPath, testPlanKey);
    });

}