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

class CreatePostStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      showDiscardContentModal: false,
      videoData: {},
      caption: '',
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
        this.props.navigation.navigate('CreatePostStep1');
      }
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
      () => this.props.navigation.navigate('HomePage', {userId: ''}),
    );
  };

  onShare = async () => {
    this.setState({
      isLoading: true,
    });
    const postObject = {
      content: this.state.videoData,
    };
    const userId = this.props.user && this.props.user.pk;
    const accessToken = this.props.accessToken;

    const {
      actions: {userPosts, createPost},
    } = this.props;

    await createPost(accessToken, postObject, this.state.caption);

    if (userId && accessToken) {
      await userPosts('following', accessToken, userId);
    }
    this.setState(
      {
        isLoading: false,
        showDiscardContentModal: false,
        videoData: {},
        caption: '',
      },
      () => {
        this.props.navigation.navigate('HomePage', {userId: ''});
      },
    );
  };

  handleCaptionChange = text => {
    this.setState({caption: text});
    // todo change keyboard and add validation
  };

  onScreenFocus = () => {
    if (!this.state.videoData.uri) {
      this.props.navigation.navigate('CreatePostStep1');
    }
  };

  render() {
    const {navigation} = this.props;
    const {isLoading, caption, videoData} = this.state;

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
            onPress={() => this.setState({showDiscardContentModal: true})}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>New Post</Text>

            {!isLoading ? (
              videoData &&
              videoData.uri && (
                <TouchableOpacity onPress={() => this.onShare()}>
                  <Text style={styles.headerNextText}>Share</Text>
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
        <View style={styles.captionContainer}>
          <View style={styles.captionVideoContainer}>
            <View style={[styles.videoIcon]}>
              {videoData && videoData.type === 'video' ? (
                <Image
                  style={[styles.videoIcon]}
                  source={require('../../../assets/images/video_icon.png')}
                />
              ) : (
                <Image
                  style={[styles.videoIcon]}
                  source={require('../../../assets/images/mike_small.png')}
                />
              )}
            </View>
          </View>
          <View style={styles.bioInputContainer}>
            <TextInput
              value={caption}
              onChangeText={this.handleCaptionChange}
              placeholder="Write a caption..."
              style={styles.bioInput}
              autoCapitalize="none"
              placeholderTextColor="#989ba5"
              underlineColorAndroid="transparent"
              multiline={true}
            />
          </View>
        </View>

        <View style={styles.followProfileRowContainer}>
          <Text style={styles.followProfileText}>Also Post to</Text>
        </View>

        <View style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <TouchableOpacity
              onPress={() => console.log('---')}
              style={[styles.profileRowImageContainer]}>
              <Image
                style={[styles.profileRowImage]}
                source={{
                  uri: '',
                }}
              />
            </TouchableOpacity>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Group 1</Text>
              </View>
            </View>
          </View>
          <View style={styles.followingButtonContainer}>
            <Switch
              style={styles.switchButton}
              onTintColor={'#B88746'}
              value={this.state.isGroupSelected}
              onValueChange={e => this.setState({isGroupSelected: e})}
            />
          </View>
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
    searchDashboard: (tab, page, token, term) => {
      dispatch(homeActions.searchDashboard(tab, page, token, term));
    },
    createPost: (token, content, caption) => {
      dispatch(homeActions.createPost(token, content, caption));
    },
  },
});

CreatePostStep3.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostStep3);
