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
  KeyboardAvoidingView,
} from 'react-native';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import * as messageActions from '../redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../../utils/scale';
import * as profileActions from '../../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import {userTypesConfig} from '../../../config/userTypes';
import moment from 'moment';
import {combineChat} from '../../../utils/combineFetchInbox';
import {sendMessage} from '../../../utils/firebase';
import VideoPlayer from '../../components/VideoPlayer';
import RNImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      chat: {
        messages: [],
        users: [],
      },
      text: '',
      fileModal: false,
      userId: '',
      secondUserId: '',
      newComment: '',
      isSendingMessage: false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  search = {
    searchTimeOut: null,
  };

  setMessages() {
    const chat = this.combineFetchInbox();
    const messages = chat.messages
      .sort((a, b) => moment(a.createdAt).diff(b.createdAt))
      .map((message, i) => ({
        media: message.media,
        text: message.message,
        createdAt: new Date(message.createdAt),
        user: message.user,
      }));
    this.setState({
      chat: {
        ...chat,
        messages,
      },
    });
  }

  async componentDidMount() {
    // write code here
    this.setMessages();
  }

  componentDidUpdate(prevProps) {
    if (this.props.chat.messages.length !== prevProps.chat.messages.length) {
      this.setMessages();
    }
    if (this.props.mediaSuccess !== prevProps.mediaSuccess) {
      if (
        this.props.media &&
        this.props.media.data &&
        this.props.media.data.media
      ) {
        let messages = this.state.chat && this.state.chat.messages;
        messages.push({
          user:
            this.props.profile && this.props.profile[`${this.props.user.pk}`],
          media: this.props.media.data.media,
          createdAt: new Date(),
        });
        this.setState({
          chat: {
            ...this.state.chat,
            messages,
          },
        });

        sendMessage(
          {
            user: this.props.user.pk,
            media: this.props.media.data.media,
            createdAt: new Date(),
          },
          this.props.chat.id,
        );
        this.setState({
          isSendingMessage: false,
        });
      }
    }
  }

  combineFetchInbox(chat = this.props.chat) {
    if (!this.props.Chat.chatSuccess) {
      return;
    }
    const {
      accessToken,
      actions: {userDetails},
    } = this.props;
    return combineChat(chat, this.props.user, this.props.profile);
  }

  onSend(text = '') {
    if (text) {
      this.setState({
        isSendingMessage: true,
      });
      let messages = this.state.chat && this.state.chat.messages;
      messages.push({
        user: this.props.profile && this.props.profile[`${this.props.user.pk}`],
        message: text,
        createdAt: new Date(),
      });
      this.setState({
        chat: {
          ...this.state.chat,
          messages,
        },
      });

      sendMessage(
        {
          user: this.props.user.pk,
          message: text,
          createdAt: new Date(),
        },
        this.props.chat.id,
      );
      this.setState({
        isSendingMessage: false,
        newComment: '',
      });
    }
  }

  handleCommentChange = text => {
    // write code here
    this.setState({
      newComment: text,
    });
  };

  showDate = (messages, index) => {
    if (index === 0) {
      return true;
    } else if (
      messages &&
      messages.length &&
      (!moment(messages[index].createdAt).isSame(
        moment(messages[index - 1].createdAt),
        'day',
      ) ||
        !moment(messages[index].createdAt).isSame(
          moment(messages[index - 1].createdAt),
          'month',
        ) ||
        !moment(messages[index].createdAt).isSame(
          moment(messages[index - 1].createdAt),
          'year',
        ))
    ) {
      return true;
    } else {
      return false;
    }
  };

  showProfileOnMessage = (messages, index) => {
    if (index === 0) {
      return true;
    } else if (
      messages &&
      messages.length &&
      messages[index].user.user.pk !== messages[index - 1].user.user.pk
    ) {
      return true;
    } else {
      return false;
    }
  };

  selectOneFile = async () => {
    //Opening gallery for selection of one file
    this.setState({
      isSendingMessage: true,
    });
    const options = {
      title: 'Video Picker',
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    RNImagePicker.launchImageLibrary(options, async response => {
      let updatedResponse = cloneDeep(response);
      const filename = Date.now().toString();

      const videoData = {
        uri: updatedResponse && updatedResponse.uri,
        name: filename + '.mp4',
        type: 'video',
      };

      const postObject = {
        media: videoData,
      };
      const accessToken = this.props.accessToken;

      const {
        actions: {storeMedia},
      } = this.props;
      const res = await storeMedia(this.props.user.pk, accessToken, postObject);

      setTimeout(() => {
        this.setState({
          isSendingMessage: false,
        });
      }, 60000);
    });
  };

  render() {
    const {navigation} = this.props;

    const {pk} = this.props.user;
    const {chat} = this.state;
    const receiver = this.state.chat.users.find(user => user.pk !== pk);

    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'black',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <KeyboardAvoidingView
          behavior={'position'}
          style={{
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
            <View style={styles.profileRowImageParentContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProfilePage', {
                    userId: receiver && receiver.user && receiver.user.pk,
                  })
                }
                style={[styles.profileRowImageContainer]}>
                <Image
                  style={[styles.profileRowImage]}
                  source={{
                    uri:
                      receiver &&
                      receiver.user_details &&
                      receiver.user_details.profile_pic,
                  }}
                />
              </TouchableOpacity>
              {/*<View style={styles.greenDot} />*/}
            </View>
            <View style={styles.headerTextContainer}>
              {receiver &&
              receiver.user &&
              (receiver.user.first_name || receiver.user.last_name) ? (
                <Text style={styles.headerText}>
                  {receiver.user.first_name} {receiver.user.last_name}
                </Text>
              ) : (
                <Text style={styles.headerText}>
                  {receiver && receiver.user && receiver.user.username}
                </Text>
              )}
            </View>
          </SafeAreaView>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: scaleModerate(16),
            }}>
            <View
              style={{
                height: '89%',
                width: '92%',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <ScrollView
                ref={ref => {
                  this.scrollView = ref;
                }}
                onContentSizeChange={() =>
                  this.scrollView.scrollToEnd({animated: true})
                }
                contentContainerStyle={styles.screen}
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: 'black'}}>
                {chat &&
                  chat.messages &&
                  chat.messages.length > 0 &&
                  chat.messages.map((message, index) => (
                    <>
                      {this.showDate(chat.messages, index) && (
                        <View style={styles.userDateBody}>
                          <Text style={styles.dateText}>
                            {moment(message && message.createdAt).format(
                              'DD MMM YYYY LT',
                            )}
                          </Text>
                        </View>
                      )}

                      {this.showProfileOnMessage(chat.messages, index) && (
                        <View
                          style={{
                            marginBottom: scaleModerate(10),
                          }}
                        />
                      )}

                      {message.user &&
                        message.user.user &&
                        message.user.user.pk && (
                          <View style={styles.userMessageBody}>
                            {message.user.user.pk === this.props.user.pk &&
                              message.text && (
                                <View
                                  style={styles.user2MessageParentContainer}>
                                  <View style={styles.user2MessageContainer}>
                                    {this.showProfileOnMessage(
                                      chat.messages,
                                      index,
                                    ) && (
                                      <TouchableOpacity
                                        onPress={() =>
                                          navigation.navigate('ProfilePage', {
                                            userId:
                                              message.user &&
                                              message.user.user &&
                                              message.user.user.pk,
                                          })
                                        }
                                        style={[
                                          styles.messageUser2ImageContainer,
                                        ]}>
                                        <Image
                                          style={[styles.messageImage]}
                                          source={{
                                            uri:
                                              message.user &&
                                              message.user.user_details &&
                                              message.user.user_details
                                                .profile_pic,
                                          }}
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <Text style={styles.messageText}>
                                      {message.text}
                                    </Text>
                                  </View>
                                </View>
                              )}

                            {message.user.user.pk === this.props.user.pk &&
                              message.media && (
                                <View
                                  style={
                                    styles.user1FileMessageParentContainer
                                  }>
                                  <TouchableOpacity
                                    onPress={() => {
                                      navigation.navigate(
                                        'PreviewVideoMessage',
                                        {
                                          videoData: {
                                            uri: message.media,
                                          },
                                        },
                                      );
                                    }}
                                    style={{
                                      width: scaleModerate(240),
                                      height: scaleModerate(240),
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderColor: '#111111',
                                      borderWidth: 2,
                                    }}>
                                    <VideoPlayer
                                      showBottomcontrol={false}
                                      videoHeight={scaleModerate(240)}
                                      source={message.media}
                                      poster={''}
                                      navigation={this.props.navigation}
                                      disableVolume="false"
                                      disableBack="false"
                                      paused={true}
                                      shouldToggleControls={false}
                                      onPause={() => {
                                        console.log('------pause');
                                      }}
                                      onPlay={() => {
                                        navigation.navigate(
                                          'PreviewVideoMessage',
                                          {
                                            videoData: {
                                              uri: message.media,
                                            },
                                          },
                                        );
                                      }}
                                      showControls={value => {
                                        navigation.navigate(
                                          'PreviewVideoMessage',
                                          {
                                            videoData: {
                                              uri: message.media,
                                            },
                                          },
                                        );
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              )}

                            {message.user.user.pk !== this.props.user.pk &&
                              message.text && (
                                <View
                                  style={styles.user1MessageParentContainer}>
                                  <View style={styles.user1MessageContainer}>
                                    {this.showProfileOnMessage(
                                      chat.messages,
                                      index,
                                    ) && (
                                      <TouchableOpacity
                                        onPress={() =>
                                          navigation.navigate('ProfilePage', {
                                            userId:
                                              message.user &&
                                              message.user.user &&
                                              message.user.user.pk,
                                          })
                                        }
                                        style={[
                                          styles.messageUser1ImageContainer,
                                        ]}>
                                        <Image
                                          style={[styles.messageImage]}
                                          source={{
                                            uri:
                                              message.user &&
                                              message.user.user_details &&
                                              message.user.user_details
                                                .profile_pic,
                                          }}
                                        />
                                      </TouchableOpacity>
                                    )}
                                    <Text style={styles.messageText}>
                                      {message.text}
                                    </Text>
                                  </View>
                                </View>
                              )}

                            {message.user.user.pk !== this.props.user.pk &&
                              message.media && (
                                <View
                                  style={
                                    styles.user1FileMessageParentContainer
                                  }>
                                  <TouchableOpacity
                                    onPress={() => {
                                      navigation.navigate(
                                        'PreviewVideoMessage',
                                        {
                                          videoData: {
                                            uri: message.media,
                                          },
                                        },
                                      );
                                    }}
                                    style={{
                                      width: scaleModerate(240),
                                      height: scaleModerate(240),
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      borderColor: '#111111',
                                      borderWidth: 2,
                                    }}>
                                    <VideoPlayer
                                      showBottomcontrol={false}
                                      videoHeight={scaleModerate(240)}
                                      source={message.media}
                                      poster={''}
                                      navigation={this.props.navigation}
                                      disableVolume="false"
                                      disableBack="false"
                                      paused={true}
                                      shouldToggleControls={false}
                                      onPause={() => {
                                        console.log('------pause');
                                      }}
                                      onPlay={() => {
                                        navigation.navigate(
                                          'PreviewVideoMessage',
                                          {
                                            videoData: {
                                              uri: message.media,
                                            },
                                          },
                                        );
                                      }}
                                      showControls={value => {
                                        navigation.navigate(
                                          'PreviewVideoMessage',
                                          {
                                            videoData: {
                                              uri: message.media,
                                            },
                                          },
                                        );
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              )}
                          </View>
                        )}
                    </>
                  ))}

                <View style={{height: scaleModerate(50)}} />
              </ScrollView>
            </View>
          </View>

          <View style={styles.enterMessageContainer}>
            <View style={styles.commentInputContainer}>
              <TextInput
                value={this.state.newComment}
                onChangeText={text => this.handleCommentChange(text)}
                onFocus={() => console.log('------')}
                onBlur={() => console.log('------')}
                placeholder="Message..."
                style={styles.commentInput}
                autoCapitalize="none"
                placeholderTextColor="#989ba5"
                underlineColorAndroid="transparent"
                multiline={true}
              />
              {!this.state.isSendingMessage && (
                <TouchableOpacity
                  onPress={() => this.selectOneFile()}
                  style={[styles.paperClipContainer]}>
                  <Image
                    style={[styles.paperClipImage]}
                    source={require('../../../assets/images/paperclip.png')}
                  />
                </TouchableOpacity>
              )}
            </View>
            {this.state.isSendingMessage ? (
              <View style={[styles.sendMessageContainer]}>
                <ActivityIndicator animating />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => this.onSend(this.state.newComment)}
                style={[styles.sendMessageContainer]}>
                <Image
                  style={[styles.sendMessageImage]}
                  source={require('../../../assets/images/Send.png')}
                />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => ({
  chat: state.Chat.chat.find(
    item => item.id === props.navigation.getParam('id'),
  ),
  Chat: state.Chat,
  userPostsErrors: state.Posts.errors.UserPosts,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  searchTopAccountsList: state.Posts.searchTopAccountsList,
  searchAccountsList: state.Posts.searchAccountsList,
  searchGroupsList: state.Posts.searchGroupsList,
  searchHashTagsList: state.Posts.searchHashTagsList,
  accessToken: state.EmailAuth.accessToken,
  media: state.Chat.media,
  mediaSuccess: state.Chat.storeMediaSuccess,
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
    searchDashboard: (tab, page, token, term) => {
      dispatch(homeActions.searchDashboard(tab, page, token, term));
    },
    storeMedia: (userId, token, media) => {
      dispatch(messageActions.storeMedia(userId, token, media));
    },
  },
});

Chat.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
