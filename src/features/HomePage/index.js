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
import {styles} from './styles';
import * as homeActions from '../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../utils/scale';
import * as profileActions from '../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import VideoPlayer from '../components/VideoPlayer';

class Home extends Component {
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
    this.setState({
      isLoading: true,
    });

    let userId = this.props.navigation.getParam('userId', '');
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const accessToken = this.props.accessToken;

    const {
      actions: {userDetails, followersConnectionsList, userPosts},
    } = this.props;
    if (userId && accessToken) {
      await userDetails(userId, accessToken);
      await followersConnectionsList(userId, accessToken);
      await userPosts('following', accessToken, userId);
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
      actions: {userDetails, followersConnectionsList, userPosts},
    } = this.props;
    if (prevUserId !== userId) {
      this.setState({
        isLoading: true,
      });
      await userDetails(userId, accessToken);
      await followersConnectionsList(userId, accessToken);
      await userPosts('following', accessToken, userId);

      this.setState({
        isLoading: false,
        userId,
      });
    }

    if (this.props.posts !== prevProps.posts) {
      const {activeTab} = this.state;
      let postsToShow =
        this.props.posts && this.props.posts[`${this.state.userId}`];

      let postsFollowing = cloneDeep(
        get(postsToShow, 'postsFollowing.data', []),
      );
      let postsTopTalents = cloneDeep(
        get(postsToShow, 'postsTalents.data', []),
      );

      if (postsFollowing && postsFollowing.length > 0) {
        postsFollowing.sort((item1, item2) => {
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
        postsFollowing.reverse();
      }

      if (postsTopTalents && postsTopTalents.length > 0) {
        postsTopTalents.sort((item1, item2) => {
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
        postsTopTalents.reverse();
      }

      let postsData = [];

      if (activeTab === 'following') {
        postsData = cloneDeep(postsFollowing);
      } else {
        postsData = cloneDeep(postsTopTalents);
      }
      this.setState({
        postsData,
      });
    }
  }

  handleCommentChange = (postId, text) => {
    // write code here
    this.setState({
      [`newComment${postId}`]: text,
    });
  };

  handleOnFocus = postId => {
    // write code here
    this.setState({
      [`isFocus${postId}`]: true,
    });
  };

  handleOnBlur = postId => {
    // write code here
    this.setState({
      [`isFocus${postId}`]: false,
    });
  };

  postComment = async postId => {
    const accessToken = this.props.accessToken;
    const userId = this.state.userId;
    const {
      actions: {userPosts, addCommentToPost},
    } = this.props;

    await addCommentToPost(
      postId,
      this.state[`newComment${postId}`],
      accessToken,
    );
    await userPosts(this.state.activeTab, accessToken, userId);
    this.setState({
      [`newComment${postId}`]: '',
    });
  };

  switchTab = async tab => {
    this.setState({
      activeTab: tab,
    });
    const accessToken = this.props.accessToken;
    const userId = this.state.userId;
    const {
      actions: {userPosts},
    } = this.props;

    await userPosts(tab, accessToken, userId);
  };

  trimText = (text, maxLength = 8) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    } else {
      return text;
    }
  };

  ratePost = async (postId, rating) => {
    const accessToken = this.props.accessToken;
    const userId = this.state.userId;
    const {
      actions: {userPosts, addEditPostRank},
    } = this.props;
    let postsData = cloneDeep(this.state.postsData);
    postsData.length > 0 &&
      postsData.forEach(elem => {
        if (elem.id === postId) {
          elem.meta_data.ratings.rating_by_login = rating;
        }
      });
    this.setState({
      postsData,
    });
    await addEditPostRank(postId, rating, accessToken);
    await userPosts(this.state.activeTab, accessToken, userId);
  };

  callPostViewed = (postId, isViewed) => {
    const {
      actions: {addPostView},
    } = this.props;
    const accessToken = this.props.accessToken;
    !isViewed && addPostView(postId, accessToken);
    this.setState({
      [`isViewed${postId}`]: true,
    });
  };

  viewAllComments = async postId => {
    this.props.navigation.navigate('CommentsPage', {postId});
  };

  // setting current time of video to a timestamp
  setVideoCurrentTime = (time, postId) => {
    this.setState({
      [`currentTime${postId}`]: time,
    });
  };

  // initializing seekTime to -1 in beginning to differentiate later
  initializeSeekTime = postId => {
    this.setState({
      [`seekTime${postId}`]: -1,
    });
  };

  render() {
    const {profile: allProfiles, posts, navigation, commentsList} = this.props;
    const {activeTab, postsData} = this.state;
    const profile = allProfiles && allProfiles[`${this.state.userId}`];

    let followers = cloneDeep(
      get(profile, 'followersConnectionsList.data', []),
    );

    return (
      <KeyboardAvoidingView
        behavior={'position'}
        style={{flex: 1, backgroundColor: 'black'}}>
        <ScrollView
          contentContainerStyle={styles.screen}
          keyboardShouldPersistTaps={'handled'}
          style={{backgroundColor: 'black'}}>
          {!this.state.isLoading ? (
            <>
              <SafeAreaView style={styles.headerContainer}>
                <View style={styles.headerLeftContainer}>
                  <View style={[styles.performItLogoContainer]}>
                    <View style={[styles.performItLogo]}>
                      <Image
                        style={[styles.performItLogo]}
                        source={require('../../assets/images/logo_performit.png')}
                      />
                    </View>
                  </View>
                  <Text style={styles.headerText}>PERFORMIT</Text>
                </View>
                <View style={styles.headerRightContainer}>
                  <TouchableOpacity
                    style={[styles.searchIconContainer]}
                    onPress={() =>
                      this.props.navigation.navigate('SearchPage')
                    }>
                    <View style={[styles.searchIcon]}>
                      <Image
                        style={[styles.searchIcon]}
                        source={require('../../assets/images/search_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.messageIconContainer]}
                    onPress={() => this.toggleDrawer()}>
                    <View style={[styles.messageIcon]}>
                      <Image
                        style={[styles.messageIcon]}
                        source={require('../../assets/images/message_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              {followers && followers.length > 0 && (
                <View style={styles.followersView}>
                  <ScrollView
                    contentContainerStyle={styles.followersContainer}
                    horizontal={true}>
                    {followers.map(follower => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProfilePage', {
                            userId: follower.follower && follower.follower.pk,
                          })
                        }
                        style={styles.followerProfileContainer}>
                        <View style={[styles.profileImageContainer]}>
                          <Image
                            style={[styles.profileImage]}
                            source={{
                              uri:
                                follower &&
                                follower.follower &&
                                follower.follower.profile_pic,
                            }}
                          />
                        </View>
                        <View style={styles.profileTextContainer}>
                          {follower &&
                          follower.follower &&
                          (follower.follower.first_name ||
                            follower.follower.last_name) ? (
                            <Text style={styles.profileText}>
                              {this.trimText(
                                `${follower.follower.first_name} ${
                                  follower.follower.last_name
                                }`,
                                8,
                              )}
                            </Text>
                          ) : (
                            <Text style={styles.profileText}>
                              {this.trimText(follower.follower.username, 8)}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
              <View style={styles.homeHeaderTabs}>
                <TouchableOpacity
                  onPress={() => this.switchTab('following')}
                  style={[
                    this.state.activeTab === 'talent' && {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    this.state.activeTab === 'following' &&
                      styles.headerTabButton,
                  ]}>
                  <Text style={styles.homeHeaderText}>Following</Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: scaleModerate(10),
                  }}>
                  <Text style={styles.homeHeaderLine}>|</Text>
                </View>
                <TouchableOpacity
                  onPress={() => this.switchTab('talent')}
                  style={[
                    this.state.activeTab === 'following' && {
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    this.state.activeTab === 'talent' && styles.headerTabButton,
                  ]}>
                  <Text style={styles.homeHeaderText}>Talent Pool</Text>
                </TouchableOpacity>
              </View>

              {postsData.map(postData => (
                <>
                  <View style={styles.postParentContainer}>
                    <View style={styles.postProfileContainer}>
                      <View style={[styles.postProfileImage]}>
                        <Image
                          style={[styles.postProfileImage]}
                          source={{
                            uri:
                              postData &&
                              postData.user &&
                              postData.user.meta_data &&
                              postData.user.meta_data.user_details &&
                              postData.user.meta_data.user_details.profile_pic,
                          }}
                        />
                      </View>
                      <View style={styles.postProfileTextContainer}>
                        {postData &&
                        postData.user &&
                        (postData.user.first_name ||
                          postData.user.last_name) ? (
                          <Text style={styles.postProfileText}>
                            {`${postData.user.first_name} ${
                              postData.user.last_name
                            }`}
                          </Text>
                        ) : (
                          <Text style={styles.postProfileText}>
                            {postData.user.username}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.postImageContainer}>
                    <VideoPlayer
                      showBottomcontrol={true}
                      videoHeight={350}
                      postId={postData && postData.id}
                      source={postData && postData.content}
                      navigation={this.props.navigation}
                      disableVolume="false"
                      disableBack="false"
                      paused={this.state[`paused${postData && postData.id}`]}
                      onVideoProgress={time => {
                        this.setVideoCurrentTime(time, postData && postData.id);
                      }}
                      initializeSeek={() => {
                        this.initializeSeekTime(postData && postData.id);
                      }}
                      onEnd={() => {
                        this.setState({
                          [`paused${postData && postData.id}`]: true,
                        });
                      }}
                      onPause={() => {
                        this.setState({
                          [`paused${postData && postData.id}`]: true,
                        });
                      }}
                      onPlay={() => {
                        this.setState({
                          [`paused${postData && postData.id}`]: false,
                        });
                      }}
                      onLoad={fields => {
                        this.callPostViewed(
                          postData && postData.id,
                          this.state[`isViewed${postData && postData.id}`],
                        );
                        this.setState({
                          [`duration${postData &&
                            postData.id}`]: fields.duration,
                        });
                      }}
                      showControls={value => {
                        this.setState({
                          [`showControls${postData && postData.id}`]: value,
                        });
                      }}
                    />
                  </View>
                  <View style={styles.postStatsParentContainer}>
                    <View style={styles.postStatsContainer}>
                      <View style={styles.postStatsLeftContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            this.ratePost(postData && postData.id, 1)
                          }
                          style={[styles.starImage]}>
                          {postData &&
                          postData.meta_data &&
                          postData.meta_data.ratings &&
                          postData.meta_data.ratings.rating_by_login >= 1 ? (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/empty_star.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.ratePost(postData && postData.id, 2)
                          }
                          style={[styles.starImage]}>
                          {postData &&
                          postData.meta_data &&
                          postData.meta_data.ratings &&
                          postData.meta_data.ratings.rating_by_login >= 2 ? (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/empty_star.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.ratePost(postData && postData.id, 3)
                          }
                          style={[styles.starImage]}>
                          {postData &&
                          postData.meta_data &&
                          postData.meta_data.ratings &&
                          postData.meta_data.ratings.rating_by_login >= 3 ? (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/empty_star.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.ratePost(postData && postData.id, 4)
                          }
                          style={[styles.starImage]}>
                          {postData &&
                          postData.meta_data &&
                          postData.meta_data.ratings &&
                          postData.meta_data.ratings.rating_by_login >= 4 ? (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/empty_star.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            this.ratePost(postData && postData.id, 5)
                          }
                          style={[styles.starImage]}>
                          {postData &&
                          postData.meta_data &&
                          postData.meta_data.ratings &&
                          postData.meta_data.ratings.rating_by_login >= 5 ? (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../assets/images/empty_star.png')}
                            />
                          )}
                        </TouchableOpacity>
                        <View style={styles.postStatsLeftTextContainer}>
                          <Text style={styles.postStatsLeftText}>
                            {(postData &&
                              postData.meta_data &&
                              postData.meta_data.ratings &&
                              postData.meta_data.ratings.average_rating) ||
                              0}{' '}
                            /5{' '}
                          </Text>
                          <Text style={styles.postStatsLeftText}>
                            {' '}
                            (
                            {postData &&
                              postData.meta_data &&
                              postData.meta_data.ratings &&
                              postData.meta_data.ratings.votes}{' '}
                            Votes)
                          </Text>
                        </View>
                      </View>
                      <View style={styles.postStatsRightContainer}>
                        <Text style={styles.postStatsRightText}>
                          {postData &&
                            postData.meta_data &&
                            postData.meta_data.counts &&
                            postData.meta_data.counts.views_count}{' '}
                          view
                          {postData &&
                            postData.meta_data &&
                            postData.meta_data.counts &&
                            postData.meta_data.counts.views_count > 1 &&
                            's'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.commentShareParentContainer}>
                    <View style={styles.commentShareContainer}>
                      <TouchableOpacity
                        style={[styles.commentImage]}
                        onPress={() =>
                          this.viewAllComments(postData && postData.id)
                        }>
                        <Image
                          style={[styles.commentImage]}
                          source={require('../../assets/images/comment_icon.png')}
                        />
                      </TouchableOpacity>
                      <View style={[styles.shareImage]}>
                        <Image
                          style={[styles.shareImage]}
                          source={require('../../assets/images/share_icon.png')}
                        />
                      </View>
                    </View>
                  </View>

                  {postData &&
                  postData.caption &&
                  postData.caption.length > 0 ? (
                    <View style={styles.captionParentContainer}>
                      <View style={styles.captionContainer}>
                        <Text style={styles.captionText}>
                          {postData.caption &&
                            postData.caption
                              .split(' ')
                              .map(elem =>
                                elem.includes('#') || elem.includes('@') ? (
                                  <Text
                                    style={[
                                      styles.captionText,
                                      {color: '#B88746'},
                                    ]}>
                                    {elem}
                                  </Text>
                                ) : (
                                  <Text style={[styles.captionText]}>
                                    {elem}{' '}
                                  </Text>
                                ),
                              )}
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}

                  {postData &&
                  postData.meta_data &&
                  postData.meta_data.counts &&
                  postData.meta_data.counts.comments_count ? (
                    <View style={styles.commentsParentContainer}>
                      <View style={styles.commentsContainer}>
                        <TouchableOpacity
                          onPress={() =>
                            this.viewAllComments(postData && postData.id)
                          }>
                          <Text style={styles.commentsText}>
                            View all {postData.meta_data.counts.comments_count}{' '}
                            comment
                            {postData.meta_data.counts.comments_count > 1 &&
                              's'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <></>
                  )}
                  {postData && postData.id && (
                    <View style={styles.enterCommentContainer}>
                      <TextInput
                        value={this.state[`newComment${postData.id}`]}
                        onChangeText={text =>
                          this.handleCommentChange(postData.id, text)
                        }
                        onFocus={() => this.handleOnFocus(postData.id)}
                        onBlur={() => this.handleOnBlur(postData.id)}
                        placeholder="Add Comment"
                        style={styles.commentInput}
                        autoCapitalize="none"
                        placeholderTextColor="#989ba5"
                        underlineColorAndroid="transparent"
                        multiline={true}
                      />
                      {this.state[`isFocus${postData.id}`] && (
                        <TouchableOpacity
                          style={[styles.postButton]}
                          onPress={() => this.postComment(postData.id)}>
                          <Text
                            style={{
                              color: '#ffffff',
                              fontSize: scaleModerate(14),
                              fontFamily: 'Nunito',
                              lineHeight: undefined,
                            }}>
                            Post
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </>
              ))}
            </>
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
      </KeyboardAvoidingView>
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
  },
});

Home.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
