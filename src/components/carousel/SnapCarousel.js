import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';

import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
import SliderEntry from './SliderEntry';
import styles, { colors } from '../../styles/Carousel.style';
import { ENTRIES1, ENTRIES2 } from '../../static/entries';
import { scrollInterpolators, animatedStyles } from '../../utils/animations';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const SnapCarousel = (props) => {

    _renderDarkItem = ({item,index}) => {
        return <SliderEntry userLocation={props.location} data={item}/>;
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['transparent','transparent']}>
                <View>
                    
                    <Carousel
                        data={props.data}
                        renderItem={_renderDarkItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        containerCustomStyle={styles.slider}
                        contentContainerCustomStyle={styles.sliderContentContainer}
                        layout={'default'}
                        loop={true}
                        onSnapToItem={(index)=>props.updateIndex(index)}
                    />
                </View>
            </LinearGradient>
        </View>
    );
}

export default SnapCarousel