import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../utils/scale';
import * as profileActions from '../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import {userTypesConfig} from '../../config/userTypes';
import VideoPlayer from '../components/VideoPlayer';

class HashTagHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'top',
      hashtag: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  search = {
    searchTimeOut: null,
  };

  async componentDidMount() {
    // write code here
    this.setState({
      isLoading: true,
    });
    const hashtag = this.props.navigation.getParam('hashtag', '');
    if (hashtag) {
      const {
        accessToken,
        actions: {searchDashboard},
      } = this.props;
      await searchDashboard('hashtags', 1, accessToken, hashtag);
    }

    this.setState({
      isLoading: false,
      hashtag,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    // console.log('-------------------------');
    // if (this.props.searchHashTagsList !== prevProps.searchHashTagsList) {
    //   if (this.state.hashtag) {
    //     const {
    //       accessToken,
    //       actions: {searchDashboard},
    //     } = this.props;
    //     await searchDashboard('hashtags', 1, accessToken, this.state.hashtag);
    //   }
    // }
  }

  // setting current time of video to a timestamp
  setVideoCurrentTime = (time, postId) => {
    this.setState({
      [`currentTime${postId}`]: time,
    });
  };

  // initializing seekTime to -1 in beginning to differentiate later
  initializeSeekTime = postId => {
    this.setState({
      [`seekTime${postId}`]: -1,
    });
  };

  render() {
    const {navigation, searchHashTagsList} = this.props;

    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => navigation.goBack()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>{this.state.hashtag}</Text>
          </View>
        </SafeAreaView>
        {!this.state.isLoading && (
          <View style={styles.profileImagesContainer}>
            {searchHashTagsList &&
              searchHashTagsList.data &&
              searchHashTagsList.data.map(hahstag => (
                <View style={styles.profileSingleImageConatiner}>
                  <VideoPlayer
                    showBottomcontrol={false}
                    videoHeight={137 * 0.66}
                    postId={hahstag && hahstag.id}
                    source={hahstag && hahstag.content}
                    navigation={this.props.navigation}
                    disableVolume="false"
                    disableBack="false"
                    paused={this.state[`paused${hahstag && hahstag.id}`]}
                    shouldToggleControls={true}
                    onVideoProgress={time => {
                      this.setVideoCurrentTime(time, hahstag && hahstag.id);
                    }}
                    initializeSeek={() => {
                      this.initializeSeekTime(hahstag && hahstag.id);
                    }}
                    onEnd={() => {
                      this.setState({
                        [`paused${hahstag && hahstag.id}`]: true,
                      });
                    }}
                    onPause={() => {
                      this.setState({
                        [`paused${hahstag && hahstag.id}`]: true,
                      });
                    }}
                    onPlay={() => {
                      this.setState({
                        [`paused${hahstag && hahstag.id}`]: false,
                      });
                    }}
                    onLoad={fields => {
                      this.setState({
                        [`duration${hahstag && hahstag.id}`]: fields.duration,
                      });
                    }}
                    showControls={value => {
                      this.setState({
                        [`showControls${hahstag && hahstag.id}`]: value,
                      });
                    }}
                  />
                </View>
              ))}
          </View>
        )}
        {this.state.isLoading && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator animating />
          </View>
        )}
      </ScrollView>
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

HashTagHomePage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HashTagHomePage);
