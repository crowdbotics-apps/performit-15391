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

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      validationErrors: {},
      showPassword: false,
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.submitForgotPassword = this.submitForgotPassword.bind(this);
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
            source={require('../../../../assets/images/forgot_user.png')}
          />
        </View>
        <View style={[styles.forgetPassTitleTextContainer]}>
          <Text style={[styles.titleText]}>FORGOT PASSWORD</Text>
        </View>
      </View>
    );
  };

  handleEmailChange(email) {
    this.setState({email});
    // todo add email validation
  }

  renderErrors() {
    const {signInErrors} = this.props;
    if (signInErrors) {
      return <ErrorBox errorText={signInErrors} />;
    }
  }

  submitForgotPassword() {
    const {
      actions: {forgotPassword},
    } = this.props;

    const {email} = this.state;

    forgotPassword(email);
  }

  render() {
    const {email, showPassword} = this.state;
    const {errors} = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.signUpScreen}
        style={{backgroundColor: 'black'}}>
        {this.renderImage()}

        <View style={styles.forgetPasswordDescContainer}>
          <Text style={styles.forgetPasswordDescText}>
            Please insert the associated email address or mobile number for your account
          </Text>
        </View>

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

        <TouchableOpacity style={styles.signUpButtonContainer}>
          <Text style={styles.signUpButtonText}>SUBMIT</Text>
        </TouchableOpacity>

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

ForgotPassword.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPassword);
