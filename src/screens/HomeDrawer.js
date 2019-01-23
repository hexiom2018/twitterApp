import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Clipboard, SafeAreaView } from 'react-native';
import { DrawerItems, StackActions, NavigationActions } from 'react-navigation';
import { View } from 'native-base';
import firebase from "firebase";
import { connect } from "react-redux";


class HomeDrawer extends Component {
    logout() {
        firebase.auth().signOut()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Register' }),
            ]
        })
        this.props.navigation.dispatch(resetAction)
        this.props.logout()

    }

    render() {

        return (

            <View style={styles.container}>
                <DrawerItems {...this.props} />
                <View style={styles.settingsContainer}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('ContactUs') }}>
                        <Text style={styles.itemText}>Contact us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('AboutUs') }}>
                        <Text style={styles.itemText}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Privacy') }}>
                        <Text style={styles.itemText}>Privacy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { Clipboard.setString('https://www.live.com') }}>
                        <Text style={styles.itemText}>Rate us!!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()}>
                        <Text style={[styles.itemText, { color: 'red' }]}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}


const mapDispatchToProps = dispatch => {
    return { logout: () => dispatch({ type: "LOG_OUT" }) };
};

export default connect(() => { return {} }, mapDispatchToProps)(HomeDrawer);
 const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 24,
    },
    settingsContainer: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        // top: 25,
        // paddingTop: 140,
        paddingLeft: 18,
        justifyContent:'center',
        textAlign:'center'
    },
    itemText: {
        fontWeight: 'bold',
        fontSize: 14,
        marginTop: 6
    },
 })