import React, { Component, useEffect, useState } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,Animated,Easing,ScrollView, Platform,Alert } from 'react-native'

import MapView, {Marker,Circle,Callout, PROVIDER_GOOGLE, Polygon} from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import openMap from 'react-native-open-maps';
import Dialog from "react-native-dialog";

import Carousel from 'react-native-snap-carousel'
import Slide from  './Slide'
import { sliderWidth, itemWidth } from './styles/SliderEntry.style'
import SliderEntry from './SliderEntry';
// import customMapStyle from './styles/customMapStyle'
import leftButton from '../assets/icons/arrows.png'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import config from '../../config'

import LinearGradient from 'react-native-linear-gradient';

import markerIcon from '../assets/icons/map_marker.png'
import defaultImage from '../assets/icons/logo.png'
import loaderImage from '../assets/icons/mag.gif'


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
    const [dialogVisible,updateDialogVisible] = useState(true)
    const [carouselYValue,updateCarouselYValue] = useState(new Animated.Value(height))
    const [carouselOpacity,updateCarouselOpacity] = useState(new Animated.Value(0))
    const [markerOpacity,updateMarkerOpacity] = useState(new Animated.Value(1))
    const [mainOpacity,updateMainOpacity] = useState(1)
    const [mapOpacity,updateMapOpacity] = useState(new Animated.Value(0))
    const [selectedMarkerIndex,updateSelectedMarkerIndex] = useState(0)
    const [markerSelectedScale,updateMarkerSelectedScale] = useState(new Animated.Value(0))
    const [radius,updateRadius] = useState(new Animated.Value(0))

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

                // try{
                //     obj['photo_reference'] = data.results[i].photos[0].photo_reference
                // } catch(error){
                //     console.log('error',error)
                //     console.log('name',data.results[i]['name'])
                //     console.log('photos',data.results[i]['photos'])
                // }

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
            // this.setState({coordinates},()=>setTimeout( ()=>{
            //     this.setState({loading:false},()=>{

            //     //animate carousel pop up
            //     Animated.timing(this.state.carouselYValue,{
            //         toValue:0,
            //         duration:1000,
            //         easing:Easing.linear,
            //         delay:500,
            //         useNativeDriver:false
            //     }).start()

            //     Animated.timing(this.state.carouselOpacity,{
            //         toValue:1,
            //         duration:1000,
            //         delay:500,
            //         easing: Easing.linear
            //     }).start()



            //     //animate markers
            //     Animated.loop(Animated.timing(this.state.radius , {
            //         toValue: 50,
            //         duration: 3000,
            //         easing: Easing.linear,
            //         useNativeDriver:false
            //     })).start();

            //     //animate opacity
            //     Animated.loop(Animated.timing(this.state.markerOpacity , {
            //         toValue: 0,
            //         duration: 3000,
            //         easing: Easing.linear,
            //         useNativeDriver:false
            //     })).start();

            //     })
            //     //console.log('THE COMPLETE ARRAY OF OBJECTS',this.state.coordinates)
            // },10))
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
            duration:3000,
            delay:600,
            easing: Easing.linear,
            useNativeDriver:false
        }).start()

        //add code for carousel/marker animations
        


        
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
          });
    })

    const interpolations = coordinates.map((marker, index) => {
        
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          ((index + 1) * CARD_WIDTH),
        ];
    
        const scale = mapAnimation.interpolate({
          inputRange,
          outputRange: [1, 1.5, 1],
          extrapolate: "clamp"
        });

        
    
        return {scale} ;
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
        
        <View style={[styles.main,{opacity:1}]}>
            <Animated.View style={[styles.mapContainer,{opacity:mapOpacity}]}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    mapPadding={{top: 0, left: 0, right: 0, bottom:350}}                
                    // ref={map=>this._map=map}
                    ref={_map}
                    showsUserLocation={false}
                    style={styles.map}
                    region={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0722,
                        longitudeDelta: 0.0421,
                    }}

                    customMapStyle={customMapStyle}
                    onRegionChangeComplete={()=>console.log('THE REGION CHANGED')}
                    
                >

                    {coordinates.map( (marker,index)=>{
                        console.log('interpolations index',interpolations[index])
                        const scaleStyle = {

                            transform:[
                                {
                                    scale: interpolations[index].scale
                                }
                            ]
                        }
                        console.log('SCALE STYLE~~~~',scaleStyle)
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
                              <Animated.View style={[styles.markerWrap]}>
                                  <Animated.Image
                                    source={markerIcon}
                                    style={[styles.marker,scaleStyle]}
                                    resizeMode="cover"
                                  />
                                {/* <Animated.View style={[styles.ring,scaleStyle]}/> */}
   
                                
                                
                                {/* <View style={styles.marker} /> */}
                              </Animated.View>
                              

                            </Marker>
                        )}
                    )}
                </MapView>
            </Animated.View>

            <View style={styles.bottomContainer}>
                <LinearGradient colors={['transparent','black']} style={[styles.linearGradient,{backgroundColor:'',flex:1}]}>
                  <View style={{flex:1,backgroundColor:'',height:'100%'}}>
                      <Animated.View style={[styles.loaderConainer,{top:0,opacity:1}]}>
                        {loaderRender}
                      </Animated.View>
                  </View>

                    <View style={{flex:1}}>
                        <Animated.ScrollView
                        ref={_scrollView}
                        style={styles.scrollView}
                        horizontal
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
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
                        {/* {carouselRender} */}

                        {coordinates.map((item,index)=>{
                            return(
                                <View style={styles.card} key={index}>
                                    <Image
                                        source={{uri:item.illustration}}
                                        style={styles.cardImage}
                                        resizeMode="cover"
                                    />
                    
                                    <View style={styles.textContent}>
                                        <Text numberOfLines={1} style={styles.cardtitle}>{item.title}</Text>
                                        <Text numberOfLines={1} style={styles.cardDescription}>{item.subtitle}</Text>
                                        <View style={styles.button}>
                                            <TouchableOpacity
                                                onPress={()=>{}}
                                                style={styles.signIn}
                                            >
                                                <Text style={styles.textSign}>Find Pitch</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                        </Animated.ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.backButton} onPress={()=>Actions.pop()}>
                                <Animated.Text style={[styles.backButtonText,{opacity:mapOpacity}]}>Go Back.</Animated.Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>

            </View>
        </View>
    ])

}

