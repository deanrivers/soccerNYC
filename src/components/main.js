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
            text:'footy.'
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
                
                <View style={{paddingTop:80,flex:1,justifyContent:'space-between',padding:50}}>
                    <View style={{flex:0,backgroundColor:'',overflow:'visible'}}>
                        <Text style={styles.text}>Find some</Text>
                        <Text style={styles.text}>{this.state.text}</Text>
                    </View>
                    
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.getLocation} onPress={()=>Actions.map()}>
                            <Text style={styles.locationText}>Use My Location</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{flex:3,justifyContent:'center',alignItems:'center',backgroundColor:''}}>
                        <Image style={{width:40,height:40}} source={logoImage}/>
                    </View>

                </View>
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
        

        // margin:2
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

    text:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:80,
        fontFamily:'GillSans-SemiBoldItalic',
        // width:300,
        marginBottom:0,
        color:'white',
        
        lineHeight:60,
        paddingTop:20,
        textAlign:'left'
        
    },
    locationText:{
        color:'white',
        fontFamily:'Arial',
    },

    getLocation:{
        borderWidth:1,
        borderColor:'white',
        color:'black',
        justifyContent:'center',
        alignItems:'center',
        height:70,
        // width: 300,
        // marginTop:10
    },
    searchText:{
        fontFamily:'Arial'
    },
    buttonView:{
        flex:2,
        // backgroundColor:'red',
        justifyContent:'center'
        // flexDirection:"row",
        // justifyContent:'center',
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