import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class MenuButton extends React.Component {

	render() {
		return(
			<View style={styles.menuIcon}>
			<Ionicons
				name="md-menu"
				color="#fff"
				size={32}
				onPress={()=> this.props.navigation.openDrawer()}
			/>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	menuIcon: {
		paddingLeft: 10
	}
})