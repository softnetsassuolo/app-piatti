/**
 * Created by lmagni on 07/01/2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import ApiService from '../../services/api-admin/config';
import HomePage from '../pages/Home';
import { Permissions, Notifications } from 'expo';

export default class Login extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            "username":"",
            "password":""
        }
    }

    static navigationOptions = {
        header: null,
    };

    async onClickLogin(username, password) {
        try {
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
            let device_token = await Notifications.getExpoPushTokenAsync();

            let resp = await ApiService.makeRequest({"entity":"api","action":"login","id":"","date":"","lang":""}, {"username":username,"password":password, "device_token":device_token});
            
            //non sono riuscito a capire come raccogliere l'errore di autenticazione, per ora controllo solamente che mi risponda con il valore token nell'array
            if (resp.token) {
                console.log("Risposta corretta, ora salvo il token");
                AsyncStorage.setItem('token', resp.token); //salvo il token grazie all'AsyncStorage
                AsyncStorage.setItem('username', username); //salvo l'username
                AsyncStorage.setItem('id_customer', JSON.stringify(resp.customer[0]['id'])); //salvo l'id del cliente
                return this.props.navigation.navigate('HomePage');//Navigator.switchNavigator(HomePage);
                //const customnav = Navigator.switchNavigator(HomePage);
            }
            else {
                alert('Login errato');
            }
        }
        catch(e) {
            console.log(e);
        }

    }

    render() {
        return (
            <View style={loginstyle.main}>
                <View style={loginstyle.image}>
                    <Image
                        style={{width: 200, height: 150}}
                        source={require('../../../images/01.jpg')}
                    />
                </View>
                <View style={loginstyle.itemView}>
                    <TextInput style={loginstyle.input} placeholder="Username" onChangeText={(username)=>this.setState({username})}></TextInput>
                    <TextInput style={loginstyle.input} placeholder="Password" onChangeText={(password)=>this.setState({password})}></TextInput>
                </View>
                <View>
                    <View style={loginstyle.image}>
                        <Image
                            style={{width: 100, height: 50}}
                            source={require('../../../images/02.jpg')}
                        />
                    </View>
                    <View style={{justifyContent: 'center', alignItems:'center'}}><Text style={{color: '#E1DDDD', textDecorationLine: 'underline'}}>Copyright 2019 © Piatti Tennis Center</Text></View>                
                </View>
                <View style={loginstyle.button}>
                    <TouchableOpacity style={loginstyle.button} onPress={()=>this.onClickLogin(this.state.username, this.state.password) }>
                        <Text style={loginstyle.textTouch}>{'Login'.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const loginstyle = StyleSheet.create({
    image: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    button: {
        bottom: 0,
        position: 'absolute',
        width: '100%',
        height: 60,
        backgroundColor: '#663300'
    },
    itemView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40
    },
    input: {
        borderColor:'transparent',
        backgroundColor:'#F5F5F5',
        width:300,
        padding: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        fontSize:15,
        borderRadius: 25,
        marginBottom: 20
    },
    textTouch: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        marginTop: 18
    },
    main: {
        flex:1,
        marginTop: 40
    }
});