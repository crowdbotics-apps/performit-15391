import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  View,
  Image,
  Dimensions,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {Button, Input} from 'react-native-ui-kitten';

import {scaleModerate, scaleVertical} from '../../../../utils/scale';
import {styles} from '../styles';
import * as emailAuthActions from '../../redux/actions';
import ErrorBox from '../../../../components/ErrorBox';
import TermsAndConditions from '../../TermsAndConditions';
import ActivityLoader from '../../ActivityIndicatorLoader/page';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      validationErrors: {},
      showPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
      error: '',
      showError: true,
      updateForm: false,
      isLoading: false,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(
      this,
    );
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.signUpErrors !== prevProps.signUpErrors) {
      this.setState({
        showError: true,
      });
      if (!this.props.signUpErrors) {
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

  renderImage = () => {
    const screenSize = Dimensions.get('window');
    const imageBackgroundSize = {
      width: scaleModerate(312, 1),
      height: scaleModerate(191, 1),
    };
    const imageSize = {
      width: scaleModerate(100, 1),
      height: scaleModerate(100, 1),
    };
    return (
      <View style={[styles.imageContainer, {width: screenSize.width}]}>
        <ImageBackground
          style={[styles.imageBackground, imageBackgroundSize]}
          source={require('../../../../assets/images/Bubbles.png')}>
          <Image
            style={[styles.image, imageSize]}
            source={require('../../../../assets/images/logo_performit.png')}
          />
        </ImageBackground>
        <View style={[styles.titleTextContainer]}>
          <Text style={[styles.titleText]}>SIGN UP</Text>
        </View>
      </View>
    );
  };

  handleEmailChange(email) {
    this.setState({email});
    // todo add email validation
  }

  handlePasswordChange(password) {
    this.setState({password});
    // todo change keyboard and add validation
  }

  handleConfirmPasswordChange(password) {
    this.setState({confirmPassword: password});
    // todo change keyboard and add validation
  }

  handleUsernameChange(username) {
    this.setState({username});
  }

  renderErrors() {
    const {signUpErrors} = this.props;
    const {error} = this.state;
    if (this.state.showError) {
      if (error) {
        return <ErrorBox errorText={error} />;
      } else if (signUpErrors) {
        return <ErrorBox errorText={signUpErrors} />;
      }
    } else {
      return;
    }
  }

  async submitSignUp() {
    this.setState({
      isLoading: true,
    });

    let validation = true;
    this.setState({error: ''});
    const {
      actions: {signUp},
      signUpErrors,
    } = this.props;

    let type;

    const {email, password, username, confirmPassword} = this.state;

    if (!email) {
      this.setState({showError: true});
      this.setState({error: 'Please enter an email or phone number'});
      validation = false;
    } else if (!username) {
      this.setState({showError: true});
      this.setState({error: 'Please enter a username'});
      validation = false;
    } else if (!password) {
      this.setState({showError: true});
      this.setState({error: 'Please enter a password'});
      validation = false;
    } else if (!confirmPassword) {
      this.setState({showError: true});
      this.setState({error: 'Please enter confirm password'});
      validation = false;
    } else if (password !== confirmPassword) {
      this.setState({showError: true});
      this.setState({error: 'Password and  confirm password do not match'});
      validation = false;
    }

    if (validation) {
      if (/[a-z]/i.test(email)) {
        type = 'email';
      } else {
        type = 'phone';
      }
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (type === 'email' && !email.match(emailRegex)) {
        this.setState({showError: true});
        this.setState({
          error: 'Please enter a valid email',
        });
        validation = false;
      }
    }

    if (validation) {
      // if (email.match(emailRegex)) {
      //   type = 'email';
      // } else {
      //   type = 'phone';
      // }

      if (type) {
        // todo add disable buttons on submit
        if (type === 'phone') {
          await signUp({phone_number: email, password, username, type});
        } else {
          await signUp({email, password, username, type});
        }

        this.setState({
          error: '',
        });
        setTimeout(() => {
          this.setState({
            showError: false,
          });
          if (this.state.updateForm) {
            this.setState({
              email: '',
              username: '',
              password: '',
              confirmPassword: '',
            });
          }
        }, 4000);
      } else {
        this.setState({error: 'Please enter a valid email or phone number'});
        setTimeout(() => {
          this.setState({
            showError: false,
          });
        }, 2000);
      }
    } else {
      setTimeout(() => {
        this.setState({
          showError: false,
        });
      }, 2000);
    }
    this.setState({
      isLoading: false,
    });
  }

  goToSignIn() {
    const {navigation} = this.props;
    navigation.navigate('SignIn');
  }

  goToTermsAndConditions() {
    const {navigation} = this.props;
    navigation.navigate('TermsAndConditions');
  }

  render() {
    const {
      email,
      password,
      username,
      showPassword,
      confirmPassword,
      showConfirmPassword,
      showError,
      isLoading,
    } = this.state;
    const {errors} = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.signUpScreen}
        style={{backgroundColor: 'black'}}>
        <KeyboardAvoidingView
          style={{
            height: Dimensions.get('window').height,
            width: '100%',
          }}
          behavior={'position'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? -150 : -50}
          contentContainerStyle={{flex: 1}}
          enabled>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: Dimensions.get('window').height,
              width: '100%',
            }}>
            <View style={{width: '100%', alignItems: 'center'}}>
              {this.renderImage()}
              <View style={styles.inputContainer}>
                <View style={[styles.inputEmailImage]}>
                  <Image
                    style={[styles.inputEmailImage]}
                    source={require('../../../../assets/images/Profile.png')}
                  />
                </View>
                <TextInput
                  value={email}
                  onChangeText={this.handleEmailChange}
                  placeholder="Email Address or Mobile number"
                  style={styles.signUpInput}
                  autoCapitalize="none"
                  placeholderTextColor="#989ba5"
                  underlineColorAndroid="transparent"
                />
              </View>
              <View style={styles.inputContainer}>
                <View style={[styles.inputUserNameImage]}>
                  <Image
                    style={[styles.inputUserNameImage]}
                    source={require('../../../../assets/images/account.png')}
                  />
                </View>
                <TextInput
                  value={username}
                  onChangeText={this.handleUsernameChange}
                  placeholder="Username"
                  style={styles.signUpInput}
                  autoCapitalize="none"
                  placeholderTextColor="#989ba5"
                  underlineColorAndroid="transparent"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.inputEmailImage]}>
                  <Image
                    style={[styles.inputEmailImage]}
                    source={require('../../../../assets/images/small_lock.png')}
                  />
                </View>
                <TextInput
                  value={password}
                  onChangeText={this.handlePasswordChange}
                  placeholder="Password"
                  style={styles.signUpInput}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  placeholderTextColor="#989ba5"
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  style={[styles.inputEyeImage]}
                  onPress={() =>
                    password && this.setState({showPassword: !showPassword})
                  }>
                  <Image
                    style={[styles.inputEyeImage]}
                    source={require('../../../../assets/images/eye.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <View style={[styles.inputEmailImage]}>
                  <Image
                    style={[styles.inputEmailImage]}
                    source={require('../../../../assets/images/small_lock.png')}
                  />
                </View>
                <TextInput
                  value={confirmPassword}
                  onChangeText={this.handleConfirmPasswordChange}
                  placeholder="Confirm Password"
                  style={styles.signUpInput}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  placeholderTextColor="#989ba5"
                  underlineColorAndroid="transparent"
                />
                <TouchableOpacity
                  style={[styles.inputEyeImage]}
                  onPress={() =>
                    confirmPassword &&
                    this.setState({showConfirmPassword: !showConfirmPassword})
                  }>
                  <Image
                    style={[styles.inputEyeImage]}
                    source={require('../../../../assets/images/eye.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.tncContainer}>
                <Text style={styles.tncText1}>
                  By Signing up, you agree to all our{' '}
                </Text>
                <TouchableOpacity
                  style={styles.tncText2Container}
                  onPress={() => this.goToTermsAndConditions()}>
                  <Text style={styles.tncText2}>Terms and Conditions</Text>
                </TouchableOpacity>
              </View>

              {isLoading ? (
                <ActivityLoader isAnimating={true} />
              ) : (
                <TouchableOpacity
                  style={[styles.signUpButtonContainer]}
                  onPress={() => this.submitSignUp()}>
                  <Text style={styles.signUpButtonText}>SIGN UP</Text>
                </TouchableOpacity>
              )}
            </View>
            <View
              style={{
                alignItems: 'center',
                width: '100%',
                marginBottom: scaleVertical(15),
              }}>
              {this.renderErrors()}
              <View style={[styles.tncContainer]}>
                <Text style={styles.tncText1}>Already have an account? </Text>
                <TouchableOpacity
                  style={styles.tncText2Container}
                  onPress={() => {
                    this.goToSignIn();
                  }}>
                  <Text style={styles.tncText2}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  signUpErrors: state.EmailAuth.errors.SignUp,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    signUp: user => {
      dispatch(emailAuthActions.signUp(user));
    },
  },
});

SignUp.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignUp);
