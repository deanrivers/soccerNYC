/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {Router, Scene, Stack,Actions} from 'react-native-router-flux'



import Main from './components/main'
import CardView from './components/cardsView'


const App = () => {
  
  return (
    
      <Router>
          <Stack key="root">
            <Scene key="main" component={Main} initial title="Main" hideNavBar/>
            <Scene key="cards" component={CardView} title="Cards" hideNavBar/>

          </Stack>
          
        </Router>
      
  );
};

const styles = StyleSheet.create({
  main: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f4f4f3'
  }
})



export default App;
