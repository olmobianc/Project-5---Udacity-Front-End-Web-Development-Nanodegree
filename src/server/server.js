// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening() {
    console.log("Server is running..");
    console.log(`running on port ${port}`);
}

//GET route
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})

//POST Route
app.post('/add', addData);

function addData(request, response) {
    projectData.depCity = request.body.depCity;
    projectData.arrCity = request.body.arrCity;
    projectData.depDate = request.body.depDate;
    projectData.temp = request.body.temp;
    projectData.recap = request.body.recap;
    projectData.daysLeft = request.body.daysLeft;
    response.send(projectData);
}
  