import React, { Component, useEffect, useState } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,Animated,Easing,ScrollView, Platform,Alert } from 'react-native'

import MapView, {Marker,Circle,Callout, PROVIDER_GOOGLE, Polygon} from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import openMap from 'react-native-open-maps';
import Dialog from "react-native-dialog";

import Carousel from 'react-native-snap-carousel'


// import customMapStyle from './styles/customMapStyle'
import leftButton from '../assets/icons/arrows.png'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import config from '../../config'

import LinearGradient from 'react-native-linear-gradient';

import markerIcon from '../assets/icons/map_marker.png'
import defaultImage from '../assets/icons/logo.png'
import loaderImage from '../assets/icons/mag.gif'

import Slide from './Slide'


const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const MapFunctional = ()=>{

    const {width,height} = Dimensions.get('window')

    //declare states
    const [loading,updateLoading] = useState(false)
    const [location,updateLocation] = useState({})
    const [currentRegion,updateCurrentRegion] = useState(null)
    const [coordinates,updateCoordinates] = useState([])
    const [circleCenter,updateCircleCenter] = useState({})
    const [dialogVisible,updateDialogVisible] = useState(false)
    const [carouselYValue,updateCarouselYValue] = useState(new Animated.Value(height))
    const [carouselOpacity,updateCarouselOpacity] = useState(new Animated.Value(0))
    const [markerOpacity,updateMarkerOpacity] = useState(new Animated.Value(1))
    const [mainOpacity,updateMainOpacity] = useState(1)
    const [mapOpacity,updateMapOpacity] = useState(new Animated.Value(0))
    const [selectedMarkerIndex,updateSelectedMarkerIndex] = useState(0)
    const [markerLocation,updateMarkerLocation] = useState(new Animated.Value(10))

    
    _requestLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        },()=>console.log('triggered'))
        .then(location => {
            //update states
            updateLocation(location)
            updateCurrentRegion(location)
            updateLoading(true)

            console.log(loading)

            //find places
            hitPlaceAPI(location)
        })

        .catch(ex => {
            const { code, message } = ex;
            console.warn(code, message);
            if (code === 'CANCELLED') {
                Alert.alert('Location cancelled by user or by another request');
            }
            if (code === 'UNAVAILABLE') {
                Alert.alert('Location service is disabled or unavailable');
            }
            if (code === 'TIMEOUT') {
                Alert.alert('Location request timed out');
            }
            if (code === 'UNAUTHORIZED') {
                Alert.alert('Authorization denied');
            }
    
            updateLocation(null)
            updateLoading(false)
            // this.setState({
            //     location: null,
            //     loading: false,
            // });
        });
    }

    hitPlaceAPI = async (location)=>{
        console.log('hit place')
        const API_KEY = config.GOOGLE_PLACES_API_KEY
        const searchTerm = 'soccer%20field'
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        const radius ='5000'
        const parameters = "location=" + location.latitude + "," + location.longitude +
        "&radius="+radius+"&keyword="+searchTerm + "&key=" + API_KEY
        
        const url = baseUrl + parameters
        const response = await fetch(url)
        const data = await response.json()
        //console.log('Data coming in:',data)
        

        var location
        var coordinates = []
        var obj = {}

        if(data.status = 'OK'){
            for(var i = 0;i<data.results.length-1;i++){

            //set variable for name and imageLink
            var name = data.results[i].name.toLowerCase()
            var imageLink = ''

            //try to upddate imageLink if it exists
            try{
                imageLink = data.results[i].photos[0].photo_reference
            } catch(error){
                console.log(error)
            }

            //only process if it has an image link and the name is not just "soccer field"
            if(name !== 'soccer field' && imageLink){
                console.log('Valid information!!!!--->',name,imageLink)
                
                obj = {}
                location = data.results[i]
                obj['title'] = data.results[i].name
                obj['subtitle'] = 'Soccer Field'
                obj['latitude'] = data.results[i].geometry.location.lat
                obj['longitude'] = data.results[i].geometry.location.lng
                obj['latitudeDelta'] = 0.0922
                obj['longitudeDelta'] = 0.0421
                obj['photo_reference'] = imageLink

                //push object to array
                coordinates.push(obj)
            }
        }

            //loop for photos
            for(var i=0; i<coordinates.length;i++){
                const photoRef = coordinates[i].photo_reference
                const photo_url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400'
                const photoParams = '&photoreference='+photoRef+'&key='+API_KEY
                const complete_photo_url = photo_url+photoParams
                coordinates[i]['illustration'] = await hitPhotoAPI(complete_photo_url)
            }

            console.log('STATE COORDINATES',coordinates)
            updateCoordinates(coordinates)
            updateLoading(false)

            //animate markers
            Animated.timing(markerLocation,{
                toValue:0,
                duration:1000,
                delay:500,
                easing: Easing.linear
            }).start()

            //animate carousel pop up
            Animated.timing(carouselOpacity,{
                toValue:1,
                duration:1000,
                delay:500,
                easing: Easing.linear
            }).start()
        }
    }

    hitPhotoAPI = async (url) => {
        try{
            const response = await fetch(url);

            return response.url
        } catch(error){
            console.log(error)
        }
    }

    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);

    //component did mount
    useEffect(()=>{
        _requestLocation()

        console.log('uuuuu')

        //animtae map opacity
        Animated.timing(mapOpacity,{
            toValue:1,
            duration:1000,
            delay:0,
            easing: Easing.linear,
            useNativeDriver:false
        }).start()
    },[])


    useEffect(()=>{
        mapAnimation.addListener(({ value }) => {
            // console.log(coordinates)
            let index = Math.floor(value / CARD_WIDTH + 0.3);
            console.log(index) // animate 30% away from landing on the next item
            if (index >= coordinates.length) {
              index = coordinates.length - 1;
            }
            if (index <= 0) {
              index = 0;
            }
      
            clearTimeout(regionTimeout);
      
            const regionTimeout = setTimeout(() => {
              if( mapIndex !== index ) {
                mapIndex = index;
                const coordinate = coordinates[index];
                console.log('carousel cooridinate',coordinate)

                _map.current.animateToRegion(
                  {
                    latitude:coordinate.latitude,
                    longitude:coordinate.longitude,
                    latitudeDelta:  0.0922,
                    longitudeDelta: 0.0421,
                  },
                  350
                );
              }
            }, 10);
          },()=>updateSelectedMarkerIndex(index));
    })

    const interpolations = coordinates.map((marker, index) => {
        
        const inputRange = [
            ((index - 1) * CARD_WIDTH),
            ((index) * CARD_WIDTH),
            ((index + 1) * CARD_WIDTH),
        ]

        const barWidth = mapAnimation.interpolate({
            inputRange:[0,coordinates.length],
            outputRange:[0,100]
        })
    
        const scale = mapAnimation.interpolate({
          inputRange,
          outputRange: [1, 3,1],
          extrapolate: "clamp"
        });

        const opacity = mapAnimation.interpolate({
            inputRange,
            outputRange: [.3,1,.3],
            extrapolate: "clamp"
        })
        return {scale,opacity,barWidth} ;
      });

      //scroll to card when marker is selected
      const onMarkerPress = (mapEventData) => {
        const markerID = mapEventData._targetInst.return.key;
    
        let x = (markerID * CARD_WIDTH) + (markerID * 20); 
        if (Platform.OS === 'ios') {
          x = x - SPACING_FOR_CARD_INSET;
        }
    
        _scrollView.current.scrollTo({x: x, y: 0, animated: true});
      }

      const _map = React.useRef(null)
      const _scrollView = React.useRef(null)

    var loaderRender = (loading)?<View style={{flex:1,justifyContent:'center',alignItems:'center',zIndex:100000,height:'100%',backgroundColor:'',top:0,paddingBottom:'33%'}}><Image style={{flex:1,justifyContent:'center',alignItems:'center',width:60,height:60}}source={loaderImage}/></View>:
    null

    const customMapStyle = require('./styles/customMapStyle.json')

    return([
        // <Animated.View style={[styles.loaderConainer,{opacity:loading?true:false}]}>
        //     {loaderRender}
        // </Animated.View>,
        
        <View style={[styles.main,{opacity:1}]}>
            <Animated.View style={[styles.mapContainer,{opacity:mapOpacity}]}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapPadding={{top: 0, left: 0, right: 0, bottom:300}}                
                    // ref={map=>this._map=map}
                    ref={_map}
                    showsUserLocation={true}
                    style={styles.map}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    customMapStyle={customMapStyle}
                    onRegionChangeComplete={()=>console.log('THE REGION CHANGED')}
                >
                    {coordinates.map( (marker,index)=>{
                        const scaleStyle = {
                            transform:[
                                {
                                    scale: interpolations[index].scale
                                }
                            ],
                            
                        }

                        const opacityStyle = {
                            opacity: interpolations[index].opacity
                        }

                       return (

                           
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude:marker.latitude,
                                        longitude:marker.longitude
                                    }}
                                    onPress={(e)=>onMarkerPress(e)}
                                    
                                    // title={marker.title}
                                    // pinColor={this.state.selectedMarkerIndex===index?'red':'black'}
                                >
                                    <Animated.View style={[styles.markerWrap,opacityStyle]}>
                                        <Animated.View style={[styles.ring,scaleStyle]}/>
                                    </Animated.View>
                                </Marker>
                            
                        )}
                    )}
                </MapView>
            </Animated.View>
        </View>,



        <View style={[styles.bottomContainer,{flex:1}]}>
            
            <LinearGradient colors={['transparent','black']} style={{width:'100%'}}>
                            
                <Animated.ScrollView
                    ref={_scrollView}
                    style={[styles.scrollView,{opacity:carouselOpacity,bottom:0}]}
                    
                    horizontal
                    scrollEventThrottle={10}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH+20}
                    snapToAlignment='center'
                    contentInset={{
                        top:0,
                        left:SPACING_FOR_CARD_INSET,
                        bottom:0,
                        right:SPACING_FOR_CARD_INSET
                    }}
                    contentContainerStyle={{
                        paddingHorizontal: Platform.OS === 'android'?SPACING_FOR_CARD_INSET:0
                    }}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent:{
                                    contentOffset:{
                                        x:mapAnimation
                                    }
                                }
                            }
                        ],
                        {useNativeDriver: true}
                    )}
                >
                {coordinates.map((item,index)=>{
                    return(
                        
                        <Slide data={item} key={index}/>
                    )
                })}
                </Animated.ScrollView>



                <View style={{height:3,backgroundColor:'white',paddingTop:0,paddingBottom:0}}/>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.backButton,{justifyContent:'flex-end'}]} onPress={()=>Actions.pop()}>
                        <Animated.Text style={[styles.backButtonText,{opacity:mapOpacity,backgroundColor:'black'}]}>&lt; Go Back.</Animated.Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

        </View>,
        
        

        
    ])

}

