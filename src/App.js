/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StatusBar, PixelRatio, Dimensions } from 'react-native';

import {Router, Scene, Stack,Actions} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'

import Main from './components/main'

import MapFunctional from './components/map/MapFunctional'

import {dimensions} from './styles/dimensions'


class App extends Component{
  componentDidMount(){

    //hide the splash screen
    SplashScreen.hide()

    //get pixel ration
    // console.log('Ratio',Ratio)
    // console.log('Screen Dimensions',dimensions)
  }
  
  render(){
    console.disableYellowBox = true;
    return ([
      <StatusBar hidden/>,
          <Router>
              <Stack key="root">
                <Scene key="main" component={Main} initial title="Main" hideNavBar initial/>
                <Scene key="map" component={MapFunctional} title="Map" hideNavBar gesturesEnabled={false} panHandlers={null}/>
              </Stack>
          </Router>
    ]);
  };
}

export default App;
