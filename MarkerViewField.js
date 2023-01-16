import { Text } from 'react-native';
import { Marker } from 'react-native-maps';
import React from 'react';
import { Callout } from 'react-native-maps';


export default function MarkerViewField(props) {


        // abängig davon, ob das Parkhaus favorisiert ist, wird ein anderes Bild für den Marker verwendet.
        let output;
        props.Parkhaus.favorite ? (
            output = <Marker coordinate={{latitude: props.Parkhaus.latitude, longitude: props.Parkhaus.longitude}} image={require('./icons/FavoritePinKlein.png')}>
                    <Callout>
                        <Text>{props.Parkhaus.name}</Text>
                        <Text>Momentan belegt: {props.Parkhaus.belegt}</Text>
                        <Text>Momentan frei: {props.Parkhaus.frei}</Text>
                    </Callout>
              </Marker>
            
            )
          :
          (
            output = (<Marker coordinate={{latitude: props.Parkhaus.latitude, longitude: props.Parkhaus.longitude}} image={require('./icons/PinKlein.png')}>
                        <Callout>
                            <Text>{props.Parkhaus.name}</Text>
                            <Text>Momentan belegt: {props.Parkhaus.belegt}</Text>
                            <Text>Momentan frei: {props.Parkhaus.frei}</Text>
                        </Callout>
                  </Marker>
              )
          )
        
        return (output)
}
