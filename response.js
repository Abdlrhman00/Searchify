
//var word = getCookie("word");
//console.log("word", word);

var globalData = "";

var link = window.location.href;
var word = link.split('/');
word = word[word.length-1];
console.log('word: '+word);

// Function to perform the fetch request
async function fetchData(word) {
    try {
        const response = await fetch(`http://localhost:3000/search/`+word, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
         
        //const data = await response.json();
        if(data.success == false)
            alert(data.message);
        else{
        console.log('Server response:', data);
        globalData = data.message;
        defaultRadio(data.message);
        }
        
    } catch (error) {
        console.error('There was a problem with the request:', error);
    }
}
// Call fetchData when the page loads
fetchData(word);



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
}

// Event listener for radio buttons
function defaultRadio(sortedData){
    sortedData.sort((a, b) => b.frequency - a.frequency);
    populateTable(sortedData);
}


    document.querySelectorAll('input[name="sortingOption"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const sortingOption = event.target.id;
            let sortedData = globalData;

            if (sortingOption === "sortByFrequency") {
                sortedData.sort((a, b) => b.frequency - a.frequency);
            } else if (sortingOption === "sortByTFIDF") {
                sortedData.sort((a, b) => b['tf-idf'] - a['tf-idf']);
            }

            populateTable(sortedData);
        });
    });



