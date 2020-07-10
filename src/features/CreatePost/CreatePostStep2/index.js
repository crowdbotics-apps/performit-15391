import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import {connect} from 'react-redux';
import * as profileActions from '../../ProfilePage/redux/actions';

class CreatePostStep2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'Video',
      recordingStarted: false,
      showDiscardContentModal: false,
    };
  }

  static navigationOptions = {
    header: null,
  };b

  search = {
    searchTimeOut: null,
  };

  async componentDidMount() {
    // write code here
  }

  async componentDidUpdate(prevProps) {
    // write code here
  }

  onClose = () => {
    this.setState(
      {
        showDiscardContentModal: false,
      },
      () => this.props.navigation.navigate('HomePage', {userId: ''}),
    );
  };

  render() {
    const {navigation} = this.props;
    const {activeTab, recordingStarted} = this.state;

    return (
      <View style={styles.screen}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => navigation.goBack()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../../assets/images/cross_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Add Placholder image</Text>
            <TouchableOpacity onPress={() => console.log('------next')}>
              <Text style={styles.headerNextText}>Next</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View style={styles.bodyContainer}>
          <View style={styles.upperBodyContainer}>
            <View style={styles.videoControlsContainer}>
              <TouchableOpacity
                style={[styles.flipCameraContainer]}
                onPress={() => console.log('------rotate')}>
                <View style={[styles.flipCamera]}>
                  <Image
                    style={[styles.flipCamera]}
                    source={require('../../../assets/images/flip_camera_icon.png')}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.flashCameraContainer]}
                onPress={() => console.log('flash')}>
                <View style={[styles.flashCamera]}>
                  <Image
                    style={[styles.flashCamera]}
                    source={require('../../../assets/images/flash.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.lowerBodyContainer}>
            <View style={styles.recordButtonParentContainer}>
              <TouchableOpacity
                style={[styles.recordButtonContainer]}
                onPress={() =>
                  this.setState({recordingStarted: !recordingStarted})
                }>
                <View style={[styles.recordButton]}>
                  <Image
                    style={[styles.recordButton]}
                    source={require('../../../assets/images/record_icon.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.libraryButtonParentContainer}>
              <TouchableOpacity
                style={[styles.libraryButtonContainer]}
                onPress={() => console.log('library button')}>
                <View style={[styles.libraryButton]}>
                  <Image
                    style={[styles.libraryButton]}
                    source={require('../../../assets/images/library.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  searchHashTagsList: state.Posts.searchHashTagsList,
  accessToken: state.EmailAuth.accessToken,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    userPosts: (tab, token, userId) => {
      dispatch(homeActions.userPosts(tab, token, userId));
    },
    followersConnectionsList: (userId, token) => {
      dispatch(profileActions.followersConnectionsList(userId, 1, token));
    },
    searchDashboard: (tab, page, token, term) => {
      dispatch(homeActions.searchDashboard(tab, page, token, term));
    },
  },
});

CreatePostStep2.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreatePostStep2);
