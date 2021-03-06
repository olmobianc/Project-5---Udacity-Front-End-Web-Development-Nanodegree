/* Global Variables */
const result = document.getElementById("result-box");
const addTripButton = document.getElementById("button-trip");
const goingTo = document.querySelector('input[name="destination"]');
const depDate = document.querySelector('input[name="start-date"]');
const endDate = document.querySelector('input[name="end-date"]');
//For updading UI
const remainingDays = document.getElementById("remaining-days");
const tripLength = document.getElementById("trip-duration");
const city = document.getElementById("city");
const date = document.getElementById("date");
const weather = document.getElementById("temp");
const imageLink = document.getElementById("image");
// Personal Data for Geonames
const geoNamesURL = 'http://api.geonames.org/searchJSON?q=';
const username = "travelling";
// Personal API Key for WeatherBit
const weatherApiUrlDaily = "https://api.weatherbit.io/v2.0/current?";
const weatherApiUrl = "https://api.weatherbit.io/v2.0/forecast/daily?";
const weatherAPIKey = "7468f7e0d79a4cf5ab5f70d3faf3b1ed";
// Personal API Key for Pixabay
const pixabayApiUrl = "https://pixabay.com/api/?key=";
const pixabayAPIKey = "18023770-1686678485031f56a56844441";

document.addEventListener('DOMContentLoaded', _ => {
    // Event listener to add function to existing HTML DOM element
    addTripButton.addEventListener('click', addTrip);
});

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
            console.log(cityLat, cityLong, country); //logging out the city Lat, Long and Country
            const weatherData = getWeather(cityLat, cityLong);
            return weatherData;
        }).then((weatherData) => {
            //const temp = weatherData.data[0].app_temp;
            //console.log(temp); //logging out the temperature
            const userData = postData('http://localhost:8000/add', 
            { newDestination, departureDate, endingDate, temp: weatherData }); //stuff I want to Post
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
    const remainingDaysCheck = getRemainingDays();
    console.log(remainingDaysCheck);
    if( remainingDaysCheck < 7 ) {
        const res = await fetch(`${weatherApiUrlDaily}&lat=${cityLat}&lon=${cityLong}&key=${weatherAPIKey}`)
        try {
            const weatherData = await res.json();
            return weatherData.data[0].app_temp;
        } catch (error) {
            console.log("There was an error with retrieving data from the Weather, error");
        }
    }
    else {
        const res = await fetch(`${weatherApiUrl}&lat=${cityLat}&lon=${cityLong}&key=${weatherAPIKey}`)
        try {
            const weatherData = await res.json();
            return weatherData.data[0].temp; 
        } catch (error) {
            console.log("There was an error with retrieving data from the Weather, error");
        }
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

/* Function to dinamically update UI while fetching the image of the desired Location*/
const updateUI = async (userData) => {
    const res = await fetch(pixabayApiUrl + pixabayAPIKey + "&q=" + userData.city + "+city&image_type=photo");
    try {
        result.classList.remove("hidden");
        const image = await res.json();

        city.innerHTML = userData.city;
        date.innerHTML = userData.startDate;
        remainingDays.innerHTML = getRemainingDays();
        tripLength.innerHTML = getLengthOfTrip();
        weather.innerHTML = userData.temp;
        imageLink.setAttribute("src", image.hits[0].webformatURL);

    }
    catch {
        console.log("error", error);
    }
    
}