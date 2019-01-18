import React,{Component} from 'react';
import {View,WebView} from 'react-native';


export default class PrivacyPolicy extends Component{

    render(){
        return (
            <View style={[{flex:1}]}>
               <WebView 
               source={{uri: 'https://www.google.com'}}
               style={{marginTop: 20}}
               /> 
            </View>
        )
    }
}