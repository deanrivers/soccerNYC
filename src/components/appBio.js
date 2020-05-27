import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image} from 'react-native'
import {Actions} from 'react-native-router-flux'

//images
import leftButton from '../assets/icons/back2.png'

let AppBio = ()=>{
    return(
        <View style={styles.main}>
            <TouchableOpacity style={styles.backButton} onPress={()=>Actions.pop()}>
                {/* <Text>Back</Text> */}
                <Image style={{width:50,height:50,}} source={leftButton}/>
            </TouchableOpacity>
            <View style={styles.subTextContainer}>
                    <View style={{backgroundColor:'black',width:300,height:300,borderRadius:1000,justifyContent:'center',alignItems:'center',padding:30,borderColor:'white',borderWidth:1}}>
                        <Text style={styles.subText}>This app was designed to find soccer fields in your area. It's time for you to get out there and ball up.</Text>
                    </View>
                    
                </View>
        </View>
    )
}

const styles = StyleSheet.create({
    main:{
        flex:1
    },
    subText:{
        color:'white',
        fontFamily:'GillSans-SemiBoldItalic',
        fontFamily:'Helvetica',
        textAlign:'center',
        fontSize:20
    },
    subTextContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        overflow:'visible',
        backgroundColor:'black'
    },
    backButton:{
        position:'absolute',
        backgroundColor:'black',
        borderRadius:100,
        width:50,
        height:50,
        top:40,
        left:40,
        zIndex:100,
        justifyContent:'center',
        alignItems:'center',
        paddingRight:5
    }
})

export default AppBio