const styles = StyleSheet.create({

    linearGradient:{
        // flex:1,
        width:'100%',
        // alignItems:'center'
    },
    carouselContainer: {
        flex:3,
        justifyContent:'center',
        alignItems:'center',
    },
    loaderConainer:{
      flex:3,
      // backgroundColor:'orange',
      // justifyContent:'space-evenly',
      justifyContent:'center',
      alignItems:'center',
    },
    bottomContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
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
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
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
        
        // height:'100%',
        // zIndex:100
    },
    backText:{
        color:'white'
    },
    buttonContainer:{
        width:'100%',
        // position:'relative'
        
        // backgroundColor:'green',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        backgroundColor:'black'

    },
    backButton: {
        alignItems: "flex-start",
        justifyContent:'flex-start',
        width:'100%'

      },
      backButtonText:{
          color:'white',
          fontFamily:'GillSans-SemiBoldItalic',
          fontFamily:'Helvetica',
          fontSize:70,
          textAlign:'center',
          width:'100%',
          marginBottom:'5%'
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
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
      },
      markerWrap: {
        alignItems: "center",
        justifyContent: "center",
        width:50,
        height:50,
      },

      scrollView: {
        // position: "absolute",
        // flex:1,
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 10,
        
      },
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
      button: {
        alignItems: 'center',
        marginTop: 5
      },
      signIn: {
          width: '100%',
          padding:5,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 3,
          color:'black'
      },
      textSign: {
          fontSize: 14,
          fontWeight: 'bold',
          borderColor:'black',
          borderWidth:1,
          width:'100%'
      }

})


export default MapFunctional