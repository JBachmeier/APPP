import { Button, StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { TouchableOpacity, Image, Switch } from 'react-native';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';

const trendArrow = {
  "0": 'red',
  '>1': 'green',
  "-1": 'red'
}

export default function ParkhausModal(props) {

  const [modalVisible, setModalVisible] = useState(false);

  let bgcolor = (props.parkhaus.frei > 0) ? '#47C847' : '#FF795C';

  if(props.parkhaus.geschlossen == 1){
    bgcolor = 'lightgrey'
  }
    if(true){
        return (
        <View style={styles.button}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View key={props.parkhaus.ID} style={[styles.containerlist, {backgroundColor: bgcolor}]}>
              <Text style={styles.PHText}>
                {props.parkhaus.name}
              </Text>
            </View>
          </TouchableOpacity>

              <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{props.parkhaus.name}</Text>
                <Text>Öffnungszeiten: {props.parkhaus.oeffnungszeiten}{"\n"}{"\n"}</Text>
                <View style={styles.parkplaetze}>
                  <Text style={styles.header}>Parkplätze</Text>
                  <Text>Gesamt: {props.parkhaus.gesamt}</Text>
                  <Text>Besetzt: {props.parkhaus.belegt}</Text>
                  <Text>Frei: {props.parkhaus.frei}</Text>
                </View>
                <Pressable
                  style={[styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        
          )
        }

        
}

const styles = StyleSheet.create({
    touchable:{
        flex: 1,
        
    },
    icon: {

      flex: 1,
      
    },
    header:{
      fontSize:18,
    },
    parkplaetze:{
      textAlign: "center",
      alignItems: "center",
      borderRadius: 15,
      borderColor: "#E8E8E8",
      borderWidth: 1,
      backgroundColor: "#E8E8E8",
      padding: 20,
      margin: 10,

    },

    containerlist:{
      width: 200,
      padding: 5,
      margin: 5,
      border: 5,
      borderRadius: 10,
      borderColor: "black",
    },
    PHText:{
      textAlign: "center",
    },



    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
      borderRadius: 20,
    padding: 10,
    elevation: 2
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      fontSize:30,
      marginBottom: 15,
      textAlign: "center"
    }
  
    
  });