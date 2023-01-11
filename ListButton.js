import { Button, StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { TouchableOpacity, Image, Switch } from 'react-native';

import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import ParkhausModal from './ParkhausModal';

const trendArrow = {
  "0": 'red',
  '>1': 'green',
  "-1": 'red'
}

export default function ListButton(props) {

  const [modalVisible, setModalVisible] = useState(false);

  let PHListe = props.parkhausdatenfull.map((parkhaus)=>{  
    return  <ParkhausModal key={parkhaus.ID} parkhaus={parkhaus}/>
     })

    if(true){

        return (
        <View style={styles.button}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image resizeMode='contain' source={require('./icons/auffuhren.png')}/>
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
                <Text style={styles.modalText}>Alle Parkhäuser</Text>
                {PHListe}
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





    button:{
      position: 'absolute',
      transform: [{ scale: 0.07 }],
      top: -210, 
      right: -180,
      zIndex: 1,
      flex: 1,
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
      marginBottom: 15,
      textAlign: "center"
    }
  
    
  });