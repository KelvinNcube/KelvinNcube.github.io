// Function to get employee name from the query string
function getEmployeeNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('employee'); // Extract the "employee" query parameter
}

// Function to load employee data from DocuWare
async function loadEmployeeData() {
    const employeeName = getEmployeeNameFromURL(); // e.g., "john-doe"
    if (!employeeName) {
        document.getElementById('employee-card').innerHTML = '<p>No employee specified</p>';
        return;
    }
    try {
        // Fetch data from your Netlify function
        const response = await fetch(`/.netlify/functions/docuware?employee=${employeeName}`);

        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const container = document.getElementById('employee-card');
        container.innerHTML = ''; // Clear previous content

        if (data && data.length > 0) {
            // Create a card for the employee
            let employeeCard = document.createElement('div');
            employeeCard.classList.add('employee-card');

            // Add logo to the employee card
            let dynamicLogo = document.createElement('img');
            dynamicLogo.src = 'https://origincranes.com.au/wp-content/uploads/2023/03/origin-logo.png';
            dynamicLogo.alt = 'Origin Cranes Logo';
            dynamicLogo.classList.add('logo');
            employeeCard.appendChild(dynamicLogo);

            // Add employee name at the top of the card
            let employeeNameElement = document.createElement('h2');
            employeeNameElement.textContent = employeeName.replace(/-/g, ' '); // Replace hyphens with spaces
            employeeCard.appendChild(employeeNameElement);

            // Create a container for the document links
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Create a button for each document returned
            data.forEach(item => {
                let linkElement = document.createElement('a');
                linkElement.href = item.docUrl; // Use the URL from DocuWare
                linkElement.textContent = item.documentType || "Document"; // Set the button label to the document type
                linkElement.classList.add('link-button'); // Add class for styling
                linkElement.target = '_blank'; // Open in new tab

                buttonsContainer.appendChild(linkElement); // Add link to buttons container
            });

            employeeCard.appendChild(buttonsContainer); // Add buttons container to employee card
            container.appendChild(employeeCard); // Add employee card to the container
        } else {
            container.innerHTML = `<p>No documents found for this employee.</p>`;
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        document.getElementById('employee-card').innerHTML = `<p>Error loading employee data: ${error.message}</p>`;
    }
}

// Load employee data when the page is loaded
window.onload = loadEmployeeData;
