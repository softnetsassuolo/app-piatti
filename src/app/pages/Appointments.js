import React from 'react';
import { StyleSheet, Text, View, TextInput, RefreshControl, Button, TouchableOpacity, Image, AsyncStorage, ScrollView, ActivityIndicator } from 'react-native';


export default class Appointments extends React.Component {
    constructor(props) {
        super(props);
         this.state = {
         	calendarItems: {},
            refreshing: false
         }
    }

    _onRefresh = () => {
        this.setState({refreshing:true});
        ItemsStorage.fetchData(this.state.calendarItems).then((val) => {
            this.setState({refreshing:false, calendarItems:val})
        });
        this.getItemsCalendar();
    }
    
    render() {

	    let data = [];
        Object.keys(this.state.calendarItems).forEach(key => {
            data.push(key);
        });
        return (
        <ScrollView
            refreshControl= {
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
            }
        >
        <View>
        <Text style={styles.title}>I miei appuntamenti:</Text>
            <View>
            {data.map(value => {
                return this.state.calendarItems[value].map((val, index) => {
                    if(typeof val.generic != 'undefined') { //qui sono dentro al turno generico
                        return(
                        <Card title={"Turno generico in data "+val.date} key={index}>
                            
                            <Text>{val.generic == "one" ? "Appuntamento per l'intera giornata" : "Appuntamento per mezza giornata"}</Text>
                
                        </Card>
                        )
                        }
                        else if(typeof val.competition_name != 'undefined') { //qui sono dentro al torneo
                            return(
                                <Card title={"Competizione in data "+val.date} key={index}>
                                    <Text style={styles.grassetto}>Nome Competizione: <Text>{val.competition_name}</Text></Text>
                                    <Text style={styles.grassetto}>Stato: <Text>{val.competition_state}</Text></Text>
                                </Card>
                            )
                        }
                        else {
                        return (
                        <Card title={val.name} key={index}>
                        <Text><Text style={styles.grassetto}>Orario: </Text> {val.start} - {val.end}</Text>
                            <Text><Text style={styles.grassetto}>Campo: </Text>{val.court}</Text>
                            <Text><Text style={styles.grassetto}>Playsight: </Text>{val.playsight=="1" ? "Si" : "No" }</Text>
                            <Text><Text style={styles.grassetto}>Campo interno/esterno: </Text>{val.indoor=="1" ? "Interno" : "Esterno" }</Text>
                            <Text style={styles.grassetto}>Partecipanti:</Text>
                            <View style={styles.listitem}>
                            { val.partecipant_list != 'undefined' && val.partecipant_list.athletes.length == 0 ? <Text>Nessun partecipante</Text> : val.partecipant_list.athletes.map((value, index) => {
                                return(
                                    <Text key={Math.random()}> > {value.name} {value.surname}</Text>
                                    )
                            })}         
                            </View>

                            <Text style={styles.grassetto}>Maestri:</Text>
                            <View style={styles.listitem}>
                            { val.partecipant_list != 'undefined' && val.partecipant_list.teachers.length == 0 ? <Text>Nessun maestro</Text> : val.partecipant_list.teachers.map((value, index) => {
                                return(
                                    <Text key={Math.random()}> > {value.name} {value.surname}</Text>
                                    )
                            })}         
                            </View>
                        </Card>)
                    }
                })
            }
            )}                
            </View>
        </View>
        </ScrollView>
		)
    }
}