import React, {Component} from 'react';
import {
  NavigationActions,
  createAppContainer,
  StackActions,
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from 'react-navigation-drawer';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from '../features/SplashScreen';
import SideMenu from './sideMenu';
//@BlueprintImportInsertion
import MessengerNavigator from '../features/Messenger/navigator';
import TutorialNavigator from '../features/Tutorial/navigator';
import CameraNavigator from '../features/Camera/navigator';
import EmailAuthNavigator from '../features/EmailAuth/navigator';
import ProfilePage from '../features/ProfilePage';
import FollowPage from '../features/FollowPage';
import ChangePassword from '../features/ChangePassword';
import TermsAndConditions from '../features/EmailAuth/TermsAndConditions';
import EditProfile from '../features/EditProfile';
import DrawerComponent from './DrawerComponent';
import HomePage from '../features/HomePage';
import SearchPage from '../features/SearchPage';
import CommentsPage from '../features/CommentsPage';
import HashTagHomePage from '../features/HashTagHomePage';
import CreatePostStep1 from '../features/CreatePost/CreatePostStep1';
import CreatePostStep2 from '../features/CreatePost/CreatePostStep2';
import CreatePostStep3 from '../features/CreatePost/CreatePostStep3';
import PreviewPost from '../features/CreatePost/PreviewPost';
import MyPosts from '../features/MyPosts';
import Chat from '../features/Message/Chat';
import Inbox from '../features/Message/Inbox';
import PreviewVideoMessage from '../features/Message/PreviewVideoMessage';

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
  // Camera: { screen: CameraNavigator },
  EmailAuth: {screen: EmailAuthNavigator},
  /** new navigators can be added here */
};

const EmailAuthStackNavigator = createStackNavigator(
  {
    ...AppNavigator,
  },
  {
    initialRouteName: 'EmailAuth',
  },
);

const HomeAuthStackNavigator = createStackNavigator(
  {
    ...AppNavigator,
    HomePage: {
      screen: HomePage,
      navigationOptions: {
        gesturesEnabled: false,
      },
    },
    SearchPage: {screen: SearchPage},
    HashTagHomePage: {screen: HashTagHomePage},
    CommentsPage: {screen: CommentsPage},
    Chat: {
      screen: Chat,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    Inbox: {
      screen: Inbox,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    PreviewVideoMessage: {
      screen: PreviewVideoMessage,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
  },
  {
    initialRouteName: 'EmailAuth',
  },
);

const commonNavigator = {
  ProfilePage: {
    screen: ProfilePage,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  FollowPage: {
    screen: FollowPage,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  MyPosts: {
    screen: MyPosts,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  MyPostsCommentsPage: {
    screen: CommentsPage,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  ChangePasswordPage: {
    screen: ChangePassword,
    navigationOptions: {
      drawerLabel: 'Change Password',
      drawerIcon: () => (
        <Image
          source={require('../assets/images/small_lock.png')}
          resizeMode="contain"
          style={{width: 20, height: 22, tintColor: '#111111'}}
        />
      ),
    },
  },
  EditProfilePage: {
    screen: EditProfile,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  TermsAndConditionsPage: {
    screen: TermsAndConditions,
    navigationOptions: {
      drawerLabel: 'Terms & Conditions',
      drawerIcon: () => <IconFA5 name="file-alt" size={25} color={'#111111'} />,
    },
  },
  ChatProfile: {
    screen: Chat,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
};

const DrawerAppNavigator = createDrawerNavigator(
  {
    ...commonNavigator,
  },
  {
    initialRouteName: 'ProfilePage',
    drawerPosition: 'right',
    // contentOptions: {
    //   style: {
    //     backgroundColor: 'black',
    //     flex: 1,
    //   },
    // },

    drawerType: 'slide',
    drawerStyle: {
      style: {
        backgroundColor: 'black',
        flex: 1,
      },
      backgroundColor: 'black',
    },
    contentComponent: DrawerComponent,
    contentOptions: {
      backgroundColor: 'black',
      flex: 1,
      ...this.props,
    },
  },
);

const PostNavigator = {
  CreatePostStep1: {
    screen: CreatePostStep1,
  },
  CreatePostStep2: {
    screen: CreatePostStep2,
  },
  CreatePostStep3: {
    screen: CreatePostStep3,
  },
  PreviewPost: {
    screen: PreviewPost,
  },
};

const CreatePostNavigator = createStackNavigator(
  {
    ...PostNavigator,
  },
  {
    initialRouteName: 'CreatePostStep1',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarOnPress: ({navigation, defaultHandler}) => {
        // to navigate to the top of stack whenever tab changes
        navigation.dispatch(StackActions.popToTop());
        defaultHandler();
      },
    }),
  },
);

const LoggedInBottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeAuthStackNavigator,
      navigationOptions: ({navigation}) => {
        return {
          tabBarVisible: navigation.state.index === 1 ? true : false,
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/home_small.png')}
              style={focused ? focusedHomeImageStyle : homeImageStyle}
            />
          ),
        };
      },
    },
    Location: {
      screen: EmailAuthStackNavigator,
      navigationOptions: ({navigation}) => ({
        tabBarVisible: false,
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
      screen: CreatePostNavigator,
      navigationOptions: ({navigation}) => ({
        tabBarVisible: false,
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
      screen: EmailAuthStackNavigator,
      navigationOptions: ({navigation}) => ({
        tabBarVisible: false,
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
      navigationOptions: ({navigation}) => {
        return {
          tabBarVisible: navigation.state.index === 0 ? true : false,
          title: '',
          tabBarIcon: ({focused}) => (
            <Image
              source={require('../assets/images/profile_small.png')}
              style={focused ? focusedHomeImageStyle : homeImageStyle}
            />
          ),
        };
      },
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
