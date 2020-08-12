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
} from 'react-native';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../../utils/scale';
import * as profileActions from '../../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import {userTypesConfig} from '../../../config/userTypes';
import {
  createThread,
  subscribeToInbox,
  updateReadStatus,
} from '../../../utils/firebase';
import {chatUpdate} from '../redux/actions';
import {combineChat, combineInbox} from '../../../utils/combineFetchInbox';
import moment from 'moment';

class Inbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      chat: [],
    };
  }

  static navigationOptions = {
    header: null,
  };

  search = {
    searchTimeOut: null,
  };

  async componentDidMount() {
    this.setState({
      isLoading: true,
    });
    const {pk, email} = this.props.user;
    // const user = await login(email, pk + 'password' + pk);
    subscribeToInbox(pk, chat => {
      this.props.actions.chatUpdate(chat);
      this.combineFetchInbox(chat);
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const userId = this.props.navigation.getParam('userId', '');
    const prevUserId = prevProps.navigation.getParam('userId', '');
    if (userId !== prevUserId) {
      if (userId) {
        this.setState({
          userId,
        });
      }
    }
    if (
      prevProps.Chat.chat !== this.props.Chat.chat ||
      JSON.stringify(prevProps.profile) !== JSON.stringify(this.props.profile)
    ) {
      this.combineFetchInbox();
    }
  }

  createIndividualThread = async user => {
    this.setState({isLoading: true});
    const id = await createThread([user, this.props.user.pk], 'individual');
    const userProfile = this.props.profile && this.props.profile[`${user}`];
    const {
      accessToken,
      actions: {userDetails},
    } = this.props;
    if (!userProfile) {
      await userDetails(user, accessToken);
    }
    this.setState({isLoading: false});
    this.props.navigation.navigate('Chat', {
      id,
    });
  };

  searchPeopleToMessage = text => {
    if (text) {
      this.setState({
        searchTerm: text,
      });
      clearTimeout(this.search.searchTimeOut);
      this.search.searchTimeOut = setTimeout(async () => {
        const {
          accessToken,
          actions: {
            searchFollowersConnectionsList,
            searchFollowingConnectionsList,
          },
        } = this.props;
        const loggedInUserId = this.props.user && this.props.user.pk;
        await searchFollowersConnectionsList(
          loggedInUserId,
          1,
          accessToken,
          text,
        );
        await searchFollowingConnectionsList(
          loggedInUserId,
          1,
          accessToken,
          text,
        );
      }, 500);
    } else {
      this.setState({
        searchTerm: undefined,
      });
    }
  };

  getUserTypes = userTypesArray => {
    let userTypes = '';
    if (userTypesArray && userTypesArray.length > 0) {
      userTypesArray.forEach(item => {
        userTypes = userTypes + userTypesConfig[item] + ', ';
      });
      userTypes = userTypes.replace(/,\s*$/, '');
    }
    return userTypes;
  };

  async combineFetchInbox(chat = this.props.Chat.chat) {
    const {
      accessToken,
      actions: {userDetails},
    } = this.props;

    if (chat && chat.length > 0) {
      for (const chatItem of chat) {
        if (chatItem && chatItem.users) {
          for (const user of chatItem.users) {
            const userProfile =
              this.props.profile && this.props.profile[`${user}`];
            if (!userProfile) {
              const userProfile = await userDetails(user, accessToken);
            }
          }
        }
      }
    }

    setTimeout(() => {
      const chatWithUsers = combineInbox(
        chat,
        this.props.user,
        this.props.profile,
      );

      this.setState({chat: chatWithUsers});
      this.setState({
        isLoading: false,
      });
    }, 1000);
  }

  render() {
    const {navigation, profile: allProfiles} = this.props;
    const {searchTerm} = this.state;
    const loggedInUserId = this.props.user && this.props.user.pk;
    const profile = allProfiles && allProfiles[`${loggedInUserId}`];
    let followers = [];
    let following = [];
    let totalSearchedPeople = 0;
    let searchedPeople = [];
    if (searchTerm) {
      followers = get(profile, 'searchFollowersConnectionsList.data', []);
      following = get(profile, 'searchFollowingConnectionsList.data', []);
      followers &&
        followers.length &&
        followers.forEach(follower => {
          searchedPeople.push(follower.follower);
        });
      following &&
        following.length &&
        following.forEach(user => {
          const found = searchedPeople.some(
            searchedUser =>
              user.following && searchedUser.pk === user.following.pk,
          );
          if (!found) {
            searchedPeople.push(user.following);
          }
        });

      totalSearchedPeople = searchedPeople && searchedPeople.length;
    }
    const {chat} = this.state;
    chat.sort((a, b) => moment(a.updatedAt).diff(b.updatedAt));
    chat.reverse();

    let shouldNavigateToChat = true;
    chat.forEach(chatItem => {
      chatItem.users.forEach(user => {
        if (
          !user ||
          (user && !user.user) ||
          (user && user.user && !user.user.username)
        ) {
          shouldNavigateToChat = false;
        }
      });
    });

    return (
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => navigation.goBack()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Messages</Text>
          </View>
        </SafeAreaView>
        {!this.state.isLoading && (
          <>
            <View style={styles.searchButtonContainer}>
              <TouchableOpacity
                style={[styles.searchIconContainer]}
                onPress={() => console.log('-------search')}>
                <View style={[styles.searchIcon]}>
                  <Image
                    style={[styles.searchIcon]}
                    source={require('../../../assets/images/search_icon.png')}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={styles.textInput}
                  autoCorrect={false}
                  placeholderTextColor="#989BA5"
                  placeholder="Search"
                  autoCapitalize="none"
                  selectionColor="#ffffff"
                  onChangeText={value => this.searchPeopleToMessage(value)}
                />
              </View>
            </View>
            {!searchTerm && (!chat || (chat && !chat.length)) && (
              <View style={[styles.emptyMessageContainer]}>
                <Image
                  style={[styles.emptyMessageIcon]}
                  source={require('../../../assets/images/empty_message.png')}
                />
              </View>
            )}

            {searchTerm &&
              searchedPeople &&
              searchedPeople.length > 0 &&
              searchedPeople.map(user => (
                <TouchableOpacity
                  onPress={() => this.createIndividualThread(user && user.pk)}
                  style={styles.searchedUserProfileRowContainer}>
                  <View
                    style={styles.searchedUserfollowProfileRowLeftContainer}>
                    <View style={[styles.searchedUserprofileRowImageContainer]}>
                      <Image
                        style={[styles.searchedUserprofileRowImage]}
                        source={{
                          uri:
                            user &&
                            user.meta_data &&
                            user.meta_data.user_details &&
                            user.meta_data.user_details.profile_pic,
                        }}
                      />
                    </View>

                    <View style={styles.searchedUserProfileRowTextContainer}>
                      <View style={styles.searchedUserProfileRowNameContainer}>
                        {user && (user.first_name || user.last_name) ? (
                          <Text style={styles.searchedUserProfileText}>
                            {user.first_name} {user.last_name}
                          </Text>
                        ) : (
                          <Text style={styles.searchedUserProfileText}>
                            {user.username}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

            {!searchTerm &&
              chat &&
              chat.length > 0 &&
              chat.map(chatItem => (
                <TouchableOpacity
                  style={styles.followProfileRowContainer}
                  onPress={async () => {
                    chatItem.messages[chatItem.messages.length - 1] &&
                      chatItem.messages[chatItem.messages.length - 1].user &&
                      chatItem.messages[chatItem.messages.length - 1].user
                        .user &&
                      chatItem.messages[chatItem.messages.length - 1].user.user
                        .pk !== this.props.user.pk &&
                      (await updateReadStatus(chatItem.id));
                    shouldNavigateToChat &&
                      this.props.navigation.navigate('Chat', {
                        id: chatItem.id,
                      });
                  }}>
                  <View style={styles.profileRowImageParentContainer}>
                    {chatItem.users &&
                      chatItem.users.length > 0 &&
                      chatItem.users.map(
                        user =>
                          user.user &&
                          user.user.pk !== loggedInUserId && (
                            <TouchableOpacity
                              onPress={async () => {
                                chatItem.messages[
                                  chatItem.messages.length - 1
                                ] &&
                                  chatItem.messages[
                                    chatItem.messages.length - 1
                                  ].user &&
                                  chatItem.messages[
                                    chatItem.messages.length - 1
                                  ].user.user &&
                                  chatItem.messages[
                                    chatItem.messages.length - 1
                                  ].user.user.pk !== this.props.user.pk &&
                                  (await updateReadStatus(chatItem.id));
                                shouldNavigateToChat &&
                                  this.props.navigation.navigate('Chat', {
                                    id: chatItem.id,
                                  });
                              }}
                              style={[styles.profileRowImageContainer]}>
                              <Image
                                style={[styles.profileRowImage]}
                                source={{
                                  uri: user.user_details.profile_pic,
                                }}
                              />
                            </TouchableOpacity>
                          ),
                      )}
                  </View>

                  <View style={styles.followProfileRowTextContainer}>
                    <View style={styles.followProfileRowNameContainer}>
                      {chatItem.users &&
                        chatItem.users.length > 0 &&
                        chatItem.users.map(
                          user =>
                            user.user &&
                            user.user.pk !== loggedInUserId &&
                            (user.user.first_name || user.user.last_name ? (
                              <Text style={styles.followProfileText}>
                                {user.user && user.user.first_name}{' '}
                                {user.user && user.user.last_name}
                              </Text>
                            ) : (
                              <Text style={styles.followProfileText}>
                                {user.user && user.user.username}
                              </Text>
                            )),
                        )}
                    </View>

                    {chatItem.messages && chatItem.messages.length > 0 && (
                      <View style={styles.followProfileRowRoleContainer}>
                        {!chatItem.messages[chatItem.messages.length - 1]
                          .message && (
                          <View style={[styles.paperClipContainer]}>
                            <Image
                              style={[styles.paperClipImage]}
                              source={require('../../../assets/images/paperclip.png')}
                            />
                          </View>
                        )}
                        <Text style={styles.followProfileSubText}>
                          {chatItem.messages[chatItem.messages.length - 1]
                            .message || 'File'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.userStatusRowTextContainer}>
                    <View style={styles.userStatusTopRowContainer}>
                      {!chatItem.allMessagesRead &&
                        chatItem.messages[chatItem.messages.length - 1] &&
                        chatItem.messages[chatItem.messages.length - 1].user &&
                        chatItem.messages[chatItem.messages.length - 1].user
                          .user &&
                        chatItem.messages[chatItem.messages.length - 1].user
                          .user.pk !== this.props.user.pk && (
                          <View style={styles.yellowDot} />
                        )}
                    </View>
                    <View style={styles.userStatusBottomRowContainer}>
                      <Text
                        style={[
                          styles.followProfileSubText,
                          {color: '#6D7278'},
                        ]}>
                        {chatItem.messages &&
                          chatItem.messages.length > 0 &&
                          moment(
                            chatItem.messages[chatItem.messages.length - 1]
                              .createdAt,
                          ).fromNow()}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </>
        )}
        {this.state.isLoading && (
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
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  searchTopAccountsList: state.Posts.searchTopAccountsList,
  searchAccountsList: state.Posts.searchAccountsList,
  searchGroupsList: state.Posts.searchGroupsList,
  searchHashTagsList: state.Posts.searchHashTagsList,
  accessToken: state.EmailAuth.accessToken,
  Chat: state.Chat,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    userPosts: (tab, token, userId) => {
      dispatch(homeActions.userPosts(tab, token, userId));
    },
    searchFollowersConnectionsList: (userId, page, token, term) => {
      dispatch(
        profileActions.searchFollowersConnectionsList(
          userId,
          page,
          token,
          term,
        ),
      );
    },
    searchFollowingConnectionsList: (userId, page, token, term) => {
      dispatch(
        profileActions.searchFollowingConnectionsList(
          userId,
          page,
          token,
          term,
        ),
      );
    },
    searchDashboard: (tab, page, token, term) => {
      dispatch(homeActions.searchDashboard(tab, page, token, term));
    },
    chatUpdate: chat => dispatch(chatUpdate(chat)),
  },
});

Inbox.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Inbox);
