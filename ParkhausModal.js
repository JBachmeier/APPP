import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Icon } from '@rneui/themed';


export default function ParkhausModal(props) {

  const [modalVisible, setModalVisible] = useState(false);

  let bgcolor = ((props.parkhaus.frei / props.parkhaus.gesamt) >= 0.05) ? '#47C847' : '#FF795C';

  function favChanged() {
    props.parkhaus.favorite = !props.parkhaus.favorite;
    console.log(props.parkhaus.name);
    console.log(props.parkhaus.favorite);
    
    props.refreshPH();
  }

  if(props.parkhaus.geschlossen == 1){
    bgcolor = 'lightgrey'
  }
        return (
        <View style={[styles.button]}>
          {props.parkhaus.favorite ?
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View key={props.parkhaus.ID} style={[styles.containerlist, {backgroundColor: bgcolor, flexDirection: 'row', alignItems: 'center'}]}>
              <Icon style={{paddingLeft:25}}/>

                <Text style={[styles.PHTextFav]}>
                    {props.parkhaus.name}
                    

                </Text>
                <Icon name='heart' color='#FF83EE' type='font-awesome'/>
              </View>
              </TouchableOpacity>

              : 
              <TouchableOpacity onPress={() => setModalVisible(true)}>
              <View key={props.parkhaus.ID} style={[styles.containerlist, {backgroundColor: bgcolor}]}>
                <Text style={styles.PHText}>
                    {props.parkhaus.name}
                </Text>
              </View>
              </TouchableOpacity>

              }
            

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

                <View style={styles.fav}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      favChanged();
                    }}
                  >
                    <Icon name='heart' color={props.parkhaus.favorite? '#FF83EE' : 'black'} type='font-awesome'/>
                  </TouchableOpacity>
                </View>
                <Text>Öffnungszeiten: {props.parkhaus.oeffnungszeiten}{"\n"}</Text>
                <Text>{props.parkhaus.gebühren}{"\n"}{"\n"}</Text>
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
    fav:{
      position: "absolute",
      top:0,
      right:0,
      padding: 10
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
      justifyContent: "space-around",

    },
    PHText:{
      textAlign: "center",
    },
    PHTextFav:{
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