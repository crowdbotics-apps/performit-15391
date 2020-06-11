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
} from 'react-native';
import RNImagePicker from 'react-native-image-picker';
import {cloneDeep} from 'lodash';
import Modal from 'react-native-modalbox';
import {styles} from './styles';
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import CheckBox from 'react-native-check-box';
import Toast from 'react-native-simple-toast';
import {scaleModerate, scaleVertical} from '../../utils/scale';
import ErrorBox from '../../components/ErrorBox';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      currentPassword: '',
      showCurrentPassword: false,
      newPassword: '',
      showNewPassword: false,
      confirmNewPassword: '',
      showConfirmNewPassword: false,
      showError: false,
      error: '',
      updateForm: false,
      showSuccessModal: false,
      firstName: '',
      lastName: '',
      address: '',
      lat: '',
      lng: '',
      bio: '',
      isMale: true,
      isArtistChecked: false,
      isSingerChecked: false,
      isRapperChecked: false,
      isDancerChecked: false,
      isProducerChecked: false,
      isOtherChecked: false,
      profilePic: '',
      profileSource: {},
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

    const {profile: allProfiles, user} = this.props;
    const userId = this.props.user && this.props.user.pk;
    const profile = allProfiles && allProfiles[`${userId}`];
    let isArtistChecked = false;
    let isSingerChecked = false;
    let isRapperChecked = false;
    let isDancerChecked = false;
    let isProducerChecked = false;
    let isOtherChecked = false;

    if (profile && profile.user_types && profile.user_types.length > 0) {
      if (profile.user_types.includes('Artist')) {
        isArtistChecked = true;
      }
      if (profile.user_types.includes('DJ')) {
        isSingerChecked = true;
      }
      if (profile.user_types.includes('Videographer')) {
        isRapperChecked = true;
      }
      if (profile.user_types.includes('Dancer')) {
        isDancerChecked = true;
      }
      if (profile.user_types.includes('Producer')) {
        isProducerChecked = true;
      }
      if (profile.user_types.includes('Engineer')) {
        isOtherChecked = true;
      }
    }

    this.setState({
      firstName: profile && profile.user && profile.user.first_name,
      lastName: profile && profile.user && profile.user.last_name,
      address:
        profile &&
        profile.user_details &&
        profile.user_details.location_address,
      lat: profile && profile.user_details && profile.user_details.location_lat,
      lng:
        profile && profile.user_details && profile.user_details.location_long,
      bio: profile && profile.user_details && profile.user_details.bio,
      isMale:
        profile &&
        profile.user_details &&
        profile.user_details.gender === 'Female'
          ? false
          : true,
      profilePic:
        profile && profile.user_details && profile.user_details.profile_pic,
      isArtistChecked,
      isSingerChecked,
      isRapperChecked,
      isDancerChecked,
      isProducerChecked,
      isOtherChecked,
    });

    this.setState({
      isLoading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    if (this.props.editProfileErrors !== prevProps.editProfileErrors) {
      this.setState({
        showError: true,
      });
      if (!this.props.editProfileErrors) {
        this.setState({
          updateForm: true,
        });
      } else {
        this.setState({
          updateForm: false,
        });
      }
    }
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

  showToastOnErrors() {
    const {editProfileErrors} = this.props;
    const {error} = this.state;
    if (this.state.showError) {
      if (error) {
        Toast.show(error);
      } else if (editProfileErrors) {
        Toast.show(editProfileErrors);
      } else {
        Toast.show('Your profile has been updated successfully');
      }
    } else {
      Toast.show('Your profile has been updated successfully');
    }
  }

  handleLastNameChange = text => {
    this.setState({lastName: text});
    // todo change keyboard and add validation
  };

  handleAddressChange = address => {
    this.setState({address});
    // todo change keyboard and add validation
  };

  handleConfirmNewPasswordChange = password => {
    this.setState({confirmNewPassword: password});
    // todo change keyboard and add validation
  };

  handleFirstNameChange = text => {
    this.setState({firstName: text});
    // todo change keyboard and add validation
  };

  handleBioChange = text => {
    this.setState({bio: text});
    // todo change keyboard and add validation
  };

  editProfile = async () => {
    let validation = true;
    this.setState({error: ''});
    const {
      actions: {editProfile},
      accessToken,
    } = this.props;

    const {
      firstName,
      lastName,
      address,
      bio,
      isMale,
      profileSource,
      isArtistChecked,
      isSingerChecked,
      isRapperChecked,
      isDancerChecked,
      isProducerChecked,
      isOtherChecked,
    } = this.state;

    const userObject = {
      bio,
      first_name: firstName,
      last_name: lastName,
      location_address: address,
    };

    if (isMale) {
      userObject.gender = 'Male';
    } else {
      userObject.gender = 'Female';
    }

    if (profileSource) {
      userObject.profile_pic = profileSource;
    }

    const userTypes = [];

    if (isArtistChecked) {
      userTypes.push('Artist');
    }

    if (isSingerChecked) {
      userTypes.push('DJ');
    }

    if (isRapperChecked) {
      userTypes.push('Videographer');
    }

    if (isDancerChecked) {
      userTypes.push('Dancer');
    }

    if (isProducerChecked) {
      userTypes.push('Producer');
    }

    if (isOtherChecked) {
      userTypes.push('Engineer');
    }

    // todo add disable buttons on submit
    await editProfile(accessToken, userObject, userTypes);
    this.showToastOnErrors();

    const {
      user,
      actions: {userDetails},
    } = this.props;

    const userId = user && user.pk;

    if (userId && accessToken) {
      await userDetails(userId, accessToken);
    }

    setTimeout(() => {
      this.setState({
        showError: false,
        error: '',
      });
      // if (this.state.updateForm) {
      //   console.log('-------------00000');
      //   this.setState({
      //     currentPassword: '',
      //     newPassword: '',
      //     confirmNewPassword: '',
      //     showSuccessModal: true,
      //   });
      // }
    }, 2000);
  };

  onClose = () => {
    const userId = this.props.user && this.props.user.pk;
    this.props.navigation.navigate('ProfilePage', {userId});
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
      if (
        !updatedResponse.fileName ||
        updatedResponse.fileName === '' ||
        updatedResponse.fileName === undefined ||
        updatedResponse.fileName === null
      ) {
        updatedResponse.fileName = 'profile.jpg';
      }

      const source = {
        uri:
          Platform.OS === 'android'
            ? updatedResponse.uri
            : updatedResponse.uri.replace('file://', ''),
        name: updatedResponse.fileName,
      };

      // You can also display the image using data:
      // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      this.setState({
        profileSource: source,
        profilePic: source && source.uri,
      });
    });
  };

  render() {
    const {firstName, lastName, address, bio, isMale, profilePic} = this.state;
    const {profile: allProfiles, user} = this.props;
    const userId = this.props.user && this.props.user.pk;
    const profile = allProfiles && allProfiles[`${userId}`];

    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.leftArrowContainer]}
            onPress={() => this.onClose()}>
            <View style={[styles.leftArrow]}>
              <Image
                style={[styles.leftArrow]}
                source={require('../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            {profile.user &&
            (profile.user.first_name || profile.user.last_name) ? (
              <Text style={styles.headerText}>
                {profile.user && profile.user.first_name}{' '}
                {profile.user && profile.user.last_name}
              </Text>
            ) : (
              <Text style={styles.headerText}>
                {profile.user && profile.user.username}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => this.editProfile()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../assets/images/right_tick_icon.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <View style={[styles.profileImageContainer]}>
            <Image style={[styles.profileImage]} source={{uri: profilePic}} />
          </View>
          <View style={[styles.tncContainer]}>
            <TouchableOpacity
              style={styles.tncTextContainer}
              onPress={() => this.openGallery()}>
              <Text style={styles.tncText}>change profile picture</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={firstName}
            onChangeText={this.handleFirstNameChange}
            placeholder="First Name"
            style={styles.signUpInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={lastName}
            onChangeText={this.handleLastNameChange}
            placeholder="Last Name"
            style={styles.signUpInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={address}
            onChangeText={this.handleAddressChange}
            placeholder="Location"
            style={styles.signUpInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={[styles.inputEyeImage]}
            onPress={() => console.log('-----')}>
            <Image
              style={[styles.inputEyeImage]}
              source={require('../../assets/images/down_trangle.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bioInputContainer}>
          <TextInput
            value={bio}
            onChangeText={this.handleBioChange}
            placeholder="Bio"
            style={styles.bioInput}
            autoCapitalize="none"
            placeholderTextColor="#989ba5"
            underlineColorAndroid="transparent"
            multiline={true}
          />
        </View>

        <View style={styles.genderTitle}>
          <Text style={styles.genderText}>Gender</Text>
        </View>

        <View style={styles.genderBody}>
          <TouchableOpacity
            style={styles.genderSubBody}
            onPress={() => this.setState({isMale: true})}>
            {
              <View
                style={[
                  styles.radioButtonView,
                  !!isMale && styles.radioButtonFilledColor,
                ]}>
                {!!isMale && <View style={styles.radioButtonFilled} />}
              </View>
            }
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.genderSubBody, {marginLeft: scaleModerate(40)}]}
            onPress={() => this.setState({isMale: false})}>
            <View
              style={[
                styles.radioButtonView,
                !isMale && styles.radioButtonFilledColor,
              ]}>
              {!isMale && <View style={styles.radioButtonFilled} />}
            </View>
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.genderTitle,
            {marginBottom: scaleModerate(12), marginTop: scaleModerate(12)},
          ]}>
          <Text style={styles.genderText}>User Type</Text>
        </View>

        <View style={styles.userTypeBody}>
          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isArtistChecked}
              onClick={() =>
                this.setState({
                  isArtistChecked: !this.state.isArtistChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Artist</Text>
          </View>

          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isSingerChecked}
              onClick={() =>
                this.setState({
                  isSingerChecked: !this.state.isSingerChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Singer</Text>
          </View>

          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isRapperChecked}
              onClick={() =>
                this.setState({
                  isRapperChecked: !this.state.isRapperChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Rapper</Text>
          </View>

          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isDancerChecked}
              onClick={() =>
                this.setState({
                  isDancerChecked: !this.state.isDancerChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Dancer</Text>
          </View>

          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isProducerChecked}
              onClick={() =>
                this.setState({
                  isProducerChecked: !this.state.isProducerChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Producer</Text>
          </View>

          <View style={styles.userTypeSubBody}>
            <CheckBox
              isChecked={this.state.isOtherChecked}
              onClick={() =>
                this.setState({
                  isOtherChecked: !this.state.isOtherChecked,
                })
              }
              style={{marginRight: 20}}
              checkBoxColor={'#b88746'}
              uncheckedCheckBoxColor={'#989ba5'}
            />
            <Text style={styles.genderText}>Other</Text>
          </View>
        </View>

        <View style={styles.socialConnectEditProfileContainer}>
          <View style={styles.socialConnectEditProfileLeftContainer}>
            <View style={styles.singleSocialMediaContainer}>
              <Image
                style={[styles.facebookIcon]}
                source={require('../../assets/images/facebook.png')}
              />
            </View>
            <Text style={styles.socialMediaText}>Connect to Facebook</Text>
          </View>

          <View style={styles.socialConnectEditProfileRightContainer}>
            <View style={styles.rightIconContainer}>
              <Image
                style={[styles.rightIcon]}
                source={require('../../assets/images/right_arrow.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.socialConnectEditProfileContainer}>
          <View style={styles.socialConnectEditProfileLeftContainer}>
            <View style={styles.singleSocialMediaContainer}>
              <Image
                style={[styles.instagramIcon]}
                source={require('../../assets/images/instagram.png')}
              />
            </View>
            <Text style={styles.socialMediaText}>Connect to Instagram</Text>
          </View>

          <View style={styles.socialConnectEditProfileRightContainer}>
            <View style={styles.rightIconContainer}>
              <Image
                style={[styles.rightIcon]}
                source={require('../../assets/images/right_arrow.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.socialConnectEditProfileContainer}>
          <View style={styles.socialConnectEditProfileLeftContainer}>
            <View style={styles.singleSocialMediaContainer}>
              <Image
                style={[styles.youtubeIcon]}
                source={require('../../assets/images/youtube.png')}
              />
            </View>
            <Text style={styles.socialMediaText}>Connect to Youtube</Text>
          </View>

          <View style={styles.socialConnectEditProfileRightContainer}>
            <View style={styles.rightIconContainer}>
              <Image
                style={[styles.rightIcon]}
                source={require('../../assets/images/right_arrow.png')}
              />
            </View>
          </View>
        </View>

        <View style={{height: scaleModerate(40)}} />
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userDetailErrors: state.Profile.errors.UserDetail,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  editProfileErrors: state.Profile.errors.ChangePassword,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    editProfile: (token, user, userTypes) => {
      dispatch(profileActions.editProfile(token, user, userTypes));
    },
  },
});

EditProfile.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditProfile);
