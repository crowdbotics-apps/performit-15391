import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modalbox';
import MovToMp4 from 'react-native-mov-to-mp4';
import AudioRecord from 'react-native-audio-record';
import SoundRecorder from 'react-native-sound-recorder';
import DocumentPicker from 'react-native-document-picker';
import RNImagePicker from 'react-native-image-picker';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {cloneDeep} from 'lodash';
import {RNCamera} from 'react-native-camera';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import * as profileActions from '../../ProfilePage/redux/actions';
import Toast from 'react-native-simple-toast';

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
      groupId: '',
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
    const groupId = this.props.navigation.getParam('groupId', '');
    this.setState({
      groupId
    })
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const groupId = this.props.navigation.getParam('groupId', '');
    const prevGroupId = prevProps.navigation.getParam('groupId', '');
    if ((groupId !== prevGroupId) || (groupId !== this.state.groupId)) {
        this.setState({
          groupId,
        });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  onClose = () => {
    clearInterval(this.state.timer);
    this.setState(
      {
        showDiscardContentModal: false,
        seconds_Counter: 0,
        videoData: {},
      },
      () => this.props.navigation.navigate('HomePage', {userId: ''}),
    );
  };

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

  onPressIn = () => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.MICROPHONE)
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              // console.log('The permission is granted');
              if (this.state.activeTab === 'Audio') {
                this.setState(
                  {
                    isRecording: true,
                    seconds_Counter: 0,
                    videoData: {},
                  },
                  () => {
                    this.startAudioRecording();
                    let timer = setInterval(this.tick, 1000);
                    this.setState({
                      timer,
                    });
                    setTimeout(() => {
                      clearInterval(this.state.timer);
                    }, 90000);

                    if (this.state.activeTab === 'Video') {
                      this.camera && this.startVideoRecording();

                      let timer = setInterval(this.tick, 1000);
                      this.setState({
                        timer,
                      });
                      setTimeout(() => {
                        clearInterval(this.state.timer);
                      }, 90000);
                    }
                  },
                );
              }
              check(PERMISSIONS.IOS.CAMERA)
                .then(result => {
                  switch (result) {
                    case RESULTS.GRANTED:
                      // console.log('The permission is granted');
                      if (this.state.activeTab === 'Video') {
                        this.setState(
                          {
                            isRecording: true,
                            seconds_Counter: 0,
                            videoData: {},
                          },
                          () => {
                            this.camera && this.startVideoRecording();

                            let timer = setInterval(this.tick, 1000);
                            this.setState({
                              timer,
                            });
                            setTimeout(() => {
                              clearInterval(this.state.timer);
                            }, 90000);
                          },
                        );
                      }
                      break;
                  }
                })
                .catch(error => {
                  // …
                });
              break;
          }
        })
        .catch(error => {
          // …
        });
    } else {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              // console.log('The permission is granted');
              break;
          }
        })
        .catch(error => {
          // …
        });

      check(PERMISSIONS.ANDROID.RECORD_AUDIO)
        .then(result => {
          switch (result) {
            case RESULTS.GRANTED:
              // console.log('The permission is granted');
              break;
          }
        })
        .catch(error => {
          // …
        });
    }

    request(PERMISSIONS.IOS.CAMERA).then(result => {
      if (result === RESULTS.BLOCKED) {
        this.state.activeTab === 'Video' && alert('CAMERA Permission Denied.');
      }
    });

    request(PERMISSIONS.IOS.MICROPHONE).then(result => {
      if (result === RESULTS.BLOCKED) {
        alert('MICROPHONE Permission Denied.');
      }
    });
  };

  startVideoRecording = () => {
    if (this.camera && this.state.isRecording) {
      this.setState({isRecording: true});

      const options = {
        orientation: 'auto',
        quality: RNCamera.Constants.VideoQuality['480p'],
        maxDuration: 90,
      };
      this.camera
        .recordAsync(options)
        .then(async data => {
          // fires first time, does not fire second time
          const filename = Date.now().toString();
          data &&
            data.uri &&
            MovToMp4.convertMovToMp4(data.uri, filename).then(async results => {
              //here you can upload the video...
              const videoData = {};
              videoData.type = 'video';
              videoData.name = filename + '.mp4';
              videoData.uri = results;
              this.setState({videoData});
            });
        })
        .catch(err => console.log(err, 'errorrrrrr'));
    }
  };

  stopRecording = async () => {
    if (this.state.activeTab === 'Video' && this.state.isRecording) {
      this.setState(
        {
          isRecording: false,
        },
        async () => {
          clearInterval(this.state.timer);
          this.camera && this.camera.stopRecording();
        },
      );
    } else if (this.state.isRecording) {
      clearInterval(this.state.timer);
      SoundRecorder.stop().then(result => {
        const filename = Date.now().toString();
        const videoData = {};
        videoData.type = 'audio';
        videoData.name = filename + '.mp3';
        videoData.uri = result.path;
        this.setState({
          isRecording: false,
          videoData,
        });
      });
    }
  };

  startAudioRecording = async () => {
    SoundRecorder.start(SoundRecorder.PATH_CACHE + '/test.mp4').then(
      function() {
        console.log('started recording');
      },
    );
  };

  tick = () => {
    this.setState({
      seconds_Counter: this.state.seconds_Counter + 1,
    });
  };

  /*selectOneFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      this.setState({
        seconds_Counter: 0,
        videoData: {},
      });
      const videoData = {};
      if (this.state.activeTab === 'Video') {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.video],
        });
        const filename = Date.now().toString();
        videoData.type = 'video';
        videoData.name = filename + '.mp4';
        videoData.uri = res.uri;
      } else {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.audio],
          //There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        //Printing the log reslted to the file
        // console.log('res : ' + JSON.stringify(res));
        // console.log('URI : ' + res.uri);
        // console.log('Type : ' + res.type);
        // console.log('File Name : ' + res.name);
        // console.log('File Size : ' + res.size);
        //Setting the state to show single file attributes
        this.setState({singleFile: res});
        const filename = Date.now().toString();
        videoData.type = 'audio';
        videoData.name = filename + '.mp3';
        videoData.uri = res.uri;
      }
      this.setState({videoData}, () => {
        this.props.navigation.navigate('CreatePostStep3', {videoData});
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        console.log('File not selected');
      } else {
        //For Unknown Error
        console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };*/

  selectOneFile = async () => {
    //Opening gallery for selection of one file

    if (this.state.activeTab === 'Video') {
      const options = {
        title: 'Video Picker',
        mediaType: 'video',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      RNImagePicker.launchImageLibrary(options, response => {
        let updatedResponse = cloneDeep(response);
        const filename = Date.now().toString();

        const videoData = {
          uri: updatedResponse && updatedResponse.uri,
          name: filename + '.mp4',
          type: 'video',
        };
        // .replace('file://', '')
        this.props.navigation.navigate('PreviewPost', {videoData, groupId: this.state.groupId});
      });
    } else {
      try {
        this.setState({
          seconds_Counter: 0,
          videoData: {},
        });
        const videoData = {};
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.audio],
        });
        //Setting the state to show single file attributes
        this.setState({singleFile: res});
        const filename = Date.now().toString();
        videoData.type = 'audio';
        videoData.name = filename + '.mp3';
        videoData.uri = res.uri;
        this.setState({videoData}, () => {
          this.props.navigation.navigate('CreatePostStep2', {videoData, groupId: this.state.groupId});
        });
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          console.log('File not selected');
        } else {
          //For Unknown Error
          console.log('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    }
  };

  onNextPress = () => {
    const {activeTab, videoData} = this.state;

    this.setState(
      {
        isRecording: false,
        seconds_Counter: 0,
        videoData: {},
      },
      () => {
        activeTab === 'Video'
          ? this.props.navigation.navigate('PreviewPost', {videoData, groupId: this.state.groupId})
          : this.props.navigation.navigate('CreatePostStep2', {videoData, groupId: this.state.groupId});
      },
    );
  };

  render() {
    const {navigation} = this.props;
    const {
      activeTab,
      recordingStarted,
      camera,
      seconds_Counter,
      videoData,
      isRecording,
    } = this.state;
    const minutes = Math.floor(seconds_Counter / 60);
    const seconds = seconds_Counter - minutes * 60;
    const filledPercentage = (seconds_Counter / 90) * 100;
    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => this.onClose()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{this.state.activeTab}</Text>
            {videoData && videoData.uri && (
              <TouchableOpacity onPress={() => this.onNextPress()}>
                <Text style={styles.headerNextText}>Next</Text>
              </TouchableOpacity>
            )}
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
                  /*androidCameraPermissionOptions={{
                    title: 'Permission to use camera',
                    message: 'We need your permission to use your camera',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}
                  androidRecordAudioPermissionOptions={{
                    title: 'Permission to use audio recording',
                    message: 'We need your permission to use your audio',
                    buttonPositive: 'Ok',
                    buttonNegative: 'Cancel',
                  }}*/
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
                  {/*<TouchableOpacity
                    style={[styles.flashCameraContainer]}
                    onPress={() => this.switchFlash()}>
                    <View style={[styles.flashCamera]}>
                      <Image
                        style={[styles.flashCamera]}
                        source={require('../../../assets/images/flash.png')}
                      />
                    </View>
                  </TouchableOpacity>*/}
                </View>
              </>
            )}
            {activeTab === 'Audio' && (
              <View style={styles.upperAudioContainer}>
                {!isRecording && (
                  <View style={[styles.audioMike]}>
                    <Image
                      style={[styles.audioMike]}
                      source={require('../../../assets/images/mike_standby.png')}
                    />
                  </View>
                )}

                {!!isRecording && (
                  <View style={[styles.recordingAudioMike]}>
                    <Image
                      style={[styles.recordingAudioMike]}
                      source={require('../../../assets/images/mike_record.png')}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={styles.videoBarContainer}>
              <View
                style={[
                  styles.filledVideoBarContainer,
                  {width: `${filledPercentage}%`},
                ]}
              />
            </View>
          </View>

          <View style={styles.lowerBodyContainer}>
            <View style={styles.recordButtonParentContainer}>
              {!!seconds_Counter && (
                <View style={[styles.timeContainer]}>
                  <View style={styles.redDot} />
                  <Text style={styles.timeText}>
                    {minutes}:{seconds}
                  </Text>
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

            {!seconds_Counter && (
              <View style={styles.libraryButtonParentContainer}>
                <TouchableOpacity
                  style={[styles.libraryButtonContainer]}
                  onPress={() => this.selectOneFile()}>
                  <View style={[styles.libraryButton]}>
                    <Image
                      style={[styles.libraryButton]}
                      source={require('../../../assets/images/library.png')}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {!seconds_Counter && (
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
            {!!seconds_Counter && (
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

CreatePostStep1.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostStep1);
