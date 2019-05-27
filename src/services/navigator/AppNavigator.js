/**
 * Created by lmagni on 08/01/2019.
 */
import React from 'react';
import { createSwitchNavigator, createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';



//import MainTabNavigator from './MainTabNavigator';
//devo importare le schermate da visualizzare
import AuthLoading from '../../app/components/AuthLoading';
import Login from '../../app/components/Login';
import HomePage from '../../app/pages/Home';
import CalendarPage from '../../app/pages/CalendarPage';
import Logout from '../../app/components/Logout';
import { Ionicons } from '@expo/vector-icons';
//import Registration from '../../app/components/Registration';

//info su Stack Navigator -> https://reactnavigation.org/docs/en/stack-navigator.html

//il drawer navigator mi serve per creare la navigazione con il menu "Drawer", tuttavia devo prima creare degli Stacknavigator per avere l'opzione dell'header in ogni componente della mia app
const HomeStack = createStackNavigator({
    HomePage: HomePage,
});
const CalendarStack = createStackNavigator({
    Calendario:{
      screen: CalendarPage
    }
});
const LogoutStack = createStackNavigator({
    Logout:{
      screen: Logout
    }
});
//il primo valore è il nome che diamo al routing, il secondo valore dopo i due punti è il nome del componente
const AuthStack = createStackNavigator({
    AuthLoading: AuthLoading
});

const LoginStack = createStackNavigator({
    Login: Login
})

const AppStack = createDrawerNavigator({
  Home: {
    screen:HomeStack,
  },
  Calendario: {
    screen: CalendarStack
  },
  Logout: {
    screen: LogoutStack
  }
},
{
  drawerBackgroundColor: '#1f1f1f',
  drawerWidth: 150,
  contentOptions: {
    activeTintColor: 'white',
    inactiveTintColor: 'grey'
  }
}
)

export default createAppContainer(createSwitchNavigator({
  //qui, attraverso lo SwitchNavigator, posso gestire i routing e indirizzare dove voglio le schermate
  //lo scopo dello SwitchNavigator è di far visualizzare uno screen alla volta e resettare i routes e le azioni una volta che si passa da uno all'altro, mentre lo stack navigator posso implementare più screen e tra uno switch e l'altro rimangono salvate le azioni
  //AuthLoading: AuthLoadingScreen,
  //Main: MainTabNavigator,
  App: AppStack,
  Auth: AuthStack,
  Login: LoginStack
  //Registration: Registration, //per ora la registrazione non è presente, solo il login
  
},
{
    initialRouteName: 'Auth',
}
));