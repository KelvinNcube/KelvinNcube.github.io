// netlify/functions/docuware.js

import fetch from 'node-fetch';

exports.handler = async (event) => {
    const employeeName = event.queryStringParameters.employee;

    // Replace these with your actual DocuWare credentials and server information
    const SERVER_URL = 'https://login-australia.docuware.cloud/0df62909-2188-406e-9a7f-9ac7540cf444';
    const PLATFORM = 'DocuWare.Platform';
    const FILE_CABINET_ID = '8d8184f4-697b-4708-ad8e-9f59bab5ecd1';
    const SEARCH_DIALOG_ID = '0ea83d58-f76e-4a2e-8d9b-5c5b5d7a8839';
    const USERNAME = 'kelvin.admin';
    const PASSWORD = 'Hoazly587#';

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
    const currentDate = moment().format('YYYY-MM-DD');

    const requestBody = {
        Condition: [
            {
                DBName: 'FULL_NAME', // replace with actual field name
                Value: [employeeName],
            },
            {
                DBName: 'DOCUMENT_TYPE',
                Value: 'Test',
            },
        ],
        Operation: 'And',
    };

    const response = await fetch(`${SERVER_URL}/${PLATFORM}/FileCabinets/${FILE_CABINET_ID}/Query/DialogExpression?Count=2&Fields=DOCUMENT_TYPE&SortOrder=DOCUMENT_TYPE+Asc&DialogId=${SEARCH_DIALOG_ID}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
