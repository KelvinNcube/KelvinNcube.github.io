// Function to get employee name from the query string
function getEmployeeNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('employee'); // Extract the "employee" query parameter
}

// Function to load employee data
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

        const data = await response.json(); // Expecting an array of document objects
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
            employeeNameElement.textContent = capitalizeName(employeeName.replace(/-/g, ' ')); // Replace hyphens with spaces and capitalize
            employeeNameElement.classList.add('employee-name'); // Add a class for styling
            employeeCard.appendChild(employeeNameElement);

            // Create a container for the document links
            const buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Create a button for each document returned
            data.forEach(item => {
                let buttonElement = document.createElement('button');
                buttonElement.textContent = item.documentType || "Document"; // Set the button label to the document type
                buttonElement.classList.add('link-button'); // Add class for styling

                // Add an event listener to the button
                buttonElement.addEventListener('click', async () => {
                    // Call the getSection function with the extracted DocID
                    await getSection(item.docID); // Use item.docID to get the document ID
                });

                buttonsContainer.appendChild(buttonElement); // Add button to buttons container
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

// Function to download a file from base64
function downloadB64(base64, type = 'application/octet-stream', name) {
    fetch(`data:${type};base64,${base64}`).then(async res => {
        let blob = await res.blob();
        let blobUrl = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = blobUrl;
        a.download = name;
        a.click();
        URL.revokeObjectURL(blobUrl); // Clean up
    });
}

async function getSection(docID) {
    const response = await fetch('/.netlify/functions/getSection', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secID: docID }),
    });

    if (!response.ok) {
        console.error(`Error fetching section for DocID ${docID}:`, response.statusText);
        return;
    }

    const sectionData = await response.json();
    const b64String = sectionData.buffer; // Ensure this exists
    const fileType = sectionData.fileType || 'application/pdf'; // Default to PDF if undefined
    const fileName = sectionData.fileName || 'document.pdf'; // Default file name

    // Log to check the data
    console.log('Section Data:', sectionData);
    console.log('Base64 String Length:', b64String.length);
    console.log('File Type:', fileType);

    // Clear previous content in the modal
    const modalContent = document.getElementById('document-data');
    modalContent.innerHTML = '';

    // Create elements for download and viewing
    const attachmentDiv = document.createElement('div');
    const buttonDiv = document.createElement('div');
    const viewButton = document.createElement('button');
    const downloadButton = document.createElement('button');

    viewButton.textContent = 'View Document';
    downloadButton.textContent = 'Download Document';

    // Add attributes for downloading
    downloadButton.setAttribute('data-base64', b64String);
    downloadButton.setAttribute('data-filetype', fileType);
    downloadButton.setAttribute('data-filename', fileName);

    // Download button event listener
    downloadButton.addEventListener('click', (e) => {
        const type = e.target.getAttribute('data-filetype');
        const b64 = e.target.getAttribute('data-base64');
        const name = e.target.getAttribute('data-filename');
        downloadB64(b64, type, name);
    });

    // Append buttons to the button div
    buttonDiv.appendChild(viewButton);
    buttonDiv.appendChild(downloadButton);
    attachmentDiv.appendChild(buttonDiv);
    modalContent.appendChild(attachmentDiv); // Append the attachmentDiv

    // Determine how to display the document
    if (fileType.startsWith("image/")) {
        const imageEl = document.createElement('img');
        imageEl.src = `data:${fileType};base64,${b64String}`;
        modalContent.appendChild(imageEl);
    } else if (fileType === "application/pdf") {
        // Use an iframe to display PDF
        const pdfEl = document.createElement("iframe");
        pdfEl.src = `data:${fileType};base64,${b64String}`;
        pdfEl.style.width = '100%';
        pdfEl.style.height = '500px';
        pdfEl.style.border = 'none'; // Add border style to avoid default iframe borders
        modalContent.appendChild(pdfEl);

        // Optionally open the PDF in a new tab
        const pdfUrl = `data:${fileType};base64,${b64String}`;
        viewButton.addEventListener('click', () => {
            window.open(pdfUrl, '_blank');
        });
    } else {
        console.error(`Unsupported file type: ${fileType}`);
    }

    // Show the modal
    const modal = document.getElementById('document-modal');
    modal.style.display = "block";

    // Close button functionality
    document.querySelector('.close-button').onclick = function () {
        modal.style.display = "none";
    };

    // Close modal if user clicks outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

// Helper function to capitalize the first letter of each word
function capitalizeName(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Load employee data when the page is loaded
window.onload = loadEmployeeData;
