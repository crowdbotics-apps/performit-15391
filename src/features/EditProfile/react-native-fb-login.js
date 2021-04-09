import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert,
  Modal,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import qs from 'qs';
const {width, height} = Dimensions.get('window');
import {WebView} from 'react-native-webview';

export default class Facebook extends Component {
  constructor(props) {
    super(props);
    this.state = {modalVisible: false};
  }

  show() {
    this.setState({modalVisible: true, code: null});
  }

  hide() {
    this.setState({modalVisible: false});
  }

  _getParameterByName(name, url) {
    name = name.replace(/[[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  _onNavigationStateChange(webViewState) {
    const {redirectURI} = this.props;
    const {url} = webViewState;
    // console.log(url)
    if (url && url.startsWith(redirectURI) && this.state.modalVisible) {
      //console.log(url);
      const token =
        this._getParameterByName('access_token', url) ||
        this._getParameterByName('#access_token', url);
      // console.log(token)
      if (token) {
        this.props.onLoginSuccess({token});
        this.hide();
      }
    }
  }

  _onError(error) {
    console.log('error', error);
  }

  render() {
    const {clientId, redirectURI, scope} = this.props;
    const query = qs.stringify({
      client_id: clientId,
      redirect_uri: redirectURI,
      response_type: 'token',
      scope: scope.join(','),
    });
    const uri = `https://www.facebook.com/v2.9/dialog/oauth?${query}`;
    console.log(uri)
    return (
      <Modal
        style={styles.modelContainer}
        animationType={'slide'}
        visible={this.state.modalVisible}
        onRequestClose={this.hide.bind(this)}
        transparent>
        <View style={styles.modalWarp}>
          <WebView
            style={[styles.webview, this.props.styles]}
            source={{uri}}
            scalesPageToFit
            startInLoadingState
            onNavigationStateChange={this._onNavigationStateChange.bind(this)}
            onError={this._onError.bind(this)}
          />
        </View>
        <TouchableOpacity
          onPress={this.hide.bind(this)}
          style={styles.btnStyle}>
          <Image source={require('./close.png')} style={styles.closeStyle} />
        </TouchableOpacity>
      </Modal>
    );
  }
}
const propTypes = {
  clientId: PropTypes.string.isRequired,
  redirectURI: PropTypes.string,
  styles: PropTypes.object,
  onLoginSuccess: PropTypes.func,
  modalVisible: PropTypes.bool,
  scope: PropTypes.array,
};

const defaultProps = {
  redirectURI: 'https://localhost',
  scope: ['public_profile'],
  onLoginSuccess: token => {
    Alert.alert('Alert Title', 'Token: ' + token, [{text: 'OK'}], {
      cancelable: false,
    });
  },
};

Facebook.propTypes = propTypes;
Facebook.defaultProps = defaultProps;

const styles = StyleSheet.create({
  modelContainer: {
    flex: 1,
  },
  modalWarp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  webview: {
    margin: 20,
    width: width - 40,
    maxHeight: height - 40,
  },
  keyboardStyle: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  btnStyle: {
    width: 30,
    height: 30,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  closeStyle: {
    width: 20,
    height: 20,
  },
});
