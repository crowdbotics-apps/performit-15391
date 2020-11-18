import React, {Component} from 'react';
import {
  NavigationActions,
  createAppContainer,
  StackActions,
} from 'react-navigation';
import {connect} from 'react-redux';
import {get} from 'lodash';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import * as NavigationService from '../navigator/NavigationService';
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
import MyNotifications from '../features/MyNotifications';
import GroupsList from '../features/Groups/GroupsList';
import CreateGroup from '../features/Groups/CreateGroup';
import InviteFriends from '../features/Groups/InviteFriends';
import GroupsDescription from '../features/Groups/GroupsDescription';
import Location from '../features/Location';

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


const HomeAuthStackNavigator = (isLoggedIn = false) => {
  return createStackNavigator(
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
    initialRouteName: isLoggedIn ?  'HomePage' : 'EmailAuth',
  },
)};

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
  GroupsListPage: {
    screen: GroupsList,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  CreateGroupPage: {
    screen: CreateGroup,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  InviteFriendsPage: {
    screen: InviteFriends,
    navigationOptions: {
      drawerLabel: () => null,
    },
  },
  GroupsDescriptionPage: {
    screen: GroupsDescription,
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

const NotificationPagesNavigator = {
  MyNotifications: {
    screen: MyNotifications,
  },
};

const NotificationNavigator = createStackNavigator(
  {
    ...NotificationPagesNavigator,
  },
  {
    initialRouteName: 'MyNotifications',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarOnPress: ({navigation, defaultHandler}) => {
        // to navigate to the top of stack whenever tab changes
        navigation.dispatch(StackActions.popToTop());
        defaultHandler();
      },
    }),
  },
);

const LocationPagesNavigator = {
  LocationPage: {
    screen: Location,
  },
};

const LocationNavigator = createStackNavigator(
  {
    ...LocationPagesNavigator,
  },
  {
    initialRouteName: 'LocationPage',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarOnPress: ({navigation, defaultHandler}) => {
        // to navigate to the top of stack whenever tab changes
        navigation.dispatch(StackActions.popToTop());
        defaultHandler();
      },
    }),
  },
);

const LoggedInBottomTabNavigator = (isLoggedIn = false) => {
  return createBottomTabNavigator(
  {
    Home: {
      screen: HomeAuthStackNavigator(isLoggedIn),
      navigationOptions: ({navigation}) => {
        return {
          tabBarVisible: isLoggedIn ? true : false,
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
      screen: LocationNavigator,
      navigationOptions: ({navigation}) => ({
        tabBarVisible: true,
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
      screen: NotificationNavigator,
      navigationOptions: ({screenProps }) => { 
        console.log('---------------------------screenProps', screenProps)
        const unReadNotifications = screenProps && screenProps.notificationsLists && screenProps.notificationsLists.data
        && screenProps.notificationsLists.data.length > 0 && screenProps.notificationsLists.data.filter(elem => !elem.is_read)
        console.log('------------------unReadNotifications', unReadNotifications)
        return ({
        tabBarVisible: true,
        title: null,
        tabBarIcon: ({focused}) => (
          <View style={{
            width: 24,
            height: 24,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image
              source={require('../assets/images/notifications_small.png')}
              style={focused ? focusedImageStyle : imageStyle}
            />
            {unReadNotifications && unReadNotifications.length > 0 && <View style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#FC573B',
              position: 'absolute',
              top: -8,
              right: -5,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                color: '#ffffff',
                fontSize: 12,
                fontFamily: 'Nunito',
                fontWeight: 'normal',
              }}>
                {unReadNotifications.length}
              </Text>
            </View>}
          </View>
        ),
      })
    },
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
)};

// const AppContainer = createAppContainer(LoggedInBottomTabNavigator);

class Routes extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     notificationsLists: []
  //   };
  // }

  componentDidMount() {
    // messaging().onMessage(message => {
    // // Alert.alert(message);
    // });
    NavigationService.setNavigator(this.navigator);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.token && !this.props.token) {
      return true;
    }

    if (!nextProps.token && this.props.token) {
      return true;
    }

  //   const prevUnReadNotifications = this.props.notificationsLists && this.props.notificationsLists.data
  // && this.props.notificationsLists.data.length > 0 && this.props.notificationsLists.data.filter(elem => !elem.is_read)
  // console.log('-----------------------should update prevUnReadNotifications', prevUnReadNotifications)

  // const currentUnReadNotifications = nextProps.notificationsLists && nextProps.notificationsLists.data
  // && nextProps.notificationsLists.data.length > 0 && nextProps.notificationsLists.data.filter(elem => !elem.is_read)

  // console.log('-----------------------should update currentUnReadNotifications', currentUnReadNotifications)

  // if(prevUnReadNotifications && currentUnReadNotifications &&
  //   prevUnReadNotifications.length !== currentUnReadNotifications.length){
  //   this.setState({
  //       notificationsLists: nextProps.notificationsLists
  //     })
  //   return true
  // }

    return false;
  }

  render() {
    const AppContainer = createAppContainer(LoggedInBottomTabNavigator(!!this.props.token));
    return (
        <AppContainer screenProps={{ notificationsLists: this.props.notificationsLists }} ref={nav => { this.navigator = nav;}}>
        </AppContainer>
    );
  }
}

export default connect(state => ({
  token: get(state, 'EmailAuth.accessToken', false),
  notificationsLists: get(state, 'Profile.notificationsLists', {})
}))(Routes);
