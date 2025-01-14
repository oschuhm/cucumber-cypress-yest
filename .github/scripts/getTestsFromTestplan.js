//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//to handle commandline arguments
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

//for web requests
const axios = require('axios').default;

//for file / folder handling
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

//to unzip
const AdmZip = require('adm-zip');

//folders
const featureFolder = "./cypress/e2e/features";
const downloadFolder = "./cypress/downloads"
const authUrl = 'https://xray.cloud.getxray.app/api/v2/authenticate';

main();

function main() {
    fse.remove(featureFolder);
    fse.remove(downloadFolder);
    if (argv.testids && argv.xrayClientId && argv.xrayClientSecret) {
        console.log(`Download testcases for jira ids: ${argv.testids}`);
        Promise.all([downloadZipXrayCloud(argv.testids, argv.xrayClientId, argv.xrayClientSecret)]);
        console.log('done');
    } else {
        console.log(`parameters missing, please add --testids='ADVC-123;ADVC-456' --xrayClientId='xxxx' --xrayClientSecret='xxxx'`);
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

async function exportCucumberTests(token, testPlanKey) {
    const apiUrl = 'https://xray.cloud.getxray.app/api/v2/export/cucumber';


    // 1. Testfälle aus Xray Cloud exportieren
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                keys: testPlanKey
            },
            responseType: 'arraybuffer' // Wichtig für Binärdaten (ZIP-Datei)
        });

       // 2. ZIP-Datei speichern
       const zipFilePath = `${downloadFolder}/cucumber_tests.zip`;
       const dir = path.dirname(zipFilePath);
       fs.mkdirSync(dir, { recursive: true });
       fs.writeFileSync(zipFilePath, response.data);
       console.log(`ZIP-Datei gespeichert: ${zipFilePath}`);

       // 3. ZIP-Datei entpacken
       const zip = new AdmZip(zipFilePath);
       zip.extractAllTo(featureFolder, true); // Entpackt den Inhalt
       console.log(`Dateien entpackt in: ${featureFolder}`);

    } catch (error) {
        console.error('Fehler beim Export von Cucumber-Tests:', error.response?.data || error.message);
    }
}



async function downloadZipXrayCloud(testcaseString, xrayClientId, xrayClientSecret) {
    if (testcaseString.length > 0) {

        //first get a token for Xray Cloud
        authenticate(xrayClientId, xrayClientSecret).then(token => {
            //then export the test cases
            exportCucumberTests(token, testcaseString)
        });
    }
}

