import React, { Component } from 'react'
import {View,Text,SafeAreaView,StyleSheet,ScrollView,TouchableOpacity,Image} from 'react-native'
import Card from './card'
import {Actions} from 'react-native-router-flux'





class CardView extends Component{
    
    handleZipPress(){
        //go back to zip code screen
        Actions.pop()
    }

    render(){
        return(
            <SafeAreaView style={styles.main}>
                
                <TouchableOpacity style={styles.zipContainer} onPress={()=>this.handleZipPress()}>  
                    <Image style={styles.leftArrow} source={imageLeft}/>    
                    <Text style={styles.zipText}>Zip Code, {this.props.zipCode}</Text>
                </TouchableOpacity>
                

                {/* <Text style={styles.soccerHeader}>Loal Fields.</Text> */}

          
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
        marginTop:0
        //  
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
        fontSize:15,
        paddingLeft:20,
        
    }
})

export default CardView