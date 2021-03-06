import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image, AsyncStorage, RefreshControl } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import MenuButton from '../components/MenuButton';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import { List, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import ItemsStorage from '../components/ItemsStorage';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

const en = {
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
  no_master: "No masters",
  no_activities: "No activities for this day"
};
const it = {
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
  no_master: "Nessun maestro",
  no_activities: "Non sono presenti attività per questa giornata"
};


//qui setto un array con inglese/francese/italiano a seconda della lingua nel telefono
/*LocaleConfig.locales = LocaleConfig.locales[''];
LocaleConfig.locales['it'] = {
  monthNames: ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'],
  monthNamesShort: ['Genn.','Febb.','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Sett.','Ott.','Nov.','Dic.'],
  dayNames: ['Domenica','Lunedi','Martedi','Mercoledi','Giovedi','Venerdi','Sabato']
};

LocaleConfig.deafultLocale='it';*/

const data = new Date().toISOString().split('T')[0];

export default class CalendarPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	      items: {},
	      date: {}
	    };
	    /*if (this.props.navigation.state.params != undefined) {
	    	const datina = this.props.navigation.state.params.data ? this.props.navigation.state.params.data : new Date().toISOString().split('T')[0];
		}*/
	}
	
	//qui posso modificare il nome della voce di menu
	static navigationOptions = ({navigation}) => {
        //console.log(navigation);
        return {
            title: navigation.state.routeName,
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

	async loadItems(day) {
		//prima faccio la richiesta al server per ottenere i dati
		ItemsStorage.fetchData(this.state.items).then((val) => {
            this.setState({refreshing:false, items:val})
        });
		//devo caricare tutti gli appuntamenti che ho salvato nell'Asyncstorage
		const itemscal = await AsyncStorage.getItem('calendarItems');

		let itemsObj = JSON.parse(itemscal);

    	//else {
    	//	this.renderEmptyDate();
    		//this.state.items[day.dateString] = [];
			/*this.state.items[day.dateString].push({
				name: 'Appuntamento in data ' + data,
				height: 100
			});*/
    	//}

		/*this.state.items[data] = [];
		this.state.items[data].push({
			name: 'Appuntamento in data ' + data,
			height: 100
		});*/
	      /*for (let i = 0; i < 1; i++) {
	        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
	        const strTime = this.timeToString(time);
	        if (!this.state.items[strTime]) {
	          this.state.items[strTime] = [];
	          const numItems = 1;
	          for (let j = 0; j < numItems; j++) {
	            this.state.items[strTime].push({
	              name: 'Item for ' + strTime,
	              height: 400
	            });
	          }
	        }
	      }
	      console.log(this.state.items);*/
	      /*const newItems = {};
	      Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});
	      this.setState({
	        items: newItems
	      });*/
	    // console.log(`Load Items for ${day.year}-${day.month}`);
	  }

	  renderItem(item) {
  		if(typeof item.generic != 'undefined') {
  			return(
	  			<View style={styles.item}>
	  				<Text>{i18n.t('dashboard_generic_appointment') + " " + item.date }</Text>
					<Text>{item.generic == "one" ? i18n.t('dashboard_generic_turn_day') : i18n.t('dashboard_generic_turn_halfday')}</Text>
				</View>
			)
  		}
  		else if(typeof item.competition_name != 'undefined') {
  			return(
  				<View style={styles.item}>
	  				<Text>{i18n.t('dashboard_generic_appointment') + " " + item.date }</Text>
					<Text style={styles.grassetto}>{i18n.t('dashboard_competition_name')}: <Text>{item.competition_name}</Text></Text>
					<Text style={styles.grassetto}>{i18n.t('dashboard_competition_state')}: <Text>{item.competition_state}</Text></Text>
				</View>
  			)
  		}
  		else {
	  		return(
	  			<View style={styles.item}>
	  				<Text>{i18n.t('dashboard_generic_appointment') + " " + item.date }</Text>
	  				<Text><Text style={styles.grassetto}>{i18n.t('dashboard_app_hour')}: </Text> {item.start} - {item.end}</Text>
	  				<Text><Text style={styles.grassetto}>{i18n.t('dashboard_app_court')}: </Text>{item.court}</Text>
	  				<Text><Text style={styles.grassetto}>Playsight: </Text>{item.playsight=="1" ? "Si" : "No" }</Text>
	  				<Text><Text style={styles.grassetto}>{i18n.t('dashboard_app_court_type')}: </Text>{item.indoor=="1" ? i18n.t('internal') : i18n.t('external') }</Text>
	  				<Text style={styles.grassetto}>{i18n.t('partecipant')}:</Text>
			      	<View style={styles.listitem}>
		  			{item.partecipant_list.athletes.length == 0 ? <Text>{i18n.t('no_partecipant')}</Text> : item.partecipant_list.athletes.map((val, index) => {
		  				return(
		  					<Text key={Math.random()}> {val.name} {val.surname}</Text>
							)
		  			})}	      	
			      	</View>
			      	<Text style={styles.grassetto}>{i18n.t('master')}:</Text>
			      	<View style={styles.listitem}>
		  			{item.partecipant_list.teachers.length < 1 ? <Text>{i18n.t('no_master')}</Text> : item.partecipant_list.teachers.map((val, index) => {
		  				return(
		  					<Text key={Math.random()}> {val.name} {val.surname}</Text>
							)
		  			})}	      	
			      	</View>
	  			</View>
			)
		}
	  }

	  /// per adesso utilizziamo asyncstorage nativo
	  saveItems = async() => {
	  	try {
	  		let itemString = JSON.stringify(this.state.items);
	  		await AsyncStorage.removeItem('calendarItems');
  			await AsyncStorage.setItem('calendarItems', itemString);
  			//let pippo = await AsyncStorage.getItem('calendarItems');
	  	}
	  	catch(error) {
	  		alert(error);
	  	}
	  }

	  addItem() { //TODO DA FARE IN FUTURO per il momento non lo usiamo, lo inseriamo in futuro
	  	//salvo il nuovo elemento con la chiave dell'index che ricavo
	  	var keyItem= this.state.items[data].length -1;
	  	this.state.items[data].push({
	  		name: "Appuntamento il "+data,
	  		height: 100,
	  		key: keyItem,
	  		date: data,
	  		start: "14:00",
        	end: "15:30",
        	court: "Court 3",
        	playsight: "1",
        	indoor: "1",
        	partecipant_list: {
        		teachers: [],
        		athletes: [{
        			name: "Nome Atleta 1",
        			surname: "Cognome Atleta 1"
        		},
        		{
        			name: "Nome Atleta 2",
        			surname: "Cognome Atleta 2"
    		}]
        	}
	  	});
	  	const newItems = {};
	    Object.keys(this.state.items).forEach(key => {newItems[key] = this.state.items[key];});

	    this.setState({
	        items: newItems
	      });
	  	
	  }

	  removeItem = async(item, key) => { //TODO DA FARE IN FUTURO anche questo al momento non lo usiamo
	  	//console.log(item);
	  	//let itemsStorage = await AsyncStorage.getItem('calendarItems');
	  	//TODO il data è statico, dovrà essere reso dinamico
	  	var toRemove = this.state.items[item.date][key];
	  	var ind = this.state.items[item.date].indexOf(toRemove);
	  	this.state.items[item.date].splice(ind, 1);
	  	const updateItems = {};
	    Object.keys(this.state.items).forEach(key => {
	    	updateItems[key] = this.state.items[key];
	    });
	    this.saveItems();
	    this.setState({
	        items: updateItems
	      });
	  }

	  renderEmptyDate() {
	  	i18n.fallbacks = true;
		i18n.translations = { en, it };
		i18n.locale = Localization.locale;
	    return (
	      <View style={styles.emptyDate}><Text> {i18n.t('no_activities')}</Text></View>
	    );
	  }

	  rowHasChanged(r1, r2) {
	    return r1.name !== r2.name;
	  }

	  timeToString(time) {
	    const date = new Date(time);
	    return date.toISOString().split('T')[0];
	  }

	  renderChangeDay(item) {
	  	//console.log('sono dentro al changeday');
	  }

	  renderDay(item) {
	  	/*return (
	      <View style={styles.emptyDate}><Text>ciaociao</Text></View>
	    );*/
	  }

	render() {
		return(
			<View style={styles.containerCalendar}>

			<Agenda
		        items={this.state.items}
		        loadItemsForMonth={this.loadItems.bind(this)}
		        selected={data}
		        renderItem={this.renderItem.bind(this)}
		        renderEmptyData={this.renderEmptyDate.bind(this)}
		        onDayPress={this.renderChangeDay.bind(this)}
		        rowHasChanged={this.rowHasChanged.bind(this)}
		        firstDay={1} //così la settimana comincia con il lunedì
		        onRefresh={this.loadItems.bind(this)}
		        //renderDay={this.renderDay.bind(this)}
		        //onDayPress={this.loadItems.bind(this)}
		        // markingType={'period'}
		        // markedDates={{
		        //    '2017-05-08': {textColor: '#666'},
		        //    '2017-05-09': {textColor: '#666'},
		        //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
		        //    '2017-05-21': {startingDay: true, color: 'blue'},
		        //    '2017-05-22': {endingDay: true, color: 'gray'},
		        //    '2017-05-24': {startingDay: true, color: 'gray'},
		        //    '2017-05-25': {color: 'gray'},
		        //    '2017-05-26': {endingDay: true, color: 'gray'}}}
		        // monthFormat={'yyyy'}
		        // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
		        //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
		      />		      
			</View>
		)
	}
}

const styles = StyleSheet.create({
    containerCalendar: {
    	flex:1,
        backgroundColor: '#fff',
    },
    item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    },
    itemremove: {
    	marginTop: 50
    },
    iconadd: {
    	position: 'absolute',
    	bottom: 40,
    	left: 10,
    	zIndex: 9,

    },
    grassetto: {
    	fontWeight: 'bold'
    },
    listitem: {
    	marginLeft: 10
    },
    emptyDate: {
    	alignItems: 'center',
    	justifyContent: 'center',
    	marginTop: 50
    }
});
