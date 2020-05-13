import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Text,
} from 'react-native';

import {scaleModerate, scaleVertical} from '../../../../utils/scale';
import {styles} from '../styles';
import * as emailAuthActions from '../../redux/actions';
import ErrorBox from '../../../../components/ErrorBox';
import Icon from 'react-native-vector-icons/FontAwesome';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      validationErrors: {},
      showPassword: false,
      error: '',
      showError: true,
      updateForm: false,
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.goToPasswordRecover = this.goToPasswordRecover.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.signInErrors !== prevProps.signInErrors) {
      this.setState({
        showError: true,
      });
      if (!this.props.signInErrors) {
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
          <Text style={[styles.titleText]}>LOGIN</Text>
        </View>
      </View>
    );
  };

  handleUsernameChange(username) {
    this.setState({username});
    // todo add email validation
  }

  handlePasswordChange(password) {
    this.setState({password});
    // todo change keyboard and add validation
  }

  renderErrors() {
    const {signInErrors} = this.props;
    const {error} = this.state;
    if (this.state.showError) {
      if (error) {
        return <ErrorBox errorText={error} />;
      } else if (signInErrors) {
        return <ErrorBox errorText={signInErrors} />;
      }
    } else {
      return;
    }
  }

  async submitLogin() {
    let validation = true;
    this.setState({error: ''});
    const {
      actions: {login},
    } = this.props;

    const {username, password} = this.state;
    if (!username) {
      this.setState({showError: true});
      this.setState({error: 'Please enter a username'});
      validation = false;
    } else if (!password) {
      this.setState({showError: true});
      this.setState({error: 'Please enter a password'});
      validation = false;
    }

    if (validation) {
      await login({username, password});
      setTimeout(() => {
        if (this.state.updateForm) {
          this.setState({
            username: '',
            password: '',
          });
        }
      }, 1000);
      setTimeout(() => {
        this.setState({
          showError: false,
        });
      }, 4000);
    } else {
      setTimeout(() => {
        this.setState({
          showError: false,
        });
      }, 2000);
    }
  }

  goToPasswordRecover() {
    const {navigation} = this.props;
    navigation.navigate('RecoverPassword');
  }

  goToSignUp() {
    const {navigation} = this.props;
    navigation.navigate('SignUp');
  }

  goToForgotPassword() {
    const {navigation} = this.props;
    navigation.navigate('ForgotPassword');
  }

  render() {
    const {username, password, showPassword} = this.state;
    const {errors} = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.signUpScreen}
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
            {this.renderImage()}
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

            <View style={styles.tncContainer}>
              <TouchableOpacity
                style={styles.tncText2Container}
                onPress={() => this.goToForgotPassword()}>
                <Text style={styles.tncText2}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.signUpButtonContainer}
              onPress={() => {
                this.submitLogin();
              }}>
              <Text style={styles.signUpButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: 'center',
              width: '100%',
              marginBottom: scaleVertical(15),
            }}>
            {this.renderErrors()}
            <View style={[styles.tncContainer]}>
              <Text style={styles.tncText1}>Don’t have an account? </Text>
              <TouchableOpacity
                style={styles.tncText2Container}
                onPress={() => this.goToSignUp()}>
                <Text style={styles.tncText2}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  signInErrors: state.EmailAuth.errors.SignIn,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    login: ({username, password}) => {
      dispatch(emailAuthActions.login({username, password}));
    },
  },
});

SignIn.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
