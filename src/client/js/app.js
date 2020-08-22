/* Global Variables */
const result = document.getElementById("result-box");
const addTripButton = document.getElementById("button-trip");
const printButton = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const goingTo = document.querySelector('input[name="destination"]');
const depDate = document.querySelector('input[name="date"]');
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
// Personal API Key for WeatherBit
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&APPID=515a96d2f824b84902e9acef36d94c63';
// Personal API Key for Pixabay
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&APPID=515a96d2f824b84902e9acef36d94c63';

// Event listener to add function to existing HTML DOM element
addTripButton.addEventListener('click', performAction);

/* Function called by event listener to Add a Trip */
export function performAction(e) {
    e.preventDefault();
    //get inputs from user
    const newDestination = goingTo.value;
    const departureDate = depDate.value;
    //check if user values inserted are incorrect
    if (newDestination.length === 0 || departureDate === 0) {
        alert("Data is not inserted correctly.. Please try again");
        return;
    }
    //main function call
    getLocation(baseURL, newDestination, apiKey)
        //chaining promises with then()
        .then(function(data) {
            //add user data to POST request
            postData('/add', { 
                latitude: data.latitude,
                longitude: data.longitude, 
                country: newDestination
            });
        }).then(function() {
            //update dinamically UI
            updateUI()
        })
}

/* Function to GET Web API Data*/
const getLocation = async(baseURL, newDestination, apiKey) => {
    const res = await fetch(baseURL + newDestination + apiKey);
    try {
        const data = await res.json(); //convert the data object into json file
        console.log(data);
        return data;

    } catch (error) {
        console.log("There was an error with your GET request", error);
    }
}

/* Function to POST data */
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        // body data type must match "Content-Type" header
        body: JSON.stringify({
            lat: data.lat,
            long: data.long,
            country: data.country }),  
    })
  
    try {
        const newData = await response.json();
        console.log(newData);
        return newData;

    } catch (error) {
        console.log("There was an error with your POST request", error);
    }
}

/* Function to dinamically update UI */
const updateUI = async () => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temp;
        document.getElementById('content').innerHTML = allData.content;
  
    } catch (error) {
        console.log("There was an error updating the UI", error);
    }
}