import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {createDrawerNavigator} from 'react-navigation-drawer';

import SplashScreen from '../features/SplashScreen';
import SideMenu from './sideMenu';
//@BlueprintImportInsertion
import MessengerNavigator from '../features/Messenger/navigator';
import TutorialNavigator from '../features/Tutorial/navigator';
import MapsNavigator from '../features/Maps/navigator';
import CalendarNavigator from '../features/Calendar/navigator';
import CameraNavigator from '../features/Camera/navigator';
import EmailAuthNavigator from '../features/EmailAuth/navigator';
import ProfilePage from '../features/ProfilePage';
import FollowPage from '../features/FollowPage';

/**
 * new navigators can be imported here
 */

const homeImageStyle = {
  width: 20,
  height: 22,
  tintColor: '#ffffff',
};
const focusedHomeImageStyle = {
  width: 20,
  height: 22,
  tintColor: '#b88746',
};

const locationImageStyle = {
  width: 20,
  height: 24,
  tintColor: '#ffffff',
};
const focusedLocationImageStyle = {
  width: 20,
  height: 24,
  tintColor: '#b88746',
};

const imageStyle = {
  width: 22,
  height: 22,
  tintColor: '#ffffff',
};
const focusedImageStyle = {
  width: 22,
  height: 22,
  tintColor: '#b88746',
};

const AppNavigator = {
  SplashScreen: {
    screen: SplashScreen,
  },
  //@BlueprintNavigationInsertion
  // Messenger: { screen: MessengerNavigator },
  // Tutorial: { screen: TutorialNavigator },
  // Maps: { screen: MapsNavigator },
  // Calendar: { screen: CalendarNavigator },
  // Camera: { screen: CameraNavigator },
  EmailAuth: {screen: EmailAuthNavigator},

  /** new navigators can be added here */
};

const DrawerAppNavigator = createStackNavigator(
  {
    ...AppNavigator,
    ProfilePage: {
      screen: ProfilePage,
    },
    FollowPage: {
      screen: FollowPage,
    },
  },
  {
    initialRouteName: 'EmailAuth',
  },
);

const LoggedInBottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: DrawerAppNavigator,
      navigationOptions: ({navigation}) => ({
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../assets/images/home_small.png')}
            style={focused ? focusedHomeImageStyle : homeImageStyle}
          />
        ),
      }),
    },
    Location: {
      screen: DrawerAppNavigator,
      navigationOptions: ({navigation}) => ({
        title: null,
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../assets/images/location_small.png')}
            style={focused ? focusedLocationImageStyle : locationImageStyle}
          />
        ),
      }),
    },
    CreatePost: {
      screen: DrawerAppNavigator,
      navigationOptions: ({navigation}) => ({
        title: null,
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../assets/images/create_post_small.png')}
            style={focused ? focusedImageStyle : imageStyle}
          />
        ),
      }),
    },
    Notifications: {
      screen: DrawerAppNavigator,
      navigationOptions: ({navigation}) => ({
        title: null,
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../assets/images/notifications_small.png')}
            style={focused ? focusedImageStyle : imageStyle}
          />
        ),
      }),
    },
    Profile: {
      screen: DrawerAppNavigator,
      navigationOptions: ({navigation}) => ({
        title: '',
        tabBarIcon: ({focused}) => (
          <Image
            source={require('../assets/images/profile_small.png')}
            style={focused ? focusedHomeImageStyle : homeImageStyle}
          />
        ),
      }),
    },
  },
  {
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#b88746',
      inactiveTintColor: '#ffffff',
      labelStyle: {
        fontSize: 10,
      },
      allowFontScaling: false,
      style: {
        backgroundColor: '#111111',
      },
      showLabel: false,
    },
  },
);

const AppContainer = createAppContainer(LoggedInBottomTabNavigator);

export default AppContainer;
