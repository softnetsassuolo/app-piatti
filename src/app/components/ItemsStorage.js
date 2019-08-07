import React from 'react';
import { StyleSheet, Text, View, TextInput, RefreshControl, Button, TouchableOpacity, Image, AsyncStorage, ScrollView, ActivityIndicator } from 'react-native';
import ApiService from '../../services/api-admin/config';

export default class ItemsStorage extends React.Component {
	constructor(props) {
        super(props);
    }

	static async fetchData(items) {
		let data = new Date().toISOString().split('T')[0];
        try {
            let id_customer = await AsyncStorage.getItem('id_customer');
            let resp = await ApiService.makeRequest({"entity":"turnCustomer", "action":"list_app_customer","id":id_customer, "date":data}, {});
            var TotalItem = {};
            //salvo i dati nello state del componente
            Object.keys(resp['dates']).forEach(function(obj){
                Object.keys(resp['dates'][obj]).forEach(function(appointment) {
                    TotalItem[obj] = [];
                    resp['dates'][obj][appointment].map((v,i) => {
                        //console.log(v['courts_turn'][0]['court_data']['court_name']);
                        //if(v.length > 0) {
                        TotalItem[obj][i] = {};
                        TotalItem[obj][i].name = "Appuntamento in data "+ obj;
                        TotalItem[obj][i].height = 100;
                        TotalItem[obj][i].key = obj;
                        TotalItem[obj][i].date = obj;
                        /*TotalItem[obj].push ({
                            name: "Appuntamento in data "+ obj + " con id "+ v['appointment_id']+"_"+i,
                            height: 100,
                            key: obj,
                            date: obj,
                        });*/
                        //qui costruisco i turni nei campi se ci sono
                        if (typeof v['courts_turn'][0] != "undefined") {
                            TotalItem[obj][i].start = v['courts_turn'][0]['court_turn_data']['starting_time'];
                            TotalItem[obj][i].end = v['courts_turn'][0]['court_turn_data']['ending_time'];
                            TotalItem[obj][i].court = v['courts_turn'][0]['court_data']['court_name'];
                            TotalItem[obj][i].playsight = v['courts_turn'][0]['court_data']['court_attributes']['playsight'];
                            TotalItem[obj][i].indoor = v['courts_turn'][0]['court_data']['court_attributes']['indoor'];
                            TotalItem[obj][i].partecipant_list = {
                                teachers: [],
                                athletes: []
                            }
                            Object.keys(v['courts_turn'][0]['partecipant_list']).forEach(function(type) {
                                if(type == 'teachers' && v['courts_turn'][0]['partecipant_list'][type].length > 0) { //aggiungo i maestri
                                    v['courts_turn'][0]['partecipant_list'][type].map((tval, tindex) =>{
                                        //console.log(typeof teachers_arr[tindex]);
                                        if(typeof tindex != 'undefined') {
                                            TotalItem[obj][i].partecipant_list.teachers[tindex] = {};
                                            TotalItem[obj][i].partecipant_list.teachers[tindex].name = tval.name;
                                            TotalItem[obj][i].partecipant_list.teachers[tindex].surname = tval.surname;
                                        }
                                    })
                                }
                                else { //aggiungo i partecipanti
                                    if(v['courts_turn'][0]['partecipant_list'][type].length > 0) {
                                        v['courts_turn'][0]['partecipant_list'][type].map((aval, aindex) =>{
                                            //console.log(typeof athletes_arr[aindex]);
                                            if(typeof aindex != 'undefined') {
                                                TotalItem[obj][i].partecipant_list.athletes[aindex] = {};
                                                TotalItem[obj][i].partecipant_list.athletes[aindex].name = aval.name;
                                                TotalItem[obj][i].partecipant_list.athletes[aindex].surname = aval.surname;
                                            }
                                        })
                                    }
                                }
                            })
                        }
                        else { //costruisco array vuoti perchè mi torna comodo quando vado a fare il render nella view
                            TotalItem[obj][i].start = "";
                            TotalItem[obj][i].end = "";
                            TotalItem[obj][i].court = "";
                            TotalItem[obj][i].playsight = "";
                            TotalItem[obj][i].indoor = "";
                            TotalItem[obj][i].partecipant_list = {
                                teachers: [],
                                athletes: []
                            };
                        }

                        //qui costruisco i tornei se ci sono
                        if (typeof v['competition_data'].name != 'undefined') {
                            TotalItem[obj][i].competition_name = v['competition_data']['name'];
                            TotalItem[obj][i].competition_state = v['competition_data']['state'];

                        }

                        //qui vado a controllare che non ci siano turni nei campi nè competizioni, allora diventa un appuntamento generico di mezza giornata o intera giornata
                        
                        if(v['courts_turn'].length == 0 && v['competition_data'].length == 0) {
                            TotalItem[obj][i].generic = v['appointment_data']['value'];
                        }
                    })
                });
            });
            items = TotalItem;
            //dopodichè li salvo in locale
            this.saveItems(items);
            return items;
        }
        catch(e) {
            console.log(e);
        };
    }


    static saveItems = async(items) => {
        try {
            let itemString = JSON.stringify(items);
            await AsyncStorage.removeItem('calendarItems');
            await AsyncStorage.setItem('calendarItems', itemString);
            //let pippo = await AsyncStorage.getItem('calendarItems');
        }
        catch(error) {
            alert(error);
        }
 	}

}