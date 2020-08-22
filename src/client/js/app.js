/* Global Variables */
const result = document.getElementById("result-box");
const addTripButton = document.getElementById("button-trip");
const printButton = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const goingTo = document.querySelector('input[name="destination"]');
const depDate = document.querySelector('input[name="date"]');
// Personal Data for Geonames
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "travelling";
// Personal API Key for WeatherBit


// Personal API Key for Pixabay



// Event listener to add function to existing HTML DOM element
addTripButton.addEventListener('click', addTrip);

/* Function called by event listener to Add a Trip */
export function addTrip(e) {
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
    getLocation(geoNamesURL, newDestination, username)
        //chaining promises with then()
        .then((cityData) => {
            const cityLat = cityData.geonames[0].lat;
            const cityLong = cityData.geonames[0].lng;
            const country = cityData.geonames[0].countryName;
            //const weatherData = getWeather(cityLat, cityLong, country, timestamp);
            //return weatherData;
        }).then((weatherData) => {
            //update dinamically UI
            updateUI();
        })
}

/* Function to GET Web API Location Data*/
export const getLocation = async (geoNamesURL, newDestination, username) => {
    // res equals to the result of fetch function
    const res = await fetch(geoNamesURL + newDestination + "username=" + username);
    try {
      const cityData = await res.json();
      return cityData;
    } catch (error) {
        console.log("There was an error with retrieving data from the Location", error);
    }
};

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