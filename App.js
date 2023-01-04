import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import Map from './Map.js';
import OptionsButton from './OptionsButton';
import Toast from 'react-native-toast-message';




export default function App() {

  const [TTSActive, setTTSActive] = useState(true);

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

  return (
    <View style={styles.container}>
        <OptionsButton TTSswitch={TTSSwitched}/>
      <Map style={styles.map} lat={lat} lon={lon} TTSActive={TTSActive}>
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