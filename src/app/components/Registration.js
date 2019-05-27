import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, AsyncStorage } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import ApiService from '../../services/api-admin/config';

export default class Registration extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            "username":"",
            "password":""
        }
    }

    render() {
        return (
            <View>
                <Text>Registrazione</Text>
                <TextInput placeholder="Username" onChangeText={(username)=>this.setState({username})}></TextInput>
                <TextInput placeholder="Password" onChangeText={(password)=>this.setState({password})}></TextInput>
                <Button loadingProps={{ size: "large", color: "rgba(111, 202, 186, 1)" }} onPress={()=>this.onClickLogin(this.state.username, this.state.password)} title="Login" />
                <Text onPress={this.props.navigation.navigate('Registration')}>Non sei ancora iscritto? Clicca qui per Registrarti</Text>
            </View>
        );
    }
}