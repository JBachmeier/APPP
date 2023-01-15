import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import * as Speech from 'expo-speech';

export default function Map(props) {

  

  const [errorMsg, setErrorMsg] = useState(null);
  const [toastflagg, setToastflag] = useState(false);
  const [lastNearestPH, setLastNearestPH] = useState(null);



  const showToast = (parkhaus) => {
    Toast.show({
      type: 'info',
      text1: parkhaus.name + ' in der Nähe',
      text2: parkhaus.frei + ' Parkplätze frei',
    });
  }
  
  const speak = (parkhaus) => {
    if(!props.TTSActive){
      const thingToSay = 'Parkhaus ' + parkhaus.name + ' in der nähe. ' + parkhaus.frei + ' Parkplätze frei. ' + parkhaus.wegbeschreibung;
      Speech.speak(thingToSay, {language: "DE"});
    }
    
  };

      useEffect(() => {   
        const intervalId = setInterval(() => { 

          props.parkhausdatenfull.forEach((parkhaus) => {

            parkhaus.distanz = Math.sqrt(((parkhaus.latitude - props.lat)*(parkhaus.latitude - props.lat)) + ((parkhaus.longitude - props.lon)*(parkhaus.longitude - props.lon)))
            if(parkhaus.distanz <= 0.006){
              if((parkhaus.frei / parkhaus.gesamt) >= 0.05){
                parkhaus.distanzFlag = true;
              }
            }
            else{
              parkhaus.distanzFlag = false;
            }

            // Diesen return verwenden, wenn mit dem richtigen Standort gearbeitet werden soll
            //return props.parkhausdatenfull[parkhaus.ID-1].distanz = Math.sqrt(((parkhaus.latitude - props.location.coords.latitude)*(parkhaus.latitude - props.location.coords.latitude)) +
            // ((parkhaus.longitude - props.location.coords.longitude)*(parkhaus.longitude - props.location.coords.longitude)))
          })

          if(props.parkhausdatenfull.some(distCheck)){
            const nearPHs = props.parkhausdatenfull.filter(parkhaus => parkhaus.distanzFlag)
            const nearestPH = nearPHs.reduce((acc, curr) => {
              return (acc.distanz < curr.distanz) ? acc : curr;
            })
            if (lastNearestPH && nearestPH.distanz < lastNearestPH.distanz -0.0001) {
              setToastflag(false);

            }
            if(!toastflagg){
              showToast(nearestPH);
              setToastflag(true);
              speak(nearestPH);
             }
             setLastNearestPH(nearestPH);

          }
          else{
            setToastflag(false);
          }
        },100);
        return () => clearInterval(intervalId);
      }, [props.lat, props.lon, toastflagg])
    
      function distCheck(value){
        return value.distanzFlag;
      }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (props.location) {
    text = JSON.stringify(props.location);
  }

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
      {props.location ? <Marker style={styles.marker}
      coordinate = {{latitude:props.lat, longitude:props.lon}}
         pinColor = {"red"}
         title={"Your Location"}
         /> : null}
    {props.PHMarker} 
    </MapView>
  );
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
    height: '100%',
  },
  marker:{
    position: 'absolute',
  }
});