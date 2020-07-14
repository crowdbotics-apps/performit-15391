import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Switch,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {NavigationEvents} from 'react-navigation';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import * as profileActions from '../../ProfilePage/redux/actions';
import VideoPlayer from '../../components/VideoPlayer';

class PreviewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      showDiscardContentModal: false,
      videoData: {},
      thumbnail: {},
      paused: true,
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
    let videoData = this.props.navigation.getParam('videoData', {});
    let thumbnail = this.props.navigation.getParam('thumbnail', {});
    if (!videoData.uri) {
      this.props.navigation.navigate('CreatePostStep1');
    }
    this.setState({
      videoData,
      thumbnail,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevVideoData = prevProps.navigation.getParam('videoData', {});
    const videoData = this.props.navigation.getParam('videoData', {});
    const prevThumbnail = prevProps.navigation.getParam('thumbnail', {});
    const thumbnail = this.props.navigation.getParam('thumbnail', {});
    if (prevVideoData !== videoData) {
      console.log('--------------------here 111');
      if (!videoData.uri) {
        this.props.navigation.navigate('CreatePostStep1');
      }
      videoData &&
        videoData.uri &&
        this.setState({
          videoData,
        });
    }

    if (thumbnail && thumbnail.uri && prevThumbnail !== thumbnail) {
      console.log('--------------------here 222');
      this.setState({
        thumbnail,
      });
    }
  }

  onClose = () => {
    this.setState(
      {
        isLoading: false,
        showDiscardContentModal: false,
        videoData: {},
        caption: '',
      },
      () => this.props.navigation.navigate('CreatePostStep1'),
    );
  };

  onNext = () => {
    this.props.navigation.navigate('CreatePostStep3', {
      videoData: this.state.videoData,
      thumbnail: this.state.thumbnail,
    });
  };

  onScreenFocus = () => {
    if (!this.state.videoData.uri) {
      this.props.navigation.navigate('CreatePostStep1');
    }
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
    const {navigation} = this.props;
    const {isLoading, caption, videoData, thumbnail} = this.state;

    return (
      <View style={styles.screen}>
        <NavigationEvents
          onDidFocus={payload => {
            this.onScreenFocus();
          }}
        />
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => this.onClose()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Preview Post</Text>

            {!isLoading ? (
              videoData &&
              videoData.uri && (
                <TouchableOpacity onPress={() => this.onNext()}>
                  <Text style={styles.headerNextText}>Next</Text>
                </TouchableOpacity>
              )
            ) : (
              <View style={[styles.inputDrawerContainer]}>
                <View style={[styles.inputDrawer]}>
                  <ActivityIndicator animating />
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>

        <View style={styles.bodyContainer}>
          <VideoPlayer
            showBottomcontrol={true}
            videoHeight={350}
            postId={'preview-post'}
            source={videoData && videoData.uri}
            poster={thumbnail && thumbnail.uri}
            navigation={this.props.navigation}
            disableVolume="false"
            disableBack="false"
            paused={this.state.paused}
            onVideoProgress={time => {
              this.setVideoCurrentTime(time, 'preview-post');
            }}
            initializeSeek={() => {
              this.initializeSeekTime('preview-post');
            }}
            onEnd={() => {
              this.setState({
                paused: true,
              });
            }}
            onPause={() => {
              this.setState({
                paused: true,
              });
            }}
            onPlay={() => {
              this.setState({
                paused: false,
              });
            }}
            onLoad={fields => {
              this.setState({
                duration: fields.duration,
              });
            }}
            showControls={value => {
              this.setState({
                showControls: value,
              });
            }}
          />
        </View>

        <Modal
          isOpen={this.state.showDiscardContentModal}
          onClosed={() => this.setState({showDiscardContentModal: false})}
          style={[styles.modal]}
          position={'center'}
          backdropPressToClose={false}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to discard this post?
            </Text>
          </View>
          <View style={styles.modalActionContainer}>
            <TouchableOpacity
              style={styles.discardTextContainer}
              onPress={() => this.onClose()}>
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keepTextContainer}
              onPress={() => this.setState({showDiscardContentModal: false})}>
              <Text style={styles.keepText}>Keep</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  searchHashTagsList: state.Posts.searchHashTagsList,
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
    createPost: (token, content, caption) => {
      dispatch(homeActions.createPost(token, content, caption));
    },
  },
});

PreviewPost.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreviewPost);
