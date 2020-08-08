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

class PreviewVideoMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      showDiscardContentModal: false,
      videoData: {},
      paused: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // write code here
    let videoData = this.props.navigation.getParam('videoData', {});
    if (!videoData.uri) {
      this.props.navigation.navigate('CreatePostStep1');
    }
    this.setState({
      videoData,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevVideoData = prevProps.navigation.getParam('videoData', {});
    const videoData = this.props.navigation.getParam('videoData', {});
    if (prevVideoData !== videoData) {
      if (!videoData.uri) {
        this.props.navigation.goBack();
      }
      videoData &&
        videoData.uri &&
        this.setState({
          videoData,
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
      () => this.props.navigation.goBack(),
    );
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
    const {isLoading, caption, videoData} = this.state;

    return (
      <View style={styles.screen}>
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
        </SafeAreaView>

        <View style={styles.bodyContainer}>
          <VideoPlayer
            showBottomcontrol={true}
            videoHeight={350}
            postId={'preview-post'}
            source={videoData && videoData.uri}
            poster={''}
            navigation={this.props.navigation}
            disableVolume="false"
            disableBack="false"
            paused={this.state.paused}
            shouldToggleControls={true}
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

PreviewVideoMessage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreviewVideoMessage);
