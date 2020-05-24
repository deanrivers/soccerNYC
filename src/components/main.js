import React, {Component} from 'react'

import { Text,View,Image,StyleSheet,TouchableOpacity, SafeAreaView }from 'react-native'

import {Actions} from 'react-native-router-flux'

import {Hoshi} from 'react-native-textinput-effects'

import logoImage from '../assets/icons/logo.png'


class Main extends Component{
    constructor(props){
        super(props)
        this.state = {
            zipCode:'',
            zipValid:false,
            zipFilled:false,
            textValue:'',
            textInserts:['Soccer','Fútbol','Calcio','Futebol','Football','Faußall'],
            globalCounter:0
        }
    }

    componentDidMount() {
        
        // this.interval = setInterval(() => {
        //     var globalCounter = this.state.globalCounter
        //     var textInserts = this.state.textInserts

        //     if(globalCounter==textInserts.length-1){
        //         globalCounter = 0
        //     } else{
        //         globalCounter++
        //     }
        //     this.setState({globalCounter},()=>console.log(this.state.globalCounter),()=>console.log(this.state.globalCounter))
            
        // }, 1000);

      }

      componentWillUnmount() {

        //clearInterval(this.interval);
      }

    inputUpdate(e){
        var zipCode = e
        this.setState({zipCode},()=>{
            if(zipCode.length == 5){
                this.setState({zipFilled:true},()=>{
                console.log(this.state.zipFilled)
                })
            } else{
                this.setState({zipFilled:false},()=>{
                console.log(this.state.zipFilled)
                })
            }
        })
    }

    searchPressed(){
        if(this.state.zipFilled){
            this.props.setZip(this.state.zipCode)
        } else{
            alert('Please enter your zip code.')
        }
    }

    render(){
        return(
            <SafeAreaView style={styles.main}>
                <View style={{flex:2,justifyContent:'center',alignItems:'center',backgroundColor:''}}>
                        <Image style={{width:40,height:40}} source={logoImage}/>
                </View>

                
                <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:''}} onPress={()=>Actions.bio()}>
                    <Text style={styles.subHeaderText}>What does this app do?</Text>
                    {/* <Text style={styles.headerText}>{this.state.textInserts[this.state.globalCounter]}.</Text> */}
                </TouchableOpacity>
                

                <TouchableOpacity style={{flex:2,justifyContent:'flex-end',alignItems:'flex-end',backgroundColor:''}} onPress={()=>Actions.map()}>
                    <Text style={styles.headerText}>Find {this.state.textInserts[this.state.globalCounter]}.</Text>
                    {/* <Text style={styles.headerText}>{this.state.textInserts[this.state.globalCounter]}.</Text> */}
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex:1,
        // width:'100%',
        // alignItems:'center',
        backgroundColor:'black',
        // justifyContent:'center',
        // alignItems:'center'
      },
    textContainer: {
        borderWidth: 1,
        // width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        borderColor:'#f4f4f3'
    },
    textContainerInvalid:{
        borderWidth: 1,
        // width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
    },

    headerText:{
        fontSize:130,
        fontFamily:'GillSans-SemiBoldItalic',
        fontFamily:'Avenir-Heavy',
        fontFamily:'Avenir-HeavyOblique',
        fontFamily:'GillSans-SemiBoldItalic',
        
        lineHeight:100,
        width:'100%',
        paddingTop:20,
        bottom:0,

        color:'white',

        // backgroundColor:'black',
    },
    subHeaderText:{
        fontSize:50,
        fontFamily:'HelveticaNeue-UltraLight',
        justifyContent:'center',
        alignItems:'center',
        // fontFamily:'Avenir-Heavy',
        // fontFamily:'Avenir-HeavyOblique',
        // fontFamily:'GillSans-SemiBoldItalic',
        
        // lineHeight:50,
        width:'100%',
        // paddingTop:10,
        // bottom:0,

        color:'white',

        // backgroundColor:'black',
    },
   
    locationText:{
        color:'white',
        fontFamily:'Arial',
    },

    getLocationButton:{
        borderWidth:1,
        borderColor:'white',
        color:'black',
        justifyContent:'center',
        alignItems:'center',
        height:50,
        borderRadius:0
        // width: 300,
        // marginTop:10
    },
    searchText:{
        fontFamily:'Arial'
    },
    buttonView:{
        flex:3,
        // backgroundColor:'red',
        justifyContent:'center',
    },
    hoshiView:{
        width:300,
        fontFamily:'Didot',
        paddingBottom:60
    },
    hoshiInput:{
        padding:100,
        fontFamily:'Didot',
        fontSize:30
    },
    hoshiLabel:{
        fontFamily:'Didot',
    },
    description:{
        color:'white'
    }
})

export default Main