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
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import {get, cloneDeep} from 'lodash';
import {userTypesConfig} from '../../config/userTypes';

class Follow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      activeTab: 'follower',
      followersCurrentPage: 1,
      followingCurrentPage: 1,
      userId: '',
      searchTerm: '',
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

    const userId = this.props.navigation.getParam('userId', '');
    const activeTab = this.props.navigation.getParam('tab', 'follower');
    const accessToken = this.props.accessToken;

    const {
      actions: {followersConnectionsList, followingConnectionsList},
    } = this.props;

    const {followersCurrentPage, followingCurrentPage} = this.state;
    if (userId && accessToken) {
      await followersConnectionsList(userId, followersCurrentPage, accessToken);
      await followingConnectionsList(userId, followingCurrentPage, accessToken);
      this.setState({
        followersCurrentPage: followersCurrentPage + 1,
        followingCurrentPage: followingCurrentPage + 1,
        activeTab,
      });
    }
    this.setState({
      isLoading: false,
      userId,
    });
  }

  componentDidUpdate(prevProps) {
    const prevActiveTab = prevProps.navigation.getParam('tab', 'follower');
    const activeTab = this.props.navigation.getParam('tab', 'follower');
    if (prevActiveTab !== activeTab) {
      this.setState({
        activeTab,
      });
    }
  }

  followUser = async (userId, user, metaData, origin) => {
    const {accessToken, user: loggedInUser} = this.props;
    const {
      actions: {followUser},
    } = this.props;
    await followUser(userId, user, metaData, accessToken, loggedInUser, origin);
  };

  unFollowUser = async (userId, origin) => {
    const {accessToken, user: loggedInUser} = this.props;
    const {
      actions: {unFollowUser},
    } = this.props;
    await unFollowUser(userId, accessToken, loggedInUser, origin);
  };

  searchUser = text => {
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
      await searchFollowersConnectionsList(
        this.state.userId,
        1,
        accessToken,
        text,
      );
      await searchFollowingConnectionsList(
        this.state.userId,
        1,
        accessToken,
        text,
      );
    }, 1000);
  };

  render() {
    let origin = 'FollowPage';
    const {navigation, profile: allProfiles} = this.props;
    const {activeTab, searchTerm} = this.state;
    const profile = allProfiles && allProfiles[`${this.state.userId}`];

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

    if (userTypesConfig && following && following.length > 0) {
      following.forEach(follower => {
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
    let followingCount = get(profile, 'followingConnectionsList.total', 0);

    if (searchTerm) {
      origin = 'search';
      followers = get(profile, 'searchFollowersConnectionsList.data', []);
      following = get(profile, 'searchFollowingConnectionsList.data', []);
      followersCount = get(profile, 'searchFollowersConnectionsList.total', 0);
      followingCount = get(profile, 'searchFollowingConnectionsList.total', 0);
    }

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
                source={require('../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              {profile && profile.user && profile.user.username}
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
                source={require('../../assets/images/search_icon.png')}
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

        <View style={styles.followHeaderContainer}>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'follower'})}
            style={[
              styles.followersHeaderContainer,
              activeTab === 'follower' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'follower'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              {followersCount} {followersCount > 1 ? 'Followers' : 'Follower'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'following'})}
            style={[
              styles.followingHeaderContainer,
              activeTab === 'following' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'following'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              {followingCount} Following
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === 'follower'
          ? followers.map(follower => (
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
                          follower.follower.profile_pic,
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
                <View style={styles.followProfileRowRightContainer}>
                  {follower &&
                  follower.meta_data &&
                  follower.meta_data.is_following ? (
                    <View style={styles.followingButtonContainer}>
                      <Text style={styles.followingButtonText}>Following</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        this.followUser(
                          follower && follower.follower && follower.follower.pk,
                          follower.follower,
                          follower.meta_data,
                          origin,
                        )
                      }
                      style={styles.followButtonContainer}>
                      <Text style={styles.followButtonText}>Follow</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          : following.map(follower => (
              <View style={styles.followProfileRowContainer}>
                <View style={styles.followProfileRowLeftContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: follower.following && follower.following.pk,
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          follower &&
                          follower.following &&
                          follower.following.profile_pic,
                      }}
                    />
                  </TouchableOpacity>

                  <View style={styles.followProfileRowTextContainer}>
                    <View style={styles.followProfileRowNameContainer}>
                      {follower &&
                      follower.following &&
                      (follower.following.first_name ||
                        follower.following.last_name) ? (
                        <Text style={styles.followProfileText}>
                          {follower.following.first_name}{' '}
                          {follower.following.last_name}
                        </Text>
                      ) : (
                        <Text style={styles.followProfileText}>
                          {follower.following.username}
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
                <View style={styles.followProfileRowRightContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.unFollowUser(
                        follower && follower.following && follower.following.pk,
                        origin,
                      )
                    }
                    style={styles.followingButtonContainer}>
                    <Text style={styles.followingButtonText}>Unfollow</Text>
                  </TouchableOpacity>
                </View>
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
    followersConnectionsList: (userId, page, token) => {
      dispatch(profileActions.followersConnectionsList(userId, page, token));
    },
    followingConnectionsList: (userId, page, token) => {
      dispatch(profileActions.followingConnectionsList(userId, page, token));
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
  },
});

Follow.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Follow);
