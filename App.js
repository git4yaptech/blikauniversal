/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    createStackNavigator,
    createAppContainer
} from 'react-navigation';
import Header from './screens/Header';
import Vinsaelir from './screens/Vinsaelir';
import Frettir from './screens/Frettir';
import Frett from './screens/Frett';
import Topforecast from './screens/Topforecast';
import Dagsspa from './screens/Dagsspa';


const RootStack = createStackNavigator({

  /*
    Head: {
        screen: Header,
    },
   Frett: {
       screen : Frett,
   },*/
    Vilsaelir: {
        screen : Vinsaelir,
    },
   Top: {
       screen :Topforecast,
   },
    Dags : {
        screen : Dagsspa,
    },
    Frettir: {
        screen : Frettir,
    },

},{
    defaultNavigationOptions : {
        header : null
    }
});

const App = createAppContainer(RootStack);

export default App;
