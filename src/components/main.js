import React, {Component} from 'react'

import { Text,View,TextInput,StyleSheet,TouchableOpacity,StatusBar, SafeAreaView }from 'react-native'

import {Actions} from 'react-native-router-flux'

import {Hoshi} from 'react-native-textinput-effects'









class Main extends Component{
    constructor(props){
        super(props)
        this.state = {
            zipCode:'',
            zipValid:false,
            zipFilled:false,
            textValue:''
        }

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
                
                <View style={{paddingTop:80,flex:1,justifyContent:'space-between',}}>
                    <View style={{flex:0,backgroundColor:'',overflow:'visible'}}>
                        <Text style={styles.text}>Find some footy.</Text>
                    </View>
                    
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.getLocation} onPress={()=>Actions.map()}>
                            <Text style={styles.locationText}>Use My Location</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:3,justifyContent:'center',alignItems:'center',backgroundColor:''}}>
                        <Text style={{color:'white',fontSize:10,fontFamily:'AppleSDGothicNeo-Light'}}>Developed by Decoded.Ninja 2020</Text>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'black',
      },
    textContainer: {
        borderWidth: 1,
        width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        borderColor:'#f4f4f3'
    },
    textContainerInvalid:{
        borderWidth: 1,
        width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
    },
    textInput:{
        fontSize:40,
        fontFamily:'Didot',
    },
    text:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:100,
        fontFamily:'Avenir-BlackOblique',
        fontFamily:'Optima-Bold',
        width:300,
        marginBottom:0,
        color:'#E7ECEF',
        lineHeight:90,
        paddingTop:20,
        textAlign:'left'
        
    },
    locationText:{
        color:'white',
        fontFamily:'Arial',
    },
    search:{
        backgroundColor:'#ccc',
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
        height:40,
        width: 140,
        borderRadius:0,
    },
    getLocation:{
        borderWidth:1,
        borderColor:'white',
        color:'black',
        justifyContent:'center',
        alignItems:'center',
        height:60,
        width: 300,
        marginTop:10
    },
    searchText:{
        fontFamily:'Arial'
    },
    buttonView:{
        flex:2,
        flexDirection:"row",
        justifyContent:'flex-start',
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
    }
})

export default Main