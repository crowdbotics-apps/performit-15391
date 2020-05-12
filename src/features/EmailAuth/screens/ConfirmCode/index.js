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
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {scaleModerate, scaleVertical} from '../../../../utils/scale';
import {styles} from '../styles';
import * as emailAuthActions from '../../redux/actions';
import ErrorBox from '../../../../components/ErrorBox';

class ConfirmCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      validationErrors: {},
      showPassword: false,
      showVerify: true,
      showResendText: false,
      showResendButton: false,
      timer: null,
      counter: 30,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitVerifyCode = this.submitVerifyCode.bind(this);
    this.resendCode = this.resendCode.bind(this);
  }

  componentWillUnmount() {
    this.clearInterval(this.state.timer);
  }

  renderImage = () => {
    const screenSize = Dimensions.get('window');
    const imageBackgroundSize = {
      width: scaleModerate(312, 1),
      height: scaleModerate(350, 1),
    };
    const imageSize = {
      width: scaleModerate(100, 1),
      height: scaleModerate(122, 1),
    };
    return (
      <View
        style={[
          styles.imageContainer,
          {width: screenSize.width, height: scaleModerate(396, 1)},
        ]}>
        <View style={[styles.imageBackground]}>
          <Image
            style={[styles.image, imageSize]}
            source={require('../../../../assets/images/email_verify.png')}
          />
        </View>
        <View style={[styles.forgetPassTitleTextContainer]}>
          <Text style={[styles.titleText]}>VERIFICATION</Text>
        </View>
      </View>
    );
  };

  handleEmailChange(email) {
    this.setState({email});
    // todo add email validation
  }

  resendCode() {
    // write code here
  }

  renderErrors() {
    const {signInErrors} = this.props;
    if (signInErrors) {
      return <ErrorBox errorText={signInErrors} />;
    }
  }

  submitVerifyCode() {
    let timer = setInterval(this.tick, 1000);
    this.setState({
      showVerify: false,
      showResendText: true,
      showResendButton: false,
      timer,
    });
    setTimeout(() => {
      clearInterval(this.state.timer);
      this.setState({
        showVerify: true,
        showResendButton: true,
        counter: 30,
      });
    }, 30000);
    // const {
    //   actions: {forgotPassword},
    // } = this.props;
    //
    // const {email} = this.state;
    //
    // forgotPassword(email);
  }

  tick = () => {
    this.setState({
      counter: this.state.counter - 1,
    });
  };

  render() {
    const {showVerify, showResendText, showResendButton} = this.state;
    const {errors} = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.signUpScreen}
        style={{backgroundColor: 'black'}}>
        {this.renderImage()}

        <View
          style={[
            styles.forgetPasswordDescContainer,
            {flexDirection: 'column'},
          ]}>
          <Text style={styles.forgetPasswordDescText}>
            Please insert the verification code sent to
          </Text>
          <Text style={[styles.forgetPasswordDescText, {color: '#c08637'}]}>
            example@crowdbotics.com
          </Text>
        </View>

        <OTPInputView
          pinCount={5}
          style={{width: '90%', height: scaleModerate(50)}}
          autoFocusOnLoad={true}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          keyboardAppearance={'dark'}
        />

        <TouchableOpacity
          onPress={() => showVerify && this.submitVerifyCode()}
          style={[
            styles.signUpButtonContainer,
            {marginTop: scaleModerate(30)},
          ]}>
          <Text style={styles.signUpButtonText}>VERIFY</Text>
        </TouchableOpacity>

        {showResendText && (
          <View style={[styles.tncContainer, {marginTop: scaleModerate(36)}]}>
            {!showResendButton && (
              <Text style={styles.tncText2}>
                Re-send code in 0:
                {this.state.counter < 10 && '0'}
                {this.state.counter}
              </Text>
            )}
            {showResendButton && (
              <TouchableOpacity
                style={styles.tncText2Container}
                onPress={() => showVerify && this.resendCode()}>
                <Text style={styles.tncText2}>Resend</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {this.renderErrors()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  forgotPasswordErrors: state.EmailAuth.errors.ForgotPassword,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    forgotPassword: email => {
      dispatch(emailAuthActions.forgotPassword(email));
    },
  },
});

ConfirmCode.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmCode);
