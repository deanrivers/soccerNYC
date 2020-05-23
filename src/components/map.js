import React, { Component } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image } from 'react-native'

import MapView, {Marker} from 'react-native-maps'
import GetLocation from 'react-native-get-location'

import Carousel from 'react-native-snap-carousel'
import { sliderWidth, itemWidth } from './styles/SliderEntry.style'
import SliderEntry from './SliderEntry';

import leftButton from '../assets/icons/arrows.png'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import config from '../../config'

import markerIcon from '../assets/icons/marker.png'
import defaultImage from '../assets/icons/logo.png'

class Map extends Component{
    constructor (props) {
        super(props);
        this.state = {
            loading:true,
            location:{},
            coordinates:[],
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
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        const parameters = "location=" + this.state.location.latitude + "," + this.state.location.longitude +
      "&radius=2000&keyword=soccer%20field" + "&key=" + API_KEY
        
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
                    coordinates[i]['illustration'] = 'https://images.unsplash.com/photo-1548192746-dd526f154ed9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
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
        
        // console.log('Respsonse URL',response.url)
        
    }
    
    _requestLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        },()=>console.log('triggered'))
        .then(location => {
            this.setState({
                location,
                loading: false,
            },()=>{
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
        return <SliderEntry data={item} even={true} />;
    }

    onCarouselItemChange(index){
        console.log(index)
        let location = this.state.coordinates[index]
        console.log(location)

        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0521,
        })
    }

    render(){

        if(this.state.loading){
            return <View><Text>Test</Text></View>
        }

        return([
            // <View style={{position:'absolute',zIndex:10,top:40,left:40,backgroundColor:'white',borderRadius:0,padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
            //     <TouchableOpacity onPress={()=>Actions.pop()}>
            //         <Image style={{width:20,height:20,color:'white'}} source={leftButton}></Image>
            //     </TouchableOpacity>
            // </View>,
            // <View style={{position:'absolute',zIndex:10,top:100,left:40,backgroundColor:'orange',borderRadius:0,padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
            //     <TouchableOpacity onPress={()=>Actions.pop()}>
            //         <Image style={{width:20,height:20,color:'white'}} source={leftButton}></Image>
            //     </TouchableOpacity>
            // </View>
            
            
            ,
            <View style={styles.main}>
            
            
                <View style={{flex:1,borderWidth:0,borderColor:'orange',padding:1,backgroundColor:'white'}}>
                    <MapView                
                        ref={map=>this._map=map}
                        showsUserLocation={true}
                        style={styles.map}
                        region={{
                            latitude: this.state.location.latitude,
                            longitude: this.state.location.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        min
                    >
                        
                        {this.state.coordinates.map( marker=>
                            (
                                <Marker
                                coordinate={{
                                    latitude:marker.latitude,
                                    longitude:marker.longitude
                                }}
                                title={marker.title}
                                >
                                    {/* <Image style={{width:20,height:50}} source={markerIcon}/> */}

                                </Marker>
                            )
                        )}
                    </MapView>
                </View>
                
                
                <View style={styles.carouselContainer}>
                    <Carousel
                        data={this.state.coordinates}
                        renderItem={this._renderLightItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.85}
                        inactiveSlideOpacity={0.8}
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
                    />
            </View>
                

            </View>,
            <View style={styles.containerA}>
                <TouchableOpacity style={styles.touchA} onPress={()=>Actions.pop()}>
                    <Text style={{color:'white'}}>Back</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.touchB}>
                    <Text>Back</Text>
                </TouchableOpacity> */}
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
    safeArea: {
        flex: 1,
        backgroundColor: colors.black
    },
    container: {
        // flex: 1,
        backgroundColor: colors.background1
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },
    carouselContainer: {
        paddingVertical: 40,
        backgroundColor:'black',
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden',
        bottom:0,
        flex:1
    },
    exampleContainerDark: {
        backgroundColor: colors.black
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: colors.black
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
        flex:1
    },
    map:{
        // width:300,
        // height:1000
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        // ...StyleSheet.absoluteFillObject,
    },
    soccerView:{
        display:'flex'
,        flex:1,
        flexDirection:'row',
        overflow:'hidden',
    },
    cardView:{
        backgroundColor:'orange',
        width:300,
        margin:10
    },
    backButton:{
        justifyContent:'center',
        alignItems:'center',
        // position:'absolute',
        backgroundColor:'blue',

        // top:0,
        // left:0,
        zIndex:100
    },
    backText:{
        color:'white'
    },
    containerA:{
        // flex: 1,
        justifyContent: "center",
        // flexDirection:'row'
        // paddingHorizontal: 10
    },
    touchA: {
        alignItems: "center",
        justifyContent:'center',
        backgroundColor: "black",
        borderWidth:1,
        borderColor:'white',
        padding: 10,
        height:100,
        // width:200
      },
    touchB: {
        alignItems: "center",
        justifyContent:'center',
        backgroundColor: "blue",
        padding: 10,
        height:80,
        // width:200,
      },
})


export default Map
