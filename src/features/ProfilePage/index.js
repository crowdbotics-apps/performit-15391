import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import {get} from 'lodash';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // write code here
    this.setState({
      isLoading: true,
    });
    let userId = this.props.navigation.getParam('userId', '');
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const accessToken = this.props.accessToken;
    const {
      actions: {
        userDetails,
        followersConnectionsList,
        followingConnectionsList,
      },
    } = this.props;
    if (userId && accessToken) {
      await userDetails(userId, accessToken);
      await followersConnectionsList(userId, accessToken);
      await followingConnectionsList(userId, accessToken);
    }
    this.setState({
      isLoading: false,
      userId,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevUserId = prevProps.navigation.getParam('userId', '');
    const userId = this.props.navigation.getParam('userId', '');
    const accessToken = this.props.accessToken;
    const {
      actions: {
        userDetails,
        followersConnectionsList,
        followingConnectionsList,
      },
    } = this.props;
    if (prevUserId !== userId) {
      this.setState({
        isLoading: true,
      });
      await userDetails(userId, accessToken);
      await followersConnectionsList(userId, accessToken);
      await followingConnectionsList(userId, accessToken);
      this.setState({
        isLoading: false,
        userId,
      });
    }
  }

  showAccountNotConnected = platform => {
    Toast.show(`${platform} account is not connected`);
  };

  followUser = async (userId, user, metaData) => {
    const {accessToken, user: loggedInUser} = this.props;
    const {
      actions: {followUser},
    } = this.props;
    await followUser(
      userId,
      user,
      metaData,
      accessToken,
      loggedInUser,
      'profile',
    );
  };

  unFollowUser = async userId => {
    const {accessToken, user: loggedInUser} = this.props;
    const {
      actions: {unFollowUser},
    } = this.props;
    await unFollowUser(userId, accessToken, loggedInUser, 'profile');
  };

  toggleDrawer = () => {
    this.props.navigation.toggleDrawer();
  };

  render() {
    let isOtherProfilePage = false;
    let shouldShowFollowButton = true;
    const {navigation, profile: allProfiles, user} = this.props;
    let {userId} = this.state;
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const profile = allProfiles && allProfiles[`${this.state.userId}`];
    const loggedInProfile = allProfiles && allProfiles[`${user.pk}`];
    let followerDataForFollow = '';
    let followerMetaDataForFollow = '';
    let userTypes = '';
    if (profile && profile.user_types && profile.user_types.length > 0) {
      profile.user_types.forEach(item => {
        userTypes = userTypes + item + ', ';
      });
    }
    const followersCount = get(profile, 'followersConnectionsList.total', 0);
    const followingCount = get(profile, 'followingConnectionsList.total', 0);
    if (userId !== user.pk) {
      isOtherProfilePage = true;
      // const followers = get(profile, 'followersConnectionsList.data', []);
      // followers &&
      //   followers.length > 0 &&
      //   followers.forEach(follower => {
      //     if (follower.follower && follower.follower.pk === user.pk) {
      //       shouldShowFollowButton = false;
      //     }
      //   });
      const loggedInProfileFollowers = get(
        loggedInProfile,
        'followersConnectionsList.data',
        [],
      );
      loggedInProfileFollowers &&
        loggedInProfileFollowers.length > 0 &&
        loggedInProfileFollowers.forEach(loggedInProfileFollower => {
          if (
            loggedInProfileFollower.follower &&
            loggedInProfileFollower.follower.pk === userId
          ) {
            followerDataForFollow = loggedInProfileFollower.follower;
            followerMetaDataForFollow = loggedInProfileFollower.meta_data;
          }
        });

      const loggedInProfileFollowing = get(
        loggedInProfile,
        'followingConnectionsList.data',
        [],
      );
      loggedInProfileFollowing &&
        loggedInProfileFollowing.length > 0 &&
        loggedInProfileFollowing.forEach(item => {
          if (item.following && item.following.pk === userId) {
            shouldShowFollowButton = false;
          }
        });
    }

    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        {!this.state.isLoading ? (
          profile && (
            <>
              <View style={styles.headerContainer}>
                {!!isOtherProfilePage && (
                  <TouchableOpacity
                    style={[styles.leftArrowContainer]}
                    onPress={() =>
                      navigation.navigate('ProfilePage', {userId: user.pk})
                    }>
                    <View style={[styles.leftArrow]}>
                      <Image
                        style={[styles.leftArrow]}
                        source={require('../../assets/images/left-arrow.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerText}>
                    {profile.user && profile.user.username}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.inputDrawerContainer]}
                  onPress={() => this.toggleDrawer()}>
                  <View style={[styles.inputDrawer]}>
                    <Image
                      style={[styles.inputDrawer]}
                      source={require('../../assets/images/drawer_icon.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.profileInfoContainer}>
                <View style={styles.profileLeftInfoContainer}>
                  <View style={styles.profileTextContainer}>
                    {profile.user &&
                    (profile.user.first_name || profile.user.last_name) ? (
                      <Text style={styles.profileText}>
                        {profile.user && profile.user.first_name}{' '}
                        {profile.user && profile.user.last_name}
                      </Text>
                    ) : (
                      <Text style={styles.profileText}>
                        {profile.user && profile.user.username}
                      </Text>
                    )}
                  </View>
                  <View style={styles.profileSubTextContainer}>
                    <Text style={styles.profileSubText}>{userTypes}</Text>
                  </View>
                  <View style={styles.profileStatsContainer}>
                    <View style={styles.profileSingleStatContainer}>
                      <Text style={styles.profileSingleStatFirstText}>
                        {(profile.posts && profile.posts.length) || '0'}
                      </Text>
                      <Text style={styles.profileSingleStatSecondText}>
                        Posts
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        !isOtherProfilePage &&
                        navigation.navigate('FollowPage', {
                          userId,
                          tab: 'follower',
                        })
                      }
                      style={styles.profileSingleStatContainer}>
                      <Text style={styles.profileSingleStatFirstText}>
                        {followersCount || '0'}
                      </Text>
                      <Text style={styles.profileSingleStatSecondText}>
                        Followers
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        !isOtherProfilePage &&
                        navigation.navigate('FollowPage', {
                          userId,
                          tab: 'following',
                        })
                      }
                      style={styles.profileSingleStatContainer}>
                      <Text style={styles.profileSingleStatFirstText}>
                        {followingCount || '0'}
                      </Text>
                      <Text style={styles.profileSingleStatSecondText}>
                        Following
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.profileRightInfoContainer}>
                  <View style={[styles.profileImageContainer]}>
                    <Image
                      style={[styles.profileImage]}
                      source={{
                        uri:
                          profile.user_details &&
                          profile.user_details.profile_pic,
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.profileDescContainer}>
                <Text style={styles.descText}>
                  {(profile.user_details && profile.user_details.bio) ||
                    'Please update your bio'}
                </Text>
              </View>

              {isOtherProfilePage ? (
                <View style={styles.otherProfileButtonContainer}>
                  <TouchableOpacity
                    style={styles.followProfileButtonContainer}
                    onPress={() =>
                      shouldShowFollowButton
                        ? this.followUser(
                            userId,
                            followerDataForFollow,
                            followerMetaDataForFollow,
                          )
                        : this.unFollowUser(userId)
                    }>
                    <Text style={styles.followProfileButtonText}>
                      {shouldShowFollowButton ? 'FOLLOW' : 'UNFOLLOW'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.messageProfileButtonContainer}
                    onPress={() => {
                      console.log('-------------edit profile');
                    }}>
                    <Text style={styles.followProfileButtonText}>MESSAGE</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.editProfileButtonContainer}
                  onPress={() => {
                    this.props.navigation.navigate('EditProfilePage');
                  }}>
                  <Text style={styles.editProfileButtonText}>EDIT PROFILE</Text>
                </TouchableOpacity>
              )}

              <View style={styles.socialMediaContainer}>
                <TouchableOpacity
                  style={styles.singleSocialMediaContainer}
                  onPress={() => this.showAccountNotConnected('Facebook')}>
                  <Image
                    style={[styles.facebookIcon]}
                    source={require('../../assets/images/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.singleSocialMediaContainer}
                  onPress={() => this.showAccountNotConnected('Instagram')}>
                  <Image
                    style={[styles.instagramIcon]}
                    source={require('../../assets/images/instagram.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.singleSocialMediaContainer}
                  onPress={() => this.showAccountNotConnected('Youtube')}>
                  <Image
                    style={[styles.youtubeIcon]}
                    source={require('../../assets/images/youtube.png')}
                  />
                </TouchableOpacity>
              </View>

              {/*<View style={styles.profileImagesContainer}>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image1.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image2.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image3.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image4.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image5.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image6.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image7.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image8.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileSingleImageConatiner}>
                  <Image
                    style={[styles.profileSingleImage]}
                    source={require('../../assets/images/ex_image9.png')}
                  />
                </TouchableOpacity>
              </View>*/}
              <View style={styles.noProfilePostsContainer}>
                <Text style={styles.profileSingleStatSecondText}>
                  There are no posts yet
                </Text>
              </View>
            </>
          )
        ) : (
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
  userDetailErrors: state.Profile.errors.UserDetail,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    followersConnectionsList: (userId, token) => {
      dispatch(profileActions.followersConnectionsList(userId, 1, token));
    },
    followingConnectionsList: (userId, token) => {
      dispatch(profileActions.followingConnectionsList(userId, 1, token));
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

Profile.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
