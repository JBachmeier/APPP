import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Map from './Map.js';
import OptionsButton from './OptionsButton';
import ListButton from './ListButton';
import Toast from 'react-native-toast-message';
import parkhaeuser from './Parkhaus.json';
import MarkerViewField from './MarkerViewField';


var parkhausURL = 'https://parken.amberg.de/wp-content/uploads/pls/pls.xml';


export default function App() {

  const [TTSActive, setTTSActive] = useState(false);
  const [parkhausdatenfull, setParhausdatenfull] = useState([]);
  const [parkhausXML, setParkhausXML] = useState(null);
  const [parkhausdaten, setParkhausdaten] = useState(null);
  const [PHMarker, setPHMarker] = useState(null);
  const [location, setLocation] = useState(null);

  const [lat, setLat] = useState(49.4466776);
  const [lon, setLon] = useState(11.8463033);
  const increaselat = () => {setLat(lat+0.001);}
  const decreaselat = () => {setLat(lat-0.001);}
  const increaselon = () => {setLon(lon+0.001);}
  const decreaselon = () => {setLon(lon-0.001);}

  function TTSSwitched(newValue) {
    console.log(newValue);
    setTTSActive(newValue);
  }

  useEffect(() => {    
    let watchId;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000, // this will get the location every 5 seconds
          distanceInterval: 0,
        },
        (location) => {
          setLocation(location);
        }
      );
    })();

    return () => watchId.remove();
  }, []); 

  const parseString = require('react-native-xml2js').parseString;
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(parkhausURL)
          .then(response => response.text())
          .then((response) => {
              parseString(response, function (err, result) {
                  setParkhausXML(result);
                  parkhaeuser.Parkhaus.forEach((ph) => {
                    ph.gesamt = result.Daten.Parkhaus[ph.ID-1].Gesamt[0]
                    ph.belegt = result.Daten.Parkhaus[ph.ID-1].Aktuell[0]
                    ph.frei = result.Daten.Parkhaus[ph.ID-1].Frei[0]
                    ph.trend = result.Daten.Parkhaus[ph.ID-1].Trend[0]
                    ph.status = result.Daten.Parkhaus[ph.ID-1].Status[0]
                    ph.geschlossen = result.Daten.Parkhaus[ph.ID-1].Geschlossen[0]
                    parkhausdatenfull[ph.ID-1] = (ph)
                    
                  });
                  setParkhausdaten(parkhausdatenfull);
                   let _PHMarker = parkhausdatenfull.map((parkhaus)=>{                    
                   return <MarkerViewField key={parkhaus.ID} Parkhaus={parkhaus}></MarkerViewField>
                    })
                    setPHMarker(_PHMarker)
                  response = null;
                  _PHMarker = null;
                  result = null;
              });
          }).catch((err) => {
              console.log('fetch', err)
          })

        },1000);
        return () => clearInterval(intervalId);

      }, []);

  return (
    <View style={styles.container}>
        <OptionsButton TTSswitch={TTSSwitched}/>
        <ListButton parkhausdatenfull={parkhausdatenfull}/>
      <Map style={styles.map} lat={lat} lon={lon} TTSActive={TTSActive} PHMarker={PHMarker} parkhausdatenfull={parkhausdatenfull} location={location}>
      </Map>
      <Button title='latchange+' onPress={increaselat}></Button>
      <Button title='latchange-' onPress={decreaselat}></Button>
      <Button title='lonchange+' onPress={increaselon}></Button>
      <Button title='lonchange-' onPress={decreaselon}></Button>
      <Toast
        position='bottom'
        onShow={() => {
          console.log('Toast is shown!');
        }}
      />
    </View>
  );
}

//<a href="https://www.flaticon.com/free-icons/parking" title="parking icons">Parking icons created by Freepik - Flaticon</a>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    flex: 1,
    position: 'absolute',
    zIndex: 0,

  },
  
  
});


/*
<Header style={styles.touchable}
  centerComponent={{ text: 'Parhäuser-Amberg', style: { color: 'black'} }}
  rightComponent={<MenuButton style={styles.test}/>}
  containerStyle={{ backgroundColor: 'white'}} />
*/