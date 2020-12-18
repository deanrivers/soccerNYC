import React, { useEffect, useState, useRef } from 'react'
import { SafeAreaView,StyleSheet,Text,View,Dimensions,Image,Animated,Easing,ScrollView, Platform,Alert } from 'react-native'
import MapView, {Marker,Circle,Callout, PROVIDER_GOOGLE, Polygon} from 'react-native-maps'
import GetLocation from 'react-native-get-location'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Actions } from 'react-native-router-flux'
import config from '../../../config'
import LinearGradient from 'react-native-linear-gradient';
import loaderImage from '../../assets/icons/mag.gif'
import Dialog from 'react-native-dialog'
import auth from '@react-native-firebase/auth';
import { colors } from '../../styles/Carousel.style';

import {useSpring,animated} from 'react-spring'

// import Carousel from 'react-native-snap-carousel'
// import SliderEntry from '../carousel/SliderEntry'

import SnapCarousel from '../carousel/SnapCarousel'
import FilterView from './filterView'

import imageBack from '../../assets/icons/back2.png'
import imageCenterLocation from '../../assets/icons/target.png'
import imageFilter from '../../assets/icons/filter.png'
import imageMarker from '../../assets/icons/marker.png'
import imageUselectedMarker from '../../assets/icons/unselected_marker.png'
import imageLogout from '../../assets/icons/logout.png'
import imageInformation from '../../assets/icons/information.png'


const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
const customMapStyle = require('../../styles/customMapStyle.json')

