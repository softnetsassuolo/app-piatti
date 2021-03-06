import React from 'react';
import { ActivityIndicator, StatusBar, View, StyleSheet, Button, AsyncStorage, TouchableOpacity } from 'react-native';

export default class Logout extends React.Component {
	
	constructor(props) {
		super(props);
		this._logout();
	}

	_logout = async () => {
		try {
			let keys = ['token', 'calendarItems'];
	        const removeToken = await AsyncStorage.multiRemove(keys);
	        this.props.navigation.navigate('Auth');
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
