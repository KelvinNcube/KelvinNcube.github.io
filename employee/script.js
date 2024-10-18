// Function to get employee name from the query string
function getEmployeeNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('employee'); // Extract the "employee" query parameter
}


// Function to load employee data from JSON
async function loadEmployeeData() {
    const employeeName = getEmployeeNameFromURL(); // e.g., "john-doe"

    try {
        const response = await fetch('/employees.json');
        const employees = await response.json();

        // Find the employee by name (assuming the employee names are unique)
        const employee = employees.find(emp =>
            emp.name.toLowerCase().replace(/\s+/g, '-') === employeeName
        );

        const container = document.getElementById('employee-card');
        container.innerHTML = ''; // Clear previous content

        if (employee) {
            // Create an employee card for the matching employee
            let card = document.createElement('div');
            card.classList.add('employee-card');

            // Employee name
            let name = document.createElement('h3');
            name.textContent = employee.name;
            card.appendChild(name);

            // Employee links
            employee.links.forEach(link => {
                let linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.textContent = link.label;
                linkElement.target = '_blank'; // Open in new tab
                card.appendChild(document.createElement('br')); // Line break
                card.appendChild(linkElement);
            });

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
