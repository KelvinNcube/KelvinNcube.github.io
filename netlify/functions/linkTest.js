const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method not allowed" }),
        };
    }

    const body = JSON.parse(event.body);
    const docid = body.docid;

    // Hardcoded token retrieval function for testing
    let token = await getToken();

    // Fetch sections for the document ID
    let secReq = await fetch(`https://origin-cranes.docuware.cloud/DocuWare/Platform/FileCabinets/8d8184f4-697b-4708-ad8e-9f59bab5ecd1/Sections?DocId=${docid}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    let secRes = await secReq.json();

    return {
        statusCode: 200,
        body: JSON.stringify({ token: token, data: secRes }),
    };
};

// Hardcoded token retrieval for testing
async function getToken() {
    const tokenReq = await fetch("https://login-australia.docuware.cloud/0df62909-2188-406e-9a7f-9ac7540cf444/connect/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: "grant_type=password&scope=docuware.platform&client_id=docuware.platform.net.client&username=jurgendj.admin&password=Q@wsed09!"
    });

    const tokenRes = await tokenReq.json();
    return tokenRes.access_token;
}
