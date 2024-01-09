document.getElementById('jsonDataForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const fileInput = document.getElementById('jsonFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const jsonData = JSON.parse(event.target.result);
            processData(jsonData);
        };
        reader.readAsText(file);
    }
});

function processData(data) {
    const products = data.products;

    // Sort products by popularity in descending order
    const sortedProducts = Object.values(products).sort((a, b) => b.popularity - a.popularity);

    const columns = Object.keys(sortedProducts[0]);

    // Populate Available Fields list
    const availableFields = document.getElementById('availableFields');
    columns.forEach(column => {
        const option = document.createElement('option');
        option.value = column;
        option.text = column;
        availableFields.appendChild(option);
    });

    // Handle add and remove buttons
    document.getElementById('addToDisplay').addEventListener('click', function () {
        moveOptions('availableFields', 'displayFields');
    });

    document.getElementById('removeFromDisplay').addEventListener('click', function () {
        moveOptions('displayFields', 'availableFields');
    });

    function moveOptions(from, to) {
        const fromSelect = document.getElementById(from);
        const toSelect = document.getElementById(to);
        const selectedOptions = Array.from(fromSelect.selectedOptions);
        selectedOptions.forEach(option => {
            toSelect.appendChild(option);
        });

        // Refresh table based on selected columns
        refreshTable();
    }

    function refreshTable() {
        const displayFields = Array.from(document.getElementById('displayFields').options)
            .map(option => option.value);

        const tableHeaders = document.getElementById('tableHeaders');
        tableHeaders.innerHTML = '';
        tableHeaders.insertAdjacentHTML('beforeend', displayFields.map(field => `<th>${field}</th>`).join(''));

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        sortedProducts.forEach(product => {
            const tr = document.createElement('tr');
            displayFields.forEach(field => {
                const td = document.createElement('td');
                td.textContent = product[field];
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // Show table on initial load
    document.getElementById('displayTable').style.display = 'block';
}