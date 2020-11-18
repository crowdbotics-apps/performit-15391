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

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      activeTab: 'top',
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

    this.setState({
      isLoading: false,
    });
  }

  async componentDidUpdate(prevProps) {
    // write code here
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
  }

  switchTab = tab => {
    this.setState({
      activeTab: tab,
    });
    if (this.state.searchTerm) {
      clearTimeout(this.search.searchTimeOut);
      this.search.searchTimeOut = setTimeout(async () => {
        const {
          accessToken,
          actions: {searchDashboard},
        } = this.props;
        await searchDashboard(tab, 1, accessToken, this.state.searchTerm);
      }, 500);
    }
  };

  searchDashboard = text => {
    this.setState({
      searchTerm: text,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
      const {
        accessToken,
        actions: {searchDashboard},
      } = this.props;
      await searchDashboard(this.state.activeTab, 1, accessToken, text);
    }, 500);
  };

  getUserTypes = userTypesArray => {
    let userTypes = '';
    if (userTypesArray && userTypesArray.length > 0) {
      userTypesArray.forEach(item => {
        userTypes = userTypes + userTypesConfig[item] + ', ';
      });
      userTypes = userTypes.replace(/,\s*$/, '');
    }
    return userTypes;
  };

  render() {
    const {
      navigation,
      searchTopAccountsList,
      searchAccountsList,
      searchGroupsList,
      searchHashTagsList,
    } = this.props;

    const {activeTab, searchTerm} = this.state;

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
              onChangeText={value => this.searchDashboard(value)}
            />
          </View>
        </View>

        <View style={styles.followHeaderContainer}>
          <TouchableOpacity
            onPress={() => this.switchTab('top')}
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
            onPress={() => this.switchTab('accounts')}
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
            onPress={() => this.switchTab('groups')}
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
            onPress={() => this.switchTab('hashtags')}
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

        {searchTerm &&
        searchTopAccountsList &&
        searchTopAccountsList.data &&
        searchTopAccountsList.data.length > 0 &&
        activeTab === 'top' ? (
          searchTopAccountsList.data.map(account => (
            <View style={styles.followProfileRowContainer}>
              <View style={styles.followProfileRowLeftContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProfilePage', {
                      userId: account.pk,
                    })
                  }
                  style={[styles.profileRowImageContainer]}>
                  <Image
                    style={[styles.profileRowImage]}
                    source={{
                      uri:
                        account &&
                        account.meta_data &&
                        account.meta_data.user_details &&
                        account.meta_data.user_details.profile_pic,
                    }}
                  />
                </TouchableOpacity>

                <View style={styles.followProfileRowTextContainer}>
                  <View style={styles.followProfileRowNameContainer}>
                    {account && (account.first_name || account.last_name) ? (
                      <Text style={styles.followProfileText}>
                        {account.first_name} {account.last_name}
                      </Text>
                    ) : (
                      <Text style={styles.followProfileText}>
                        {account.username}
                      </Text>
                    )}
                  </View>
                  <View style={styles.followProfileRowRoleContainer}>
                    <Text style={styles.followProfileSubText}>
                      {this.getUserTypes(
                        account &&
                          account.meta_data &&
                          account.meta_data.user_types,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <></>
        )}

        {searchTerm &&
        searchAccountsList &&
        searchAccountsList.data &&
        searchAccountsList.data.length > 0 &&
        activeTab === 'accounts' ? (
          searchAccountsList.data.map(account => (
            <View style={styles.followProfileRowContainer}>
              <View style={styles.followProfileRowLeftContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProfilePage', {
                      userId: account.pk,
                    })
                  }
                  style={[styles.profileRowImageContainer]}>
                  <Image
                    style={[styles.profileRowImage]}
                    source={{
                      uri:
                        account &&
                        account.meta_data &&
                        account.meta_data.user_details &&
                        account.meta_data.user_details.profile_pic,
                    }}
                  />
                </TouchableOpacity>

                <View style={styles.followProfileRowTextContainer}>
                  <View style={styles.followProfileRowNameContainer}>
                    {account && (account.first_name || account.last_name) ? (
                      <Text style={styles.followProfileText}>
                        {account.first_name} {account.last_name}
                      </Text>
                    ) : (
                      <Text style={styles.followProfileText}>
                        {account.username}
                      </Text>
                    )}
                  </View>
                  <View style={styles.followProfileRowRoleContainer}>
                    <Text style={styles.followProfileSubText}>
                      {this.getUserTypes(
                        account &&
                          account.meta_data &&
                          account.meta_data.user_types,
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <></>
        )}

        {searchTerm &&
        searchGroupsList &&
        searchGroupsList.data &&
        searchGroupsList.data.length > 0 &&
        activeTab === 'groups' ? (
          searchGroupsList.data.map(group => (
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
          ))
        ) : (
          <></>
        )}

        {searchTerm &&
        searchHashTagsList &&
        searchHashTagsList.data &&
        searchHashTagsList.data.length > 0 &&
        activeTab === 'hashtags' ? (
          searchHashTagsList.data.map(hahstag => (
            <View style={styles.followProfileRowContainer}>
              <View style={styles.followProfileRowLeftContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('HashTagHomePage', {
                      hashtag: this.state.searchTerm,
                    })
                  }
                  style={[styles.profileRowImageContainer]}>
                  <Image
                    style={[styles.hashTagImage]}
                    source={require('../../assets/images/hashtag.png')}
                  />
                </TouchableOpacity>

                <View style={styles.followProfileRowTextContainer}>
                  <View style={styles.followProfileRowNameContainer}>
                    <Text style={styles.followProfileText}>
                      {hahstag && hahstag.caption}
                    </Text>
                  </View>
                  <View style={styles.followProfileRowRoleContainer}>
                    <Text style={styles.followProfileSubText}>
                      Trending Hashtag
                    </Text>
                  </View>
                </View>
              </View>
            </View>
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
  posts: state.Posts.userPosts,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  searchTopAccountsList: state.Posts.searchTopAccountsList,
  searchAccountsList: state.Posts.searchAccountsList,
  searchGroupsList: state.Posts.searchGroupsList,
  searchHashTagsList: state.Posts.searchHashTagsList,
  accessToken: state.EmailAuth.accessToken,
  isSearchDashboardLoading: state.Posts.isSearchDashboardLoading,
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

SearchPage.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchPage);
