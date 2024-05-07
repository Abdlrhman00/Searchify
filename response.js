// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector("#dataTable tbody");
    // Clear existing rows
    tableBody.innerHTML = "";

    // Loop through data and create table rows
    data.forEach((item, index) => {
        const row = `<tr>
                        <th scope="row">${index + 1}</th>
                        <td><button type="button" class="btn btn-outline-warning" onclick="window.open('http://${item.url}', '_blank')">${item.url}</button></td>
                        <td>${item.frequency}</td>
                        <td>${item['tf-idf']}</td>
                    </tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
    // Return button event listener
    const returnButton = document.getElementById("returnButton");
    returnButton.addEventListener("click", function() {
        // Redirect to the input page
        window.location.href = "input.html";
    });
}

// Sample data (replace with your actual data from the server response)
let test = {
    "Cat": [
        {
            "url": "google.com",
            "frequency": 1,
            "tf": 1,
            "idf": 0.5,
            "tf-idf": 0.5
        },
        {
            "url": "Facebook.com",
            "frequency": 2,
            "tf": 1,
            "idf": 1,
            "tf-idf": 1
        }
    ]
};

// Event listener for radio buttons
document.querySelectorAll('input[name="sortingOption"]').forEach((elem) => {
    elem.addEventListener("change", function(event) {
        const sortingOption = event.target.id;
        let sortedData;
        let data = test[Object.keys(test)[0]]; // Extracting the array of data from each object
        if (sortingOption === "sortByFrequency") {
            sortedData = data.sort((a, b) => b.frequency - a.frequency);
        } else if (sortingOption === "sortByTFIDF") {
            sortedData = data.sort((a, b) => b['tf-idf'] - a['tf-idf']);
        }

        populateTable(sortedData);
});

});
