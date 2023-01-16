import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import { TouchableOpacity, Image, Switch } from 'react-native';
import React, { useState } from 'react';

export default function OptionsButton(props) {

  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Wechselt den TTS Status und ruft die Prop funktion in App.js auf.
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    props.TTSswitch(isEnabled);
  };
        return (
        <View style={styles.button}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Image resizeMode='contain' source={require('./icons/die-einstellungen.png')}/>
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
                <Text style={styles.modalText}>Settings</Text>

                <Text>Text-To-Speech</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
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

    button:{
      position: 'absolute',
      transform: [{ scale: 0.07 }],
      top: -200, 
      right: -230,
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