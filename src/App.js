/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  
} from 'react-native';

import {Router, Scene, Stack,Actions} from 'react-native-router-flux'
import SplashScreen from 'react-native-splash-screen'

import Main from './components/main'
import CardView from './components/cardsView'
import Map from './components/map'
import MapFunctional from './components/MapFunctional'


class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      zipCode:'',

    }
    this.setZip = this.setZip.bind(this)
  }

  componentDidMount(){
    SplashScreen.hide()
  }



  setZip(zip){
    this.setState({zipCode:zip},()=>{
      console.log('Zip code state in App.js =>',this.state.zipCode)
      if(this.state.zipCode.length===5){
        Actions.cards({zipCode:this.state.zipCode})
      }
    })
  }

  render(){
    console.disableYellowBox = true;
  return ([
    <StatusBar hidden/>,
        <Router>
            <Stack key="root">
              <Scene key="main" component={Main} initial title="Main" hideNavBar initial/>
              <Scene key="cards" component={CardView} title="Cards" hideNavBar/>
              {/* <Scene key="map" component={Map} title="Map" hideNavBar/> */}
              <Scene key="map" component={MapFunctional} title="Map" hideNavBar/>
            </Stack>
          </Router>
  ]);
  };
}

const styles = StyleSheet.create({
  main: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f4f4f3'
  }
})



export default App;