const styles = StyleSheet.create({


    carouselContainer: {
        flex:3,
        justifyContent:'center',
        alignItems:'center',
    },
    loaderConainer:{
        height:20,
        zIndex:100,
        flex:1,
        // backgroundColor:'orange',
        // justifyContent:'space-evenly',
        justifyContent:'center',
        alignItems:'center',
    },
    bottomContainer:{
        flex:1,
        // height:height/3,
        justifyContent:'flex-end',
        alignItems:'flex-end',
        position:'absolute',
        zIndex:100,
        bottom:0,
        width:'100%',

        // backgroundColor:'black',
        // height:'50%'
    },


    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },

    main:{
        flex:1,
        backgroundColor:'black',
        justifyContent:'center',
    },
    map:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        
        // position:'absolute',
        // zIndex:100
    },
    mapContainer:{
        flex:1,
    },
    buttonContainer:{
        // backgroundColor:'green'
        

    },
    backButton: {
        // alignItems: "flex-start",
        // justifyContent:'flex-start',
        width:'100%'

      },
    backButtonText:{
        color:'white',
        fontFamily:'Helvetica',
        fontSize:70,
        textAlign:'center',
        width:'100%',
        
    },

    marker: {
    width: 30,
    height: 30,
    // borderRadius: 4,
    // backgroundColor: "white",
    },
    selectedMarker:{
        width: 20,
        height: 20,
        borderRadius: 40,
        backgroundColor: "red",
    },
    ring: {
        width: 15,
        height: 15,
        borderRadius: 100,
        backgroundColor: "rgba(255,255,255, 1)",
        position: "absolute",
        // borderWidth: 1,
        borderColor: "black",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width:50,
        height:50,
    },

    scrollView: {
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 30,
    },


  

})


export default MapFunctional