import React,{useEffect, useState } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,BlurView,TouchableOpacity,Animated,Easing,ScrollView, Platform,Alert } from 'react-native'
import Dialog from "react-native-dialog";
import openMap from 'react-native-open-maps';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height/2.5;
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

            <View style={[styles.textContent]}>
                <Text numberOfLines={1} style={[styles.cardtitle,{color:'white'}]}>{props.data.title}</Text>
                <Text numberOfLines={1} style={[styles.cardDescription,{color:'#95A3A4'}]}>{props.data.subtitle}</Text>
                
                
            </View>

            <TouchableOpacity style={[styles.button]} onPress={()=>updateDialogVisible(true)}>
                <View style={[styles.signIn]}>
                    <Text style={{color:'white'}}>Get Directions</Text>
                </View>
            </TouchableOpacity>
        </View>,
        <View style={{flex:1,position:'absolute',zIndex:100}}>
            <Dialog.Container 
                visible={dialogVisible}
                >
                <Dialog.Title>Open Apple Maps?</Dialog.Title>
                <Dialog.Description>
                    Get directions to "{props.data.title}""
                </Dialog.Description>
                <Dialog.Button label="Cancel" onPress={()=>updateDialogVisible(false)} color="black"/>
                <Dialog.Button label="Yes" onPress={()=>handleYes(props.data)} color="black"/>
            </Dialog.Container>
        </View>
    ])
}

const styles = StyleSheet.create({
    card: {
        // padding: 10,
        elevation: 2,
        backgroundColor: "#3F4045",
        backgroundColor: "black",
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
        borderColor:'white',
        // borderWidth:1,
        borderRadius:10,
        zIndex:100
      },
      cardImage: {
        flex: 7,
        width: "100%",
        
        // alignSelf: "center",
        // zIndex:1000
        // backgroundColor:'red'
      },
      textContent: {
        flex: 2,
        padding: 10,
        
      },
      cardtitle: {
        fontSize: 16,
        // marginTop: 5,
        fontWeight: "bold",
      },
      cardDescription: {
        fontSize: 15,
        color: "#444",
        fontStyle:'italic'
      },
      button: {
        justifyContent:'center',
        alignItems: 'center',
        // backgroundColor:'#3F4045',
        // marginTop: 10,
        width:'100%',
        borderColor:'white',
        // borderRadiusBottom:10,
        borderWidth:1,
        flex:2,
        borderBottomEndRadius:10,
        borderBottomStartRadius:10
        },
 
    textSign:{
        color:'white',
        borderWidth:1,
        borderColor:'white',
        width:'100%',
        height:30,
        // height:'100%',
        justifyContent:'center',
        alignItems:'center',
        textAlign:'center',
        borderRadius:20
    },
    signIn:{
        alignItems:'center',
        justifyContent:'center'
    }
})

export default Slide