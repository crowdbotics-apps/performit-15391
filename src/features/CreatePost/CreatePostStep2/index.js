import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import * as profileActions from '../../ProfilePage/redux/actions';
import {RNCamera} from 'react-native-camera';
import RNImagePicker from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import {cloneDeep} from 'lodash';

class CreatePostStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      showDiscardContentModal: false,
      videoData: {},
      camera: {
        type: RNCamera.Constants.Type.back,
        orientation: RNCamera.Constants.Orientation.auto,
        flashMode: RNCamera.Constants.FlashMode.auto,
      },
      groupId: ''
    };
  }

  static navigationOptions = {
    header: null,
  };
  b;

  search = {
    searchTimeOut: null,
  };

  async componentDidMount() {
    // write code here
    let videoData = this.props.navigation.getParam('videoData', {});
    const groupId = this.props.navigation.getParam('groupId', '');
    console.log('-----------------ceatePost2 groupId 000000', groupId)
    if (!videoData.uri) {
      this.props.navigation.navigate('CreatePostStep1', {groupId});
    }
    this.setState({
      videoData,
      groupId
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevVideoData = prevProps.navigation.getParam('videoData', {});
    const videoData = this.props.navigation.getParam('videoData', {});
    const groupId = this.props.navigation.getParam('groupId', '');
    const prevGroupId = prevProps.navigation.getParam('groupId', '');

    if (prevVideoData !== videoData) {
      if (!videoData.uri) {
        this.props.navigation.navigate('CreatePostStep1', {groupId});
      }
      this.setState({
        videoData,
      });
    }
    console.log('-----------------ceatePost2 groupId 111111', groupId)
    console.log('-----------------ceatePost2 prevGroupId 222222', prevGroupId)
    console.log('-----------------ceatePost2 this.state.groupId 333333', this.state.groupId)
    if ((groupId !== prevGroupId) || (groupId !== this.state.groupId)) {
      this.setState({
        groupId,
      });
    }
  }

  switchType = () => {
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

  onBack = () => {
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

  onNext = () => {
    this.props.navigation.navigate('CreatePostStep3', {
      videoData: this.state.videoData,
      thumbnail: this.state.thumbnail,
      groupId: this.state.groupId
    });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      let thumbnail = '';
      thumbnail = data && data.uri;
      const filename = Date.now().toString();
      this.props.navigation.navigate('PreviewPost', {
        videoData: this.state.videoData,
        thumbnail: {
          uri: thumbnail,
          name: filename + '.png',
        },
        groupId: this.state.groupId
      });
    }
  };

  openGallery = () => {
    const options = {
      noData: true,
    };
    RNImagePicker.launchImageLibrary(options, response => {
      if (response && response.fileSize / 1000000 > 7) {
        Toast.show('The minimum size is 1Kb \n The maximum size is 7 Mb');
      }

      let updatedResponse = cloneDeep(response);
      const filename = Date.now().toString();
      if (
        !updatedResponse.fileName ||
        updatedResponse.fileName === '' ||
        updatedResponse.fileName === undefined ||
        updatedResponse.fileName === null
      ) {
        updatedResponse.fileName = filename + '.png';
      }

      const thumbnail = {
        uri:
          Platform.OS === 'android'
            ? updatedResponse.uri
            : updatedResponse.uri.replace('file://', ''),
        name: updatedResponse.fileName,
      };
      this.props.navigation.navigate('PreviewPost', {
        videoData: this.state.videoData,
        thumbnail,
        groupId: this.state.groupId
      });
    });
  };

  androidCameraPO: {
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  };

  androidRecordAudioPO: {
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel',
  };

  render() {
    const {navigation} = this.props;
    const {camera} = this.state;
    const {on} = RNCamera.Constants.FlashMode;

    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => this.onBack()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Add Placholder image</Text>
            {/*<TouchableOpacity onPress={() => this.onNext()}>
              <Text style={styles.headerNextText}>Next</Text>
            </TouchableOpacity>*/}
          </View>
        </SafeAreaView>

        <View style={styles.bodyContainer}>
          <View style={styles.upperBodyContainer}>
            <RNCamera
              ref={cam => {
                this.camera = cam;
              }}
              style={styles.RNCamera}
              type={camera && camera.type}
              flashMode={camera && camera.flashMode}
              androidCameraPermissionOptions={this.androidCameraPO}
              androidRecordAudioPermissionOptions={this.androidRecordAudioPO}
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
                  {this.state.camera.flashMode === on ? (
                    <Image
                      style={[styles.flashCamera]}
                      source={require('../../../assets/images/flash_filled.png')}
                    />
                  ) : (
                    <Image
                      style={[styles.flashCamera]}
                      source={require('../../../assets/images/flash.png')}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.lowerBodyContainer}>
            <View style={styles.recordButtonParentContainer}>
              <TouchableOpacity
                style={[styles.recordButtonContainer]}
                onPress={() => this.takePicture()}>
                <View style={[styles.recordButton]}>
                  <Image
                    style={[styles.recordButton]}
                    source={require('../../../assets/images/record_icon.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.libraryButtonParentContainer}>
              <TouchableOpacity
                style={[styles.libraryButtonContainer]}
                onPress={() => this.openGallery()}>
                <View style={[styles.libraryButton]}>
                  <Image
                    style={[styles.libraryButton]}
                    source={require('../../../assets/images/library.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
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
  accessToken: state.EmailAuth.accessToken,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
  },
});

CreatePostStep2.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostStep2);
