import React, { Component } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,Animated,Easing } from 'react-native'

import MapView, {Marker,Circle,Callout, PROVIDER_GOOGLE} from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import openMap from 'react-native-open-maps';
import Dialog from "react-native-dialog";

import Carousel from 'react-native-snap-carousel'
import { sliderWidth, itemWidth } from './styles/SliderEntry.style'
import SliderEntry from './SliderEntry';

import leftButton from '../assets/icons/arrows.png'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import config from '../../config'

import LinearGradient from 'react-native-linear-gradient';

import markerIcon from '../assets/icons/marker.png'
import defaultImage from '../assets/icons/logo.png'
import loaderImage from '../assets/icons/mag.gif'

class Map extends Component{
  
    constructor (props) {
        const {width,height} = Dimensions.get('window')
        super(props);
        this.state = {
            loading:false,
            location:{},
            coordinates:[],
            circleCenter:{},
            dialogVisible:true,
            carouselYValue: new Animated.Value(height),
            carouselOpacity: new Animated.Value(0),
            markerOpacity: new Animated.Value(0),
            mainOpacity: 1,
            mapOpacity: new Animated.Value(0),
            // coordinates: [{
            //     title: 'Sinatra Park',
            //     subtitle:'test',
            //     illustration: 'https://i.imgur.com/UYiroysl.jpg',
            //     latitude:40.7411,
            //     longitude:-74.0266
            // },
            // {
            //     title: 'Berry Lane Park',
            //     subtitle:'test',
            //     illustration: 'https://i.imgur.com/UYiroysl.jpg',
            //     latitude:40.7118,
            //     longitude:-74.0678
            // },
            // {
            //     title: '1600 Park',
            //     subtitle:'test',
            //     illustration:'https://i.imgur.com/UYiroysl.jpg',
            //     latitude:40.7574,
            //     longitude:-74.0281
            // }]
        };
        this._renderDarkItem = this._renderDarkItem.bind(this)
        this._requestLocation = this._requestLocation.bind(this)
    }


    componentDidMount(){

        // Animated.timing(this.state.mainOpacity,{
        //   toValue:1,
        //   duration:1000,
        //   easing:Easing.linear
        // }).start()

        //animae map opacity
        Animated.timing(this.state.mapOpacity,{
          toValue:1,
          duration:3000,
          delay:600,
          easing: Easing.linear,
          useNativeDriver:false
        }).start()
        
        console.log('Component Mounted')
        console.log('------------------')
        console.log('------------------')
        console.log('------------------')
        console.log('------------------')
        console.log('------------------')
        console.log('------------------')
        this._requestLocation()
    }

    hitPlaceAPI = async ()=>{
        const API_KEY = config.GOOGLE_PLACES_API_KEY
        const searchTerm = 'soccer%20field'
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        const radius ='5000'
        const parameters = "location=" + this.state.location.latitude + "," + this.state.location.longitude +
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
                coordinates[i]['illustration'] = await this.hitPhotoAPI(complete_photo_url)
            }

            console.log('STATE COORDINATES',coordinates)
            this.setState({coordinates},()=>setTimeout( ()=>{
                this.setState({loading:false},()=>{

                  //animate carousel pop up
                  Animated.timing(this.state.carouselYValue,{
                    toValue:0,
                    duration:1000,
                    easing:Easing.linear,
                    delay:500,
                    useNativeDriver:false
                  }).start()

                  Animated.timing(this.state.carouselOpacity,{
                    toValue:1,
                    duration:1000,
                    delay:500,
                    easing: Easing.linear
                  }).start()

                  //animate marker opacity
                  Animated.timing(this.state.markerOpacity,{
                    toValue: 1,
                    duration:2000,
                    delay:500,
                    easing: Easing.linear,
                    useNativeDriver:false
                  }).start()
                })
                //console.log('THE COMPLETE ARRAY OF OBJECTS',this.state.coordinates)
            },10))
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
    
