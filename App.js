import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import Map from './Map.js';
import OptionsButton from './OptionsButton';
import ListButton from './ListButton';
import Toast from 'react-native-toast-message';
import parkhaeuser from './Parkhaus.json';
import MarkerViewField from './MarkerViewField';
import AsyncStorage from '@react-native-async-storage/async-storage';



var parkhausURL = 'https://parken.amberg.de/wp-content/uploads/pls/pls.xml';


export default function App() {

  const [TTSActive, setTTSActive] = useState(false);
  const [parkhausdatenfull, setParkhausdatenfull] = useState([]);
  const [PHMarker, setPHMarker] = useState(null);
  const [location, setLocation] = useState(null);

  const [lat, setLat] = useState(49.44796341748108);
  const [lon, setLon] = useState(11.861939782900281);
  const increaselat = () => {setLat(lat+0.001);}
  const decreaselat = () => {setLat(lat-0.001);}
  const increaselon = () => {setLon(lon+0.001);}
  const decreaselon = () => {setLon(lon-0.001);}

  const saveData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log(e)
    }
  }

  const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        console.log(e)
    }
  }

  function TTSSwitched(newValue) {
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

  async function setPHData(result){
    if(parkhausdatenfull == null){
      parkhaeuser.Parkhaus.forEach((ph) => {
        ph.gesamt = result.Daten.Parkhaus[ph.ID-1].Gesamt[0]
        ph.belegt = result.Daten.Parkhaus[ph.ID-1].Aktuell[0]
        ph.frei = result.Daten.Parkhaus[ph.ID-1].Frei[0]
        ph.trend = result.Daten.Parkhaus[ph.ID-1].Trend[0]
        ph.status = result.Daten.Parkhaus[ph.ID-1].Status[0]
        ph.geschlossen = result.Daten.Parkhaus[ph.ID-1].Geschlossen[0]
        parkhausdatenfull[ph.ID-1] = (ph)              
      });
    }
    else{
      let phdtemp = await getData("Parkhaeuser");
      phdtemp.forEach((ph) => {
        ph.gesamt = result.Daten.Parkhaus[ph.ID-1].Gesamt[0]
        ph.belegt = result.Daten.Parkhaus[ph.ID-1].Aktuell[0]
        ph.frei = result.Daten.Parkhaus[ph.ID-1].Frei[0]
        ph.trend = result.Daten.Parkhaus[ph.ID-1].Trend[0]
        ph.status = result.Daten.Parkhaus[ph.ID-1].Status[0]
        ph.geschlossen = result.Daten.Parkhaus[ph.ID-1].Geschlossen[0]
        parkhausdatenfull[ph.ID-1] = (ph)  
      });
      parkhaeuser.Parkhaus.forEach((ph) => {
        parkhausdatenfull[ph.ID-1].ID = ph.ID;
        parkhausdatenfull[ph.ID-1].name = ph.name;
        parkhausdatenfull[ph.ID-1].latitude = ph.latitude;
        parkhausdatenfull[ph.ID-1].longitude = ph.longitude;
        parkhausdatenfull[ph.ID-1].oeffnungszeiten = ph.oeffnungszeiten;
        parkhausdatenfull[ph.ID-1].wegbeschreibung = ph.wegbeschreibung;
        parkhausdatenfull[ph.ID-1].gebühren = ph.gebühren;
      });
    }
    await saveData("Parkhaeuser", parkhausdatenfull);
    let PHMakerFavs = parkhausdatenfull.filter(fav => fav.favorite);
    let _PHMarker = parkhausdatenfull.map((parkhaus)=>{                    
      return <MarkerViewField key={parkhaus.ID} Parkhaus={parkhaus}></MarkerViewField>
    })
    setPHMarker(_PHMarker)
    _PHMarker = null;
    result = null;
  }

  async function getPHData(){
    let phdtemp = await getData("Parkhaeuser");
    setParkhausdatenfull(phdtemp);
  }

  const parseString = require('react-native-xml2js').parseString;
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch(parkhausURL)
          .then(response => response.text())
          .then((response) => {
              parseString(response, function (err, result) {
                setPHData(result);
              });
          }).catch((err) => {
              console.log('fetch', err);
              getPHData();
          })

        },2500);
        return () => clearInterval(intervalId);

      }, []);

  return (
    <View style={styles.container}>
        <OptionsButton style={styles.button} TTSswitch={TTSSwitched}/>
        <ListButton style={styles.button} parkhausdatenfull={parkhausdatenfull} saveData={saveData}/>
      <Map style={styles.map} lat={lat} lon={lon} TTSActive={TTSActive} PHMarker={PHMarker} parkhausdatenfull={parkhausdatenfull} location={location}>
      </Map>
      <TouchableOpacity style={[styles.Coordsbutton, {left: 10}, {bottom: 80}]} onPress={() => increaselat()}>
        <Text>lat +</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.Coordsbutton, {left: 10}, {bottom: 20}]} onPress={() => decreaselat()}>
        <Text>lat -</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.Coordsbutton, {right: 10}, {bottom: 80}]} onPress={() => increaselon()}>
        <Text>lon +</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.Coordsbutton, {right: 10}, {bottom: 20}]} onPress={() => decreaselon()}>
        <Text>lon -</Text>
      </TouchableOpacity>
      
      <Toast
        position='bottom'
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
  button:{
    zIndex: 3,
    flex: 1,
  },
  map:{
    flex: 1,
    position: 'absolute',
    zIndex: 0,

  },
  Coordsbutton: {
    padding: 10,
    backgroundColor: '#FF7567',
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
    position: 'absolute',
  }
  
  
});


/*
<Header style={styles.touchable}
  centerComponent={{ text: 'Parhäuser-Amberg', style: { color: 'black'} }}
  rightComponent={<MenuButton style={styles.test}/>}
  containerStyle={{ backgroundColor: 'white'}} />
*/