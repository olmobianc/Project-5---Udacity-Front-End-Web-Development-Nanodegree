/* Global Variables */
const result = document.getElementById("result-box");
const addTripButton = document.getElementById("button-trip");
const printButton = document.getElementById("save");
const deleteButton = document.getElementById("delete");
const goingTo = document.querySelector('input[name="destination"]');
const depDate = document.querySelector('input[name="start-date"]');
const endDate = document.querySelector('input[name="end-date"]');
//For updading UI
const remainingDays = document.getElementById("remaining-days");
const tripLength = document.getElementById("trip-duration");
const city = document.getElementById("city");
const date = document.getElementById("date");
const weather = document.getElementById("temp");
// Personal Data for Geonames
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "travelling";
// Personal API Key for WeatherBit
const weatherApiUrl = "https://api.weatherbit.io/v2.0/current?";
const weatherAPIKey = "7468f7e0d79a4cf5ab5f70d3faf3b1ed";
// Personal API Key for Pixabay



// Event listener to add function to existing HTML DOM element
addTripButton.addEventListener('click', addTrip);

/* Function called by event listener to Add a Trip */
export function addTrip(e) {
    e.preventDefault();
    //get inputs from user
    const newDestination = goingTo.value;
    const departureDate = depDate.value;
    const endingDate = endDate.value;
    //check if user values inserted are incorrect
    if (newDestination.length === 0 || departureDate === 0 || endingDate === 0 || (endingDate - departureDate) < 0) {
        alert("Data is not inserted correctly.. Please try again");
        return;
    }
    //MAIN function call
    getLocation(geoNamesURL, newDestination, username)
        .then((cityData) => {
            const cityLat = cityData.geonames[0].lat;
            const cityLong = cityData.geonames[0].lng;
            const country = cityData.geonames[0].countryName;
            console.log(cityLat, cityLong, country);
            const weatherData = getWeather(cityLat, cityLong);
            console.log(weatherData);
            return weatherData;
        }).then((weatherData) => {
            const userData = postData('http://localhost:8000/add', 
            { newDestination, departureDate, endingDate, temp: weatherData.data[0].temp });
            console.log(userData);
            return userData;
        }).then((userData) => {
            updateUI(userData);
        });
}

/* Function to GET Web API Location Data */
export const getLocation = async (geoNamesURL, newDestination, username) => {
    // res equals to the result of fetch function
    const res = await fetch(geoNamesURL + newDestination + "&maxRows=10&" + "username=" + username);
    try {
        const cityData = await res.json();
        return cityData;
    } catch (error) {
        console.log("There was an error with retrieving data from the Location", error);
    }
}

/* Function to GET Web API Weather Data */
export const getWeather = async (cityLat, cityLong) => {
    const req = await fetch(`${weatherApiUrl}&lat=${cityLat}&lon=${cityLong}&key=${weatherAPIKey}`)
    try {
        const weatherData = await req.json();
        return weatherData;
    } catch (error) {
        console.log("There was an error with retrieving data from the Weather, error");
    }
}

/* Function to POST data */
export const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            city: data.newDestination,
            startDate: data.departureDate,
            endDate: data.endingDate,
            temp: data.temp
        }),  
    })  
    try {
        const userData = await response.json();
        console.log(userData);
        return userData;
    } catch (error) {
        console.log("There was an error with your POST request", error);
    }
}

/* Function to get the length of the trip */
const getLengthOfTrip = () => {
    const start = new Date(depDate.value);
    const end = new Date(endDate.value);
    const length = end.getTime() - start.getTime();
    const lengthOfTrip = length / (1000 * 60 * 60 * 24);
    return lengthOfTrip;
}

/* Function to get the days remaning to the trip */
const getRemainingDays = () => {
    const start = new Date(depDate.value);
    const today = new Date();
    const duration =  Math.floor(start - today);
    const durationInDays = Math.floor(duration / (1000 * 60 * 60 * 24) + 1);
    return durationInDays;
}

/* Function to dinamically update UI */
const updateUI = async (userData) => {
    try {
        result.classList.remove("hidden");
        city.innerHTML = userData.newDestination;
        date.innerHTML = userData.startDate;
        remainingDays.innerHTML = getRemainingDays();
        tripLength.innerHTML = getLengthOfTrip();
        weather.innerHTML = userData.temp;
    }
    catch {
        console.log("error", error);
    }
    
}