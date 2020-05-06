import React, { Component } from 'react'
import {View,Text,SafeAreaView,StyleSheet,ScrollView,TouchableOpacity,Image} from 'react-native'
import Card from '../components/card'
import {Actions} from 'react-native-router-flux'


import imageSinatra from '../assets/Sinatra.png'
import imageBerryLane from '../assets/berryLane.jpg'
import imageWeehawken from '../assets/weehawken.jpg'
import imageLeft from '../assets/icons/arrows.png'


class CardView extends Component{
    constructor(props){
        super(props)
        this.state = {
            cardData: [{
                'location': 'Sinatra Park',
                'leagues': ['Hoboken Youth Soccer Leagues','Hoboken Adult Soccer League'],
                'pickupFriendly':true,
                'image': imageSinatra
            },
            {
                'location': 'Berry Lane Park',
                'leagues': ['Weekend League','High School Soccer'],
                'pickupFriendly':false,
                'image': imageBerryLane
            },
            {
                'location': 'Weehawken Waterfront',
                'leagues': ['Zog Sports','High School Soccer'],
                'pickupFriendly':true,
                'image':imageWeehawken
            }]
        }

    }

    handleZipPress(){
        //go back to zip code screen
        Actions.pop()
    }

    render(){
        return(
            <SafeAreaView style={styles.main}>
                <TouchableOpacity style={styles.zipContainer} onPress={()=>this.handleZipPress()}>  
                    <Image style={styles.leftArrow} source={imageLeft}/>    
                    <Text style={styles.zipText}>Zip Code</Text>
                </TouchableOpacity>

                {/* <Text style={styles.soccerHeader}>Local Fields.</Text> */}

                <View></View>
                <ScrollView style={styles.scrollView} justifyContent showsVerticalScrollIndicator={false} contentContainerStyle={{flexGrow:1}}>
                    
                    {this.state.cardData.map( (item,index)=>{
                        return(
                            <Card key={index} location={item['location']} leagues={item['leagues']} image={item['image']}/>
                        )
                    })}
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    main:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#f4f4f3'
    },
    scrollView:{
        flexDirection:'column',
        backgroundColor:'#f4f4f3',
        paddingTop:700,
        // marginTop:200
        // paddingBottom:200
    },
    soccerHeader:{
        fontFamily:'Didot',
        fontSize:40,
        width:350,
        marginTop:80,
        // marginBottom:40,
        left:0,
        // backgroundColor:'red'
    },
    leftArrow:{
        width:20,
        height:20
    },
    zipContainer:{
        // flex:1,
        position:'absolute',
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        // height:50,
        width:350,

        zIndex:200,
        top:80,
        // left:30
        // left:0
    },
    zipText:{
        fontSize:20,
        paddingLeft:20,
        fontFamily:'Didot'
    }
})

export default CardView