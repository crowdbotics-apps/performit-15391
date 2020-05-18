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
  KeyboardAvoidingView,
  Platform,
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
      showResendText: true,
      showResendButton: false,
      timer: null,
      counter: 30,
      error: '',
      showError: false,
      type: '',
      origin: '',
      code: '',
    };

    this.submitVerifyCode = this.submitVerifyCode.bind(this);
    this.resendCode = this.resendCode.bind(this);
  }

  componentDidMount() {
    const user = this.props.navigation.getParam('user', {});
    const origin = this.props.navigation.getParam('origin', '');

    if (user && user.type === 'phone') {
      this.setState({
        type: user && user.type,
        email: user && user.phone_number,
        origin,
      });
    } else {
      this.setState({
        type: user && user.type,
        email: user && user.email,
        origin,
      });
    }

    let timer = setInterval(this.tick, 1000);
    this.setState({
      timer,
    });
    setTimeout(() => {
      clearInterval(this.state.timer);
      this.setState({
        showResendButton: true,
        counter: 30,
      });
    }, 30000);
  }

  componentDidUpdate(prevProps) {
    if (this.props.confirmCodeErrors !== prevProps.confirmCodeErrors) {
      this.setState({
        showError: true,
      });

      if (!this.props.confirmCodeErrors) {
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

  componentWillUnmount() {
    clearInterval(this.state.timer);
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

  async resendCode() {
    // write code here
    this.setState({
      showResendButton: false,
    });
    clearInterval(this.state.timer);
    let timer = setInterval(this.tick, 1000);
    this.setState({
      timer,
    });
    setTimeout(() => {
      clearInterval(this.state.timer);
      this.setState({
        showResendButton: true,
        counter: 30,
      });
    }, 30000);
    const {type, email} = this.state;
    const {
      actions: {resendCode},
    } = this.props;
    if (type === 'phone') {
      await resendCode({type, phone_number: email});
    } else if (type === 'email') {
      await resendCode({type, email});
    }
    setTimeout(() => {
      this.setState({
        showError: false,
      });
    }, 4000);
  }

  renderErrors() {
    const {confirmCodeErrors} = this.props;
    const {error} = this.state;
    if (this.state.showError) {
      if (error) {
        return <ErrorBox errorText={error} />;
      } else if (confirmCodeErrors) {
        return <ErrorBox errorText={confirmCodeErrors} />;
      }
    } else {
      return;
    }
  }

  async submitVerifyCode() {
    const {code, type, email, origin} = this.state;
    this.setState({error: ''});
    if (!code) {
      this.setState({showError: true});
      this.setState({error: 'Please enter the verification code'});
    }

    this.setState({
      showResendText: true,
    });
    const {
      actions: {confirmCode},
    } = this.props;
    if (type === 'phone') {
      await confirmCode({code, type, phone_number: email, origin});
    } else if (type === 'email') {
      await confirmCode({code, type, email, origin});
    }

    setTimeout(() => {
      if (this.state.updateForm) {
        this.setState({
          code: '',
        });
      }
    }, 1000);

    setTimeout(() => {
      this.setState({
        showError: false,
      });
    }, 2000);
  }

  tick = () => {
    this.setState({
      counter: this.state.counter - 1,
    });
  };

  render() {
    const {showVerify, showResendText, showResendButton, email} = this.state;
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? -250 : -150}
          contentContainerStyle={{flex: 1}}
          enabled>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              height: Dimensions.get('window').height,
              width: '100%',
            }}>
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
                {email}
              </Text>
            </View>

            <OTPInputView
              pinCount={5}
              style={{width: '90%', height: scaleModerate(50)}}
              autoFocusOnLoad={true}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              keyboardAppearance={'dark'}
              onCodeFilled={code => {
                this.setState({code});
              }}
            />

            <TouchableOpacity
              onPress={() => showVerify && this.submitVerifyCode()}
              style={[
                styles.signUpButtonContainer,
                {marginTop: scaleModerate(30)},
              ]}>
              <Text style={styles.signUpButtonText}>VERIFY</Text>
            </TouchableOpacity>
            {this.renderErrors()}
            {showResendText && (
              <View
                style={[styles.tncContainer, {marginTop: scaleModerate(36)}]}>
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
                    onPress={() => this.resendCode()}>
                    <Text style={styles.tncText2}>Resend</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  confirmCodeErrors: state.EmailAuth.errors.ConfirmCode,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    confirmCode: data => {
      dispatch(emailAuthActions.confirmCode(data));
    },
    resendCode: data => {
      dispatch(emailAuthActions.resendCode(data));
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
