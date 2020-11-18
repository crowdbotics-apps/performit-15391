import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {styles} from './styles';
import * as groupActions from '../../Groups/redux/actions';
import * as profileActions from '../../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import {get, cloneDeep} from 'lodash';
import {userTypesConfig} from '../../../config/userTypes';

class InviteFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTab: 'follower',
      followersCurrentPage: 1,
      followingCurrentPage: 1,
      userId: '',
      searchTerm: '',
      groupId: ''
    };
  }

  static navigationOptions = {
    header: null,
  };

  search = {
    searchTimeOut: null,
  };

  async componentDidMount() {
    // write code here
    this.setState({
      isLoading: true,
    });

    const groupId = this.props.navigation.getParam('groupId', '');
    const accessToken = this.props.accessToken;
    const userId = this.props.user && this.props.user.pk
    const {
      actions: {followersConnectionsList},
    } = this.props;

    const {followersCurrentPage} = this.state;
    if (userId && accessToken) {
      await followersConnectionsList(userId, followersCurrentPage, accessToken, groupId);
      /*this.setState({
        followersCurrentPage: followersCurrentPage + 1,
      });
*/    }
    this.setState({
      isLoading: false,
      groupId,
      userId
    });
  }

  async componentDidUpdate(prevProps) {
    const userId = this.props.user && this.props.user.pk
    const groupId = this.props.navigation.getParam('groupId', '');
    const prevGroupId = prevProps.navigation.getParam('groupId', '');

    if (groupId !== prevGroupId) {
      const accessToken = this.props.accessToken;

      const {
        actions: {followersConnectionsList},
      } = this.props;

      const {followersCurrentPage} = this.state;

      if (userId && accessToken) {
        await followersConnectionsList(
          userId,
          followersCurrentPage,
          accessToken,
          groupId
        );
        this.setState({
          groupId,
          userId
        });
      }
    }
  }

  inviteUser = async (userId) => {
    const {accessToken, user: loggedInUser} = this.props;
    const {
      actions: {inviteUserToGroup, followersConnectionsList, searchFollowersConnectionsList},
    } = this.props;
    await inviteUserToGroup(userId, this.state.groupId, accessToken);
    if(this.state.searchTerm){
      await searchFollowersConnectionsList(this.state.userId, 1, accessToken, this.state.groupId);
    } else {
      await followersConnectionsList(this.state.userId, 1, accessToken, this.state.groupId);
    }
  };

  searchUser = text => {
    this.setState({
      searchTerm: text,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
      const userId = this.props.user && this.props.user.pk
      const {
        accessToken,
        actions: {
          searchFollowersConnectionsList,
        },
      } = this.props;
      await searchFollowersConnectionsList(
        userId,
        1,
        accessToken,
        text,
        this.state.groupId
      );
    }, 1000);
  };

  render() {
    let origin = 'FollowPage';
    const {navigation, profile: allProfiles} = this.props;
    const {activeTab, searchTerm} = this.state;
    const profile = allProfiles && allProfiles[`${this.state.userId}`];
    const loggedInUserId = this.props.user && this.props.user.pk;

    let followers = cloneDeep(
      get(profile, 'followersConnectionsList.data', []),
    );
    let following = cloneDeep(
      get(profile, 'followingConnectionsList.data', []),
    );
    let userTypes = '';
    if (userTypesConfig && followers && followers.length > 0) {
      followers.forEach(follower => {
        userTypes = '';
        if (
          follower &&
          follower.meta_data &&
          follower.meta_data.user_types &&
          follower.meta_data.user_types.length > 0
        ) {
          follower.meta_data.user_types.forEach(item => {
            userTypes = userTypes + userTypesConfig[item] + ', ';
          });
          userTypes = userTypes.replace(/,\s*$/, '');
        }
        follower.userTypes = userTypes;
      });
    }

    let followersCount = get(profile, 'followersConnectionsList.total', 0);

    if (searchTerm) {
      origin = 'search';
      followers = get(profile, 'searchFollowersConnectionsList.data', []);
      followersCount = get(profile, 'searchFollowersConnectionsList.total', 0);
    }
    console.log('---------------------------------followers', followers)

    return (
      <ScrollView
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
            <Text style={styles.headerText}>
              Invite Friends
            </Text>
          </View>
        </SafeAreaView>

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
              onChangeText={value => this.searchUser(value)}
            />
          </View>
        </View>

        {followers && followers.length > 0 && followers.map(follower => (
              <View style={styles.followProfileRowContainer}>
                <View style={styles.followProfileRowLeftContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: follower.follower && follower.follower.pk,
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          follower &&
                          follower.follower &&
                          follower.follower.meta_data &&
                          follower.follower.meta_data.user_details &&
                          follower.follower.meta_data.user_details.profile_pic,
                      }}
                    />
                  </TouchableOpacity>

                  <View style={styles.followProfileRowTextContainer}>
                    <View style={styles.followProfileRowNameContainer}>
                      {follower &&
                      follower.follower &&
                      (follower.follower.first_name ||
                        follower.follower.last_name) ? (
                        <Text style={styles.followProfileText}>
                          {follower.follower.first_name}{' '}
                          {follower.follower.last_name}
                        </Text>
                      ) : (
                        <Text style={styles.followProfileText}>
                          {follower.follower.username}
                        </Text>
                      )}
                    </View>
                    <View style={styles.followProfileRowRoleContainer}>
                      <Text style={styles.followProfileSubText}>
                        {follower.userTypes}
                      </Text>
                    </View>
                  </View>
                </View>
                { follower &&
                  follower.follower &&
                  follower.follower.pk !== loggedInUserId && (
                    <View style={styles.followProfileRowRightContainer}>
                      {follower &&
                      follower.meta_data &&
                      follower.meta_data.is_invited ? (
                        <TouchableOpacity
                          onPress={() =>
                            console.log('----------------')
                          }
                          style={styles.followingButtonContainer}>
                          <Text style={styles.followingButtonText}>
                            Invited
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            this.inviteUser(
                              follower &&
                                follower.follower &&
                                follower.follower.pk
                            )
                          }
                          style={styles.followButtonContainer}>
                          <Text style={styles.followButtonText}>Send Invitation</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
              </View>
            ))}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userDetailErrors: state.Profile.errors.UserDetail,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    followersConnectionsList: (userId, page, token, group_id) => {
      dispatch(profileActions.followersConnectionsList(userId, page, token, group_id));
    },
    followingConnectionsList: (userId, page, token) => {
      dispatch(profileActions.followingConnectionsList(userId, page, token));
    },
    searchFollowersConnectionsList: (userId, page, token, term, group_id) => {
      dispatch(
        profileActions.searchFollowersConnectionsList(
          userId,
          page,
          token,
          term,
          group_id
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
    followUser: (userId, user, metaData, token, loggedInUser, origin) => {
      dispatch(
        profileActions.followUser(
          userId,
          user,
          metaData,
          token,
          loggedInUser,
          origin,
        ),
      );
    },
    unFollowUser: (userId, token, loggedInUser, origin) => {
      dispatch(
        profileActions.unFollowUser(userId, token, loggedInUser, origin),
      );
    },
    inviteUserToGroup: (userId, groupId, token) => {
      dispatch(
        profileActions.inviteUserToGroup(userId, groupId, token),
      );
    },
  },
});

InviteFriends.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InviteFriends);
