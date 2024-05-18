const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());

app.use('/controllers', express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'views')));

function loadJSON() {
    // Specify the path to your JSON file
    const filePath = 'dataSet-test.json';

    return new Promise((resolve, reject) => {
        // Read the JSON file asynchronously
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading JSON file:', err);
                reject(err); // Reject the Promise if there's an error
                return;
            }

            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData); // Resolve the Promise with the parsed JSON data
            } catch (error) {
                console.error('Error parsing JSON data:', error);
                reject(error); // Reject the Promise if there's an error parsing JSON
            }
        });
    });
}

app.get('/', (req, res) => {
    console.log("someone is here");
    res.send('<h1>HELLO</h1>');
});

app.get('/search', (req, res) => {
    const searchBarPath = path.join(__dirname, 'views', 'searchBar.html');
    res.sendFile(searchBarPath);
});


app.post('/search/:word', (req, res) => {   
    console.log("POST search/:word");
    loadJSON()
    .then(jsonData =>{
        const word = req.params.word;
        const data = jsonData[word];

        if (data === undefined) {
            res.status(404).json({ success: false, message: 'Not Found' });
            return; // Exit early to prevent sending multiple responses
        }

        // Send the JSON response
        res.json({ success: true, message: data });

        // Send the HTML file after the JSON response has been sent
        // const resultPath = path.join(__dirname, 'views', 'result.html');
        // res.sendFile(resultPath);
    })
    .catch(err => {
        console.error('Error loading JSON:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    });
});

app.get('/search/:word', (req, res) => {
    console.log("Get serch/word");
    res.sendFile(path.join(__dirname, 'views', 'result.html'));
  });



app.listen(3000, () => {
    console.log('Server started on port 3000');
});
