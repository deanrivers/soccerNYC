import React, {Component} from 'react'

import { Text,View,TextInput,StyleSheet,TouchableOpacity,Keyboard, ScrollView, SafeAreaView }from 'react-native'

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

    // componentDidMount(){
    //     this.setState({zipCode:''})
    // }

    

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
                <View style={{marginTop:0,flex:1,justifyContent:'space-evenly'}}>
                    <Text style={styles.text}>Find some footy.</Text>
                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.getLocation} onPress={()=>Actions.map()}>
                            <Text style={styles.locationText}>Use My Location</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{felx:1,justifyContent:'center',alignItems:'center',backgroundColor:''}}>
                        <Text style={{color:'white'}}>Developed by Decoded.Ninja</Text>
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
        paddingTop:1000
        
      },
    textContainer: {
        borderWidth: 1,
        // borderColor: 'black',
        width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        // borderBottomColor:'white'
        borderColor:'#f4f4f3'
        
    },
    textContainerInvalid:{
        borderWidth: 1,
        // borderColor: 'black',
        width:300,
        height: 50,
        justifyContent:'center',
        // alignItems:'center',
        
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        // borderBottomColor:'red'
    },
    textInput:{
        fontSize:40,
        fontFamily:'Didot',
        
    },

    text:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:80,
        fontFamily:'Avenir-BlackOblique',
        fontFamily:'Optima-Bold',
        // fontFamily:'Optima-BoldItalic',
        // fontFamily:'Optima-BoldItalic',
        
        // fontFamily:'Helvetica Neue',
        width:300,
        marginBottom:50,
        color:'#E7ECEF'
        
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
        // backgroundColor:'#E7ECEF',
        borderWidth:1,
        borderColor:'white',
        color:'black',
        justifyContent:'center',
        alignItems:'center',
        // marginTop:20,
        height:60,
        width: 300,
        
        // borderRadius:300,
        
    },
    
    searchText:{
        fontFamily:'Arial'
    },
    buttonView:{
        flexDirection:"row",
        justifyContent:'space-between',
    },

    hoshiView:{
        width:300,
        fontFamily:'Didot',
        paddingBottom:60
        
    },  
    hoshiInput:{
        // backgroundColor:'red',
        
        padding:100,
        fontFamily:'Didot',
        
        fontSize:30
    },
    hoshiLabel:{
        fontFamily:'Didot',
        // fontSize:30
    }


})

export default Main