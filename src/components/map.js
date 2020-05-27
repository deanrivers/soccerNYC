import React, { Component } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image } from 'react-native'

import MapView, {Marker,Circle} from 'react-native-maps'
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
import loaderImage from '../assets/icons/loader.gif'

class Map extends Component{
    constructor (props) {
        super(props);
        this.state = {
            loading:true,
            location:{},
            coordinates:[],
            circleCenter:{},
            dialogVisible:true
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

    handleYes(){

    }

    componentDidMount(){
        
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
        const API_KEY = config.API_KEY
        const searchTerm = 'soccer%20field'
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        const radius ='5000'
        const parameters = "location=" + this.state.location.latitude + "," + this.state.location.longitude +
      "&radius="+radius+"&keyword="+searchTerm + "&key=" + API_KEY
        
        const url = baseUrl + parameters

        const response = await fetch(url)
        const data = await response.json()
        console.log(data.status)
        

        var location
        var coordinates = []
        var obj = {}

        if(data.status = 'OK'){
            for(var i = 0;i<data.results.length-1;i++){
                obj = {}
                location = data.results[i]
                obj['title'] = data.results[i].name
                obj['subtitle'] = 'Soccer Field'
                obj['latitude'] = data.results[i].geometry.location.lat
                obj['longitude'] = data.results[i].geometry.location.lng
                obj['latitudeDelta'] = 0.0922
                obj['longitudeDelta'] = 0.0421

                try{
                    obj['photo_reference'] = data.results[i].photos[0].photo_reference
                } catch(error){
                    console.log('error',error)
                    console.log('name',data.results[i]['name'])
                    console.log('photos',data.results[i]['photos'])
                    
                }

                if(data.results["business_status"] !=="OPERATIONAL"){
                    coordinates.push(obj)
                } else{
                    console.log('Something is not right for this entry:')
                    console.log(obj)
                }
            }
            
            //loop for photos
            for(var i=0; i<coordinates.length;i++){
                const photoRef = coordinates[i].photo_reference
                if(photoRef!==undefined){
                    const photo_url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400'
                    const photoParams = '&photoreference='+photoRef+'&key='+API_KEY
                    const complete_photo_url = photo_url+photoParams
                    // console.log('URL:',complete_photo_url)
                    coordinates[i]['illustration'] = await this.hitPhotoAPI(complete_photo_url)
                } else{
                    coordinates[i]['illustration'] = 'https://sjsuspartans.com/images/2019/5/24/SJS21818.JPG'
                }
            }
            console.log('STATE COORDINATES',coordinates)
            this.setState({coordinates},()=>setTimeout( ()=>{
                this.setState({loading:false})
                console.log('THE COMPLETE ARRAY OF OBJECTS',this.state.coordinates)
            },10))
        }
    }

    hitPhotoAPI = async (url) => {
        // console.log('hit photo API')
        // console.log('URL->>>>>',url)

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
        // console.log(index)
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
       
        var carouselRender = (this.state.loading) ? <View style={{flex:1,justifyContent:'center',alignItems:'center',zIndex:100000,height:'100%',backgroundColor:'',top:0,paddingBottom:'33%'}}><Image style={{flex:1,justifyContent:'center',alignItems:'center',width:60,height:60}}source={loaderImage}/></View>:
        
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

        // if(this.state.loading){
        //     return <View><Text>Test</Text></View>
        // }

        return([
            <View style={styles.main}>
                 {/* <View style={{flex:1,position:'absolute',zIndex:100000}}>
                    <Dialog.Container visible={this.state.dialogVisible}>
                        <Dialog.Title>Open Apple Maps?</Dialog.Title>
                        <Dialog.Description>
                            Are you sure you want to get directions to this field?
                        </Dialog.Description>
                        <Dialog.Button label="Cancel" onPress={()=>{this.setState({dialogVisible:false})}}/>
                        <Dialog.Button label="Yes" onPress={()=>this.handleYes()}/>
                    </Dialog.Container>
                </View> */}
                <View style={styles.mapContainer}>
                    <MapView
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
                        {this.state.coordinates.map( marker=>
                            (
                                <Marker
                                coordinate={{
                                    latitude:marker.latitude,
                                    longitude:marker.longitude
                                }}
                                title={marker.title}
                                >
                                </Marker>
                            )
                        )}
                    </MapView>
                </View>

                <View style={styles.bottomContainer}>
                    <LinearGradient colors={['transparent','black']} style={styles.linearGradient}>
                        <View style={styles.carouselContainer}>
                            {carouselRender}
                        </View>
                    </LinearGradient>
                    

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.backButton} onPress={()=>Actions.pop()}>
                            <Text style={styles.backButtonText}>Go Back.</Text>
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
        flex:1,
        width:'100%',
        alignItems:'center'
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
