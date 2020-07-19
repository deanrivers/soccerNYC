/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import { StatusBar } from 'react-native';

import {Router, Scene, Stack,Actions} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'

import Main from './components/main'
import CardView from './components/carousel/cardsView'
import MapFunctional from './components/map/MapFunctional'


class App extends Component{
  componentDidMount(){
    SplashScreen.hide()
  }
  
  render(){
    console.disableYellowBox = true;
    return ([
      <StatusBar hidden/>,
          <Router>
              <Stack key="root">
                <Scene key="main" component={Main} initial title="Main" hideNavBar initial/>
                <Scene key="cards" component={CardView} title="Cards" hideNavBar/>
                <Scene key="map" component={MapFunctional} title="Map" hideNavBar/>
              </Stack>
          </Router>
    ]);
  };
}

export default App;
