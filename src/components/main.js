import React, {Component} from 'react'

import { Text,View,Image,StyleSheet,TouchableOpacity, SafeAreaView,Animated,Easing,Dimensions }from 'react-native'

import {Actions, Reducer} from 'react-native-router-flux'
import {useSpring,animated} from 'react-spring'

import logoImage from '../assets/icons/logo.png'

class Main extends Component{
    constructor(props){
        const {width,height} = Dimensions.get('window')
        super(props)
        this.state = {
            zipCode:'',
            zipValid:false,
            zipFilled:false,
            textValue:'',
            textInserts:['Fútbol','Soccer','Calcio','Futebol','Football','Fußall','Fótbolta','Foutbòl'],
            globalCounter:0,
            fadeValue: new Animated.Value(0),
            xValue1: new Animated.Value(0),
            xValue2: new Animated.Value(0),
            xValue3: new Animated.Value(0),
            xValue4: new Animated.Value(0),
            xValue5: new Animated.Value(0),
            xValue6: new Animated.Value(0),
            xValue7: new Animated.Value(0),
            xValue8: new Animated.Value(0), 
            xValue9: new Animated.Value(0),
            xValue10: new Animated.Value(0),
            marginBottomValue: new Animated.Value(50),
            subHeaderOpacity: new Animated.Value(0),
            discoverOpacity: new Animated.Value(0),
            logoYValue: new Animated.Value(height/4),
            logoWidthValue: new Animated.Value(0),
            logoHeightvalue: new Animated.Value(0),
            logoOpacity: new Animated.Value(0)
        }
    }

