import React, {Component} from 'react'
import { Text,View,TextInput,StyleSheet,TouchableOpacity,Keyboard, ScrollView, SafeAreaView }from 'react-native'
import GetLocation from 'react-native-get-location'
import Card from './card'
import {Actions} from 'react-native-router-flux'

class Main extends Component{
    constructor(props){
        super(props)
        this.state = {
            zipCode:'',
            zipValid:false,
            zipFilled:true,
            location: null,
            
        }

    }

    _requestLocation = () => {
        this.setState({ loading: true, location: null });

        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 150000,
        })
            .then(location => {
                this.setState({
                    location,
                    loading: false,
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

    inputUpdate(e){
        var zipCode = e
        console.log(zipCode)
        this.setState({zipCode,zipFilled:true})
    }

    searchPressed(){
        if(this.state.zipCode.length == 5){
            console.log('valid')
            this.setState({zipValid:true})
            Actions.cards()

        } else{
            console.log('invalid')
            this.setState({zipFilled:false})
        }
    }

    render(){
        return(
            <SafeAreaView style={styles.main}>
                <View>
                    <Text style={styles.text}>Let's find some soccer.</Text>
                    <View style={this.state.zipFilled? styles.textContainer:styles.textContainerInvalid}>                    
                        <TextInput style={styles.textInput} placeholder="Zip Code?" selectionColor={'black'} keyboardType="number-pad" maxLength={5} onChangeText={(e)=>this.inputUpdate(e)}/>
                    </View>

                    <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.search} onPress={()=>this.searchPressed()}>
                            <Text style={styles.searchText}>Search</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.getLocation} onPress={()=>this._requestLocation()}>
                            <Text style={styles.locationText}>Use My Location</Text>
                        </TouchableOpacity>
                    </View>
                    {this.state.location?(<Text>Location: {JSON.stringify(this.state.location,0,2)}</Text>):null}
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f4f4f3'
      },
    textContainer: {
        borderWidth: 1,
        borderColor: 'black',
        width:300,
        height: 50,
        justifyContent:'center',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        
    },
    textContainerInvalid:{
        borderWidth: 1,
        borderColor: 'black',
        width:300,
        height: 50,
        justifyContent:'center',
        // alignItems:'center',
        borderEndColor:'white',
        borderTopColor:'#f4f4f3',
        borderRightColor:'#f4f4f3',
        borderLeftColor:'#f4f4f3',
        borderBottomColor:'red'
    },
    textInput:{
        fontSize:40,
        fontFamily:'Didot',
    },

    text:{
        justifyContent:'center',
        alignItems:'center',
        fontSize:40,
        fontFamily:'Didot',
        width:300,
        marginBottom:50
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
        backgroundColor:'black',
        color:'white',
        justifyContent:'center',
        alignItems:'center',
        marginTop:20,
        height:40,
        width: 140,
        borderRadius:0,
    },
    locationText:{
        color:'white',
        fontFamily:'Arial',
    },  
    searchText:{
        fontFamily:'Arial'
    },
    buttonView:{
        flexDirection:"row",
        justifyContent:'space-between',
    },


})

export default Main