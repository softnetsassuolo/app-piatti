import React from 'react';
import { StyleSheet, Text, View, NativeModules, Platform } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AppNavigator from './src/services/navigator/AppNavigator'
import HomePage from './src/app/pages/Home';

if (Platform.OS === 'android') {
//questo mi serve per pescare la lingua su Android (devo settarla come variabile globale)
global.locale = NativeModules.I18nManager.localeIdentifier;
}
else if(Platform.OS === 'ios') { 
//questa mi serve per IOS
//TODO dovrebbe funzionare ma non funziona su Apple 
//global.locale = NativeModules.SettingsManager.settings.AppleLocale;
}


export default class App extends React.Component {
	render() {
		return(
				<AppNavigator />
		)
	}
};