const MapFunctional = ()=>{

    //declare states
    const [loading,updateLoading] = useState(false)
    const [location,updateLocation] = useState({})
    const [locationDataArray,updateLocationDataArray] = useState([])
    const [carouselOpacity,updateCarouselOpacity] = useState(new Animated.Value(0))
    const [mapOpacity,updateMapOpacity] = useState(new Animated.Value(0))
    const [selectedMarkerIndex,updateSelectedMarkerIndex] = useState(0)
    const [filterActive,updateFilterActive] = useState(false)
    const [currentMarkerLocation,updateCurrentMarkerLocation] = useState(null)
    const [dialogVisible,updateDialogVisible] = useState(false)
    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);

    //location work
    _requestLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        })
        .then(location => {
            //update states
            updateLocation(location)
            updateLoading(true)

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
        });
    }
    
    hitPlaceAPI = async (userLocation)=>{
        console.log('hit place')
        const API_KEY = config.GOOGLE_PLACES_API_KEY
        const searchTerm = 'soccer%20field'
        const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
        const radius ='5000'
        const parameters = "location=" + userLocation.latitude + "," + userLocation.longitude +
        "&radius="+radius+"&keyword="+searchTerm + "&key=" + API_KEY
        
        const url = baseUrl + parameters
        const response = await fetch(url)
        const data = await response.json()
        let location
        let locationDataArray = []
        let obj = {}

        if(data.status = 'OK'){
            for(let i = 0;i<data.results.length-1;i++){

            //set variable for name and imageLink
            let name = data.results[i].name.toLowerCase()
            let imageLink = ''

            //try to upddate imageLink if it exists
            try{
                imageLink = data.results[i].photos[0].photo_reference
            } catch(error){
                console.log(error)
            }

            //only process if it has an image link and the name is not just "soccer field"
            if(name !== 'soccer field' && imageLink){                
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
                locationDataArray.push(obj)
            }
        }

            //loop for photos
            for(var i=0; i<locationDataArray.length;i++){
                const photoRef = locationDataArray[i].photo_reference
                const photo_url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400'
                const photoParams = '&photoreference='+photoRef+'&key='+API_KEY
                const complete_photo_url = photo_url+photoParams
                locationDataArray[i]['illustration'] = await hitPhotoAPI(complete_photo_url)
            }

            //set state for all fetched locations
            updateLocationDataArray(locationDataArray)

            //set state for the first marker location
            updateCurrentMarkerLocation(locationDataArray[0])
            console.log('Current Marker Location',currentMarkerLocation)
            
            //update loading gif to dissapear
            updateLoading(false)

            //animate carousel pop up
            Animated.timing(carouselOpacity,{
                toValue:1,
                duration:1000,
                delay:500,
                easing: Easing.linear,
                useNativeDriver:true
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

    //component did mount
    useEffect(()=>{
        //set loading to true on load
        updateLoading(true)

        //animtae map opacity
        Animated.timing(mapOpacity,{
            toValue:1,
            duration:1000,
            delay:0,
            easing: Easing.linear,
            useNativeDriver:true
        }).start()

        setTimeout(()=>{
            _requestLocation()
        },1000)

    },[])

    //********HACK********
    //********HACK********
    //********HACK********
    //Animate to first location entry.
    useEffect(()=>{
        if(locationDataArray.length !== 0){
            _map.current.animateToRegion({
                latitude:locationDataArray[0].latitude,
                longitude:locationDataArray[0].longitude,
                latitudeDelta:  0.0922,
                longitudeDelta: 0.0421,
            },350);
        }
    },[locationDataArray])

    let mapAnimation = new Animated.Value(0)

    //update index from Carousel
    updateSelectedIndex = (index) => {
        updateSelectedMarkerIndex(index)
        console.log('Index from function',index)
        _map.current.animateToRegion({
            latitude:locationDataArray[index].latitude,
            longitude:locationDataArray[index].longitude,
            latitudeDelta:  0.0922,
            longitudeDelta: 0.0421,
        },350);
    }

    //handle location center press
    centerMap = () =>{
        _map.current.animateToRegion({
            latitude:location.latitude,
            longitude:location.longitude,
            latitudeDelta:  0.0922,
            longitudeDelta: 0.0421,
        },350);
    }

    //function to render marker based on current selected marker index
    markerRender = (marker,index) =>{
        let render

        if(selectedMarkerIndex===index){
            render = <Marker
            key={index}
            coordinate={{
                latitude:marker.latitude,
                longitude:marker.longitude
            }}
            // style={springSlideMarkers}
            // image={imageMarker}                                
            // onPress={()=>Alert.alert('hey')}
            title={marker.title}
            pinColor={'#F40B22'}
            pinColor={'#0bf4dd'}
            pinColor={'black'}
        >
            <Image
                source={imageMarker}
                style={{
                    width:45,
                    height:45,
                    resizeMode:'contain'
                    
                }}
            />
        </Marker>
        } else{
            render = <Marker
            key={index}
            coordinate={{
                latitude:marker.latitude,
                longitude:marker.longitude
            }}
            // style={springSlideMarkers}
            // image={imageMarker}                                
            // onPress={()=>Alert.alert('hey')}
            title={marker.title}
            pinColor={'#F40B22'}
            pinColor={'#0bf4dd'}
            pinColor={'black'}
        >
            <Image
                source={imageUselectedMarker}
                style={{
                    width:45,
                    height:45,
                    resizeMode:'contain'
                    
                }}
            />
        </Marker>
        }

        return render
    }

    // const filterOpacity = new Animated.Value(filterActive ? 0 : 1)

    //filter pressed
    filterPressed = () =>{
        updateFilterActive(!filterActive)
    }

    //listen to filter press
    useEffect(()=>{
        console.log('Filter Active',filterActive)
        if(filterActive){
            Animated.timing(filterWidth,{
                toValue:100,
                duration:1000,
                delay:0,
                easing: Easing.linear,
                useNativeDriver:true
            }).start()
        } 

    },[filterActive])

    const onAuthStateChanged = user =>{

        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        console.log('sub',subscriber)
        return subscriber; // unsubscribe on unmount
    }, [])

    useEffect(()=>{
        console.log('This is the users location',location)
    },[location])


    //scroll to card when marker is selected
    const onMarkerPress = (mapEventData) => {
        const markerID = mapEventData._targetInst.return.key;

        let x = (markerID * CARD_WIDTH) + (markerID * 20); 
        if (Platform.OS === 'ios') {
            x = x - SPACING_FOR_CARD_INSET;
        }

        _scrollView.current.scrollTo({x: x, y: 0, animated: true});
    }

    const logout = () =>{
        
        auth().signOut().then(() => {
            console.log('User signed out!')
            updateDialogVisible(false)
            Actions.login()
        });
    }
    const onCancel = () =>{
        updateDialogVisible(false)
    }


    const reactNativeModalProps = {
        onBackdropPress: ()=>onCancel(),
    };

    const _map = React.useRef(null)
    const _scrollView = React.useRef(null)

    //animations
    let filterWidth = new Animated.Value(10)
    const AnimatedView = new animated(View)
    
    
    //load icon
    let loaderRender = (loading)?
    <View style={{flex:1,justifyContent:'center',alignItems:'center',zIndex:100000,height:'100%',backgroundColor:'',top:0,paddingBottom:'33%'}}>
        <Image style={{flex:1,justifyContent:'center',alignItems:'center',width:60,height:60}}source={loaderImage}/>
    </View>:null

    //map render
    let mapRender = <MapView
                        provider={PROVIDER_GOOGLE}
                        mapPadding={{top: 0, left: 0, right: 0, bottom:300}}
                        ref={_map}
                        showsUserLocation={true}
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            // latitude: location.latitude?location.latitude:37.33233141,
                            // longitude: location.longitude?location.longitude:-122.0312186,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                        // region={{
                        //     latitude: location.latitude,
                        //     longitude: location.longitude,
                        //     latitudeDelta: 0.0922,
                        //     longitudeDelta: 0.0421,
                        // }}
                        customMapStyle={customMapStyle}
                        // onRegionChangeComplete={()=>console.log('THE REGION CHANGED')}
                    >
                        {locationDataArray.map( (marker,index)=>{return markerRender(marker,index)})}
                    </MapView>

    let backButtonRender = <View
                                style={{
                                    position:'absolute',
                                    top:15,
                                    left:15,
                                    zIndex:100,
                                    backgroundColor:colors.black,
                                    borderRadius:100,
                                    padding:5
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>Actions.pop()}
                                >
                                    <Image 
                                        source={imageBack}
                                        style={{
                                            width:30,
                                            height:30,
                                            right:2
                                        }}
                                    />
                                </TouchableOpacity>

                            </View>

    let controlsRender = <View
                            style={{
                                flex:1,
                                position:'absolute',
                                top:20,
                                right:20,
                                zIndex:100,
                                borderRadius:10,
                                backgroundColor:colors.black,
                                justifyContent:'space-evenly',
                                // paddingHorizontal:5,
                                // paddingVertical:5,
                                padding:6
                            }}
                        >   
                            {/* filter button */}
                            {/* <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginVertical:10,
                                    zIndex:200,
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>updateFilterActive(!filterActive)}
                                >
                                    <Image 
                                        source={imageFilter} 
                                        style={{
                                            width:20,
                                            height:20,
                                            
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            
                            <View
                                style={{
                                    flex:1,
                                    backgroundColor:'white',
                                    height:1,
                                    marginVertical:10
                                }}
                            /> */}

                            
                            {/* information button */}
                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginVertical:5,
                                     
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    
                                    
                                    onPress={()=>Actions.donation()}
                                >
                                    <Image 
                                        source={imageInformation} 
                                        style={{
                                            width:25,
                                            height:28,
                                            
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>


                            <View
                                style={{
                                    flex:1,
                                    backgroundColor:'white',
                                    height:1,
                                    marginVertical:10
                                }}
                            />

                            {/* center to user button */}
                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginVertical:10,
                                     
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>centerMap()}
                                >
                                    <Image 
                                        source={imageCenterLocation} 
                                        style={{
                                            width:25,
                                            height:25,
                                            
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flex:1,
                                    backgroundColor:'white',
                                    height:1,
                                    marginVertical:10
                                }}
                            />
                            <View
                                style={{
                                    flex:1,
                                    justifyContent:'center',
                                    alignItems:'center',
                                    marginVertical:10,
                                    
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={()=>updateDialogVisible(true)}
                                >
                                    <Image 
                                        source={imageLogout} 
                                        style={{
                                            width:25,
                                            height:25,
                                            
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
    
    return([

        // first element in array
        // loading screen
        

        // second element in array
        // filter element
        filterActive?<FilterView closeFilter={()=>filterPressed()} text={`${filterActive}`}/>:null,

        // third element in array
        // back button
        [backButtonRender],

        // fourth element in array
        // filter and target controls
        [controlsRender],
        
        // fourth element in array
        // main map and carousel view
        <View style={[styles.main,{opacity:1}]}>
            <Animated.View style={[styles.mapContainer,{opacity:mapOpacity}]}>

                {/* map render */}
  
                {mapRender}

            </Animated.View>
        </View>,
        

        //carousel render
        <View style={[styles.bottomContainer,{flex:1}]}>
            <LinearGradient colors={['transparent','black']} style={{width:'100%'}}>
                {loaderRender}
                {!loading?
                <SnapCarousel
                    location={location}
                    data={locationDataArray}
                    updateIndex={this.updateSelectedIndex}
                />:null}
            </LinearGradient>
        </View>,

        <View style={{flex:1,position:'absolute',zIndex:100000}}>
        <Dialog.Container 
            visible={dialogVisible}
            // blurComponentIOS={blurComponentIOS}
            {...reactNativeModalProps}
            >
            <Dialog.Title>Log Out</Dialog.Title>
            <Dialog.Description>
                Are you sure you want to logout?
            </Dialog.Description>
            <Dialog.Button color="red" label="Cancel" onPress={()=>onCancel()}/>
            <Dialog.Button color="black" label="Yes" onPress={()=>logout()}/>
        </Dialog.Container>
        </View>
    ])
}

const styles = StyleSheet.create({
    main:{
        flex:1,
        backgroundColor:'black',
        justifyContent:'center',
    },
    carouselContainer: {
        flex:3,
        justifyContent:'center',
        alignItems:'center',
    },
    loaderConainer:{
        height:20,
        zIndex:100,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    bottomContainer:{
        flex:1,
        justifyContent:'flex-end',
        alignItems:'flex-end',
        position:'absolute',
        zIndex:100,
        bottom:0,
        width:'100%',
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
    map:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    },
    mapContainer:{
        flex:1,
    },
    buttonContainer:{
        // backgroundColor:'black',
        marginBottom:'1%'
    },
    backButton: {
        width:'100%',
    },
    backButtonText:{
        color:'white',
        fontFamily:'Helvetica',
        fontFamily: 'AppleSDGothicNeo-UltraLight',
        fontFamily:'AvenirNext-UltraLight',
        fontFamily:'DamascusLight',
        fontSize:70,
        fontWeight:'bold',
        textAlign:'center',
        width:'100%',
    },
    ring: {
        width: 15,
        height: 15,
        borderRadius: 100,
        backgroundColor: "#485563",
        position: "absolute",
        borderWidth:1,
        borderColor:'white'
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
        paddingVertical: 0,
    },
})

export default MapFunctional