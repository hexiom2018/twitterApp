import React,{Component} from 'react';
import {View,WebView,SafeAreaView} from 'react-native';


export default class AboutUs extends Component{

    render(){
        return (
            <SafeAreaView style={[{flex:1}]}>
               <WebView 
               source={{uri: 'https://www.yahoo.com'}}
               style={{marginTop: 20}}
               /> 
            </SafeAreaView>
        )
    }
}