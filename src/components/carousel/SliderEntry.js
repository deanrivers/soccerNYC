import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../styles/SliderEntry.style';
import Dialog, {BlurView} from 'react-native-dialog'
import openMap from 'react-native-open-maps'

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
    };

    constructor(props){
        super(props)
        this.state={
            dialogVisible:false
        }
    }

    componentDidMount(){
        // console.log('Slide Props',this.props)
    }

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
                
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    handleYes(){
        this.locationPressed(this.props.data)
        this.setState({dialogVisible:false})
    }

    locationPressed(data){
        openMap({
            latitude:data.latitude,
            longitude:data.longitude,
            travelType:'drive',
            navigate_mode:'preview',
            query:data.title,
            provider:'apple',
        })
    }

    render () {
        const blurComponentIOS = (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="xlight"
              blurAmount={50}
            />
          )

        const { data: { title, subtitle }, even } = this.props;
        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, even ? styles.titleEven : {}]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return ([
            <View
              style={styles.slideInnerContainer}
              >
                <TouchableOpacity 
                    style={styles.directionButton}
                    onPress={()=>this.setState({dialogVisible:true})}
                >
                    <Text style={{color:'white'}}>Directions</Text>
                </TouchableOpacity>
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                    { this.image }
                    <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
                </View>
                <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                    { uppercaseTitle }
                    <Text
                      style={[styles.subtitle,styles.subtitleEven]}
                      numberOfLines={2}
                    >
                        { subtitle }
                    </Text>
                </View>
            </View>,

            // directions dialog box
            <View style={{flex:1,position:'absolute',zIndex:100000}}>
                <Dialog.Container 
                    visible={this.state.dialogVisible}
                    // blurComponentIOS={blurComponentIOS}
                    
                    >
                    <Dialog.Title>Open Apple Maps?</Dialog.Title>
                    <Dialog.Description>
                        {`Are you sure you want to get directions to "${title}"?`}
                    </Dialog.Description>
                    <Dialog.Button label="Cancel" onPress={()=>{this.setState({dialogVisible:false})}}/>
                    <Dialog.Button label="Yes" onPress={()=>this.handleYes()}/>
                </Dialog.Container>
            </View>,
        ]);
    }
}


