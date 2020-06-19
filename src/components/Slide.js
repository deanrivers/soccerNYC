import React,{useEffect, useState } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,TouchableOpacity,Animated,Easing,ScrollView, Platform,Alert } from 'react-native'
import Dialog from "react-native-dialog";
import openMap from 'react-native-open-maps';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const Slide = (props) => {

    const [dialogVisible,updateDialogVisible] = useState(false)

    locationPressed = (data) =>{
        console.log('Data',data)
        openMap({
            latitude:data.latitude,
            longitude:data.longitude,
            travelType:'drive',
            navigate_mode:'preview',
            query:data.title,
            provider:'apple',
            
        })
    }

    handleYes = (data) => {
        
        locationPressed(data)
        updateDialogVisible(false)
    }

    

    return([
        <View style={styles.card}>
            <Image
                source={{uri:props.data.illustration}}
                style={styles.cardImage}
                resizeMode="cover"
            />

            <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{props.data.title}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>{props.data.subtitle}</Text>
                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={()=>updateDialogVisible(true)}
                    >
                        <Text style={styles.textSign}>Find Pitch</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>,
        <View style={{flex:1,position:'absolute',zIndex:100}}>
        <Dialog.Container 
            visible={dialogVisible}
            >
            <Dialog.Title>Open Apple Maps?</Dialog.Title>
            <Dialog.Description>
                Get directions to {props.data.title}
            </Dialog.Description>
            <Dialog.Button label="Cancel" onPress={()=>updateDialogVisible(false)}/>
            <Dialog.Button label="Yes" onPress={()=>handleYes(props.data)}/>
        </Dialog.Container>
    </View>
    ])
}

const styles = StyleSheet.create({
    card: {
        // padding: 10,
        elevation: 2,
        backgroundColor: "#ddd",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
      },
      cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
        zIndex:1000
        // backgroundColor:'red'
      },
      textContent: {
        flex: 2,
        padding: 10,
      },
      cardtitle: {
        fontSize: 12,
        // marginTop: 5,
        fontWeight: "bold",
      },
      cardDescription: {
        fontSize: 12,
        color: "#444",
      },
      signIn: {
        width: '100%',
        padding:5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        color:'black'
    },
})

export default Slide