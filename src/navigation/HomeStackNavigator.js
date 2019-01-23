import React, {Component} from 'react';
import {} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import {connect} from 'react-redux';
import {reduxifyNavigator,createReactNavigationReduxMiddleware,createNavigationReducer} from 'react-navigation-redux-helpers';
import RegistrationScreen from '../screens/RegistrationScreen';
import {HomeDrawerNavigator} from './HomeDrawerNavigator';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import SearchPostsScreen from '../screens/SearchPosts';
import firebase from '../api/Firebase';
import ContactUs from '../screens/ContactsUs';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import AboutUs from '../screens/AboutUs';
const HomeStackNavigator = createStackNavigator({Register:{screen:RegistrationScreen},
                                                HomeDrawer:{screen:HomeDrawerNavigator},
                                                PostDetails:{screen:PostDetailsScreen},
                                            SearchPosts:{screen:SearchPostsScreen},
                                               ContactUs:{screen:ContactUs},
                                                Privacy:{screen:PrivacyPolicy},
                                                AboutUs:{screen:AboutUs}, 
                                            },
                                                {
                                                    navigationOptions:{
                                                        header:null,    
                                                    },
                                                    initialRouteName:firebase.auth().currentUser?'HomeDrawer':undefined,
                                                })

const navReducer = createNavigationReducer(HomeStackNavigator)
const middleware = createReactNavigationReduxMiddleware('root',state =>state.nav)


const HomeStackWithNavigatorState = reduxifyNavigator(HomeStackNavigator,'root')

const mapStateToProps =  state => ({state:state.nav})


const AppHomeStackNavigator = connect(mapStateToProps)(HomeStackWithNavigatorState)

export {middleware,AppHomeStackNavigator,HomeStackNavigator,navReducer}