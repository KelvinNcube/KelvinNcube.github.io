// Function to get employee name from the query string
function getEmployeeNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('employee'); // Extract the "employee" query parameter
}

// Function to load employee data from JSON
async function loadEmployeeData() {
    const employeeName = getEmployeeNameFromURL(); // e.g., "john-doe"
    if (!employeeName) {
        document.getElementById('employee-card').innerHTML = '<p>No employee specified</p>';
        return;
    }
    try {
        const response = await fetch('./employees.json'); // Ensure the correct path
        const employees = await response.json();
        // Find the employee by comparing URL name to JSON employee names, converting them to URL-friendly format
        const employee = employees.find(emp =>
            emp.name.toLowerCase().replace(/\s+/g, '-') === employeeName
        );
        const container = document.getElementById('employee-card');
        container.innerHTML = ''; // Clear previous content
        if (employee) {
            // Create an employee card for the matching employee
            let card = document.createElement('div');
            card.classList.add('employee-card');

            // Create label for Origin Cranes
            let label = document.createElement('h2');
            label.textContent = 'Origin Cranes';
            label.classList.add('label'); // Add a class for styling
            card.appendChild(label); // Add label to card

            // Employee name
            let name = document.createElement('h3');
            name.textContent = employee.name;
            card.appendChild(name);

            // Container for the buttons
            let buttonsContainer = document.createElement('div');
            buttonsContainer.classList.add('buttons-container');

            // Employee links
            employee.links.forEach(link => {
                let linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.label;
                linkElement.classList.add('link-button'); // Add this class
                linkElement.target = '_blank'; // Open in new tab
                buttonsContainer.appendChild(linkElement); // Add to buttons container
            });

            card.appendChild(buttonsContainer); // Add buttons container to card
            container.appendChild(card); // Add card to container
        } else {
            container.innerHTML = `<p>Employee not found</p>`;
        }
    } catch (error) {
        console.error('Error loading employee data:', error);
        document.getElementById('employee-card').innerHTML = `<p>Error loading employee data</p>`;
    }
}

// Load employee data when the page is loaded
window.onload = loadEmployeeData;
