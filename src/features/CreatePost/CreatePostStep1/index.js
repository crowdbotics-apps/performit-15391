import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {cloneDeep} from 'lodash';
import {RNCamera} from 'react-native-camera';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import * as profileActions from '../../ProfilePage/redux/actions';

class CreatePostStep1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      timer: null,
      seconds_Counter: 0,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      galleryImagePath: false,
      cameraImagePath: false,
      isRecording: false,
      isProcessing: false,
      isCameraButton: false,
      showDiscardContentModal: false,
      camera: {
        type: RNCamera.Constants.Type.back,
        orientation: RNCamera.Constants.Orientation.auto,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      videoData: {},
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
  }

  async componentDidUpdate(prevProps) {
    // write code here
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onClose = () => {
    this.setState(
      {
        showDiscardContentModal: false,
      },
      () => this.props.navigation.navigate('HomePage', {userId: ''}),
    );
  };

  switchType = () => {
    console.log('-----------------------switch');
    let newType;
    const {back, front} = RNCamera.Constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  };

  switchFlash = () => {
    let newFlashMode;
    const {auto, on, off} = RNCamera.Constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  };

  onPressIn = () => {
    console.log('-----------------------recording started');
    this.setState(
      {
        isRecording: true,
      },
      () => {
        console.log('-----------------------recording fdsgsd');
        let timer = setInterval(() => {
          console.log('----56565656565656');
          // default to mp4 for android as codec is not set
          let num = this.state.seconds_Counter + 1;

          this.setState({
            seconds_Counter: num,
          });
        }, 10000);
        this.setState({timer});
        this.startRecording();
      },
    );
  };

  startRecording = () => {
    console.log('--------this.state.isRecording 00000', this.state.isRecording);
    if (this.camera && this.state.isRecording) {
      console.log(
        '--------this.state.isRecording 11111',
        this.state.isRecording,
      );
      this.setState({isRecording: true});

      const options = {
        orientation: 'auto',
        quality: RNCamera.Constants.VideoQuality['480p'],
        maxDuration: 90,
      };

      console.log(
        '----------------------------------------this.camera',
        this.camera,
      );
      this.camera
        .recordAsync(options)
        .then(async data => {
          // fires first time, does not fire second time
          const videoData = {};
          videoData.type = 'video';
          videoData.name = 'post_video';
          videoData.uri = data && data.uri;
          // && data.uri.replace('file://', '')
          console.log('-------------------------videoData', videoData);
          this.setState({videoData});
          const postObject = {
            content: videoData,
          };
          console.log('----------------postObject', postObject);
          const userId = this.props.user && this.props.user.pk;
          const accessToken = this.props.accessToken;

          const {
            actions: {userPosts, createPost},
          } = this.props;

          await createPost(accessToken, postObject, 'lplplp');

          if (userId && accessToken) {
            await userPosts('following', accessToken, userId);
          }
        })
        .catch(err => console.log(err, 'errorrrrrr'));
    }
  };

  stopRecording = () => {
    console.log('-----------------------recording stopped');
    console.log('----this.state.seconds_Counter', this.state.seconds_Counter);
    if (this.camera) {
      clearInterval(this.state.timer);
      this.setState(
        {
          isRecording: false,
        },
        async () => {
          this.camera.stopRecording();
        },
      );
    }
  };

  render() {
    const {navigation} = this.props;
    const {activeTab, recordingStarted, camera} = this.state;

    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => navigation.navigate('HomePage', {userId: ''})}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{this.state.activeTab}</Text>
            <TouchableOpacity
              onPress={() =>
                activeTab === 'Video'
                  ? navigation.navigate('CreatePostStep3')
                  : navigation.navigate('CreatePostStep2')
              }>
              <Text style={styles.headerNextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.bodyContainer}>
          <View style={styles.upperBodyContainer}>
            {activeTab === 'Video' && (
              <>
                <RNCamera
                  ref={cam => {
                    this.camera = cam;
                  }}
                  style={styles.RNCamera}
                  type={camera && camera.type}
                  flashMode={RNCamera.Constants.FlashMode.on}
                  permissionDialogTitle={'Permission to use camera'}
                  permissionDialogMessage={
                    'We need your permission to use your camera phone'
                  }
                />
                <View style={styles.videoControlsContainer}>
                  <TouchableOpacity
                    style={[styles.flipCameraContainer]}
                    onPress={() => this.switchType()}>
                    <View style={[styles.flipCamera]}>
                      <Image
                        style={[styles.flipCamera]}
                        source={require('../../../assets/images/flip_camera_icon.png')}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.flashCameraContainer]}
                    onPress={() => this.switchFlash()}>
                    <View style={[styles.flashCamera]}>
                      <Image
                        style={[styles.flashCamera]}
                        source={require('../../../assets/images/flash.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {activeTab === 'Audio' && (
              <View style={styles.upperAudioContainer}>
                {!recordingStarted && (
                  <View style={[styles.audioMike]}>
                    <Image
                      style={[styles.audioMike]}
                      source={require('../../../assets/images/mike_standby.png')}
                    />
                  </View>
                )}

                {!!recordingStarted && (
                  <View style={[styles.recordingAudioMike]}>
                    <Image
                      style={[styles.recordingAudioMike]}
                      source={require('../../../assets/images/mike_record.png')}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={styles.videoBarContainer} />
          </View>

          <View style={styles.lowerBodyContainer}>
            <View style={styles.recordButtonParentContainer}>
              {recordingStarted && (
                <View style={[styles.timeContainer]}>
                  <View style={styles.redDot} />
                  <Text style={styles.timeText}>01:35</Text>
                </View>
              )}

              <TouchableWithoutFeedback
                style={[styles.recordButtonContainer]}
                onPressIn={() => this.onPressIn()}
                onPress={() => this.stopRecording()}>
                <View style={[styles.recordButton]}>
                  <Image
                    style={[styles.recordButton]}
                    source={require('../../../assets/images/record_icon.png')}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>

            {!recordingStarted && (
              <View style={styles.libraryButtonParentContainer}>
                <TouchableOpacity
                  style={[styles.libraryButtonContainer]}
                  onPress={() => console.log('------rotate')}>
                  <View style={[styles.libraryButton]}>
                    <Image
                      style={[styles.libraryButton]}
                      source={require('../../../assets/images/library.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {!recordingStarted && (
              <View style={styles.bottomTabContainer}>
                <TouchableOpacity
                  style={[styles.bottomLeftContainer]}
                  onPress={() => this.setState({activeTab: 'Video'})}>
                  <Text
                    style={[
                      styles.bottomTabText,
                      activeTab === 'Video' && {color: '#B88746'},
                    ]}>
                    VIDEO
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.bottomRightContainer]}
                  onPress={() => this.setState({activeTab: 'Audio'})}>
                  <Text
                    style={[
                      styles.bottomTabText,
                      activeTab === 'Audio' && {color: '#B88746'},
                    ]}>
                    AUDIO
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {!!recordingStarted && (
              <View style={styles.bottomDeleteParentContainer}>
                <TouchableOpacity
                  style={[styles.bottomDeleteContainer]}
                  onPress={() =>
                    this.setState({showDiscardContentModal: true})
                  }>
                  <View style={[styles.leftArrowButton]}>
                    <Image
                      style={[styles.leftArrowButton]}
                      source={require('../../../assets/images/left-icon.png')}
                    />
                  </View>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
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

CreatePostStep1.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostStep1);
