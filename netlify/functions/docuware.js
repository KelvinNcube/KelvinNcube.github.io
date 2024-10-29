// netlify/functions/docuware.js

const fetch = require('node-fetch');

exports.handler = async (event) => {
    const employeeName = 'john-doe'; //event.queryStringParameters.employee;

    // Replace these with your actual DocuWare credentials and server information
    const SERVER_URL = 'https://login-australia.docuware.cloud/0df62909-2188-406e-9a7f-9ac7540cf444';
    const PLATFORM = 'DocuWare.Platform';
    const FILE_CABINET_ID = '8d8184f4-697b-4708-ad8e-9f59bab5ecd1';
    const SEARCH_DIALOG_ID = '0ea83d58-f76e-4a2e-8d9b-5c5b5d7a8839';
    const USERNAME = 'jurgendj.admin';
    const PASSWORD = 'Q@wsed09!';

    const getToken = async () => {
        const tokenReq = await fetch(`${SERVER_URL}/connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: `grant_type=password&scope=docuware.platform&client_id=docuware.platform.net.client&username=${USERNAME}&password=${PASSWORD}`,
        });
        const tokenRes = await tokenReq.json();
        return tokenRes.access_token;
    };

    const accessToken = await getToken();

    const requestBody = {
        Condition: [
            {
                DBName: 'FULL_NAME', // replace with actual field name
                Value: [employeeName],
            }
        ],
        Operation: 'And',
    };

    const response = await fetch(`https://origin-cranes.docuware.cloud/DocuWare/Platform/FileCabinets/${FILE_CABINET_ID}/Query/DialogExpression?Count=1&Fields=DOCUMENT_TYPE&SortOrder=DOCUMENT_TYPE+Asc&DialogId=${SEARCH_DIALOG_ID}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();  // Get the raw text of the response
    console.log("Raw response:", responseText);

    let data;
    try {
        data = JSON.parse(responseText);  // Parse response only if it's valid JSON
    } catch (error) {
        console.error("Failed to parse JSON:", error);
        throw new Error("Invalid JSON response");
    }


    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
