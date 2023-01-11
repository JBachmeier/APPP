import { Button, StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { Callout } from 'react-native-maps';


export default function MarkerViewField(props) {


    if(true){
        //console.log(Object.values(props.Parkhaus.Name)[0]);
        //console.log(Object.values(props.Parkhaus.Aktuell)[0]);
        //console.log(Object.values(props.Parkhaus.Frei)[0]);
        //console.log(props)
        return (<Marker coordinate={{latitude: props.Parkhaus.latitude, longitude: props.Parkhaus.longitude}}>
                    <Callout>
                        <Text>{props.Parkhaus.name}</Text>
                        <Text>Momentan belegt: {props.Parkhaus.belegt}</Text>
                        <Text>Momentan frei: {props.Parkhaus.frei}</Text>
                    </Callout>
              </Marker>
          )
        }

        
}