import React, { Component,useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet, Alert, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../styles/SliderEntry.style';
import Dialog from 'react-native-dialog'
import openMap from 'react-native-open-maps'
import { BlurView } from "@react-native-community/blur";
import {animated,useSpring} from 'react-spring'

import interfaceImage from '../../assets/icons/interface.png'
import { Easing } from 'react-native-reanimated';

const SliderEntry = (props) => {

    //native animations
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            easing:Easing.linear
        }).start();
    },[])

    const [dialogVisible,updateDialogVisible] = useState(false)
    

    //react spring
    const springSlide = useSpring({opacity: 1, from: {opacity: 0}})
    const AnimatedView = animated(View)
    const AnimatedText = animated(Text)



    // const fadein = () =>{
    //     Animated.timing(fadeAnim, {
    //         toValue: 1,
    //         duration: 5000
    //       }).start();
    // }
    handleYes = ()=> {
        locationPressed(props.data)
        updateDialogVisible(false)
    }

    onCancel = () => {
        updateDialogVisible(false)
    }

    locationPressed = (data) => {

        let latitudeStr = JSON.stringify(data.latitude)
        let longitudeStr = JSON.stringify(data.longitude)
        let userLocationLatStr = JSON.stringify(props.userLocation.latitude)
        let userLocationLngStr = JSON.stringify(props.userLocation.longitude)

        openMap({
            // latitude:data.latitude,
            // longitude:data.longitude,  
            travelType:'drive',
            navigate_mode:'navigate',
            query:data.title,
            provider:'apple',
            start:`${userLocationLatStr},${userLocationLngStr}`,
            end:`${latitudeStr},${longitudeStr}`,
            
            
        })
    }

    const reactNativeModalProps = {
        onBackdropPress: this.onCancel,
    };

    const { data: { title, subtitle }, even } = props;
    

    return ([
        
        <Animated.View
            style={[{opacity:fadeAnim},styles.slideInnerContainer]}
            >
            
            <View style={styles.shadow} />

            {/* new text container */}
            <View style={styles.newTextContainer}>
                

                <View style={styles.topBar}>
                    <View style={styles.newTextInnerContainer}>
                        <Text style={[styles.newTitle]}>{title}</Text>
                    </View>

                    <View 
                        style={styles.interactionButton}
                    >  
                        <TouchableOpacity
                            onPress={()=>updateDialogVisible(true)}
                            activeOpacity={0.8}
                        >
                            <Image  
                                style={{width:40,height:40,borderRadius:20}}
                                source={interfaceImage}
                                onPress={()=>updateDialogVisible(true)}
                            />
                        </TouchableOpacity>
                        
                </View>
                </View>

                
                
            </View>

            <View style={[styles.imageContainer]}>
                <Image
                    source={{ uri: props.data.illustration }}
                    style={styles.image}
                />
                <View style={[styles.radiusMask,styles.radiusMaskEven]} />
            </View>


            {/* old text container */}
            {/* <View style={[styles.textContainer,styles.textContainerEven]}>
                { uppercaseTitle }
                <Text
                    style={[styles.subtitle,styles.subtitleEven]}
                    numberOfLines={2}
                >
                    { subtitle }
                </Text>
            </View> */}
        </Animated.View>,

        // directions dialog box
        <View style={{flex:1,position:'absolute',zIndex:100000}}>
            <Dialog.Container 
                visible={dialogVisible}
                // blurComponentIOS={blurComponentIOS}
                {...reactNativeModalProps}
                >
                <Dialog.Title>Open Apple Maps?</Dialog.Title>
                <Dialog.Description>
                    <Text>Test</Text>
                    {`Are you sure you want to get directions to "${title}"?`}
                </Dialog.Description>
                <Dialog.Button color="red" label="Cancel" onPress={()=>onCancel()}/>
                <Dialog.Button color="black" label="Yes" onPress={()=>handleYes()}/>
            </Dialog.Container>
        </View>,
    ]);
    
}


export default SliderEntry