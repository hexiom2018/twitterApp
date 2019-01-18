import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, Clipboard, SafeAreaView } from 'react-native';
import { DrawerItems } from 'react-navigation';
import { View } from 'native-base';
import firebase from "firebase";
import { connect } from "react-redux";


class HomeDrawer extends Component {


    render() {

        return (

            <View style={styles.container}>
                <DrawerItems {...this.props} />
                <View style={styles.settingsContainer}>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('ContactUs') }}>
                        <Text style={styles.itemText}>contact us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('AboutUs') }}>
                        <Text style={styles.itemText}>about</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Privacy') }}>
                        <Text style={styles.itemText}>privacy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { Clipboard.setString('https://www.live.com') }}>
                        <Text style={styles.itemText}>Rate us!!</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { firebase.auth().signOut(); this.props.logout() }}>
                        <Text style={[styles.itemText, { color: "#fff" }]}>Log Out</Text>
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
        paddingTop: 24,
    },
    settingsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    itemText: {
        fontWeight: 'bold',
        fontSize: 16,
    },

})