    componentDidMount() {

        var {width,height} = Dimensions.get('window')

        var easeControl = Easing.ease

        const useNativeDriver = false

        

        //set interval for soccer words
        this.interval = setInterval(() => {
            var globalCounter = this.state.globalCounter
            var textInserts = this.state.textInserts
            if(globalCounter==textInserts.length-1){
                globalCounter = 0
            } else{
                globalCounter++
            }
            this.setState({globalCounter})
        }, 3000);

        // //Animate opacity of lines
        Animated.timing(this.state.fadeValue,{
            toValue:1,
            duration:2000,
            delay:0,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        
        }).start()

        // Animate translation of lines
        Animated.timing(this.state.marginBottomValue,{
            toValue:8,
            duration:2000,
            delay:500,
            useNativeDriver:useNativeDriver
        }).start()

        // //animate first line
        Animated.timing(this.state.xValue1,{
            toValue:width,
            duration:500,
            delay:0,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()

        //animate second line
        Animated.timing(this.state.xValue2,{
            toValue:width*0.9,
            duration:500,
            delay:200,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate third line
        Animated.timing(this.state.xValue3,{
            toValue:width*0.8,
            duration:500,
            delay:400,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate fourth line
        Animated.timing(this.state.xValue4,{
            toValue:width*0.7,
            duration:500,
            delay:600,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate fifth line
        Animated.timing(this.state.xValue5,{
            toValue:width*0.6,
            duration:500,
            delay:800,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate second line
        Animated.timing(this.state.xValue6,{
            toValue:width*0.4,
            duration:500,
            delay:1000,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate second line
        Animated.timing(this.state.xValue7,{
            toValue:width*0.3,
            duration:500,
            delay:1200,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate second line
        Animated.timing(this.state.xValue8,{
            toValue:width*0.2,
            duration:500,
            delay:1400,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate second line
        Animated.timing(this.state.xValue9,{
            toValue:width*0.1,
            duration:500,
            delay:1800,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()
        //animate second line
        Animated.timing(this.state.xValue10,{
            toValue:width*0.0,
            duration:500,
            delay:2000,
            easing:easeControl,
            useNativeDriver:useNativeDriver
        }).start()

        //subHeader opacity
        Animated.timing(this.state.subHeaderOpacity,{
            toValue:1,
            duration:2000,
            delay:2500,
            easing:Easing.linear,
            useNativeDriver:useNativeDriver
        }).start()

        //Discover button animation
        Animated.timing(this.state.discoverOpacity,{
            toValue:1,
            duration:2000,
            delay:4000,
            easing:Easing.linear,
            useNativeDriver:useNativeDriver
        }).start()


        //logo opacity
        Animated.timing(this.state.logoOpacity,{
            toValue:1,
            duration:2000,
            delay:4500,
            easing:Easing.linear,
            useNativeDriver:useNativeDriver
        }).start()

    }

    componentWillUnmount() {
    clearInterval(this.interval);
    console.log('main unmounteddd')
    }



    render(){
        return(
            <SafeAreaView style={styles.main}>
                <Animated.View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'black',opacity:this.state.logoOpacity}}>
                        <Image style={{width:40,height:40}} source={logoImage}/>
                </Animated.View>

                <Animated.View style={{flex:1,justifyContent:'center',alignItems:'flex-start',backgroundColor:'',opacity:this.state.subHeaderOpacity}} >
                    <Text style={styles.subHeaderText}>All fields are within 5km of your current location.</Text>
                    <Text></Text>
                    <Text style={styles.subHeaderText}>Built to serve the worldwide football community.</Text>
                    <Text></Text>
                    <Text style={styles.subHeaderText}>In association with JLV.</Text>
                </Animated.View>
                
                <Animated.View style={{flex:1,justifyContent:'center',alignItems:'flex-end',backgroundColor:'',opacity:this.state.fadeValue}}>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:89,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue1,opacity:1}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:55,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue2,opacity:0.9}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:34,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue3,opacity:0.8}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:13,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue4,opacity:0.7}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:8,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue5,opacity:0.6}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:5,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue6,opacity:0.5}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:3,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue7,opacity:0.4}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:2,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue8,opacity:0.43}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:1,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue9,opacity:0.2}}/>
                    <Animated.View style={{marginBottom:this.state.marginBottomValue,height:1,borderWidth:1,borderTopColor:'transparent',borderColor:'white',backgroundColor:'',borderLeftColor:'black',borderRightColor:'black',width:this.state.xValue10,opacity:0.1}}/>
                </Animated.View>
                
                <TouchableOpacity style={{flex:1,justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:''}} onPress={()=>Actions.map()}>
                    <Animated.Text style={[styles.headerText,{opacity:this.state.discoverOpacity}]}>Discover {this.state.textInserts[this.state.globalCounter]}</Animated.Text>
                </TouchableOpacity>

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex:1,
        backgroundColor:'black',
      },
    textContainer: {
        borderWidth: 1,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        borderColor:'#f4f4f3'
    },
    textContainerInvalid:{
        borderWidth: 1,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
    },
    headerText:{
        fontSize:70,
        fontWeight:'bold',
        fontFamily:'Helvetica',
        fontFamily:'AppleSDGothicNeo-UltraLight',
        fontFamily:'AvenirNext-UltraLight',
        fontFamily:'DamascusLight',
        lineHeight:70,
        width:'100%',
        paddingTop:20,
        bottom:0,
        textAlign:'right',
        color:'white',
        backgroundColor:'black'
    },
    subHeaderText:{
        fontSize:18,
        fontWeight:'bold',
        fontFamily:'HelveticaNeue-Italic',
        fontFamily:'AvenirNext-Regular',
        fontFamily:'DamascusLight',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        flexWrap:'wrap',
        width:'60%',
        color:'white',
        paddingLeft:5,
    },
    locationText:{
        color:'white',
        fontFamily:'Arial',
    },
    getLocationButton:{
        borderWidth:1,
        borderColor:'white',
        justifyContent:'center',
        alignItems:'center',
        height:50,
        borderRadius:0
    },
    searchText:{
        fontFamily:'Arial',
        
    },
    buttonView:{
        flex:3,
        justifyContent:'center',
    },
    description:{
        color:'white'
    }
})

export default Main