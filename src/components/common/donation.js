import React from 'react'
import {View,TouchableOpacity,Image,Text} from 'react-native'
import {Actions} from 'react-native-router-flux'
import { colors } from '../../styles/Carousel.style';
import imageBack from '../../assets/icons/back2.png'

const Donation = () =>{
    let backButtonRender =   <View
        style={{
            position:'absolute',
            top:15,
            left:15,
            zIndex:100,
            backgroundColor:colors.black,
            borderRadius:100,
            // padding:5
            justifyContent:'center',
            alignItems:'center'
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


    return(
        <View style={{flex:1,backgroundColor:colors.black,}}>
            {backButtonRender}
            <View
                style={{
                    flex:1,
                    justifyContent:'center',
                    alignItems:'center'
                }}
            >
                <Text
                    style={{
                        width:'50%',
                        textAlign:'center',
                        fontWeight:'bold',
                        color:colors.white,
                        fontFamily:'DamascusLight',
                    }}
                >
                    If you enjoyed...Please consider donating to help the developers. These resources ain't free!
                </Text>
                {/* <Text
                    style={{
                        
                        fontWeight:'bold',
                        color:colors.white,
                        fontFamily:'DamascusLight',
                    }}
                >Please cosider helping</Text>
                <Text
                    style={{
                        
                        fontWeight:'bold',
                        color:colors.white,
                        fontFamily:'DamascusLight',
                    }}
                >the developers pay for the</Text>
                <Text
                    style={{
                        
                        fontWeight:'bold',
                        color:colors.white,
                        fontFamily:'DamascusLight',
                    }}
                >resources!</Text> */}

                <Text
                    style={{
                        fontStyle:'italic',
                        marginTop:'20%',
                        color:colors.white,
                        fontFamily:'DamascusLight',
                    }}
                >Built by {'\u00A9'} decoded.ninja</Text>
                
            </View>
        </View>
    )
}

export default Donation