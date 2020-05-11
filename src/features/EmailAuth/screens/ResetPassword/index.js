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

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      validationErrors: {},
      showPassword: false,
      confirmPassword: '',
      showConfirmPassword: false,
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(
      this,
    );
    this.submitResetPassword = this.submitResetPassword.bind(this);
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
            source={require('../../../../assets/images/shield.png')}
          />
        </View>
        <View style={[styles.forgetPassTitleTextContainer]}>
          <Text style={[styles.titleText]}>RESET PASSWORD</Text>
        </View>
      </View>
    );
  };

  handlePasswordChange(password) {
    this.setState({password});
    // todo change keyboard and add validation
  }

  handleConfirmPasswordChange(password) {
    this.setState({confirmPassword: password});
    // todo change keyboard and add validation
  }

  renderErrors() {
    const {signInErrors} = this.props;
    if (signInErrors) {
      return <ErrorBox errorText={signInErrors} />;
    }
  }

  submitResetPassword() {
    const {
      actions: {resetPassword},
    } = this.props;

    const {password} = this.state;

    resetPassword(password);
  }

  render() {
    const {
      password,
      showPassword,
      confirmPassword,
      showConfirmPassword,
    } = this.state;
    const {errors} = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.signUpScreen}
        style={{backgroundColor: 'black'}}>
        {this.renderImage()}

        <View style={styles.forgetPasswordDescContainer}>
          <Text style={styles.forgetPasswordDescText}>
            Please enter your new password
          </Text>
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

        <TouchableOpacity style={styles.signUpButtonContainer}>
          <Text style={styles.signUpButtonText}>RESET PASSWORD</Text>
        </TouchableOpacity>

        {this.renderErrors()}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  resetPasswordErrors: state.EmailAuth.errors.ResetPassword,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    resetPassword: email => {
      dispatch(emailAuthActions.resetPassword(email));
    },
  },
});

ResetPassword.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPassword);
