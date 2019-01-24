import React, { Component } from "react";
import { StyleSheet, Image, ActivityIndicator, Dimensions, Button, TextInput } from "react-native";
import { Container, Text, View, H1, Content } from "native-base";
import firebase from '../api/Firebase';
import Registration from "../component/Registration";
import GoogleSignIn from "../component/GoogleSignIn";
import FacebookSignIn from "../component/FacbookSignIn";
import LocationPermissions from "./LocationPermissions";
import SubmitRegistration from '../component/SubmitRegistration';
import { } from "redux";
import { connect } from "react-redux";
import { Linking, WebBrowser } from 'expo'

const captchaUrl = `https://my-firebase-hosting/captcha-page.html?appurl=${Linking.makeUrl('6LfJaYwUAAAAABTG-6HNeoWwIcvwn1yspWSS68Ms')}`


const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
class RegistrationScreen extends Component {


  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '+',
      confirmResult: null,
    };
  }


  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '+',
          confirmResult: null,
        });
      }
    });
    // grecaptcha.ready(function() {
    //   grecaptcha.execute('6LfJaYwUAAAAABTG-6HNeoWwIcvwn1yspWSS68Ms', {action: 'action_name'})
    //   .then(function(token) {
    //   // Verify the token on the server.
    //   console.log("toekn=>>>",token)
    //   });
    //   })
  }
  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {

    // const { phoneNumber } = this.state;
    // var appVerifier = window.recaptchaVerifier;
    // this.setState({ message: 'Sending code ...' });
    // firebase.auth().signInWithPhoneNumber(phoneNumber , appVerifier)
    //   .then(confirmResult =>
    //     console.log(confirmResult , 'jsdhjsdhjhds')
        
    //     //  this.setState({ confirmResult, message: 'Code has been sent!' })
    //      )
    //   .catch(error =>
    //     console.log('===>>>' , error)
    //     //  this.setState({ message: `Sign In With Phone Number Error: ${error.message}` })
    //      );

      // ye kam kya tha lekin ho nh rha
      
    var token = null
    const listener = ({ url }) => {
      WebBrowser.dismissBrowser()
      const tokenEncoded = Linking.parse(url).queryParams['token']
      if (tokenEncoded)
        token = decodeURIComponent(tokenEncoded)
    }
    Linking.addEventListener('url', listener)
     WebBrowser.openBrowserAsync(captchaUrl)
    Linking.removeEventListener('url', listener)
    const { phoneNumber } = this.state;
    this.setState({ message: 'Sending code ...' });
    console.log('token==>', token);

    if (token) {

      const captchaVerifier = {
        type: 'recaptcha',
        verify: () => Promise.resolve(token)
      }

      firebase.auth().signInWithPhoneNumber(phoneNumber, captchaVerifier)
        .then(confirmResult =>
          console.log('conform result==', confirmResult)
          // this.setState({ confirmResult, message: 'Code has been sent!' })
        )
        .catch(error =>
          console.log('error==', error)
          //  this.setState({ message: `Sign In With Phone Number Error: ${error.message}` })
        );
    }
  };




  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }
  static navigationOptions = {
    title: "registration",
    header: null
  };
  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text>Enter phone number:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Phone number ... '}
          value={phoneNumber}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Code ... '}
          value={codeInput}
        />
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }
  render() {
    const { user, confirmResult } = this.state;


    if (this.props.userInfo.user) {
      setTimeout(() => {
        this.props.navigation.replace("HomeDrawer");
      }, 100);
    }
    var { height } = Dimensions.get('window');
    height -= 20;
    return (
      <Container style={styles.container} >
        <Content  >
          <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
            {!this.props.userInfo.isChecked && (
              <View
                style={[
                  {
                    backgroundColor: "rgba(52, 52, 52, 0.5)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: "center",
                    justifyContent: "center"
                  }
                ]}
              >
                <ActivityIndicator size="large" color="#4517FF" />
              </View>
            )}
            <View style={{ width: "95%", height: '65%', justifyContent: 'center' }}>
              <H1 style={[{ alignSelf: 'center', width: '100%', textAlign: 'center' }]}>Register</H1>
              <Registration navigation={this.props.navigation} />
            </View>
            <View style={{ height: '35%', width: "95%", justifyContent: 'space-around', alignItems: 'center' }}>


              <View style={{ width: "80%" }}>
                <SubmitRegistration />
              </View>
              <View
                style={[
                  { flexDirection: "row", width: "80%", alignItems: "center", marginHorizontal: 10 }
                ]}
              >
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: "white",
                      flex: 1,
                      height: 1,
                      alignSelf: "center"
                    }
                  ]}
                />

                <Text> OR </Text>
                <View
                  style={[
                    {
                      borderWidth: 1,
                      borderColor: "white",
                      flex: 1,
                      height: 1,
                      alignSelf: "center"
                    }
                  ]}
                />
              </View>
              <View style={{ width: "80%" }}>
                <FacebookSignIn />
              </View>
              <View style={{ width: "80%" }}>
                <GoogleSignIn />
              </View>
              {/* <View /> */}
            </View>
          </View>

          <View style={{ flex: 1 }}>

            {!user && !confirmResult && this.renderPhoneNumberInput()}

            {this.renderMessage()}

            {!user && confirmResult && this.renderVerificationCodeInput()}

            {user && (
              <View
                style={{
                  padding: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#77dd77',
                  flex: 1,
                }}
              >
                <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
                <Text style={{ fontSize: 25 }}>Signed In!</Text>
                <Text>{JSON.stringify(user)}</Text>
                <Button title="Sign Out" color="red" onPress={this.signOut} />
              </View>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#390D9E",

  }
});

const mapStateToProps = state => {
  return {
    userInfo: state.userInfo
  };
};
export default connect(mapStateToProps)(RegistrationScreen);
