import React, { useEffect, useState } from 'react'
import {View,Text,TouchableOpacity,Image,Animated,Easing,Dimensions, Alert} from 'react-native'
import Slider from '@react-native-community/slider';


import {colors,fonts} from '../../styles/styles'

import imageCancel from '../../assets/icons/cancel.png'

const FilterView = (props) => {

    const {width,height} = Dimensions.get('window')

    const [isActive,updateIsActive] = useState(true)
    const [sliderValue,updateSliderValue] = useState(0)
    
    let slideIn = new Animated.Value(width)
    let slideOut = new Animated.Value(0)


    //component did mount
    useEffect(()=>{

        console.log('is active',isActive)

        if(!isActive){ //animate out
            Animated.timing(slideOut,{
                toValue:width,
                duration:200,
                delay:0,
                easing: Easing.ease,
                useNativeDriver:true
            }).start()


            setTimeout(()=>{
                props.closeFilter()
            },300)

            
        } else{ //animate in
            Animated.timing(slideIn,{
                toValue:0,
                duration:200,
                delay:0,
                easing: Easing.linear,
                useNativeDriver:true
            }).start()

        }

    },[isActive])


    confirmButtonPressd = () =>{
        Alert.alert('Confirmed!')
    }
    

    let cancelButton = <View
                        style={{
                            flex:1,
                            position:'absolute',
                            top:20,
                            right:20,
                            zIndex:100,
                            borderRadius:10,
                            marginVertical:10,
                            justifyContent:'space-evenly',
                            padding:6
                        }}
                    >
                        <TouchableOpacity onPress={()=>updateIsActive(false)}>
                            <Image 
                                source={imageCancel} 
                                style={{
                                    width:20,
                                    height:20,
                                }}
                            />
                        </TouchableOpacity>
                    </View>

    let confirmButton = <View
                            style={{
                                flex:1,
                                justifyContent:'flex-start',
                                alignItems:'center',
                                
                                
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{
                                    backgroundColor:colors.white,
                                    padding:20,
                                    borderRadius:100
                                }}
                                onPress={()=>confirmButtonPressd()}
                                
                            >
                                <Text 
                                    style={{
                                        fontFamily:fonts.mainFont,
                                        fontSize:20,
                                        fontWeight:"bold",
                                        color:colors.black
                                    }}
                                >Confirm Changes</Text>
                            </TouchableOpacity>
                        </View>
    return(
        <Animated.View
            style={{
                opacity:1,
                // height:`${slideIn}%`,
                height:'100%',
                transform: [{ translateX: isActive?slideIn:slideOut }],
                flex:1,
                backgroundColor:'#151515',
                position:'absolute',
                width:'100%',
                // height:'100%',
                zIndex:200
            }}
        >
            {cancelButton}

            <View style={{
                flex:3,
                justifyContent:'center',
                alignItems:'center',
                // backgroundColor:'orange'
            }}>
                <Text style={{
                    color:colors.white,
                    fontFamily:fonts.mainFont,
                    fontSize:18,
                    fontWeight:'normal'
                }}
                >Search Radius - {sliderValue}
                
                </Text>
                <Slider
                    style={{width: 200, height: 40}}
                    value={0}
                    step={1}
                    minimumValue={0}
                    maximumValue={5}
                    minimumTrackTintColor={colors.white}
                    maximumTrackTintColor="#000000"
                    onSlidingComplete={(value)=>updateSliderValue(value)}
                />
            </View>
            {confirmButton}
        </Animated.View>
    )
}

export default FilterView