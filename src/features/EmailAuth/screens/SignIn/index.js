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
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.goToPasswordRecover = this.goToPasswordRecover.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
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
    if (signInErrors) {
      return <ErrorBox errorText={signInErrors} />;
    }
  }

  submitLogin() {
    const {
      actions: {login},
    } = this.props;

    const {username, password} = this.state;
    // todo add disable buttons on submit
    login({username, password});

    this.setState({username: '', password: ''});
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

        <TouchableOpacity style={styles.signUpButtonContainer}>
          <Text style={styles.signUpButtonText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={[styles.tncContainer, {marginTop: scaleModerate(205)}]}>
          <Text style={styles.tncText1}>Don’t have an account? </Text>
          <TouchableOpacity
            style={styles.tncText2Container}
            onPress={() => this.goToSignUp()}>
            <Text style={styles.tncText2}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {this.renderErrors()}
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
