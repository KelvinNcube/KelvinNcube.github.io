async function fetchDocUrl() {
    const docId = '4857'; // Example document ID; replace with dynamic value if needed

    try {
        const response = await fetch('/.netlify/functions/docUrl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ docId })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('doc-url-output').textContent = `Document URL: ${data.documentUrl}`;
    } catch (error) {
        console.error('Error fetching document URL:', error);
        document.getElementById('doc-url-output').textContent = 'Error fetching document URL.';
    }
}
