import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Map from './Map.js';
import MenuButton from './MenuButton';
import Toast from 'react-native-toast-message';




export default function App() {

  const [toastshowflag, setToastshowflag] = useState(false);
  const [lat, setLat] = useState(49.4466776);
  const [lon, setLon] = useState(11.8463033);
  const increasecords = () => {setLat(lat+0.001);
  setLon(lon+0.001)}
  const decreasecords = () => {setLat(lat-0.001);
    setLon(lon-0.001)}

  function handleChange(newValue) {
    console.log(newValue);
    setToastshowflag(newValue);
  }

  return (
    <View style={styles.container}>
        <MenuButton/>
      <Map style={styles.map} onChange={handleChange} toastflag={toastshowflag} lat={lat} lon={lon}>
      </Map>
      <Button title='locationchange+' onPress={increasecords}></Button>
      <Button title='locationchange-' onPress={decreasecords}></Button>
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