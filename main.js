// import { deleteAllCookies } from './co.js';
// deleteAllCookies();

// Check if the search button and input element exist on the page
if (document.getElementById("searchButton") && document.getElementById("inputSearch")) {
    // Add event listener only if the elements exist
    document.getElementById("searchButton").addEventListener("click", function() {
        // Get the value entered by the user
        var word = document.getElementById("inputSearch").value;
        // For demonstration, you can log the stored search term to the console
        console.log("Stored search term:", word);
        // Save the word to localStorage
        document.cookie = "word=" + encodeURIComponent(word) + "; path=/";
        // Redirect to the result page
        window.location.href = "/search/"+word;
    });
}



