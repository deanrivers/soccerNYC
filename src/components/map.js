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

class Map extends Component{
    constructor (props) {
        super(props);
        this.state = {
            loading:true,
            location:{},
            coordinates:[]
        };
        this._renderDarkItem = this._renderDarkItem.bind(this)
        this._requestLocation = this._requestLocation.bind(this)
    }

    componentDidMount(){
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
                obj['photo_reference'] = data.results[i].photos[0].photo_reference
 
                coordinates.push(obj)
                //console.log(coordinates)
            }

            //loop for photos
            for(var i=0; i<coordinates.length;i++){
                const photoRef = coordinates[i].photo_reference
                const photo_url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400'
                const photoParams = '&photoreference='+photoRef+'&key='+API_KEY
                const complete_photo_url = photo_url+photoParams
                console.log('URL:',complete_photo_url)
                coordinates[i]['illustration'] = await this.hitPhotoAPI(complete_photo_url)
            }
            console.log('COORDINATES',coordinates)
            this.setState({coordinates},()=>setTimeout( ()=>{
                this.setState({loading:false})
                console.log(this.state.coordinates)
            },10))
        }
    }

    hitPhotoAPI = async (url) => {
        console.log('hit photo API')
        console.log('URL->>>>>',url)
        const response = await fetch(url);
        console.log(response.url)
        return response.url
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
            // return null
            return <View><Text>Test</Text></View>
            
        }

        return([
            <View style={{position:'absolute',zIndex:10,top:40,left:40,backgroundColor:'white',borderRadius:100,padding:10,flex:1,justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>Actions.pop()}>
                    <Image style={{width:20,height:20,color:'white'}} source={leftButton}></Image>
                </TouchableOpacity>
            </View>
            ,
            <View style={styles.main}>

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
                            />
                        )
                    )}
                </MapView>
                
                
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
        paddingVertical: 60,
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
        // width:'100%'
        
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
    }
})


export default Map
