var storedSearch;
document.getElementById("searchButton").addEventListener("click", function() {
    // Get the value entered by the user
    var searchTerm = document.getElementById("inputSearch").value;
    
    // Store the value in the global variable
    storedSearch = searchTerm;
    
    // For demonstration, you can log the stored search term to the console
    console.log("Stored search term:", storedSearch);
    
    if (test.hasOwnProperty(storedSearch)) {
        window.location.href = "table.html";
    } else {
        alert("Please enter another word.");
        // Add event listener to the alert dialog
        window.addEventListener('click', function(event) {
            // Check if the event target is the alert's "OK" button
            if (event.target === document.querySelector('.alert button')) {
                // Redirect back to the search page
                window.location.href = "input.html";
            }
        });
    }
    
    // You can also perform further actions with the stored search term here
    
    // Send a request to the server
    fetch('https:localhost:3000/search'+storedSearch, {
        method: 'POST', // or 'GET', 'PUT', 'DELETE', etc.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchTerm: storedSearch })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })

    .then(data => {
        console.log('Server response:', data);
        // Further actions with the server response
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
    

});
let test= {
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
}
    
    console.log(test);