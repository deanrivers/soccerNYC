import React from 'react'
import {View,Text} from 'react-native'

const LoadingScreen = () =>{
    return(
        <View
            style={{
                position:'absolute',
                width:'100%',
                height:'100%',
                zIndex:300
            }}
        >
            <Text>This is the loading screen</Text>
        </View>
    )
}

export default LoadingScreen