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

class ForgotPassword extends Component {
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
          <Text style={[styles.titleText]}>FORGOT PASSWORD</Text>
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

ForgotPassword.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);
