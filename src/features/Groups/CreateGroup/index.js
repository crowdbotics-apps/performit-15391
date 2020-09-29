import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Button,
  Text,
  TextInput,
  Dimensions,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import RNImagePicker from 'react-native-image-picker';
import {cloneDeep} from 'lodash';
import Modal from 'react-native-modalbox';
import {styles} from './styles';
import * as profileActions from '../../ProfilePage/redux/actions';
import * as groupActions from '../../Groups/redux/actions';
import {connect} from 'react-redux';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';
import {scaleModerate, scaleVertical} from '../../../utils/scale';
import ErrorBox from '../../../components/ErrorBox';
import CookieManager from '@react-native-community/cookies';
import { withNavigationFocus } from "react-navigation";

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      showError: false,
      error: '',
      updateForm: false,
      showSuccessModal: false,
      groupName: '',
      groupDesc: '',
      groupPic: '',
      groupSource: {},
      isEditLoading: false,
      counter: 30,
      timer: null,
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // write code here
    console.log('----------------mount')
  }

  async componentDidUpdate(prevProps) {
    // write code here
    if (this.props.createGroupErrors !== prevProps.createGroupErrors) {
      this.setState({
        showError: true,
      });
      if (!this.props.createGroupErrors) {
        this.setState({
          updateForm: true,
        });
      } else {
        this.setState({
          updateForm: false,
        });
      }
    }
    if (prevProps.isFocused !== this.props.isFocused) {
      console.log("--------------did focus")
      const {
        actions: {setSuccessToDefault},
        accessToken,
      } = this.props;
      if (accessToken) {
        await setSuccessToDefault(accessToken);
      }
      this.setState({
          groupName: '',
          groupDesc: '',
          groupPic: '',
          groupSource: {},
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    console.log('----------------unmount')
  }

  // renderErrors() {
  //   const {editProfileErrors} = this.props;
  //   const {error} = this.state;
  //   if (this.state.showError) {
  //     if (error) {
  //       return <ErrorBox errorText={error} />;
  //     } else if (editProfileErrors) {
  //       return <ErrorBox errorText={editProfileErrors} />;
  //     }
  //   } else {
  //     return;
  //   }
  // }

  async showToastOnErrors() {
    const {createGroupErrors, editGroupErrors} = this.props;
    const {error} = this.state;
    const {newGroup} = this.props
    const {
      actions: {getUserGroups},
      accessToken,
    } = this.props;
    if (this.state.showError) {
      if (error) {
        Toast.show(error);
      } else if (createGroupErrors) {
        Toast.show(editProfileErrors);
      } else if (editGroupErrors) { 
        Toast.show(editGroupErrors);
      } else {
        await getUserGroups(accessToken)
        if(newGroup && newGroup.data && newGroup.data.id) {
          Toast.show('Group is updated successfully');
        } else {
          Toast.show('Group is created successfully');
        }
      }
    } else {
      /*const userId = this.props.user && this.props.user.pk;
      this.props.navigation.navigate('ProfilePage', {
        userId,
        origin: 'editPage',
      });*/
      await getUserGroups(accessToken)
      if(newGroup && newGroup.data && newGroup.data.id) {
        Toast.show('Group is updated successfully');
      } else {
        Toast.show('Group is created successfully');
      }
    }
  }

  handleGroupNameChange = text => {
    this.setState({groupName: text});
    // todo change keyboard and add validation
  };

  handleGroupDescChange = text => {
    this.setState({groupDesc: text});
    // todo change keyboard and add validation
  };

  createGroup = async () => {
    this.setState({
      isEditLoading: true,
    });
    const {newGroup} = this.props
    let validation = true;
    this.setState({error: ''});
    const {
      actions: {createGroup, editGroup},
      accessToken,
    } = this.props;

    const {
      groupName,
      groupDesc,
      groupSource,
    } = this.state;

    const groupObject = {
      group_name: groupName,
      group_description: groupDesc,
    };

    if (groupSource && groupSource.uri) {
      groupObject.group_icon = groupSource;
    }

    if (!groupName) {
      validation = false;
      Toast.show('Please enter a group name');
      this.setState({
        isEditLoading: false,
      });
    }

    if (validation) {
      // todo add disable buttons on submit
      if(newGroup && newGroup.data && newGroup.data.id) {
        await editGroup(accessToken, newGroup.data.id, groupObject.group_name, groupObject.group_description, groupObject.group_icon );
      } else {
        await createGroup(accessToken, groupObject.group_name, groupObject.group_description, groupObject.group_icon );
      }

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
  };

  tick = async () => {
    this.setState({
      counter: this.state.counter - 1,
    });

    if (this.props.createGroupSuccess === 'success') {
      clearInterval(this.state.timer);
      this.showToastOnErrors();
      this.setState({
        showError: false,
        error: '',
        isEditLoading: false,
      });
    }
  };

  onClose = () => {
    this.props.navigation.goBack();
  };

  openGallery = () => {
    const options = {
      noData: true,
    };
    RNImagePicker.launchImageLibrary(options, response => {
      // if (response && response.fileSize / 1000000 > 7) {
      //   Toast.show('The minimum size is 1Kb \n The maximum size is 7 Mb');
      // }
      let updatedResponse = cloneDeep(response);
      if (updatedResponse) {
        if (
          !updatedResponse.fileName ||
          updatedResponse.fileName === '' ||
          updatedResponse.fileName === undefined ||
          updatedResponse.fileName === null
        ) {
          updatedResponse.fileName = 'group.jpg';
        }

        const source = {
          uri:
            Platform.OS === 'android'
              ? updatedResponse.uri
              : updatedResponse.uri &&
                updatedResponse.uri.replace('file://', ''),
          name: updatedResponse.fileName,
        };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        source &&
          source.uri &&
          this.setState({
            groupSource: source,
            groupPic: source && source.uri,
          });
      }
    });
  };

  render() {
    const {
      groupName,
      groupDesc,
      groupPic,
      isEditLoading,
    } = this.state;
    const {newGroup, navigation} = this.props
    console.log('--------------------------newGroup', newGroup)

    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps={'handled'}
        style={{backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.leftArrowContainer]}
            onPress={() => this.onClose()}>
            <View style={[styles.leftArrow]}>
              <Image
                style={[styles.leftArrow]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Create Group</Text>
          </View>
          {!isEditLoading ? (
            <TouchableOpacity
              style={[styles.inputDrawerContainer]}
              onPress={() => this.createGroup()}>
              <View style={[styles.inputDrawer]}>
                <Image
                  style={[styles.inputDrawer]}
                  source={require('../../../assets/images/right_tick_icon.png')}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.inputDrawerContainer]}>
              <View style={[styles.inputDrawer]}>
                <ActivityIndicator animating />
              </View>
            </View>
          )}
        </SafeAreaView>
        <View style={styles.imageContainer}>
          <View style={[styles.profileImageContainer]}>
            <Image
              style={[styles.profileImage]}
              source={require('../../../assets/images/create-group-logo.png')}
            />
          </View>
          <View style={[styles.tncContainer]}>
            <TouchableOpacity
              style={styles.tncTextContainer}
              onPress={() => this.openGallery()}>
              <Text style={styles.tncText}>Add Group Image</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={groupName}
            onChangeText={this.handleGroupNameChange}
            placeholder="Group Name"
            style={styles.signUpInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.bioInputContainer}>
          <TextInput
            value={groupDesc}
            onChangeText={this.handleGroupDescChange}
            placeholder="Group Description"
            style={styles.bioInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
            multiline={true}
          />
        </View>

        {newGroup && newGroup.data && newGroup.data.id && 
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('InviteFriendsPage', {groupId: newGroup.data.id})
              console.log('------');
            }}>
            <View style={styles.socialConnectEditProfileContainer}>
              <View style={styles.socialConnectEditProfileLeftContainer}>
                <View style={styles.singleSocialMediaContainer}>
                  <Image
                    style={[styles.facebookIcon]}
                    source={require('../../../assets/images/invite-user.png')}
                  />
                </View>
                <Text style={styles.socialMediaText}>Invite Friends</Text>
              </View>

              <View style={styles.socialConnectEditProfileRightContainer}>
                <View style={styles.rightIconContainer}>
                  <Image
                    style={[styles.rightIcon]}
                    source={require('../../../assets/images/right_arrow.png')}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>}
        
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  createGroupErrors: state.Group.errors.CreateGroup,
  createGroupSuccess: state.Group.createGroupSuccess,
  newGroup: state.Group.newGroup,
  editGroupSuccess: state.Group.editGroupSuccess,
  editGroupErrors: state.Group.errors.EditGroup,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    createGroup: (token, group_name, group_description, group_icon) => {
      dispatch(groupActions.createGroup(token, group_name, group_description, group_icon));
    },
    setSuccessToDefault: (token) => {
      dispatch(groupActions.setSuccessToDefault(token));
    },
    editGroup: (token, group_id, group_name, group_description, group_icon) => {
      dispatch(groupActions.editGroup(token, group_id, group_name, group_description, group_icon));
    },
    setEditGroupSuccessToDefault: (token) => {
      dispatch(groupActions.setEditGroupSuccessToDefault(token));
    },
    getUserGroups: (token) => {
      dispatch(groupActions.getUserGroups(token));
    },
  },
});

CreateGroup.navigationOptions = {
  header: null,
};

export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateGroup));
