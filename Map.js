import { Button, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import XMLParser from 'react-native-xml2js';
import { Callout } from 'react-native-maps';
import MarkerViewField from './MarkerViewField';
import parkhaeuser from './Parkhaus.json';
import Toast from 'react-native-toast-message';



//import AsyncStorage from '@react-native-async-storage/async-storage';

var parkhausURL = 'https://parken.amberg.de/wp-content/uploads/pls/pls.xml';



export default function Map(props) {

  

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [parkhausXML, setParkhausXML] = useState(null);
  const [parkhausdaten, setParkhausdaten] = useState(null);
  const [PHMarker, setPHMarker] = useState(null);
  const [counter, setCounter] = useState(0);
  const [parkhausdatenfull, setParhausdatenfull] = useState([]);
  const [closestPH, setClosestPH] = useState();
  const [toastflagg, setToastflag] = useState(false);


  const showToast = () => {
    Toast.show({
      type: 'info',
      text1: 'Freies Parhaus in der Nähe',
      text2: 'This is some something 👋',
    });
  }
  

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
          setCounter(prevCounter => prevCounter + 1);

        },1000);
        return () => clearInterval(intervalId);

      }, []);


      function CalcDist(PHLat, PHLon){
        Math.sqrt(((PHLat - props.lat)*(PHLat - props.lat)) + ((PHLon - props.lon)*(PHLon - props.lon))) 
      }
  
      useEffect(() => {    
        // Get the current location
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }
    
          let locallocation = await Location.getCurrentPositionAsync({});
          setLocation(locallocation);
          let PrevDist = 0;
          parkhausdatenfull.forEach((parkhaus) => {
            parkhaus.distanz = CalcDist(parkhaus.latitude, parkhaus.longitude);
            if(PrevDist > parkhaus.distanz){
              PrevDist = parkhaus.distanz;
              setClosestPH(parkhaus);
            }
            //return parkhausdatenfull[parkhaus.ID-1].distanz = Math.sqrt(((parkhaus.latitude - locallocation.coords.latitude)*(parkhaus.latitude - locallocation.coords.latitude)) + ((parkhaus.longitude - locallocation.coords.longitude)*(parkhaus.longitude - locallocation.coords.longitude)))
          })

          parkhausdatenfull.forEach((parkhaus) => {
            if(parkhaus.distanz <= 0.008){

              if(parkhaus.frei / parkhaus.gesamt >= 0.1){
                console.log("freiesparkhaus Nah dran");
                parkhaus.distanzFlag = true;
              }
            }
            else{
              parkhaus.distanzFlag = false;
            }
          })
          if(parkhausdatenfull.some(distCheck)){
            if(!toastflagg){
              showToast();
              setToastflag(true);
             }
          }
          else{
            setToastflag(false);
          }
        })();
        // Increment the counter every time the useEffect hook runs
      }, [counter]); // Watch the counter variable for changes
    
      function distCheck(value){
        return value.distanzFlag;
      }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

if(true){

  return (
    <MapView
    style={styles.map}
    initialRegion={{
      latitude: 49.44522,
      longitude: 11.858,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
    >
      {location ? <Marker style={styles.marker}
      coordinate = {{latitude:props.lat, longitude:props.lon}}
         pinColor = {"purple"} // any color
         title={"Your Location"}
         /> : null}
    {PHMarker} 
    </MapView>
  );
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '90%',
  },
  marker:{
    position: 'absolute',
  }
});