import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Text, View, TextInput, Button, AsyncStorage } from 'react-native';

export default class AuthLoading extends React.Component {
	constructor(props) {
		super(props);
		this.fetchToken();
	}

	//devo capire se è presente il token di autenticazione per indirizzare l'utente nel routing giusto
	fetchToken = async () => {
		try {
			const Token = await AsyncStorage.getItem('token');
			this.props.navigation.navigate(Token ? 'HomePage' : 'Login');
		}
		catch(error) {
			alert(error);
		}
	}

	render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}