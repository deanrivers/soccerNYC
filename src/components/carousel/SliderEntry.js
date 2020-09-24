import React, { Component,useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../styles/SliderEntry.style';
import Dialog from 'react-native-dialog'
import openMap from 'react-native-open-maps'
import { BlurView } from "@react-native-community/blur";
import {animated,useSpring} from 'react-spring'

import interfaceImage from '../../assets/icons/interface.png'

const SliderEntry = (props) => {

    // useEffect(()=>{
    //     console.log('PROPS',props)
    // },[])


    const [dialogVisible,updateDialogVisible] = useState(false)

    //react spring
    const springSlide = useSpring({opacity: 1, from: {opacity: 0}})
    const AnimatedView = animated(View)
    const AnimatedText = animated(Text)
    
    handleYes = ()=> {
        locationPressed(props.data)
        updateDialogVisible(false)
        // this.setState({dialogVisible:false})
    }

    onCancel = () => {
        updateDialogVisible(false)
    }

    locationPressed = (data) => {
        openMap({
            latitude:data.latitude,
            longitude:data.longitude,
            travelType:'drive',
            navigate_mode:'preview',
            query:data.title,
            provider:'apple',
        })
    }

    const reactNativeModalProps = {
        onBackdropPress: this.onCancel,
    };

    
    //react spring
    // const spring = useSpring({opacity: 1, from: {opacity: 0}})


    


    const { data: { title, subtitle }, even } = props;
    

    return ([
        
        <View
            style={[styles.slideInnerContainer]}
            >
            
            <View style={styles.shadow} />

            {/* new text container */}
            <View style={styles.newTextContainer}>
                

                <View style={styles.topBar}>
                    <View style={styles.newTextInnerContainer}>
                        <Text style={[styles.newTitle]}>{title}</Text>
                    </View>



                    <TouchableOpacity 
                    style={styles.interactionButton}
                    onPress={()=>updateDialogVisible(true)}
                >
                    <Image  
                        style={{width:30,height:30,borderRadius:20}}
                        source={interfaceImage}
                    />
                </TouchableOpacity>
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
        </View>,

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