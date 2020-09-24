import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {styles} from './styles';
import * as homeActions from '../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../utils/scale';
import * as profileActions from '../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import VideoPlayer from '../components/VideoPlayer';
import { withNavigationFocus } from "react-navigation";

class MyNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'following',
      newComment: '',
      currentTime: 0,
      paused: true,
      progress: 0,
      duration: 0,
      seekTime: -1,
      showControls: false,
      postsData: [],
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // write code here
    const {
      actions: {getNotificationsList},
      accessToken,
    } = this.props;
    if (accessToken) {
      await getNotificationsList(accessToken);
    }
  }

  async componentDidUpdate(prevProps) {
    // write code here
    if (prevProps.isFocused !== this.props.isFocused) {
      console.log("--------------did focus")
      const {
        actions: {getNotificationsList},
        accessToken,
      } = this.props;
      if (accessToken) {
        await getNotificationsList(accessToken);
      }
    }
  }

  onNotificationClick = async (notification) => {
     const {
        actions: {getNotificationsList, readNotification, acceptGroupJoin, acceptGroupInvite},
        accessToken,
      } = this.props;

      if (accessToken) {
        console.log('-----------------------notification && notification.id', notification && notification.id)
        console.log('-----------------------notification && notification.notification_type', notification && notification.notification_type)
        console.log('-----------------------notification && notification.request', notification && notification.request)
        console.log('-----------------------notification && notification.invite', notification && notification.invite)
        console.log('---------------true or false', notification.notification_type === "Group Joining Request")
        if(notification && !notification.is_read)
        await readNotification(notification && notification.id, accessToken);
        if(notification && notification.notification_type === "Group Joining Request"){
            console.log('-------------------- 0000000000', notification)
            if(notification.request){
              await acceptGroupJoin(notification && notification.request, accessToken);
              Toast.show('Joining group request accepted');
            }
            if(notification.invite){
              await acceptGroupInvite(notification && notification.invite, accessToken);
             Toast.show('Inivitation to group accepted');
            }
            
        }
        await getNotificationsList(accessToken);
      }
  }

  render() {
    const {profile: allProfiles, posts, navigation, commentsList, notificationsLists} = this.props;
    let {postsData, userId} = this.state;
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const profile = allProfiles && allProfiles[`${userId}`];
    let notifications =  []
    if(notificationsLists && notificationsLists.data && notificationsLists.data.length > 0 )
      notifications = notificationsLists && notificationsLists.data

    if(notifications && notifications.length > 0 ){
      notifications.sort((item1, item2) => {
          const keyA = new Date(item1.created_at),
            keyB = new Date(item2.created_at);
          // Compare the 2 dates
          if (keyA < keyB) {
            return -1;
          }
          if (keyA > keyB) {
            return 1;
          }
          return 0;
        });
        notifications.reverse();
    }
    console.log('-------------------this.props.notificationsLists', notifications)

    return (
      <ScrollView
          contentContainerStyle={styles.screen}
          keyboardShouldPersistTaps={'handled'}
          style={{backgroundColor: 'black'}}>
          <SafeAreaView style={styles.headerContainer}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Notifications</Text>
            </View>
          </SafeAreaView>
          {!this.state.isLoading && notifications && notifications.length > 0 &&
            notifications.map(notification => (
              <TouchableOpacity 
              onPress={() => this.onNotificationClick(notification)}
              style={styles.followProfileRowContainer}>
              <View style={styles.followProfileRowLeftContainer}>
                <View style={styles.followProfileRowContainer}>

                  <View style={styles.followProfileRowLeftContainer}>
                    <TouchableOpacity
                      onPress={() => this.onNotificationClick(notification)}
                      style={[styles.profileRowImageContainer]}>
                      <Image
                        style={[styles.profileRowImage]}
                        source={{
                          uri: notification &&
                           notification.created_by &&
                          notification.created_by.meta_data &&
                            notification.created_by.meta_data.profile_pic
                        }}
                      />
                    </TouchableOpacity>

                    <View style={styles.followProfileRowTextContainer}>
                      <View style={styles.followProfileRowNameContainer}>
                        <Text style={[styles.followProfileText, notification && notification.is_read && {color: '#989BA5'}]}>
                          {notification && notification.message}
                        </Text>
                      </View>
                      <View style={styles.followProfileRowRoleContainer}>
                        <Text style={styles.followProfileSubText}>
                            {moment(notification && notification.created_at).fromNow()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {notification && !notification.is_read && <View style={styles.followProfileRowRightContainer}>
                    <View style={styles.yellowDot} />
                  </View>}

                </View>
              </View>
            </TouchableOpacity>
            ))
          }

          {!this.state.isLoading && (!notifications || (notifications && notifications.length === 0)) &&
              <View style={[styles.emptyNotificationContainer]}>
                <Image
                  style={[styles.emptyNotificationIcon]}
                  source={require('../../assets/images/empty_notification.png')}
                />
              </View>
          }

          {this.state.isLoading &&
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator animating />
            </View>
          }
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  userPostsCommentErrors: state.Posts.errors.UserPostsCommentList,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  commentsList: state.Posts.userPostsCommentList,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  notificationsLists: state.Profile.notificationsLists,
  readNotificationSuccess: state.Profile.readNotificationSuccess,
  acceptGroupJoinSuccess: state.Profile.acceptGroupJoinSuccess,
  acceptGroupInviteSuccess: state.Profile.acceptGroupInviteSuccess,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    userPosts: (tab, token, userId) => {
      dispatch(homeActions.userPosts(tab, token, userId));
    },
    followersConnectionsList: (userId, token) => {
      dispatch(profileActions.followersConnectionsList(userId, 1, token));
    },
    addEditPostRank: (postId, rating, accessToken) => {
      dispatch(homeActions.addEditPostRank(postId, rating, accessToken));
    },
    addPostView: (postId, accessToken) => {
      dispatch(homeActions.addPostView(postId, accessToken));
    },
    fetchCommentsForPost: (postId, accessToken) => {
      dispatch(homeActions.fetchCommentsForPost(postId, accessToken));
    },
    addCommentToPost: (postId, comment, accessToken) => {
      dispatch(homeActions.addCommentToPost(postId, comment, accessToken));
    },
    getNotificationsList: (token) => {
      dispatch(profileActions.getNotificationsList(token));
    },
    readNotification: (notification_id, token) => {
      dispatch(profileActions.readNotification(notification_id, token));
    },
    acceptGroupJoin: (request_id, token) => {
      dispatch(profileActions.acceptGroupJoin(request_id, token));
    },
    acceptGroupInvite: (invite_id, token) => {
      dispatch(profileActions.acceptGroupInvite(invite_id, token));
    },
  },
});

MyNotifications.navigationOptions = {
  header: null,
};

export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyNotifications));
