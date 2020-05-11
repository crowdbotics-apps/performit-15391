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
} from 'react-native';
import {Button, Input} from 'react-native-ui-kitten';

import {scaleModerate} from '../../../../utils/scale';
import {styles} from '../styles';
import * as emailAuthActions from '../../redux/actions';
import ErrorBox from '../../../../components/ErrorBox';

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
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.submitSignUp = this.submitSignUp.bind(this);
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
    if (signUpErrors) {
      return <ErrorBox errorText={signUpErrors} />;
    }
  }

  submitSignUp() {
    const {
      actions: {signUp},
    } = this.props;

    const {email, password, username} = this.state;
    // todo add disable buttons on submit
    signUp({email, password, username});

    this.setState({email: '', password: '', username: ''});
  }

  render() {
    const {
      email,
      password,
      username,
      showPassword,
      confirmPassword,
      showConfirmPassword,
    } = this.state;
    const {errors} = this.props;

    return (
      <View style={[styles.signUpScreen]}>
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

        <Button style={styles.actionButon} onPress={this.submitSignUp}>
          Sign up
        </Button>

        {this.renderErrors()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  signUpErrors: state.EmailAuth.errors.SignUp,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    signUp: ({email, password, username}) => {
      dispatch(emailAuthActions.signUp({email, password, username}));
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
