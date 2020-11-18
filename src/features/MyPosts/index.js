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
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native';
import {styles} from './styles';
import * as homeActions from '../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../utils/scale';
import * as profileActions from '../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import VideoPlayer from '../components/VideoPlayer';
import Toast from 'react-native-simple-toast';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import { withNavigationFocus } from "react-navigation";

class MyPosts extends Component {
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
      uploadingStatus: 0, 
      postId: '',
      myPostLoading: false
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
    let postId = this.props.navigation.getParam('postId', '');
    const loggedInUserId = this.props.user && this.props.user.pk
    if (!userId) {
      userId = loggedInUserId;
    }
    const accessToken = this.props.accessToken;

    const {
      actions: {userDetails},
    } = this.props;

    const {profile: allProfiles} = this.props;
    const profile = allProfiles && allProfiles[`${userId}`];
    if (userId && accessToken && userId !== loggedInUserId) {
      if(profile && profile.user && profile.user.pk){
        //do nothing
      } else {
        await userDetails(userId, accessToken);
      }
    }

    let postsData = [];
    postsData = cloneDeep(get(profile, 'posts', []));

    this.setState({
      postsData,
    });
    if(postId && !this.props.myPostLoading){
      setTimeout(() => {
        let index = 0 
        if(postsData && postsData.length > 0) {
          index = postsData.findIndex(elem => elem.id === postId);
        }
        let yPos = scaleModerate(index * 659);
        this.scroller && this.scroller.scrollTo({x: 0, y: yPos, animated: true})
      }, 1500);
    }

    this.setState({
      isLoading: false,
      userId,
      postId,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevUserId = prevProps.navigation.getParam('userId', '');
    const userId = this.props.navigation.getParam('userId', '');
    const prevPostId = prevProps.navigation.getParam('postId', '');
    const postId = this.props.navigation.getParam('postId', '');

    const loggedInUserId = this.props.user && this.props.user.pk
    
    const accessToken = this.props.accessToken;
    const {
      actions: {userDetails},
    } = this.props;
    if (userId && prevUserId !== userId) {
      this.setState({
        isLoading: true,
      });
      const {profile: allProfiles} = this.props;
      const profile = allProfiles && allProfiles[`${userId}`];

      if(profile && profile.user && profile.user.pk){
        //do nothing
      } else {
        await userDetails(userId, accessToken);
      }

      let postsData = [];
      postsData = cloneDeep(get(profile, 'posts', []));

      this.setState({
        postsData,
        isLoading: false,
        userId,
      });
    }

    if(this.props.myPostLoading !== prevProps.myPostLoading){
      if(this.props.myPostLoading){
        this.setState({
          myPostLoading: true
        })
      } else {
        this.setState({
          myPostLoading: false
        })
      }
    }

    if (prevPostId !== postId) {
      this.setState({
        postId,
      });
      const postsData = cloneDeep(this.state.postsData);
      if(postsData && postId && !this.props.myPostLoading){
        let index = 0 
        // if(postsData && postsData.length > 0) {
        //   index = postsData.findIndex(elem => elem.id === postId);
        // }
        let yPos = scaleModerate(index * 659);
        // this.scroller && this.scroller.scrollTo({x: 0, y: yPos, animated: true})
      }
    }


    if (this.props.profile !== prevProps.profile) {
      const {profile: allProfiles} = this.props;
      const profile = allProfiles && allProfiles[`${userId}`];
      let postsData = [];
      postsData = cloneDeep(get(profile, 'posts', []));

      this.setState({
        postsData,
      });
    }

    if (prevProps.isFocused !== this.props.isFocused) {
        const {profile: allProfiles} = this.props;
        const profile = allProfiles && allProfiles[`${userId}`];
        let postsData = [];
        postsData = cloneDeep(get(profile, 'posts', []));
        if(postsData && postId && !this.props.myPostLoading){
          let index = 0 
          if(postsData && postsData.length > 0) {
            index = postsData.findIndex(elem => elem.id === postId);
          }
          let yPos = scaleModerate(index * 659);
          this.scroller && this.scroller.scrollTo({x: 0, y: yPos, animated: true})
        }
      }
  }

  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
   
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
   
    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  sharePost = async (video) => {
    if (Platform.OS === "android" && !(await this.hasAndroidPermission())) {
      Toast.show('User permission not granted');
      return;
    }
    this.setState({ uploadingStatus: 0.01 });

    const cache = await RNFetchBlob.config({
                fileCache: true,
                appendExt: 'mp4',
              }).fetch('GET', video.content, {}).progress((received, total) => {
                    this.setState({ uploadingStatus: (received / total) * 100 })
                    // console.log('Progress', (received / total) * 100);
                });
    const gallery = await CameraRoll.save(cache.path(), 'video');
    cache.flush();
    this.setState({ uploadingStatus: 0 }, async () => {
      await Share.shareSingle({
          title: (video && video.caption) ? video.caption : 'Performit Video',
          social: Share.Social.INSTAGRAM,
          url: gallery,
      });
    })
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
      actions: {userDetails, addCommentToPost},
    } = this.props;

    await addCommentToPost(
      postId,
      this.state[`newComment${postId}`],
      accessToken,
    );
    await userDetails(userId, accessToken);
    this.setState({
      [`newComment${postId}`]: '',
    });
  };

