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

class SearchPage extends Component {
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
  };

  async componentDidMount() {
    // write code here
    this.setState({
      isLoading: true,
    });

    this.setState({
      isLoading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
    console.log('-------------------------');
  }

  handleCommentChange = () => {
    // write code here
    console.log('---------------this.state.newComment', this.state.newComment);
  };

  switchTab = tab => {
    this.setState({
      activeTab: tab,
    });
  };

  searchUser = text => {
    this.setState({
      searchTerm: text,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
      const {
        accessToken,
        actions: {
          searchFollowersConnectionsList,
          searchFollowingConnectionsList,
        },
      } = this.props;
      // await searchFollowersConnectionsList(
      //   this.state.userId,
      //   1,
      //   accessToken,
      //   text,
      // );
      // await searchFollowingConnectionsList(
      //   this.state.userId,
      //   1,
      //   accessToken,
      //   text,
      // );
    }, 1000);
  };

  render() {
    const {navigation} = this.props;
    const {activeTab} = this.state;
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
            <Text style={styles.headerText}>Search</Text>
          </View>
        </SafeAreaView>

        <View style={styles.searchButtonContainer}>
          <TouchableOpacity
            style={[styles.searchIconContainer]}
            onPress={() => console.log('-------search')}>
            <View style={[styles.searchIcon]}>
              <Image
                style={[styles.searchIcon]}
                source={require('../../assets/images/search_icon.png')}
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
              onChangeText={value => this.searchUser(value)}
            />
          </View>
        </View>

        <View style={styles.followHeaderContainer}>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'top'})}
            style={[
              styles.followersHeaderContainer,
              activeTab === 'top' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'top'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              Top
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'accounts'})}
            style={[
              styles.followingHeaderContainer,
              activeTab === 'accounts' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'accounts'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              Accounts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'groups'})}
            style={[
              styles.followingHeaderContainer,
              activeTab === 'groups' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'groups'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              Groups
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.setState({activeTab: 'hashtags'})}
            style={[
              styles.followingHeaderContainer,
              activeTab === 'hashtags' ? styles.activeTab : styles.inactiveTab,
            ]}>
            <Text
              style={
                activeTab === 'hashtags'
                  ? styles.activeHeaderText
                  : styles.inActiveHeaderText
              }>
              Hashtags
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userPostsErrors: state.Posts.errors.UserPosts,
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
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
    followersConnectionsList: (userId, token) => {
      dispatch(profileActions.followersConnectionsList(userId, 1, token));
    },
  },
});

SearchPage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
