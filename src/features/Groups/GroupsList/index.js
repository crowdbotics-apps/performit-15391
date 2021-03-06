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
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {styles} from './styles';
import * as homeActions from '../../HomePage/redux/actions';
import * as groupActions from '../../Groups/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../../utils/scale';
import * as profileActions from '../../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';
import VideoPlayer from '../../components/VideoPlayer';

class GroupsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'following',
      newComment: '',
      currentTime: 0,
      paused: true,
      progress: 0,
      duration: 0,
      seekTime: -1,
      showControls: false,
      postsData: [],
      searchTerm: ''
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
    let userId = this.props.navigation.getParam('userId', '');
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const accessToken = this.props.accessToken;

    const {
      actions: {getUserGroups},
    } = this.props;
    if (accessToken) {
      await getUserGroups(accessToken);
    }

    this.setState({
      userId
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    const prevUserId = prevProps.navigation.getParam('userId', '');
    const userId = this.props.navigation.getParam('userId', '');
    const accessToken = this.props.accessToken;
    const {
      actions: {getUserGroups},
    } = this.props;

    if(this.props.isSearchDashboardLoading !== prevProps.isSearchDashboardLoading){
      if(this.props.isSearchDashboardLoading){
        this.setState({
          isLoading: true
        })
      } else {
        this.setState({
          isLoading: false
        })
      }
    }

    if(this.props.userGroupLoading !== prevProps.userGroupLoading){
      if(this.props.userGroupLoading){
        this.setState({
          isLoading: true
        })
      } else {
        this.setState({
          isLoading: false
        })
      }
    }
    
  }

  searchGroup = text => {
    this.setState({
      searchTerm: text,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
      const {
        accessToken,
        actions: {searchDashboard},
      } = this.props;
      await searchDashboard('groups', 1, accessToken, text);
    }, 500);
  };

  render() {
    const {profile: allProfiles, posts, commentsList} = this.props;
    const {
      navigation,
      searchGroupsList,
      userGroups
    } = this.props;

    let {activeTab, searchTerm, postsData, userId} = this.state;
    if (!userId) {
      userId = this.props.user && this.props.user.pk;
    }
    const profile = allProfiles && allProfiles[`${userId}`];
    let groupsData = [];

    if(searchTerm) {
      groupsData = (searchGroupsList && searchGroupsList.data) || []
    } else {
      groupsData = (userGroups && userGroups.data) || []
    }

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
                source={require('../../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Groups</Text>
          </View>
          <TouchableOpacity
            style={[styles.createGroupTextContainer]}
            onPress={() => navigation.navigate('CreateGroupPage')}>
            <Text style={styles.createGroupText}>Create Group</Text>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.searchButtonContainer}>
          <TouchableOpacity
            style={[styles.searchIconContainer]}
            onPress={() => console.log('-------search')}>
            <View style={[styles.searchIcon]}>
              <Image
                style={[styles.searchIcon]}
                source={require('../../../assets/images/search_icon.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.textInput}
              autoCorrect={false}
              placeholderTextColor="#989BA5"
              placeholder="Search"
              autoCapitalize="none"
              selectionColor="#ffffff"
              onChangeText={value => this.searchGroup(value)}
            />
          </View>
        </View>

            {groupsData &&
              groupsData.length > 0 ? (
                groupsData.map(group => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('GroupsDescriptionPage', {groupId: group && group.id})}
              style={styles.followProfileRowContainer}>
              <View style={styles.followProfileRowLeftContainer}>
                <View style={styles.followProfileRowContainer}>
                  <View style={styles.followProfileRowLeftContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('GroupsDescriptionPage', {groupId: group && group.id})}
                      style={[styles.profileRowImageContainer]}>
                      <Image
                        style={[styles.profileRowImage]}
                        source={{
                          uri: group && group.group_icon,
                        }}
                      />
                    </TouchableOpacity>

                    <View style={styles.followProfileRowTextContainer}>
                      <View style={styles.followProfileRowNameContainer}>
                        <Text style={styles.followProfileText}>
                          {group && group.group_name}
                          <Text
                            style={[
                              styles.followProfileText,
                              {color: '#B88746', fontSize: scaleModerate(12)},
                            ]}>
                            {'  '}(
                            {group &&
                              group.meta_data &&
                              group.meta_data.group_member_count}{' '}
                            members)
                          </Text>
                        </Text>
                      </View>
                      <View style={styles.followProfileRowRoleContainer}>
                        <Text style={styles.followProfileSubText}>
                          {group && group.group_description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
                ))
                ) : (
              <></>
            )}

            {!!this.state.isLoading && 
              <View style={styles.loaderContainer}>
                <ActivityIndicator animating />
              </View>
            }
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  userPostsCommentErrors: state.Posts.errors.UserPostsCommentList,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  commentsList: state.Posts.userPostsCommentList,
  user: state.EmailAuth.user,
  searchGroupsList: state.Posts.searchGroupsList,
  userGroups: state.Group.userGroups,
  userGroupLoading: state.Group.userGroupLoading,
  userGroupSuccess: state.Group.userGroupSuccess,
  isSearchDashboardLoading: state.Posts.isSearchDashboardLoading,
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
    addEditPostRank: (postId, rating, accessToken) => {
      dispatch(homeActions.addEditPostRank(postId, rating, accessToken));
    },
    addPostView: (postId, accessToken) => {
      dispatch(homeActions.addPostView(postId, accessToken));
    },
    fetchCommentsForPost: (postId, accessToken) => {
      dispatch(homeActions.fetchCommentsForPost(postId, accessToken));
    },
    addCommentToPost: (postId, comment, accessToken) => {
      dispatch(homeActions.addCommentToPost(postId, comment, accessToken));
    },
    searchDashboard: (tab, page, token, term) => {
      dispatch(homeActions.searchDashboard(tab, page, token, term));
    },
    getUserGroups: (token) => {
      dispatch(groupActions.getUserGroups(token));
    },
  },
});

GroupsList.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsList);
