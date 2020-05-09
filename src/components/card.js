import React from 'react'
import {View, Text,StyleSheet,Image,TouchableOpacity} from 'react-native'
import ImageOverlay from 'react-native-image-overlay'
import ImageGradient from 'react-native-image-gradient';

import imageTech from '../assets/icons/technology.svg'
// import imageCompass from '../assets/icons/compasses.png'
import imageCompass from '../assets/icons/maps-and-location.png'
import imageSoccer from '../assets/icons/humanpictos.png'
import imageLeague from '../assets/icons/web.png'


let Card = (props) =>{
    return(
        <View style={styles.cardView}>
            <View style={styles.locationView}>

                <Text style={styles.locationText}>{props.location}</Text>
            </View>

            <View style={styles.imageView}>
                {/* <Image style={styles.image} source={props.image} resizeMode='cover'/> */}
                <ImageOverlay source={props.image} overlayAlpha={0.3}/>
                {/* <ImageGradient 
                    
                    
                    
                    imageUrl={props.image}
                    startPosition ={{x:0,y:0}}
                    rgbcsvStart={'255,255,255'}
                    rgbcsvEnd={'0,0,0'}
                    opacityStart={0.9}
                    opacityEnd={0.0}
                ></ImageGradient> */}
            </View>
            
            
            {/* {props.leagues.map( (item,index)=>{
                return(
                <Text style={styles.leagueText}>{item}</Text>
                )
            })} */}

            
            
            <View style={styles.bottomBarView}>
                <TouchableOpacity>
                    <Image style={styles.iconImage} source={imageCompass}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.iconImage} source={imageSoccer}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.iconImage} source={imageLeague}/>
                </TouchableOpacity>
                
            </View>

            
        </View>
    )
}

const styles = StyleSheet.create({
    cardView:{
        height:400,
        width:350,
        backgroundColor:'white',
        marginBottom:40,
        // margin:10,
        // padding:50,
        // justifyContent:'flex-end',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        // alignItems:'center',
        shadowOffset:{  width: 3,  height: 3,  },
        shadowColor: 'black',
        shadowOpacity: 1.0,
        borderRadius:10,
        // padding:30,
        overflow:'hidden',
        backgroundColor:'#ccc',
        

    },

    locationView:{

        flex:1,
        position:'absolute',
        top:0,
        padding:10,
        // paddingTop:0,
        zIndex:10,
        backgroundColor:'white',
        width:350
        
        
    },
    locationText:{
        color:'black',
        fontFamily:'Didot',
        // flex:1
        fontSize:25,
    },
    leagueText:{
        fontFamily:'Didot',
        // flex:1,
        alignItems:'flex-start',
        justifyContent:'flex-start'
    },
    image:{
        // width:240,
        // height:200,
        transform:[{scale:1}],
        // resizeMode:'contain',
        flex:1,
        // zIndex:1000,
        justifyContent:'flex-start',
        alignItems:'flex-start',
        width:350
    },
    imageView:{
        justifyContent:'flex-start',
        alignItems:'center',
    },
    bottomBarView:{
        flex:1,
        width:350,
        backgroundColor:'white',
        flex:1,
        alignItems:'center',
        justifyContent:'space-evenly',
        flexDirection:'row'
        // position:'absolute',
        // bottom:0
    },
    bottomText:{
        color:'white'

    },
    iconImage:{
        width:30,
        height:30,
        
    }
})

export default Card