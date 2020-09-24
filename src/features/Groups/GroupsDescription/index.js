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
import Modal from 'react-native-modalbox';
import * as groupActions from '../../Groups/redux/actions';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../../utils/scale';
import * as profileActions from '../../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import VideoPlayer from '../../components/VideoPlayer';

class GroupsDescription extends Component {
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
      groupId: '',
      page: 1,
      counter: 30,
      timer: null,
      showJoinGroupSuccessModal: false
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

    const groupId = this.props.navigation.getParam('groupId', '');
    const accessToken = this.props.accessToken;
    const userId = this.props.user && this.props.user.pk
    const {
      actions: {getGroupDetails},
    } = this.props;

    const {page} = this.state;
    if (userId && accessToken) {
      await getGroupDetails(groupId, page, accessToken);
      // this.setState({
      //   page: page + 1,
      // });
    }
    this.setState({
      isLoading: false,
      groupId,
      userId
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const userId = this.props.user && this.props.user.pk
    const groupId = this.props.navigation.getParam('groupId', '');
    const prevGroupId = prevProps.navigation.getParam('groupId', '');

    if ((groupId !== prevGroupId) || (groupId !== this.state.groupId)) {
      const accessToken = this.props.accessToken;

      const {
        actions: {getGroupDetails},
      } = this.props;

      const {page} = this.state;

      if (userId && accessToken) {
        await getGroupDetails(
          groupId,
          page,
          accessToken
        );
        this.setState({
          groupId,
          userId
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    console.log('----------------unmount')
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

  ratePost = async (postId, rating) => {
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
    const userId = this.props.user && this.props.user.pk;
    this.props.navigation.navigate('ProfilePage', {userId});
  };

  requestOrInviteUser = async (groupData) => {
    if(groupData && groupData.group && groupData.group.group_owner && groupData.group.group_owner.pk === this.state.userId){
      this.props.navigation.navigate('InviteFriendsPage', {groupId: this.state.groupId})
    } else{
        console.log('------------------------')
        const accessToken = this.props.accessToken;
        const {
          actions: {joinGroup},
        } = this.props;

        if (accessToken) {
          await joinGroup(this.state.groupId, accessToken);
          let timer = setInterval(this.tick, 1000);
          this.setState({
            timer,
          });
          setTimeout(async () => {
            clearInterval(this.state.timer);
            this.setState({
              counter: 30,
            });
          }, 30000);
        }
    }

  }

  tick = async () => {
    this.setState({
      counter: this.state.counter - 1,
    });

    if (this.props.joinGroupSuccess === 'success') {
      clearInterval(this.state.timer);
      this.setState({
        showJoinGroupSuccessModal: true,
      });
    }
  };

  onClose = () => {
    this.setState(
      {
        showJoinGroupSuccessModal: false,
      }
    );
  };

  requestOrInviteUserText = (groupData) => {
    let text  = 'Request Join'
    console.log('------group pk', groupData && groupData.group && groupData.group.group_owner && groupData.group.group_owner.pk)
    console.log('------------------------this.state.userId', this.state.userId)
    if(groupData && groupData.group && groupData.group.group_owner && groupData.group.group_owner.pk === this.state.userId){
      text = 'Invite'
    } else {
      console.log('------------------------')
    }

    return text;

  }

  isAccessGranted = (groupData) => {
    if(groupData && groupData.group && groupData.group.group_owner && groupData.group.group_owner.pk === this.state.userId){
      return true
    } else {
      console.log('------------------------')
      return false
    }

  }

  // 30+ 10 +350+ 30 + 10 +25 + 10 + 50 + 30 + 10 + 70 +24

  render() {
    const {profile: allProfiles, posts, navigation, commentsList, groupsFeed} = this.props;
    let {postsData, userId, groupId} = this.state;
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const profile = allProfiles && allProfiles[`${userId}`];
    const groupData = groupsFeed && groupsFeed[`${groupId}`];
    
    const mytextvar = 'It is a long established fact that a reader will be distracted by the readable content of a page layout. It is a long established fact that a reader will be distracted by the readable content of a page layout.'

    return (
      <KeyboardAvoidingView
        behavior={'position'}
        style={{flex: 1, backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
                <View style={styles.headerLeftContainer}>
                  <TouchableOpacity
                    style={[styles.leftArrowContainer]}
                    onPress={() => this.props.navigation.goBack()}>
                    <View style={[styles.leftArrow]}>
                      <Image
                        style={[styles.leftArrow]}
                        source={require('../../../assets/images/left-arrow.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.headerText}>{groupData && groupData.group && groupData.group.group_name}</Text>
                </View>
                <TouchableOpacity
                 onPress={() => this.requestOrInviteUser(groupData)}
                 style={styles.headerRightContainer}>
                  <Text style={styles.headerRightText}>{this.requestOrInviteUserText(groupData)}</Text>
                </TouchableOpacity>
              </SafeAreaView>
        <ScrollView
          contentContainerStyle={styles.screen}
          keyboardShouldPersistTaps={'handled'}
          style={{backgroundColor: 'black'}}
          ref={(scroller) => {this.scroller = scroller}}
          >
          {!this.state.isLoading ? (
            <>
              <View style={styles.groupDescriptionContainer}>
                <View style={[styles.groupImageContainer]}>
                  <Image
                    style={[styles.groupImage]}
                    source={{
                      uri: groupData && groupData.group && groupData.group.group_icon
                    }}
                  />
                </View>
                <View style={[styles.groupDescriptionRightContainer]}>
                  <View style={[styles.groupTitleContainer]}>
                    <Text style={styles.groupTitleText}>{groupData && groupData.group && groupData.group.group_name}</Text>
                  </View>
                  <View style={styles.groupDescContainer}>
                   <Text style={styles.groupDescText}>
                      { (groupData && groupData.group && groupData.group.group_description && 
                        (groupData && groupData.group && groupData.group.group_description).length > 150) ? 
                        (((groupData && groupData.group && groupData.group.group_description).substring(0,150-3)) + '...') : 
                        groupData && groupData.group && groupData.group.group_description }
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.groupMemberContainer}>
                <View style={[styles.groupMemberImageContainer]}>
                  {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members &&  groupData.group.meta_data.members.length > 0 && <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: '',
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          groupData.group.meta_data.members[0].member_user &&
                          groupData.group.meta_data.members[0].member_user.meta_data &&
                          groupData.group.meta_data.members[0].member_user.meta_data.user_details &&
                          groupData.group.meta_data.members[0].member_user.meta_data.user_details.profile_pic
                      }}
                    />
                  </TouchableOpacity>}

                  {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members && groupData.group.meta_data.members.length > 1 && <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: '',
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          groupData.group.meta_data.members[1].member_user &&
                          groupData.group.meta_data.members[1].member_user.meta_data &&
                          groupData.group.meta_data.members[1].member_user.meta_data.user_details &&
                          groupData.group.meta_data.members[1].member_user.meta_data.user_details.profile_pic
                      }}
                    />
                  </TouchableOpacity>}

                  {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members && groupData.group.meta_data.members.length > 2 && <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: '',
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          groupData.group.meta_data.members[2].member_user &&
                          groupData.group.meta_data.members[2].member_user.meta_data &&
                          groupData.group.meta_data.members[2].member_user.meta_data.user_details &&
                          groupData.group.meta_data.members[2].member_user.meta_data.user_details.profile_pic
                      }}
                    />
                  </TouchableOpacity>}

                </View>
                <View style={[styles.groupMemberRightContainer]}>
                  <Text style={styles.followProfileText}>
                    <Text
                      style={[
                        styles.followProfileText,
                        {color: '#B88746', fontSize: scaleModerate(12)},
                      ]}>
                      {''}
                      {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.group_member_count}{' '}
                      members{' '}
                    </Text>
                    {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members &&  groupData.group.meta_data.members.length > 0 &&
                        'including '
                    }
                    {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members &&  groupData.group.meta_data.members.length > 0 &&
                        groupData.group.meta_data.members[0].member_user && groupData.group.meta_data.members[0].member_user.first_name ?
                        `${groupData.group.meta_data.members[0].member_user.first_name} ${groupData.group.meta_data.members[0].member_user.last_name}` :
                        groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members &&  groupData.group.meta_data.members.length > 0 &&
                        groupData.group.meta_data.members[0].member_user && groupData.group.meta_data.members[0].member_user.username && `${groupData.group.meta_data.members[0].member_user.username}`
                    }
                    {groupData && groupData.group && groupData.group.meta_data && groupData.group.meta_data.members &&  groupData.group.meta_data.members.length > 1 &&
                        ` and ${groupData.group.meta_data.members.length - 1} others`
                    }
                  </Text>
                </View>
              </View>
              {this.isAccessGranted(groupData) && groupData && groupData.data && groupData.data.length > 0  && groupData.data.map(postData => (
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
                              source={require('../../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../../assets/images/empty_star.png')}
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
                              source={require('../../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../../assets/images/empty_star.png')}
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
                              source={require('../../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../../assets/images/empty_star.png')}
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
                              source={require('../../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../../assets/images/empty_star.png')}
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
                              source={require('../../../assets/images/filled_star.png')}
                            />
                          ) : (
                            <Image
                              style={[styles.starImage]}
                              source={require('../../../assets/images/empty_star.png')}
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
                          source={require('../../../assets/images/comment_icon.png')}
                        />
                      </TouchableOpacity>
                      <View style={[styles.shareImage]}>
                        <Image
                          style={[styles.shareImage]}
                          source={require('../../../assets/images/share_icon.png')}
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
              {!this.isAccessGranted(groupData) && <View style={styles.noAccessContainer}>
                    <Image
                      style={[styles.noAccessImage]}
                      source={require('../../../assets/images/group-locked.png')}
                    />
                </View>
              }
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
          {groupData && groupData.group && groupData.group.group_owner && groupData.group.group_owner.pk === this.state.userId && 
            <TouchableOpacity style={styles.addPostButton}
              onPress={() => this.props.navigation.navigate('CreatePostStep1', {groupId: this.state.groupId})}
            >
              <Image
                style={[styles.postButtonImage]}
                source={require('../../../assets/images/create-group-post.png')}
              />
          </TouchableOpacity>}

          <Modal
            isOpen={this.state.showJoinGroupSuccessModal}
            onClosed={() => this.setState({showJoinGroupSuccessModal: false})}
            style={[styles.modal]}
            position={'center'}
            backdropPressToClose={false}>
            <View style={styles.modalTextContainer}>
              <Text style={styles.modalText}>Your Request was sent to Group admin</Text>
            </View>
            <TouchableOpacity
              style={styles.okTextContainer}
              onPress={() => this.onClose()}>
              <Text style={styles.okText}>OK</Text>
            </TouchableOpacity>
          </Modal>
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
  groupsFeed: state.Group.groupsFeed,
  joinGroupSuccess: state.Group.joinGroupSuccess
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
    getGroupDetails: (group_id, page, token) => {
      dispatch(groupActions.getGroupDetails(group_id, page, token));
    },
    joinGroup: (group_id, token) => {
      dispatch(groupActions.joinGroup(group_id, token));
    },
  },
});

GroupsDescription.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsDescription);
