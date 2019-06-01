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


const RootStack = createStackNavigator({
    Frettir: {
        screen : Frettir,
    },
   /* Vilsaelir: {
        screen : Vinsaelir,
    },
    Head: {
        screen: Header,
    },
   Frett: {
       screen : Frett,
   },*/
},{
    defaultNavigationOptions : {
        header : null
    }
});

const App = createAppContainer(RootStack);

export default App;
