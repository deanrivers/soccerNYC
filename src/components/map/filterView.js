import React, { useEffect, useState } from 'react'
import {View,Text,TouchableOpacity,Image,Animated,Easing,Dimensions} from 'react-native'

import imageCancel from '../../assets/icons/cancel.png'

const FilterView = (props) => {

    const {width,height} = Dimensions.get('window')

    const [isActive,updateIsActive] = useState(true)
    
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
            
            
        </Animated.View>
    )
}

export default FilterView