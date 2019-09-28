/**
 * Created by lmagni on 08/01/2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput, RefreshControl, Button, TouchableOpacity, Image, AsyncStorage, ScrollView, ActivityIndicator, NetInfo } from 'react-native';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import MenuButton from '../components/MenuButton';
import CalendarPage from './CalendarPage';
import { Ionicons, AntDesign, FontAwesome, Foundation, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import ItemsStorage from '../components/ItemsStorage';
import ApiService from '../../services/api-admin/config';
import { Notifications } from 'expo';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';



const en = {
  txt: 'Welcome in your reserved area, here you can see all your appointments',
  txt_label: "View my appointments",
  dashboard_title: "My appointments",
  dashboard_loading: "Appointments Update",
  dashboard_calendar: "View on calendar",
  dashboard_generic_turn_title: "Generic turn in date",
  dashboard_generic_appointment: "Appointment in date",
  dashboard_generic_turn_day: "Appointment for all day",
  dashboard_generic_turn_halfday: "Appointment for half day",
  dashboard_competition_title: "Tournament in date",
  dashboard_competition_name: "Tournament name",
  dashboard_competition_state: "State",
  dashboard_app_hour: "Hour",
  dashboard_app_court: "Court",
  dashboard_app_court_type: "Internal/External Court",
  internal: "Internal",
  external: "External",
  partecipant: "Partecipants",
  no_partecipant: "No athletes",
  master: "Masters",
  no_master: "No masters"
};
const it = {
  txt: 'Benvenuto nella tua area riservata, qui puoi visualizzare tutti i tuoi appuntamenti',
  txt_label: "Visualizza i miei appuntamenti",
  dashboard_title: "I miei appuntamenti",
  dashboard_loading: "Aggiornamento Appuntamenti",
  dashboard_calendar: "Vedi sul calendario",
  dashboard_generic_turn_title: "Turno generico in data",
  dashboard_generic_appointment: "Appuntamento in data",
  dashboard_generic_turn_day: "Appuntamento per l'intera giornata",
  dashboard_generic_turn_halfday: "Appuntamento per mezza giornata",
  dashboard_competition_title: "Competizione in data",
  dashboard_competition_name: "Nome Competizione",
  dashboard_competition_state: "Stato",
  dashboard_app_hour: "Orario",
  dashboard_app_court: "Campo",
  dashboard_app_court_type: "Campo Interno/Esterno",
  internal: "Interno",
  external: "Esterno",
  partecipant: "Partecipanti",
  no_partecipant: "Nessun partecipante",
  master: "Maestri",
  no_master: "Nessun maestro"
};

i18n.fallbacks = true;
i18n.translations = { en, it };
i18n.locale = Localization.locale;


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calendarItems: {},
            isLoading: false,
            name:'',
            refreshing: false,
            appointments: false,
        }
        

    }

    componentWillMount() {
        this.listener = Notifications.addListener(this.listen);
    }
    /*componentWillUnmount() {
        this.listener && Notifications.removeListener(this.listen);
    }*/
    listen = ({origin, data}) => {
        this.setState({refreshing:true});
        this.onRefresh();
        
    }

    //qui posso modificare il nome della voce di menu
    static navigationOptions = ({navigation}) => {
        //console.log(navigation);
        return {
            title: 'Piatti Tennis Center',
            headerLeft: <MenuButton navigation={navigation} />,
            headerStyle: {
                backgroundColor: '#663300',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
        };
    };

    onRefresh = () => {
        this.setState({refreshing:true});

        ItemsStorage.fetchData(this.state.calendarItems).then((val) => {
            this.setState({refreshing:false, calendarItems:val, appointments:true, isLoading:false})
        });
        this.getItemsCalendar();
        i18n.translations = { en, it };
    }

    goBack = async() => {
        this.setState({appointments:false});
        //await AsyncStorage.removeItem('calendarItems');
    }

    waitElements = async() => {
        this.setState({isLoading:true});
        const items = await AsyncStorage.getItem('calendarItems');
        NetInfo.isConnected.fetch().then(isConnected => {
           if(isConnected)
           {
               this.onRefresh(); //qui vado a refreshare gli appuntamenti se sono connesso a internet
           }
           else {
               items?this.getItemsCalendar():this.onRefresh()
           }
        })        
    }

    getItemsCalendar = async() => {
        try {            
            const items = await AsyncStorage.getItem('calendarItems')
            let itemsObj = JSON.parse(items);
            const allItems = {};
            const customer_name = await AsyncStorage.getItem('nome');
            const customer_surname = await AsyncStorage.getItem('cognome')

            if(itemsObj != null) {
                Object.keys(itemsObj).forEach(key => {
                    allItems[key] = itemsObj[key];
                    /*for(i = 0; i < Object.keys(itemsObj[key]).length; i++) {
                    }*/
                });
            }

            this.setState({
                calendarItems:allItems,
                isLoading: false,
                appointments: true,
                name: customer_name + ' ' + customer_surname
            });          
        }
        catch(error) {
            alert(error);
        }
    }

    /*sendNotification = async() => {
        try {
            let token_notification = await Notifications.getExpoPushTokenAsync();

            let resp = await ApiService.makeRequest({"entity":"users","action":"push-token","id":"","date":"","lang":"", "login":""}, {"token":token_notification});
            
        }
        catch(e) {
            console.log(e);
        }
    }*/
    render() {
        if(this.state.isLoading == false && this.state.appointments == false || this.state.calendarItems == null ) { //qui entro se non ho item salvati
            return (
                <View style={styles.main}>
                <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={{width: 150, height: 250}}
                    source={require('../../../images/03.jpg')}
                />
                </View>
                <View style={{ alignItems: 'center'}}>
                <Image
                    style={{width: 120, height: 50}}
                    source={require('../../../images/02.jpg')}
                />
                </View>
                <View style={styles.container}>
                    <Text style={styles.text}>{i18n.t('txt')}</Text>
                    <AntDesign
                        name="down"
                        size={30}
                        color="grey"
                    />
                </View>
                <View style={styles.homeButton}>
                <TouchableOpacity style={styles.homeButton} onPress={()=>this.waitElements() }>
                    <Text style={styles.textTouch}>{i18n.t('txt_label').toUpperCase()}</Text>
                </TouchableOpacity>
                </View>
                </View>            
            )
        }
        else if (this.state.isLoading == true) { ///qui entro se sta caricando i dati con il loading
            return (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#663300" />
              </View>
            )
        }
        else { ///qui entro quando devo visualizzare gli appuntamenti
            let data = [];
            Object.keys(this.state.calendarItems).forEach(key => {
                data.push(key);
            });
            return (
            <View style={{backgroundColor: '#F5F5F5'}}>
            {//icona del torna in Home PAge che per adesso lascio commentata
            /*<Ionicons
                name="md-arrow-dropleft-circle"
                onPress={()=>this.goBack()}
                size={60}
                color="#663300"
                style={styles.returnIcon}
            />*/}
            <ScrollView
                refreshControl= {
                    <RefreshControl
                        title={i18n.t('dashboard_loading')}
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh}
                    />
                }
            >
            <View>   
            <FontAwesome
                name='user-circle'
                color='#C0C0C0'
                style={{textAlign:'center', marginTop: 10}}
                size={60}
            />
            <Text style={styles.title}>{this.state.name.split('"').join('')}</Text>
            <Text style={styles.title}>{i18n.t('dashboard_title')}:</Text>
                <View>
                {data.map(value => {
                    return this.state.calendarItems[value].map((val, index) => {
                        if(typeof val.generic != 'undefined') { //qui sono dentro al turno generico
                            return(
                            <Card key={index}>
                            <View style={{borderBottomWidth:1,borderBottomColor: '#808080', paddingBottom: 20}}>
                                <View style={{position: 'absolute'}}>
                                    <AntDesign
                                        name='clockcircle'
                                        size={25}
                                        color="#663300"
                                    />
                                </View>
                                <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{i18n.t('dashboard_generic_turn_title')+ " " +val.date}</Text></View>
                            </View>
                            <View style={{marginTop:20}}>
                                <View style={{position: 'absolute'}}>
                                <Foundation
                                    name='list-bullet'
                                    size={20}
                                    color="#808080"
                                />
                                </View>
                                    <Text style={{color:"#808080", marginLeft:35}}>{val.generic == "one" ? i18n.t('dashboard_generic_turn_day') : i18n.t('dashboard_generic_turn_halfday')}</Text>
                            </View>
                            <View style={{marginTop: 30}}>
                                <Button
                                    title={i18n.t('dashboard_calendar')}
                                    onPress={()=>this.props.navigation.dispatch(NavigationActions.navigate({ routeName:'Calendario', data: val.date }))}
                                    color="#663300"
                                />
                            </View>
                            </Card>
                            )
                            }
                            else if(typeof val.competition_name != 'undefined') { //qui sono dentro al torneo
                                return(
                                    <Card key={index}>
                                    <View style={{borderBottomWidth:1,borderBottomColor: '#808080', paddingBottom: 20}}>
                                        <View style={{position: 'absolute'}}>
                                            <FontAwesome
                                                name='star'
                                                size={25}
                                                color="#FFDD03"
                                            />
                                        </View>
                                        <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{i18n.t('dashboard_competition_title') + " " + val.date}</Text></View>
                                    </View>
                                   <View style={{marginTop:20}}>
                                        <View style={{position: 'absolute'}}>
                                            <Ionicons
                                                name='md-trophy'
                                                size={20}
                                                color="#808080"
                                            />
                                        </View>
                                        <Text style={{color:"#808080", marginLeft:35}}>{i18n.t('dashboard_competition_name')}: <Text style={styles.grassetto}>{val.competition_name}</Text></Text>
                                        <View style={{marginTop: 10}}>
                                        <View style={{position: 'absolute'}}>
                                            <FontAwesome
                                                name='flag'
                                                size={20}
                                                color="#808080"
                                            />
                                        </View>
                                        <Text style={{color:"#808080", marginLeft:35}}>{i18n.t('dashboard_competition_state')}: <Text style={styles.grassetto}>{val.competition_state}</Text></Text>
                                        </View>
                                    </View>
                                    <View style={{marginTop: 30}}>
                                        <Button
                                            title={i18n.t('dashboard_calendar')}
                                            onPress={()=>{this.props.navigation.navigate('Calendario', {data:val.date})}}
                                            color="#663300"
                                        />
                                    </View>
                                    </Card>
                                )
                            }
                            else {
                            return (
                            <Card key={index}>
                            <View style={{borderBottomWidth:1,borderBottomColor: '#808080', paddingBottom: 20}}>
                            <View style={{position:'absolute'}}>                                
                                <FontAwesome
                                    name='calendar-check-o'
                                    size={25}
                                    color="#663300"
                                />
                            </View>
                            <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{i18n.t('dashboard_generic_appointment') + " " + val.date}</Text></View>
                            </View>
                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                        <AntDesign
                                            name='clockcircle'
                                            size={20}
                                            color="#808080"
                                        />
                                    </View>
                                    <Text style={{color:"#808080", marginLeft:25}}>{i18n.t('dashboard_app_hour')}:<Text style={styles.grassetto}> {val.start} - {val.end}</Text></Text>
                                </View>
                                
                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <Ionicons
                                        name='md-tennisball'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                    <Text style={{color:"#808080", marginLeft:25}}>{i18n.t('dashboard_app_court')}:<Text style={styles.grassetto}>{val.court}</Text></Text>
                                </View>
                                
                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <AntDesign
                                        name='playcircleo'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                <Text style={{color:"#808080", marginLeft:25}}>Playsight:<Text style={styles.grassetto}>{val.playsight=="1" ? "Si" : "No" }</Text></Text>
                                </View>

                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <AntDesign
                                        name='swap'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                <Text style={{color:"#808080", marginLeft:25}}>{i18n.t('dashboard_app_court_type')}:<Text style={styles.grassetto}>{val.indoor=="1" ? i18n.t('internal') : i18n.t('external') }</Text></Text>
                                </View>

                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <Entypo
                                        name='users'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                    <View style={{marginLeft:30}}><Text style={{color:"#808080"}}>{i18n.t('partecipant')}:</Text>
                                        <View style={styles.listitem}>
                                            { val.partecipant_list != 'undefined' && val.partecipant_list.athletes.length == 0 ? <Text style={{fontWeight: 'bold',color:"#808080"}}>{i18n.t('no_partecipant')}</Text> : val.partecipant_list.athletes.map((value, index) => {
                                                return(                                                    
                                                    <Text style={{fontWeight: 'bold',color:"#808080"}} key={Math.random()}>
                                                        <Entypo
                                                            name="user"
                                                            color="#808080"
                                                        />  {value.name} {value.surname}
                                                    </Text>
                                                )
                                            })}         
                                        </View>
                                    </View>
                                </View>

                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <MaterialCommunityIcons
                                        name='teach'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                    <View style={{marginLeft:30}}><Text style={{color:"#808080"}}>{i18n.t('master')}:</Text>
                                        <View style={styles.listitem}>
                                            { val.partecipant_list != 'undefined' && val.partecipant_list.teachers.length == 0 ? <Text style={{fontWeight: 'bold',color:"#808080"}}>{i18n.t('no_master')}</Text> : val.partecipant_list.teachers.map((value, index) => {
                                                return(
                                                    <Text style={{fontWeight: 'bold',color:"#808080"}} key={Math.random()}> 
                                                        <FontAwesome
                                                            name="user"
                                                            color="#808080"
                                                        />   {value.name} {value.surname}
                                                    </Text>
                                                )
                                            })}         
                                        </View>
                                    </View>
                                </View>
                                <View style={{marginTop: 30}}>
                                    <Button
                                        title={i18n.t('dashboard_calendar')}
                                        onPress={()=>{this.props.navigation.navigate('Calendario', {data:val.date})}}
                                        color="#663300"
                                    />
                                </View>
                            </Card>)
                        }
                    })
                }
                )}                
                </View>
            </View>
            </ScrollView>
            </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    main: {
        flex:1
    },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        width: 200,
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 30
    },
    iconrefresh: {
        zIndex: 1,
        alignItems: 'flex-end',
        right: 20
    },
    grassetto: {
        fontWeight: 'bold'
    },
    listitem: {
        marginLeft: 10
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    returnIcon: {
        position: 'absolute',
        zIndex: 9,
        left: 5
    },
    homeButton: {
      bottom: 0,
      position: 'absolute',
      width: '100%',
      height: 60,
      backgroundColor: '#663300'
    },
    textTouch: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        marginTop: 18
    }
});