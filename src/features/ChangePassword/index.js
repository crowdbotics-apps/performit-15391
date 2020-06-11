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
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {styles} from './styles';
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import {scaleVertical} from '../../utils/scale';
import ErrorBox from '../../components/ErrorBox';

class ChangePassword extends Component {
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
    let userId = this.props.navigation.getParam('userId', '');
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const accessToken = this.props.accessToken;
    const {
      actions: {userDetails},
    } = this.props;
    if (userId && accessToken) {
      await userDetails(userId, accessToken);
    }
    this.setState({
      isLoading: false,
      userId,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    if (this.props.changePasswordErrors !== prevProps.changePasswordErrors) {
      this.setState({
        showError: true,
      });
      if (!this.props.changePasswordErrors) {
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

  renderErrors() {
    const {changePasswordErrors} = this.props;
    const {error} = this.state;
    if (this.state.showError) {
      if (error) {
        return <ErrorBox errorText={error} />;
      } else if (changePasswordErrors) {
        return <ErrorBox errorText={changePasswordErrors} />;
      }
    } else {
      return;
    }
  }

  handleCurrentPasswordChange = password => {
    this.setState({currentPassword: password});
    // todo change keyboard and add validation
  };

  handleNewPasswordChange = password => {
    this.setState({newPassword: password});
    // todo change keyboard and add validation
  };

  handleConfirmNewPasswordChange = password => {
    this.setState({confirmNewPassword: password});
    // todo change keyboard and add validation
  };

  changePassword = async () => {
    let validation = true;
    this.setState({error: ''});
    const {
      actions: {changePassword},
      accessToken,
    } = this.props;

    const {currentPassword, newPassword, confirmNewPassword} = this.state;

    if (!currentPassword) {
      this.setState({showError: true});
      this.setState({error: 'Please enter current password'});
      validation = false;
    } else if (!newPassword) {
      this.setState({showError: true});
      this.setState({error: 'Please enter the new password'});
      validation = false;
    } else if (!confirmNewPassword) {
      this.setState({showError: true});
      this.setState({error: 'Please enter the confirm new password'});
      validation = false;
    } else if (newPassword !== confirmNewPassword) {
      this.setState({showError: true});
      this.setState({
        error: 'New Password and confirm new password do not match',
      });
      validation = false;
    }

    if (validation) {
      // todo add disable buttons on submit
      await changePassword(accessToken, currentPassword, newPassword);

      this.setState({
        error: '',
      });
      setTimeout(() => {
        this.setState({
          showError: false,
        });
        if (this.state.updateForm) {
          this.setState({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            showSuccessModal: true,
          });
        }
      }, 2000);
    } else {
      setTimeout(() => {
        this.setState({
          showError: false,
        });
      }, 2000);
    }
  };

  onClose = () => {
    const userId = this.props.user && this.props.user.pk;
    this.setState(
      {
        showSuccessModal: false,
      },
      () => this.props.navigation.navigate('ProfilePage', {userId}),
    );
  };

  render() {
    const {
      currentPassword,
      showCurrentPassword,
      newPassword,
      showNewPassword,
      confirmNewPassword,
      showConfirmNewPassword,
    } = this.state;
    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: Dimensions.get('window').height,
            width: '100%',
          }}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <SafeAreaView style={styles.headerContainer}>
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
                <Text style={styles.headerText}>Change Password</Text>
              </View>
              <TouchableOpacity
                style={[styles.inputDrawerContainer]}
                onPress={() => this.changePassword()}>
                <View style={[styles.inputDrawer]}>
                  <Image
                    style={[styles.inputDrawer]}
                    source={require('../../assets/images/right_tick_icon.png')}
                  />
                </View>
              </TouchableOpacity>
            </SafeAreaView>

            <View style={styles.inputContainer}>
              <View style={[styles.inputEmailImage]}>
                <Image
                  style={[styles.inputEmailImage]}
                  source={require('../../assets/images/small_lock.png')}
                />
              </View>
              <TextInput
                value={currentPassword}
                onChangeText={this.handleCurrentPasswordChange}
                placeholder="Current Password"
                style={styles.signUpInput}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
                placeholderTextColor="#989ba5"
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                style={[styles.inputEyeImage]}
                onPress={() =>
                  currentPassword &&
                  this.setState({showCurrentPassword: !showCurrentPassword})
                }>
                <Image
                  style={[styles.inputEyeImage]}
                  source={require('../../assets/images/eye.png')}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={[styles.inputEmailImage]}>
                <Image
                  style={[styles.inputEmailImage]}
                  source={require('../../assets/images/small_lock.png')}
                />
              </View>
              <TextInput
                value={newPassword}
                onChangeText={this.handleNewPasswordChange}
                placeholder="New Password"
                style={styles.signUpInput}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
                placeholderTextColor="#989ba5"
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                style={[styles.inputEyeImage]}
                onPress={() =>
                  newPassword &&
                  this.setState({showNewPassword: !showNewPassword})
                }>
                <Image
                  style={[styles.inputEyeImage]}
                  source={require('../../assets/images/eye.png')}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <View style={[styles.inputEmailImage]}>
                <Image
                  style={[styles.inputEmailImage]}
                  source={require('../../assets/images/small_lock.png')}
                />
              </View>
              <TextInput
                value={confirmNewPassword}
                onChangeText={this.handleConfirmNewPasswordChange}
                placeholder="Confirm New Password"
                style={styles.signUpInput}
                secureTextEntry={!showConfirmNewPassword}
                autoCapitalize="none"
                placeholderTextColor="#989ba5"
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                style={[styles.inputEyeImage]}
                onPress={() =>
                  confirmNewPassword &&
                  this.setState({
                    showConfirmNewPassword: !showConfirmNewPassword,
                  })
                }>
                <Image
                  style={[styles.inputEyeImage]}
                  source={require('../../assets/images/eye.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              alignItems: 'center',
              width: '100%',
              marginBottom: scaleVertical(15),
            }}>
            {this.renderErrors()}
          </View>
        </View>

        {/*<View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator animating />
          </View>*/}
        {/*        {this.state.showSuccessModal && (
          <Modal
            style={[styles.modal]}
            ref={'modal1'}
            onClosed={this.onClose}
            onClosingState={this.onClosingState}>
            <Text style={styles.modalText}>Password Changed Successfully</Text>
            <Button
              title={'Ok'}
              onPress={() => this.props.navigation.navigate('ProfilePage')}
              style={styles.btn}
            />
          </Modal>
        )}*/}
        <Modal
          isOpen={this.state.showSuccessModal}
          onClosed={() => this.setState({showSuccessModal: false})}
          style={[styles.modal]}
          position={'center'}
          backdropPressToClose={false}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>Password changed successfully</Text>
          </View>
          <TouchableOpacity
            style={styles.okTextContainer}
            onPress={() => this.onClose()}>
            <Text style={styles.okText}>OK</Text>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userDetailErrors: state.Profile.errors.UserDetail,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  changePasswordErrors: state.Profile.errors.ChangePassword,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    changePassword: (token, current_password, password) => {
      dispatch(
        profileActions.changePassword(token, current_password, password),
      );
    },
  },
});

ChangePassword.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePassword);
