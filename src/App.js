import React , { useState, useEffect }from 'react';
import { Grid, CssBaseline} from '@material-ui/core';

import { getPlacesData , getWeatherData } from './api';
import Header from './components/Header/Header';
import Map from './components/Map/Map';
import List from './components/List/List';

const App = () => {
  const [bounds, setBounds] = useState({});
  const [coords, setCoords] = useState({});
  const [places, setPlaces] = useState([]);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState([]); 
  const [weatherData, setWeatherData] = useState([]);
  const [autocomplete, setAutocomplete] = useState(null);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({coords: {latitude, longitude} }) => {
      setCoords({ lat: latitude, lng: longitude});
    })
  }, [])

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating > rating )

    setFilteredPlaces(filteredPlaces);

  }, [rating])
  
  useEffect(() => {
    if(bounds.sw && bounds.ne) {
    setIsLoading(true)
    
    getWeatherData(coords.lat, coords.lng)
      .then((data) => setWeatherData(data));

    getPlacesData(type, bounds.sw, bounds.ne)
      .then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0 ));
        setFilteredPlaces([]);
        setRating('');
        setIsLoading(false);
      })
    }
  }, [bounds, type])
  
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };

  
  return (
    <>
      <CssBaseline />
      <Header 
        onPlaceChanged={onPlaceChanged} onLoad={onLoad} 
      />
      <Grid container spacing={3} style={{width: '100%'}}>
        <Grid item xs={12} md={4}>
          <List 
            places={filteredPlaces.length ? filteredPlaces : places }
            childClicked={childClicked}
            isLoading={isLoading}
            setType={setType}
            type={type}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map 
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            weatherData={weatherData}
          />
        </Grid>
      </Grid> 
    </>
  );
}

export default App;
