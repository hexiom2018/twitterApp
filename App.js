import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createStore, applyMiddleware, } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { Root, StyleProvider } from 'native-base';
import { AppLoading, Asset, Font, Permissions} from 'expo';
import { AppHomeStackNavigator, middleware, HomeStackNavigator } from './src/navigation/HomeStackNavigator';
import reducers from './src/reducers';
import getTheme from './native-base-theme/components';
import commonColor from './native-base-theme/variables/commonColor';
const store = createStore(reducers, applyMiddleware(thunk))
import firebase from './src/api/Firebase';

console.disableYellowBox = true;

export default class App extends React.Component {


  constructor() {
    super()
    this.state = {
      isReady: false
    }
  }


  async componentWillMount() {
    await this._loadFonts()
    const { status } = Permissions.askAsync(Permissions.CAMERA_ROLL);

    //   firebase.auth().onAuthStateChanged((user) => {
    //     if (user) {
    //       console.log('user is logged');
    //     }
    // })
    let unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.dispatch({ type: 'SIGNED_IN', data: { user } })

      } else {
        store.dispatch({ type: 'NO_SIGNED_IN', })
      }
      unsubscribe()
    })
    this.setState({ isReady: true })
  }

  async _loadAssetsAsync() {
    return Promise.all([this._loadFonts()])
  }

  async _loadFonts() {
    return Font.loadAsync({

      Roboto: require('./assets/Fonts/Roboto.ttf'),
      FontAwesome: require('./assets/Fonts/FontAwesome.ttf'),
      Roboto_medium: require('./assets/Fonts/Roboto_medium.ttf'),
      Entypo: require('./assets/Fonts/Entypo.ttf'),
      EvilIcons: require('./assets/Fonts/EvilIcons.ttf'),
      Foundation: require('./assets/Fonts/Foundation.ttf'),
      Ionicons: require('./assets/Fonts/Ionicons.ttf'),
      Entypo: require('./assets/Fonts/Entypo.ttf'),
      //MaterialCommunityIcons.ttf
      MaterialCommunityIcons: require('./assets/Fonts/MaterialCommunityIcons.ttf'),
      //MaterialIcons.ttf
      MaterialIcons: require('./assets/Fonts/MaterialIcons.ttf'),
      //MaterialIcons.ttf
      MaterialIcons: require('./assets/Fonts/MaterialIcons.ttf'),
      //Octicons.ttf
      Octicons: require('./assets/Fonts/Octicons.ttf'),
      //rubicon-icon-font.ttf
      'rubicon-icon-font': require('./assets/Fonts/rubicon-icon-font.ttf'),
      //SimpleLineIcons.ttf
      'SimpleLineIcons': require('./assets/Fonts/SimpleLineIcons.ttf'),
      //Zocial.ttf
      'Zocial': require('./assets/Fonts/Zocial.ttf'),
    })
  }

  async _loadImages() {

  }
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading

        />
      );
    } else {
      return (
        <Provider store={store}>
          <StyleProvider style={getTheme(commonColor)}>
            <Root>
              <SafeAreaView style={{ flex: 1, }}>
                <HomeStackNavigator />
              </SafeAreaView>
            </Root>
          </StyleProvider>
        </Provider>
      );
    }
  }
}

