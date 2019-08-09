/**
 * Created by lmagni on 08/01/2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput, RefreshControl, Button, TouchableOpacity, Image, AsyncStorage, ScrollView, ActivityIndicator } from 'react-native';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import MenuButton from '../components/MenuButton';
import CalendarPage from './CalendarPage';
import { Ionicons, AntDesign, FontAwesome, Foundation, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import ItemsStorage from '../components/ItemsStorage';
import ApiService from '../../services/api-admin/config';
import { Notifications } from 'expo';
import { NetInfo } from 'react-native';

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
                    <Text style={styles.text}>Benvenuto nella tua area riservata, qui puoi visualizzare tutti i tuoi appuntamenti</Text>
                    <AntDesign
                        name="down"
                        size={30}
                        color="grey"
                    />
                </View>
                <View style={styles.homeButton}>
                <TouchableOpacity style={styles.homeButton} onPress={()=>this.waitElements() }>
                    <Text style={styles.textTouch}>{'Visualizza i miei appuntamenti'.toUpperCase()}</Text>
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
                        title="Aggiornamento appuntamenti"
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
            <Text style={styles.title}>I miei appuntamenti:</Text>
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
                                <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{"Turno generico in data "+val.date}</Text></View>
                            </View>
                            <View style={{marginTop:20}}>
                                <View style={{position: 'absolute'}}>
                                <Foundation
                                    name='list-bullet'
                                    size={20}
                                    color="#808080"
                                />
                                </View>
                                    <Text style={{color:"#808080", marginLeft:35}}>{val.generic == "one" ? "Appuntamento per l'intera giornata" : "Appuntamento per mezza giornata"}</Text>
                            </View>
                            <View style={{marginTop: 30}}>
                                <Button
                                    title="Vedi sul calendario"
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
                                        <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{"Competizione in data "+val.date}</Text></View>
                                    </View>
                                   <View style={{marginTop:20}}>
                                        <View style={{position: 'absolute'}}>
                                            <Ionicons
                                                name='md-trophy'
                                                size={20}
                                                color="#808080"
                                            />
                                        </View>
                                        <Text style={{color:"#808080", marginLeft:35}}>Nome Competizione: <Text style={styles.grassetto}>{val.competition_name}</Text></Text>
                                        <View style={{marginTop: 10}}>
                                        <View style={{position: 'absolute'}}>
                                            <FontAwesome
                                                name='flag'
                                                size={20}
                                                color="#808080"
                                            />
                                        </View>
                                        <Text style={{color:"#808080", marginLeft:35}}>Stato: <Text style={styles.grassetto}>{val.competition_state}</Text></Text>
                                        </View>
                                    </View>
                                    <View style={{marginTop: 30}}>
                                        <Button
                                            title="Vedi sul calendario"
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
                            <View style={{marginLeft:35}}><Text style={{fontWeight:'bold', fontSize:16}}>{val.name}</Text></View>
                            </View>
                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                        <AntDesign
                                            name='clockcircle'
                                            size={20}
                                            color="#808080"
                                        />
                                    </View>
                                    <Text style={{color:"#808080", marginLeft:25}}>Orario:<Text style={styles.grassetto}> {val.start} - {val.end}</Text></Text>
                                </View>
                                
                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <Ionicons
                                        name='md-tennisball'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                    <Text style={{color:"#808080", marginLeft:25}}>Campo:<Text style={styles.grassetto}>{val.court}</Text></Text>
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
                                <Text style={{color:"#808080", marginLeft:25}}>Campo interno/esterno:<Text style={styles.grassetto}>{val.indoor=="1" ? "Interno" : "Esterno" }</Text></Text>
                                </View>

                                <View style={{marginTop:10}}>
                                    <View style={{position: 'absolute'}}>
                                    <Entypo
                                        name='users'
                                        size={20}
                                        color="#808080"
                                    />
                                    </View>
                                    <View style={{marginLeft:30}}><Text style={{color:"#808080"}}>Partecipanti:</Text>
                                        <View style={styles.listitem}>
                                            { val.partecipant_list != 'undefined' && val.partecipant_list.athletes.length == 0 ? <Text style={{fontWeight: 'bold',color:"#808080"}}>Nessun partecipante</Text> : val.partecipant_list.athletes.map((value, index) => {
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
                                    <View style={{marginLeft:30}}><Text style={{color:"#808080"}}>Maestri:</Text>
                                        <View style={styles.listitem}>
                                            { val.partecipant_list != 'undefined' && val.partecipant_list.teachers.length == 0 ? <Text style={{fontWeight: 'bold',color:"#808080"}}>Nessun maestro</Text> : val.partecipant_list.teachers.map((value, index) => {
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
                                        title="Vedi sul calendario"
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