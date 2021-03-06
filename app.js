window.addEventListener("load", () => {
    const key = "501bb31c26359fccb702935cbdf676b4";
    const token = "e622932e15c8a3";
    const mapToken = "pk.eyJ1Ijoia290ZGVuIiwiYSI6ImNrYXR5Nmd6ZjA1cWQyemxmYTh4bHh5NG4ifQ.GmXRsj5AtKw7e2AvLlYoiQ";
    const accesKey = "VCPa0zhyv8i7M51dJdKUDzNPLlAxEspNsXOnOtkqzps";
    const geoKey = "a71409b520f94101bc130b47a348634e";

    let lon = 52.09;
    let lat = 23.68;
    let isCelsius = true;
    let degreeScale = "°C";
    const KELVIN = 273;
    const iconWeather = ["01d", "CLEAR_DAY", "01n", "CLEAR_NIGHT", "02d", "PARTLY_CLOUDY_DAY", "02n", "PARTLY_CLOUDY_NIGHT", "03d", "CLOUDY",
    "03n", "CLOUDY", "04d", "CLOUDY", "04n", "CLOUDY", "09d", "RAIN", "09n", "RAIN", "10d", "SLEET", "10n", "SLEET", "13d", "SNOW", "13n", "SNOW",
    "11d", "WIND", "11n", "WIND", "50d", "FOG", "50n", "FOG", ];

    const temperatureDescription = document.querySelector(".temperature-description");
    const temperatureDegree = document.querySelector(".temperature-degree");
    const locationTimezone = document.querySelector(".location-timezone");
    const inputText = document.querySelector(".form-control");
    const longitudePoint = document.querySelector('.longitude');
    const latitudePoint = document.querySelector('.latitude');
    const chengeBackground = document.getElementById("getPic");
    const textSearch = document.getElementById("searchtext");
    const form = document.getElementById("searchform");
    form.addEventListener('submit', searchInput);
    let timeNow;

    function searchInput(event){
        event.preventDefault();
        getLocationSearch(textSearch.value);
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            displayMap(lon, lat);
            getWeather(lon, lat);
        });
    } else {
        inputText.placeholder = "Browser does not support geolocation";
        displayMap(lon, lat);
        getWeather(lon, lat);
    }

    determinationOfCoordinates();
    function determinationOfCoordinates() {
        const res = `https://ipinfo.io/json?token=${token}`;
        fetch(res)
            .then(response => {
                const mapTokens = response.json();
                return mapTokens;
            })
            .then(mapTokens => {
                const { city, country, timezone, loc } = mapTokens;
                locationTimezone.textContent = `${city} ${country}`;
                const cords = loc.split(",");
                changeTimeZone(timezone, lang = 'en-US');
                return cords;
            });
    }

    function getLocationSearch(placename) {
        clearInterval(timeNow);
        const placeNameSearch = placename;
        const link = `https://api.opencagedata.com/geocode/v1/json?q=${placeNameSearch}&key=${geoKey}`;
        fetch (link)
            .then(response => {
                const searchPlace = response.json();
                return searchPlace;
            })
            .then(searchPlace => {
                const { formatted, geometry, annotations} = searchPlace.results[0];
                const searchResult = {};
                searchResult.place = geometry;
                searchResult.timezone = annotations.timezone.name;
                searchResult.formatted = formatted;
                return searchResult;
            })
            .then(searchResult => {
                displayMap(searchResult.place.lng, searchResult.place.lat);
                getWeather(searchResult.place.lng, searchResult.place.lat);
                locationTimezone.textContent = searchResult.formatted;
                changePicture();
                changeTimeZone(searchResult.timezone, lang = 'en-US');

            })
            .catch(error => {
                textSearch.value = "";
                inputText.placeholder = `Try it again. Invalid request. ${error}`;
            });
    }
    
    function getWeather(longitude, latitude) {
        changePicture();
        latitudePoint.textContent = ((Math.round(latitude*100)/100) + "′").replace('.', '°');  
        longitudePoint.textContent = ((Math.round(longitude*100)/100) + "′").replace('.', '°');
        const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&APPID=${key}`;
        fetch(api)
            .then(response => {
                let data = response.json();
                return data;
            })
            .then(data => {
                const { temp, feels_like, wind_speed } = data.current;
                temperatureDegree.textContent = changeKelvin(temp);
                fellsLike = `, fells like ${changeKelvin(feels_like)}`;
                temperatureDescription.textContent = ((data.current.weather)[0].description) + fellsLike;
                windSpeed = wind_speed;
                const icon = (data.current.weather)[0].icon;
                setIcons(icon, document.querySelector(".icon"));
                let daysTemperature = {temp: [], icon: []};
                let daysAllWeather = data.daily;
                    for (let i = 0; i < 3; i++) {
                        daysTemperature.temp[i] = daysAllWeather[i].temp.eve
                        daysTemperature.icon[i] = daysAllWeather[i].weather[0].icon;
                        }
                return daysTemperature;
            })
            .then(daysTemperature => {
                let daysWeather = document.querySelector(".days");
                let nextDayMarker = "NDay";
                for (let i = 0; i < 3; i++) {
                    let dayWeather = document.querySelector(`.day.${nextDayMarker}`);
                    let icon = document.querySelector(`canvas.${nextDayMarker}`);
                    dayWeather.innerHTML = changeKelvin(daysTemperature.temp[i]);

                    let iconDay = daysTemperature.icon[i];
                    setIcons(iconDay, icon);
                    daysWeather.appendChild(dayWeather);
                    daysWeather.appendChild(icon);
                    nextDayMarker = "N" + nextDayMarker;
                }
            });
    }
   
    chengeBackground.onclick = function turnChange () {
        return changePicture();
    }

    function changePicture() {
        const api = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=${accesKey}`;
        fetch(api)
            .then(response => {
                let data = response.json();
                return data;
            })
            .then(data => {
                let backPicture = `url(${data.urls.full})`;
                return backPicture;
            })
            .then(backPicture => {
                const containerCanvase = document.getElementById("mean");
                containerCanvase.style.backgroundImage = backPicture;
            });
    }

    function displayMap(cordLon, cordLat) {
        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [cordLon, cordLat],
            zoom: 9,
        });
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "white" }); 
        const currentIcon = iconWeather[iconWeather.indexOf(icon)+1];
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

    function changeKelvin (temperatureDegreeKelvin) {
        if (isCelsius) {
            return Math.floor(temperatureDegreeKelvin - KELVIN) + degreeScale;
        }
    }

    function changeTimeZone(zoneName, lang = 'en-US') {
        const options = {
            timeZone: zoneName,
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }
        timeNow = setInterval(() => {
            document.querySelector('.time').innerHTML = new Date().toLocaleString(lang, options)
        }, 1000); 
    }
});