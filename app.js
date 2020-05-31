window.addEventListener("load", () => {
    const key = "501bb31c26359fccb702935cbdf676b4";
    const token = "e622932e15c8a3";
    const KELVIN = 273;
    const mapToken = "pk.eyJ1Ijoia290ZGVuIiwiYSI6ImNrYXR5Nmd6ZjA1cWQyemxmYTh4bHh5NG4ifQ.GmXRsj5AtKw7e2AvLlYoiQ";
    let lon;
    let lat;
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimezone = document.querySelector(".location-timezone");
    const iconWeather = ["01d", "CLEAR_DAY", "01n", "CLEAR_NIGHT", "02d", "PARTLY_CLOUDY_DAY", "02n", "PARTLY_CLOUDY_NIGHT", "03d", "CLOUDY",
    "03n", "CLOUDY", "04d", "CLOUDY", "04n", "CLOUDY", "09d", "RAIN", "09n", "RAIN", "10d", "SLEET", "10n", "SLEET", "13d", "SNOW", "13n", "SNOW",
    "11d", "WIND", "11n", "WIND", "50d", "FOG", "50n", "FOG", ];
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(lon, lat);
            //const res = `https://ipinfo.io/json?token=${token}`;

            mapboxgl.accessToken = mapToken;
            const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [lon, lat],
            zoom: 9
            });

            
            const api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&APPID=${key}`;
            

            fetch(api)
                .then(response => {
                    let data = response.json();
                    return data;
                })
                .then(data => {
                    console.log(data);

                    const { temp, feels_like, wind_speed } = data.current;
                    temperatureDegree.textContent = Math.floor(temp - KELVIN);
                    temperatureDescription.textContent = ((data.current.weather)[0].description);
                    locationTimezone.textContent = data.timezone;

                    windSpeed = wind_speed;
                    fellsLike = feels_like;
                    const icon = (data.current.weather)[0].icon;
                    setIcons(icon, document.querySelector(".icon"));
                });
        });
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({ color: "white" }); 
        const currentIcon = iconWeather[iconWeather.indexOf(icon)+1];
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

    function changeTimeZone(zoneName, lang) {
        const options = {
            timeZone: zoneName,
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
            seconnd: 'numeric',
            hour12: false,
        }
        setInterval(() => {
            document.querySelector('.time').innerHTML = new Date().toLocaleString(lang, option)
        }, 1000)
    }
});