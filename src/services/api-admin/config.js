/**
 * Created by lmagni on 07/01/2019.
 */
import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeybordAvoidingView, AsyncStorage, } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import { Constants } from 'expo';

export class ApiService {

    //qui devo costruire una funzione che posso pescare in tutto il progetto e che mi permetta di fare le richieste alle api
    static makeRequest(
        params:any={"entity":"","action":"","id":"","date":"","lang":""},
        regbody:any=null,
        method="POST"
    ) {
        let correctUrl= this.constructUrlFromParams(params);
        var formBody = [];        
        for (var property in regbody) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(regbody[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        return fetch(correctUrl, {
            method: method,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formBody
        })
            .then((response)=>response.json())
            .then((responseJson)=>{return responseJson})
            .catch((error)=>{return error})
    }

    //qui costruisco il percorso all'API
    static constructUrlFromParams(params:any) {
        let baseUrl="http://planner.piattitenniscenter.soft-net.it/";
        //todo bisogna che vada inserendo l'url nell'app.json
        //let baseUrl=Constants.manifest.extra;

        let realpath = "";

        realpath = baseUrl + params.entity;
        if (params.action)
            realpath += "/" + params.action;

        if (params.id)
            realpath += "/" + params.id;

        if (params.date)
            realpath += "/" + params.date;

        if (params.lang)
            realpath += "/" + params.lang;
        
        return realpath;
    }

    //qui serializzo i parametri da passare TODO DA SISTEMARE
    /*static urlencode(regbody) {
        let params = '';
        if (regbody) {
            for (var param in regbody) {
                let paramToset=regbody[param];
                if(typeof paramToset == "undefined")
                    paramToset="";
                if(typeof paramToset == "object")
                    paramToset=JSON.stringify(paramToset);
                params.set(param, paramToset);
            }
        }
        return params;
    }*/
}
export default ApiService;