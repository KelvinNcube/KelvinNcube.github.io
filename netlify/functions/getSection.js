const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Method not allowed" }),
        };
    }

    const body = JSON.parse(event.body);
    const secID = body.secID;
    const token = body.token;

    // Fetch the section data for the given section ID
    const partReq = await fetch(`https://origin-cranes.docuware.cloud/DocuWare/Platform/FileCabinets/8d8184f4-697b-4708-ad8e-9f59bab5ecd1/Sections/${secID}/Data`, {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
        }
    });

    const partRes = await partReq.arrayBuffer();
    return {
        statusCode: 200,
        body: JSON.stringify({ buffer: Buffer.from(partRes).toString('base64') })
    };
};
