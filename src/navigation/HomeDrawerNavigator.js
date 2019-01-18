import React, { Component } from 'react';
import {} from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import HomePostsScreen from '../screens/HomePostsScreen';
import GoogleMapcreen from '../screens/GoogleMapScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import HomeDrawer from '../screens/HomeDrawer';

export const HomeDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomePostsScreen,
      navigationOptions: {
        title: 'Posts',
      },
    },
    GoogleMap: { screen: GoogleMapcreen },
    CreatePost: { screen: CreatePostScreen },
  },
  {
    drawerWidth: 300,
    navigationOptions: {
      headerBackground: '#8E6F37',
    },
    contentComponent: HomeDrawer,
    header: null,
  }
);
