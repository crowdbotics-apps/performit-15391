import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Button,
  Text,
  TextInput,
  Dimensions,
  Platform,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {cloneDeep} from 'lodash';
import * as homeActions from '../HomePage/redux/actions';
import Modal from 'react-native-modalbox';
import {styles} from './styles';
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import CheckBox from 'react-native-check-box';
import {scaleModerate, scaleVertical} from '../../utils/scale';

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
];

class Location extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userId: '',
      currentPassword: '',
      showCurrentPassword: false,
      newPassword: '',
      showNewPassword: false,
      confirmNewPassword: '',
      showConfirmNewPassword: false,
      showError: false,
      error: '',
      updateForm: false,
      showSuccessModal: false,
      user_types: [],
      distance: 10,
      term: '',
      lat: '',
      lng: '',
      isMale: true,
      isArtistChecked: false,
      isSingerChecked: false,
      isRapperChecked: false,
      isDancerChecked: false,
      isProducerChecked: false,
      isOtherChecked: false,
      profilePic: '',
      profileSource: {},
      isEditLoading: false,
      counter: 30,
      timer: null,
      showFilters: false
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    // write code here
    const accessToken = this.props.accessToken;

    const {
      actions: {findNearbyUsers},
    } = this.props;
    if (accessToken) {
      await findNearbyUsers(accessToken, this.state.user_types, this.state.distance, this.state.term);
    }
  }

  async componentDidUpdate(prevProps) {
    // write code here
  }

  searchLocation = text => {
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
  const mytextvar = 'Alexis'
  const profile = ''
  console.log('------------------------------------------this.props.nearbyUsers', this.props.nearbyUsers)
    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps={'handled'}
        style={{backgroundColor: 'black'}}>
        <SafeAreaView style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
                Nearby
              </Text>
          </View>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => this.setState({showFilters: !this.state.showFilters})}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../assets/images/filter-icon.png')}
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>

        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            customMapStyle={mapStyle}
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker
              coordinate = {{latitude: 37.78825,longitude: -122.4324}}
            >
              <View>
                <Image source={require('../../assets/images/current-location.png')} 
                  style={{width: scaleModerate(70), height: scaleModerate(70)}} 
                />
              </View>
            </Marker>

            <Marker
              coordinate = {{latitude: 37.78825,longitude: -122.4324}}
            >
              <View style={{
                width: scaleModerate(81),
                height: scaleModerate(120),
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
                <View style={{
                  width: scaleModerate(81),
                  height: scaleModerate(105),
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#111111',
                }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('ProfilePage', {
                        userId: '',
                      })
                    }
                    style={[styles.profileRowImageContainer]}>
                    <Image
                      style={[styles.profileRowImage]}
                      source={{
                        uri:
                          profile &&
                          profile.user_details &&
                          profile.user_details.profile_pic,
                      }}
                    />
                  </TouchableOpacity>
                  <View style={styles.locationTextContainer}>
                    <Text style={styles.headerText}>
                        { ((mytextvar).length > 7) ? 
                        (((mytextvar).substring(0,7-3)) + '...') : 
                        mytextvar }
                      </Text>
                  </View>
                </View>

                <View style={{
                  width: scaleModerate(81),
                  height: scaleModerate(15),
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <View style={{
                    width: 0,
                    height: 0,
                    backgroundColor: 'transparent',
                    borderStyle: 'solid',
                    borderTopWidth: 15,
                    borderRightWidth: 8,
                    borderBottomWidth: 0,
                    borderLeftWidth: 8,
                    borderTopColor: '#111111',
                    borderRightColor: 'transparent',
                    borderBottomColor: 'transparent',
                    borderLeftColor: 'transparent',
                  }} />
                </View>
              </View>
            </Marker>

          </MapView>
        </View>

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
              onChangeText={value => this.searchLocation(value)}
            />
          </View>
        </View>

        {this.state.showFilters && <View style={styles.userTypeParentBodyContainer}>
          <View
            style={[
              styles.genderTitle,
              {marginBottom: scaleModerate(12), marginTop: scaleModerate(12)},
            ]}>
            <Text style={styles.genderText}>User Type</Text>
          </View>

          <View style={styles.userTypeBody}>
            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isArtistChecked}
                onClick={() =>
                  this.setState({
                    isArtistChecked: !this.state.isArtistChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Artist</Text>
            </View>

            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isSingerChecked}
                onClick={() =>
                  this.setState({
                    isSingerChecked: !this.state.isSingerChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Singer</Text>
            </View>

            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isRapperChecked}
                onClick={() =>
                  this.setState({
                    isRapperChecked: !this.state.isRapperChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Rapper</Text>
            </View>

            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isDancerChecked}
                onClick={() =>
                  this.setState({
                    isDancerChecked: !this.state.isDancerChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Dancer</Text>
            </View>

            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isProducerChecked}
                onClick={() =>
                  this.setState({
                    isProducerChecked: !this.state.isProducerChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Producer</Text>
            </View>

            <View style={styles.userTypeSubBody}>
              <CheckBox
                isChecked={this.state.isOtherChecked}
                onClick={() =>
                  this.setState({
                    isOtherChecked: !this.state.isOtherChecked,
                  })
                }
                style={{marginRight: 20}}
                checkBoxColor={'#b88746'}
                uncheckedCheckBoxColor={'#989ba5'}
              />
              <Text style={styles.genderText}>Other</Text>
            </View>
          </View>
        </View>}
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  userDetailErrors: state.Profile.errors.UserDetail,
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  editProfileErrors: state.Profile.errors.ChangePassword,
  editProfileSuccess: state.Profile.editProfileSuccess,
  nearbyUsers: state.Posts.nearbyUsers,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
    editProfile: (token, user, userTypes) => {
      dispatch(profileActions.editProfile(token, user, userTypes));
    },
    findNearbyUsers: (token, user_types, distance, term) => {
      dispatch(homeActions.findNearbyUsers(token, user_types, distance, term));
    }
  },
});

Location.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Location);
