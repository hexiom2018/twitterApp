import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text, Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase from '../api/Firebase';
import { connect } from 'react-redux';
import Expo from 'expo';
import { bindActionCreators } from 'redux';
import { loginWithGoogle } from '../actions/GoogleSignInAction';
class GoogleSignInButton extends Component {


    signIn = async () => {

        this.props.loginWithGoogle()

    }

    render() {

        return (

            <Button iconLeft onPress={this.signIn} block >
                <Icon name='logo-googleplus' style={{ color: "#c42d29" }} />
                <Text style={{ color: "#c42d29" }}>Register with google+</Text>
            </Button>

        )
    }
}


const mapStateToProps = (state) => ({ userInfo: state.userInfo })
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loginWithGoogle }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(GoogleSignInButton))