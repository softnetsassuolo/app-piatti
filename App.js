import React from 'react';
import { StyleSheet, Text, View, NativeModules, Platform, AsyncStorage } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import AppNavigator from './src/services/navigator/AppNavigator'
import HomePage from './src/app/pages/Home';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';


if (Platform.OS === 'android') {
//questo mi serve per pescare la lingua su Android (devo settarla come variabile globale)
global.locale = NativeModules.I18nManager.localeIdentifier;
}
else if(Platform.OS === 'ios') { 
//questa mi serve per IOS
//TODO dovrebbe funzionare ma non funziona su Apple 
//global.locale = NativeModules.SettingsManager.settings.AppleLocale;
}

async function register() {

	//questa funzione mi serve per registrare le notifiche e il token da associare al dispositivo
	const { status: existingStatus } = await Permissions.getAsync(
	Permissions.NOTIFICATIONS
	);
	let finalStatus = existingStatus;

	// only ask if permissions have not already been determined, because
	// iOS won't necessarily prompt the user a second time.
	if (existingStatus !== 'granted') {
	// Android remote notification permissions are granted during the app
	// install, so this will only ask on iOS
	const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
	finalStatus = status;
	}

	// Stop here if the user did not grant permissions
	if (finalStatus !== 'granted') {
	return;
	}

    //qui salvo il token in una variabile per le notifiche push
    global.device_token = await Notifications.getExpoPushTokenAsync();
}

export default class App extends React.Component {
	componentWillMount() {
		register();
		this.listener = Notifications.addListener(this.listen);
	}
	componentWillUnmount() {
		this.listener && Notifications.removeListener(this.listen);
	}
	listen = ({origin, data}) => {
		
	}
	render() {
		return(
				<AppNavigator />
		)
	}
};