import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import ParkhausModal from './ParkhausModal';


export default function ListButton(props) {

  const [modalVisible, setModalVisible] = useState(false);

  // ruft die AsyncStorage speicher-Funktion auf, da sich die Favorisierung geändert hat.
  async function refreshPH(){
    await props.saveData("Parkhaeuser",props.parkhausdatenfull);
  }

  // Hier wird unterschieden zwischen favorisierten und normalen Parkhäusern
  let PHFavs = props.parkhausdatenfull.filter(fav => fav.favorite).map((parkhaus) =>{
    return  <ParkhausModal key={parkhaus.ID} parkhaus={parkhaus} refreshPH={refreshPH}/>
  })
  let PHNonFavs = props.parkhausdatenfull.filter(fav => !fav.favorite).map((parkhaus) =>{
    return  <ParkhausModal key={parkhaus.ID} parkhaus={parkhaus} refreshPH={refreshPH}/>
     })

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
                {// Die Favoriten werden als erstes gerendert, um diese oben in der Liste anzeigen zu lassen.
                }
                {PHFavs}
                {PHNonFavs}
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
      top: -200, 
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