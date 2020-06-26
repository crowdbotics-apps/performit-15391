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
    console.log('----------------------postId 00000', postId);
    const {
      actions: {fetchCommentsForPost},
    } = this.props;
    const accessToken = this.props.accessToken;
    await fetchCommentsForPost(postId, accessToken);

    this.setState({
      isLoading: false,
      postId,
    });
  }

  async componentDidUpdate(prevProps) {
    const prevPostId = prevProps.navigation.getParam('postId', '');
    const postId = this.props.navigation.getParam('postId', '');
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
      });
    }
  }

  render() {
    const {navigation, commentsList} = this.props;
    let comments = commentsList && commentsList[`${this.state.postId}`];
    comments = get(comments, 'comments.data', []);
    console.log('-------------------------------this.state.comments', comments);
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
            <Text style={styles.headerText}>Comments</Text>
          </View>
        </SafeAreaView>
        {comments.map(comment => (
          <View style={styles.postParentContainer}>
            <View style={styles.postProfileContainer}>
              <View style={[styles.postProfileImage]}>
                <Image
                  style={[styles.postProfileImage]}
                  source={{
                    uri:
                      comment &&
                      comment.commenter_user &&
                      comment.commenter_user.meta_data &&
                      comment.commenter_user.meta_data.user_details &&
                      comment.commenter_user.meta_data.user_details.profile_pic,
                  }}
                />
              </View>
              <View style={styles.postProfileTextContainer}>
                {comment &&
                comment.commenter_user &&
                (comment.commenter_user.first_name ||
                  comment.commenter_user.last_name) ? (
                  <Text style={[styles.postProfileText, {color: '#B88746'}]}>
                    {`${comment.commenter_user.first_name} ${
                      comment.commenter_user.last_name
                    }`}
                    {'  '}
                    <Text style={styles.postProfileText}>
                      {comment && comment.comment}
                    </Text>
                  </Text>
                ) : (
                  <Text style={[styles.postProfileText, {color: '#B88746'}]}>
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
  },
});

CommentsPage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CommentsPage);
