import { useState } from 'react'
import axios from 'axios';
import './App.css'

interface Location {
  latitude: number;
  longitude: number;
}

function App() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [currentWeather, setCurrentWeather] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const getWeather = () => {
    setLoading(true);
    setTimeout(() => {
      if (!userLocation) {
        setLoading(false);
        return;
      };
      const apiKey = import.meta.env.VITE_API_KEY;

      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.latitude}&lon=${userLocation.longitude}&appid=${apiKey}`)
        .then((result) => {
          setCurrentWeather(result.data.weather[0].main);
        }).catch((err: Error) => {
          console.error(err);
        }).finally(() => {
          setLoading(false);
        })

    }, 1000);
  };

  return (
    <>
      <div>
        <h1>Geolocation App</h1>
        {/* create a button that is mapped to the function which retrieves the users location */}
        <button onClick={getUserLocation}>Get User Location</button>
        {/* if the user location variable has a value, print the users location */}
        {userLocation && (
          <div>
            <h2>User Location</h2>
            <p>Latitude: {userLocation.latitude}</p>
            <p>Longitude: {userLocation.longitude}</p>
            <button onClick={getWeather}>Get Current Weather</button>
            {loading && (<div className='loader'></div>)}
            {currentWeather && (<p>Current weather: {currentWeather}</p>)}
          </div>
        )}
      </div>
    </>
  )
}

export default App
