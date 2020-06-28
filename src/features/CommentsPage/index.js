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
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';
import * as homeActions from '../HomePage/redux/actions';
import {connect} from 'react-redux';
import {scaleModerate} from '../../utils/scale';
import * as profileActions from '../ProfilePage/redux/actions';
import {cloneDeep, get} from 'lodash';

class CommentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'top',
      newComment: '',
    };
  }

  static navigationOptions = {
    header: null,
    postId: '',
    comments: [],
  };

  async componentDidMount() {
    // write code here
    this.setState({
      isLoading: true,
    });

    const postId = this.props.navigation.getParam('postId', '');
    const activeTab = this.props.navigation.getParam('activeTab', 'following');
    const {
      actions: {fetchCommentsForPost},
    } = this.props;
    const accessToken = this.props.accessToken;
    await fetchCommentsForPost(postId, accessToken);

    this.setState({
      isLoading: false,
      postId,
      activeTab,
    });
  }

  async componentDidUpdate(prevProps) {
    const prevPostId = prevProps.navigation.getParam('postId', '');
    const postId = this.props.navigation.getParam('postId', '');
    const activeTab = this.props.navigation.getParam('activeTab', 'following');
    if (prevPostId !== postId) {
      this.setState({
        isLoading: true,
      });
      const {
        actions: {fetchCommentsForPost},
      } = this.props;
      const accessToken = this.props.accessToken;
      await fetchCommentsForPost(postId, accessToken);

      this.setState({
        isLoading: false,
        postId,
        activeTab,
      });
    }
  }

  handleCommentChange = (postId, text) => {
    // write code here
    this.setState({
      [`newComment${postId}`]: text,
    });
  };

  postComment = async postId => {
    const accessToken = this.props.accessToken;
    const userId = this.props.user && this.props.user.pk;
    const {
      actions: {userPosts, addCommentToPost, fetchCommentsForPost},
    } = this.props;

    await addCommentToPost(
      postId,
      this.state[`newComment${postId}`],
      accessToken,
    );
    await fetchCommentsForPost(postId, accessToken);
    Keyboard.dismiss();
    await userPosts(this.state.activeTab, accessToken, userId);
    this.setState({
      [`newComment${postId}`]: '',
    });
  };

  handleOnFocus = postId => {
    // write code here
    this.setState({
      [`isFocus${postId}`]: true,
    });
  };

  handleOnBlur = postId => {
    // write code here
    this.setState({
      [`isFocus${postId}`]: false,
    });
  };

  render() {
    const {navigation, commentsList} = this.props;
    let comments = commentsList && commentsList[`${this.state.postId}`];
    comments = get(comments, 'comments.data', []);
    return (
      <View style={{flex: 1, backgroundColor: 'black'}}>
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
            <Text style={styles.headerText}>Comments</Text>
          </View>
        </SafeAreaView>
        <KeyboardAvoidingView
          behavior={'position'}
          style={{flex: 1, backgroundColor: 'black', minHeight: '90%'}}>
          <ScrollView
            contentContainerStyle={styles.screen}
            keyboardShouldPersistTaps={'handled'}
            style={{backgroundColor: 'black'}}>
            {comments.map(comment => (
              <View style={styles.postParentContainer}>
                <View style={styles.postProfileContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId:
                          comment &&
                          comment.commenter_user &&
                          comment.commenter_user.pk,
                      })
                    }
                    style={[styles.postProfileImage]}>
                    <Image
                      style={[styles.postProfileImage]}
                      source={{
                        uri:
                          comment &&
                          comment.commenter_user &&
                          comment.commenter_user.meta_data &&
                          comment.commenter_user.meta_data.user_details &&
                          comment.commenter_user.meta_data.user_details
                            .profile_pic,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={styles.postProfileTextContainer}>
                    {comment &&
                    comment.commenter_user &&
                    (comment.commenter_user.first_name ||
                      comment.commenter_user.last_name) ? (
                      <Text
                        style={[styles.postProfileText, {color: '#B88746'}]}>
                        {`${comment.commenter_user.first_name} ${
                          comment.commenter_user.last_name
                        }`}
                        {'  '}
                        <Text style={styles.postProfileText}>
                          {comment && comment.comment}
                        </Text>
                      </Text>
                    ) : (
                      <Text
                        style={[styles.postProfileText, {color: '#B88746'}]}>
                        {comment.commenter_user.username}
                        {'  '}
                        <Text style={styles.postProfileText}>
                          {comment && comment.comment}
                        </Text>
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.enterCommentContainer}>
            <TextInput
              value={this.state[`newComment${this.state.postId}`]}
              onChangeText={text =>
                this.handleCommentChange(this.state.postId, text)
              }
              onFocus={() => this.handleOnFocus(this.state.postId)}
              onBlur={() => this.handleOnBlur(this.state.postId)}
              placeholder="Add Comment"
              style={styles.commentInput}
              autoCapitalize="none"
              placeholderTextColor="#989ba5"
              underlineColorAndroid="transparent"
              multiline={true}
            />
            {this.state[`isFocus${this.state.postId}`] && (
              <TouchableOpacity
                style={[styles.postButton]}
                onPress={() => this.postComment(this.state.postId)}>
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: scaleModerate(14),
                    fontFamily: 'Nunito',
                    lineHeight: undefined,
                  }}>
                  Post
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
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
    fetchCommentsForPost: (postId, accessToken) => {
      dispatch(homeActions.fetchCommentsForPost(postId, accessToken));
    },
    addCommentToPost: (postId, comment, accessToken) => {
      dispatch(homeActions.addCommentToPost(postId, comment, accessToken));
    },
  },
});

CommentsPage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsPage);
