import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import Expo from 'expo';
import { withNavigation } from 'react-navigation';
import { loginWithFacebook } from '../actions/FacebookSignInAction';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
class GoogleSignInButton extends Component {


    signIn = () => {
        this.props.loginWithFacebook()
    }

    render() {
        return (

            <Button iconLeft onPress={this.signIn} block >
                <Icon name='logo-facebook' style={{ color: "#3d538d" }} />
                <Text style={{ color: "#3d538d" }}>Register with Facebook</Text>
            </Button>

        )
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapActionsToProps = (dispatch) => {
    return bindActionCreators({ loginWithFacebook }, dispatch)
}

export default connect(mapStateToProps, mapActionsToProps)(GoogleSignInButton)