  trimText = (text, maxLength = 8) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength - 3) + '...';
    } else {
      return text;
    }
  };

  ratePost = async (postId, rating, postOwner) => {
    if(this.props.user && postOwnerId === this.props.user.pk){
      Toast.show('User cannot rate his own post');
      return false;
    }
    const accessToken = this.props.accessToken;
    const userId = this.state.userId;
    const {
      actions: {userDetails, addEditPostRank},
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
    await userDetails(userId, accessToken);
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
    this.props.navigation.navigate('MyPostsCommentsPage', {
      postId,
      activeTab: this.state.activeTab,
    });
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

  onClose = () => {
    let userId = this.state.userId
    if(!userId) userId = this.state.user && this.props.user.pk;
    this.props.navigation.navigate('ProfilePage', {userId});
  };

  // 30+ 10 +350+ 30 + 10 +25 + 10 + 50 + 30 + 10 + 70 +24

  render() {
    const {profile: allProfiles, posts, navigation, commentsList} = this.props;
    let {postsData, userId, postId} = this.state;

    const profile = allProfiles && allProfiles[`${userId}`];

    return (
      <KeyboardAvoidingView
        behavior={'position'}
        style={{flex: 1, backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
                <View style={styles.headerLeftContainer}>
                  <TouchableOpacity
                    style={[styles.leftArrowContainer]}
                    onPress={() => this.onClose()}>
                    <View style={[styles.leftArrow]}>
                      <Image
                        style={[styles.leftArrow]}
                        source={require('../../assets/images/left-arrow.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.headerText}>My Posts</Text>
                </View>
                <View style={styles.headerRightContainer} />
              </SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.screen}
          keyboardShouldPersistTaps={'handled'}
          style={{backgroundColor: 'black'}}
          ref={(scroller) => {this.scroller = scroller}}
          >
          {!this.state.isLoading ? (
            <>
              {postsData.map(postData => (
                <>
                  <View style={styles.postParentContainer}>
                    <View style={styles.postProfileContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ProfilePage', {
                            userId,
                          })
                        }
                        style={[styles.postProfileImage]}>
                        <Image
                          style={[styles.postProfileImage]}
                          source={{
                            uri:
                              profile &&
                              profile.user_details &&
                              profile.user_details.profile_pic,
                          }}
                        />
                      </TouchableOpacity>
                      <View style={styles.postProfileTextContainer}>
                        {profile &&
                        profile.user &&
                        (profile.user.first_name || profile.user.last_name) ? (
                          <Text style={styles.postProfileText}>
                            {`${profile.user.first_name} ${
                              profile.user.last_name
                            }`}
                          </Text>
                        ) : (
                          <Text style={styles.postProfileText}>
                            {profile.user.username}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  <View style={styles.postImageContainer}>
                    <VideoPlayer
                      key={postData && postData.id}
                      showBottomcontrol={true}
                      videoHeight={350}
                      postId={postData && postData.id}
                      source={postData && postData.content}
                      poster={postData && postData.thumbnail}
                      navigation={this.props.navigation}
                      disableVolume="false"
                      disableBack="false"
                      paused={this.state[`paused${postData && postData.id}`]}
                      shouldToggleControls={true}
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
                        this.callPostViewed(
                          postData && postData.id,
                          this.state[`isViewed${postData && postData.id}`],
                        );
                        this.setState({
                          [`paused${postData && postData.id}`]: false,
                        });
                      }}
                      onLoad={fields => {
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
                            this.ratePost(postData && postData.id, 1, postsData && postData.created_by && postData.created_by.pk)
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
                            this.ratePost(postData && postData.id, 2, postsData && postData.created_by && postData.created_by.pk)
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
                            this.ratePost(postData && postData.id, 3, postsData && postData.created_by && postData.created_by.pk)
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
                            this.ratePost(postData && postData.id, 4, postsData && postData.created_by && postData.created_by.pk)
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
                            this.ratePost(postData && postData.id, 5, postsData && postData.created_by && postData.created_by.pk)
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
                              postData.meta_data.avg_rating) ||
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
                            Vote
                            {postData &&
                              postData.meta_data &&
                              postData.meta_data.ratings &&
                              postData.meta_data.ratings.votes > 1 &&
                              's'}
                            )
                          </Text>
                        </View>
                      </View>
                      <View style={styles.postStatsRightContainer}>
                        <Text style={styles.postStatsRightText}>
                          {postData &&
                            postData.meta_data &&
                            postData.meta_data.post_views}{' '}
                          view
                          {postData &&
                            postData.meta_data &&
                            postData.meta_data.post_views > 1 &&
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
                      <TouchableOpacity
                        onPress={() => this.state.uploadingStatus === 0 && this.sharePost(postData)}
                       style={[styles.shareImage]}>
                        <Image
                          style={[styles.shareImage]}
                          source={require('../../assets/images/share_icon.png')}
                        />
                      </TouchableOpacity>
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
                    <View style={styles.captionParentContainer} />
                  )}

                  {/*{postData &&
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
                  )}*/}

                  <View style={styles.commentsParentContainer}>
                    <View style={styles.commentsContainer}>
                      <TouchableOpacity
                        onPress={() =>
                          this.viewAllComments(postData && postData.id)
                        }>
                        <Text style={styles.commentsText}>
                          View all comments
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
          <View style={{width: '100%', height: scaleModerate(120)}} />
        </ScrollView>
        {this.state.uploadingStatus > 0 && this.state.uploadingStatus < 100  && 
            <View style={styles.loaderContainer}>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: scaleModerate(14),
                  fontFamily: 'Nunito',
                  lineHeight: undefined,
                }}>
                Downloading file to share
              </Text>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: scaleModerate(14),
                  fontFamily: 'Nunito',
                  lineHeight: undefined,
                }}>
                {` ${Math.floor(this.state.uploadingStatus)} %`}
              </Text>
            </View>
          }
          {this.state.myPostLoading  && 
            <View style={styles.postLoaderContainer}>
              <ActivityIndicator animating />
            </View>
          }
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
  myPostLoading: state.Profile.myPostLoading,
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

MyPosts.navigationOptions = {
  header: null,
};

export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyPosts));