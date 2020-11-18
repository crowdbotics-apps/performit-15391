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
  Dimensions,
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

const screenSize = Dimensions.get('window');

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
    if (
      this.props.searchDashBoardSuccess !== prevProps.searchDashBoardSuccess
    ) {
      this.setState({
        isLoading: false,
      });
    }
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
        {!this.state.isLoading &&
          (searchHashTagsList &&
            searchHashTagsList.data &&
            searchHashTagsList.data.length > 0 && (
              <View style={styles.profileImagesContainer}>
                {searchHashTagsList.data.map(hahstag => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('PreviewVideoMessage', {
                        videoData: {
                          uri: hahstag && hahstag.content,
                        },
                      });
                    }}
                    style={styles.profileSingleImageConatiner}>
                    <VideoPlayer
                      key={hahstag && hahstag.id}
                      showBottomcontrol={false}
                      videoHeight={(screenSize.width / 3 - 1) * 0.66}
                      postId={hahstag && hahstag.id}
                      source={hahstag && hahstag.content}
                      poster={hahstag && hahstag.thumbnail}
                      navigation={this.props.navigation}
                      disableVolume="false"
                      disableBack="false"
                      paused={true}
                      shouldToggleControls={false}
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
                        console.log('------pause');
                      }}
                      onPlay={() => {
                        navigation.navigate('PreviewVideoMessage', {
                          videoData: {
                            uri: hahstag && hahstag.content,
                          },
                        });
                      }}
                      onLoad={fields => {
                        this.setState({
                          [`duration${hahstag && hahstag.id}`]: fields.duration,
                        });
                      }}
                      showControls={value => {
                        navigation.navigate('PreviewVideoMessage', {
                          videoData: {
                            uri: hahstag && hahstag.content,
                          },
                        });
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
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
  searchDashBoardSuccess: state.Posts.searchDashBoardSuccess,
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
