window.addEventListener("load", () => {
    const key = "501bb31c26359fccb702935cbdf676b4";
    const token = "e622932e15c8a3";
    const KELVIN = 273;
    let isCelsius = true;
    const mapToken = "pk.eyJ1Ijoia290ZGVuIiwiYSI6ImNrYXR5Nmd6ZjA1cWQyemxmYTh4bHh5NG4ifQ.GmXRsj5AtKw7e2AvLlYoiQ";
    let lon;
    let lat = 12.07;
    let temperatureDescription = document.querySelector(".temperature-description");
    let temperatureDegree = document.querySelector(".temperature-degree");
    let locationTimezone = document.querySelector(".location-timezone");
    const iconWeather = ["01d", "CLEAR_DAY", "01n", "CLEAR_NIGHT", "02d", "PARTLY_CLOUDY_DAY", "02n", "PARTLY_CLOUDY_NIGHT", "03d", "CLOUDY",
    "03n", "CLOUDY", "04d", "CLOUDY", "04n", "CLOUDY", "09d", "RAIN", "09n", "RAIN", "10d", "SLEET", "10n", "SLEET", "13d", "SNOW", "13n", "SNOW",
    "11d", "WIND", "11n", "WIND", "50d", "FOG", "50n", "FOG", ];
    //const daysWeather = document.querySelector('.days');
    const longitudePoint = document.querySelector('.longitude');
    const latitudePoint = document.querySelector('.latitude');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            console.log(lon, lat);
            //longitudePoint.textContent = Math.round(lon*100)/100;
            //latitudePoint.textContent = Math.round(lat*100)/100;
            //locationPoint.textContent = lon + " " + lat;


            const res = `https://ipinfo.io/json?token=${token}`;
            fetch(res)
                .then(response => {
                    let mapTokens = response.json();
                    return mapTokens;
                })
                .then(mapTokens => {
                    console.log(mapTokens);

                    const { city, region, country, loc } = mapTokens;
                    locationTimezone.textContent = city;
                    const cords = loc.split(",");
                    return cords;
                })   
                .then(cords => { 
                    lon = cords[0];
                    lat = cords[1];
                    
                    latitudePoint.textContent = Math.round(lat*100)/100;
                    longitudePoint.textContent = Math.round(lon*100)/100;
                   
                });

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
                    
                    temperatureDegree.textContent = changeKelvin(temp);
                    temperatureDescription.textContent = ((data.current.weather)[0].description);
                    //locationTimezone.textContent = data.timezone;
                    //changeTimeZone(data.timezone, "En");
                    windSpeed = wind_speed;
                    fellsLike = feels_like;
                    const icon = (data.current.weather)[0].icon;
                    setIcons(icon, document.querySelector(".icon"));
                    let daysTemperature = {temp: [], icon: []};
                    let daysAllWeather = data.daily;
                        for (let i = 0; i < 3; i++) {
                            //console.log(daysAllWeather[i].temp.eve);
                            daysTemperature.temp[i] = daysAllWeather[i].temp.eve
                            daysTemperature.icon[i] = daysAllWeather[i].weather[0].icon;
                        }
                    return daysTemperature;
                })
                .then(daysTemperature => {
                    let fragment = document.createDocumentFragment();
                    let daysWeather = document.querySelector(".days");
                    let nextDayMarker = "NDay";
                    console.log(daysTemperature);
                    for (let i = 0; i < 3; i++) {
                        let dayWeather = document.querySelector(`.day.${nextDayMarker}`);
                        //dayWeather.classList.add("day");
                        let icon = document.querySelector(`canvas.${nextDayMarker}`);
                        
                        
                        dayWeather.innerHTML = changeKelvin(daysTemperature.temp[i]);
                        let iconDay = daysTemperature.icon[i];
                        setIcons(iconDay, icon);
                        daysWeather.appendChild(dayWeather);
                        daysWeather.appendChild(icon);
                        nextDayMarker = "N" + nextDayMarker;
                        console.log(iconDay);
                        
                    }

                });
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
            return Math.floor(temperatureDegreeKelvin - KELVIN);
        }

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
            document.querySelector('.time').innerHTML = new Date().toLocaleString(lang, options)
        }, 1000)
        //const date = new Date(new Date().toLocaleString('en-US', { timeZone: timezone }));
    }
});