    _requestLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        },()=>console.log('triggered'))
        .then(location => {
            this.setState({
                location,
                loading: true,
                circleCenter:{latitude:location.latitude,longitude:location.longitude}
            },()=>{
                console.log('My device location',this.state.location)
                console.log('Circle Center:',this.state.circleCenter)
                this.hitPlaceAPI()
            });
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
            this.setState({
                location: null,
                loading: false,
            });
        });
    }
    
    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true}/>;
    }

    onCarouselItemChange(index){
        console.log('index',index)

        
        let location = this.state.coordinates[index]
        // console.log(location)

        // this.setState({
        //     //circleCenter:{latitude:location.latitude,longitude:location.longitude}
        // },()=>{
            
        // })

        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0522,
            longitudeDelta: 0.0221,
        })
    }

    render(){
      
        var loaderRender = (this.state.loading)?<View style={{flex:1,justifyContent:'center',alignItems:'center',zIndex:100000,height:'100%',backgroundColor:'',top:0,paddingBottom:'33%'}}><Image style={{flex:1,justifyContent:'center',alignItems:'center',width:60,height:60}}source={loaderImage}/></View>:
        null

        var carouselRender = (this.state.loading)?null:
        (<Carousel
        data={this.state.coordinates}
        renderItem={this._renderDarkItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.85}
        inactiveSlideOpacity={1}
        enableMomentum={true}
        activeSlideAlignment={'center'}
        containerCustomStyle={styles.slider}
        contentContainerCustomStyle={styles.sliderContentContainer}
        activeAnimationType={'spring'}
        activeAnimationOptions={{
            friction: 5,
            tension: 200
        }}
        onSnapToItem={(index)=>this.onCarouselItemChange(index)}
    />);

        const customMapStyle = [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#212121"
                }
              ]
            },
            {
              "featureType": "administrative",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#757575"
                },
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#9e9e9e"
                }
              ]
            },
            {
              "featureType": "administrative.locality",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#bdbdbd"
                }
              ]
            },
            {
              "featureType": "poi",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#181818"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1b1b1b"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#2c2c2c"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.icon",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8a8a8a"
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#373737"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3c3c3c"
                }
              ]
            },
            {
              "featureType": "road.highway.controlled_access",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#4e4e4e"
                }
              ]
            },
            {
              "featureType": "road.local",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#616161"
                }
              ]
            },
            {
              "featureType": "transit",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#757575"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#000000"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3d3d3d"
                }
              ]
            }
          ]

        return([
            <View style={[styles.main,{opacity:this.state.mainOpacity}]}>
                <Animated.View style={[styles.mapContainer,{opacity:this.state.mapOpacity}]}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        mapPadding={{top: 0, left: 0, right: 0, bottom:350}}                
                        ref={map=>this._map=map}
                        showsUserLocation={true}
                        style={styles.map}
                        region={{
                            latitude: this.state.location.latitude,
                            longitude: this.state.location.longitude,
                            latitudeDelta: 0.0722,
                            longitudeDelta: 0.0421,
                        }}
                        customMapStyle={customMapStyle}
                        
                    >
                        {/* <Circle
                            center={{
                                latitude:this.state.circleCenter.latitude,
                                longitude:this.state.circleCenter.longitude
                            }}
                            radius={200}
                            strokeWidth={5}
                            strokeColor='red'
                            zIndex={100}
                        /> */}
                        {this.state.coordinates.map( (marker,index)=>
                            (
                                <Marker
                                key={index}
                                coordinate={{
                                    latitude:marker.latitude,
                                    longitude:marker.longitude
                                }}
                                title={marker.title}
                                pinColor='black'
                                onPress={()=>this.onCarouselItemChange(index)}

                                />
                      
                              
                            )
                        )}
                    </MapView>
                </Animated.View>

                <View style={styles.bottomContainer}>
                    {/* <View style={{lex:1,backgroundColor:'black'}}>
                        <Text style={{textAlign:'left',width:'100%',color:'white'}}>Number of soccer fields found: {this.state.coordinates.length}</Text>
                    </View> */}
                    
                    <LinearGradient colors={['transparent','black']} style={[styles.linearGradient,{backgroundColor:'',flex:1}]}>
                      <View style={{flex:1,backgroundColor:'',height:'100%'}}>
                          <Animated.View style={[styles.loaderConainer,{top:0,opacity:1}]}>
                            {loaderRender}
                          </Animated.View>

                        <Animated.View style={[styles.carouselContainer,{top:0,opacity:this.state.carouselOpacity}]}>
                            {carouselRender}
                        </Animated.View> 
                      </View>
                       
                    </LinearGradient>
                    

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={()=>Actions.pop()}>
                            <Animated.Text style={[styles.backButtonText,{opacity:this.state.mapOpacity}]}>Go Back.</Animated.Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            ])
    }
}
const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};
const styles = StyleSheet.create({

    linearGradient:{
        // flex:1,
        width:'100%',
        // alignItems:'center'
    },
    carouselContainer: {
        flex:3,
        // backgroundColor:'orange',
        // justifyContent:'space-evenly',
        justifyContent:'center',
        alignItems:'center',
        
        // overflow:'hidden',
        // paddingTop:50
        
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
        zIndex:100
    },
    mapContainer:{
        flex:1,
        
        // height:'100%',
        zIndex:100
    },
    backText:{
        color:'white'
    },
    buttonContainer:{
        width:'100%',
        // position:'relative'
        flex:1,
        // backgroundColor:'green',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        backgroundColor:'black'

    },
    backButton: {
        alignItems: "flex-start",
        justifyContent:'flex-start',
        width:'100%'
        // backgroundColor: "black",
        


      },
      backButtonText:{
          color:'white',
          fontFamily:'GillSans-SemiBoldItalic',
          fontFamily:'Helvetica',
          fontSize:80,
          textAlign:'center',
          width:'100%'
      }
})


export default Map
