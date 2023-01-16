import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import React, { useState, useEffect } from 'react';
import Toast from 'react-native-toast-message';
import * as Speech from 'expo-speech';

export default function Map(props) {

  

  const [errorMsg, setErrorMsg] = useState(null);
  const [toastflagg, setToastflag] = useState(false);
  const [lastNearestPH, setLastNearestPH] = useState(null);



  // Zeigt den Toast an, mit den entsprechenden Daten
  const showToast = (parkhaus) => {
    Toast.show({
      type: 'info',
      text1: parkhaus.name + ' in der Nähe',
      text2: parkhaus.frei + ' Parkplätze frei',
    });
  }
  
  // Liest die nachricht, wenn aktiviert, laut vor
  const speak = (parkhaus) => {
    if(!props.TTSActive){
      const thingToSay = 'Parkhaus ' + parkhaus.name + ' in der nähe. ' + parkhaus.frei + ' Parkplätze frei. ' + parkhaus.wegbeschreibung;
      Speech.speak(thingToSay, {language: "DE"});
    }
    
  };

      useEffect(() => {   
        const intervalId = setInterval(() => { 

          props.parkhausdatenfull.forEach((parkhaus) => {
            // Zuerst wird für jedes Parkhaus die Distanz berechnet
            parkhaus.distanz = Math.sqrt(((parkhaus.latitude - props.lat)*(parkhaus.latitude - props.lat)) + ((parkhaus.longitude - props.lon)*(parkhaus.longitude - props.lon)))
            // Wenn die Distanz klein genug ist, und genügen Parkplätze frei sind, wird distanzFlag true gesetzt
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

          // Danach wird geprüft, ob ein Parkhaus diese kriterien erfüllt
          if(props.parkhausdatenfull.some(distCheck)){
            // falls ja, wird das näheste Parkhaus berechnet
            const nearPHs = props.parkhausdatenfull.filter(parkhaus => parkhaus.distanzFlag)
            const nearestPH = nearPHs.reduce((acc, curr) => {
              return (acc.distanz < curr.distanz) ? acc : curr;
            })
            // falls das näheste Parkhaus näher ist als das letzte, wird der ToasFlag false gesetzt
            if (lastNearestPH && nearestPH.distanz < lastNearestPH.distanz -0.0001) {
              setToastflag(false);
            }
            // Bei false ToastFlag, wird ein neuer Toast angezeigt und die Flag auf true gesetzt
            if(!toastflagg){
              showToast(nearestPH);
              setToastflag(true);
              speak(nearestPH);
            }
            // dann wird das letzte näheste Parkhaus gesetzt
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