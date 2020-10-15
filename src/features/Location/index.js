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
import {check, request, openSettings, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {cloneDeep, get} from 'lodash';
import * as homeActions from '../HomePage/redux/actions';
import Modal from 'react-native-modalbox';
import {styles} from './styles';
import * as profileActions from '../ProfilePage/redux/actions';
import {connect} from 'react-redux';
import CheckBox from 'react-native-check-box';
import {scaleModerate, scaleVertical} from '../../utils/scale';
import Slider from '@react-native-community/slider';
import { withNavigationFocus } from "react-navigation";
import Geolocation from '@react-native-community/geolocation';

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
      user_types: [],
      distance: 10,
      searchTerm: '',
      lat: '',
      lng: '',
      isArtistChecked: false,
      isSingerChecked: false,
      isRapperChecked: false,
      isDancerChecked: false,
      isProducerChecked: false,
      isOtherChecked: false,
      showFilters: false,
      permissionNotGranted: false
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
    const accessToken = this.props.accessToken;

    const {
      actions: {findNearbyUsers},
    } = this.props;
    if (accessToken) {
      let permissionGranted = false
      if (Platform.OS === 'ios') {
        await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          .then(result => {
            console.log('-------------------result 1', result)
              switch (result) {
                  case RESULTS.GRANTED:
                    permissionGranted = true
                    // console.log('The permission is granted');
                    break;
                }
            })
        .catch(error => {
          // …
        });
        await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then(result => {
            console.log('-------------------result 2', result)
              switch (result) {
                case RESULTS.GRANTED:
                  permissionGranted = true
                  // console.log('The permission is granted');
                  break;
              }
            })
        .catch(error => {
          // …
        });
      } else {
        await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          .then(result => {
            console.log('-------------------result android', result)
            switch (result) {
              case RESULTS.GRANTED:
                permissionGranted = true
                // console.log('The permission is granted');
                break;
            }
          })
        .catch(error => {
          // …
        });
      }

      console.log('-------------------result permissionGranted mount', permissionGranted)
      if(permissionGranted) {
        this.setState({
          permissionNotGranted: false
        })
        await findNearbyUsers(accessToken, this.state.user_types, this.state.distance, this.state.term);
      } else {
        this.setState({
          permissionNotGranted: true
        })
      }
    }

    console.log("--------------did focus 1010101010");
  }

  async componentDidUpdate(prevProps, prevState) {
    // write code here
    if( this.state.isArtistChecked !== prevState.isArtistChecked ||
        this.state.isSingerChecked !== prevState.isSingerChecked ||
        this.state.isRapperChecked !== prevState.isRapperChecked ||
        this.state.isDancerChecked !== prevState.isDancerChecked ||
        this.state.isProducerChecked !== prevState.isProducerChecked ||
        this.state.isOtherChecked !== prevState.isOtherChecked
      ){
        const {
          searchTerm,
          distance,
          isArtistChecked,
          isSingerChecked,
          isRapperChecked,
          isDancerChecked,
          isProducerChecked,
          isOtherChecked,
        } = this.state;
        const user_types = []
        if (isArtistChecked) {
          user_types.push('Artist');
        }

        if (isSingerChecked) {
          user_types.push('DJ');
        }

        if (isRapperChecked) {
          user_types.push('Videographer');
        }

        if (isDancerChecked) {
          user_types.push('Dancer');
        }

        if (isProducerChecked) {
          user_types.push('Producer');
        }

        if (isOtherChecked) {
          user_types.push('Engineer');
        }

        this.setState({
          user_types
        })

        const accessToken = this.props.accessToken;
        const {
          actions: {findNearbyUsers},
        } = this.props;
        if (accessToken) {
          await findNearbyUsers(accessToken, user_types, distance, searchTerm);
        }

    }

    if(this.props.isNearbyUsersLoading !== prevProps.isNearbyUsersLoading){
      if(this.props.isNearbyUsersLoading){
        this.setState({
          isLoading: true
        })
      } else {
        this.setState({
          isLoading: false
        })
      }
    }

    if(this.props.updateLocationLoading !== prevProps.updateLocationLoading && !this.props.updateLocationLoading){
      const accessToken = this.props.accessToken;
      const {
        actions: {userDetails, findNearbyUsers},
      } = this.props;
      const userId = this.props.user && this.props.user.pk;
      if (accessToken) {
        await userDetails(userId, accessToken);
        await findNearbyUsers(accessToken, this.state.user_types, this.state.distance, this.state.term);
      }
    }

    if (prevProps.isFocused !== this.props.isFocused && this.props.isFocused) {
      console.log("--------------did focus location")
      const accessToken = this.props.accessToken;

      const {
        actions: {findNearbyUsers, updateCurrentLocation},
      } = this.props;
      if (accessToken) {
        let permissionGranted = false
        if (Platform.OS === 'ios') {
          await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            .then(result => {
              console.log('-------------------result 1', result)
                switch (result) {
                    case RESULTS.GRANTED:
                      permissionGranted = true
                      // console.log('The permission is granted');
                      break;
                  }
              })
          .catch(error => {
            // …
          });
          await check(PERMISSIONS.IOS.LOCATION_ALWAYS)
            .then(result => {
              console.log('-------------------result 2', result)
                switch (result) {
                  case RESULTS.GRANTED:
                    permissionGranted = true
                    // console.log('The permission is granted');
                    break;
                }
              })
          .catch(error => {
            // …
          });
        } else {
          await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            .then(result => {
              console.log('-------------------result android', result)
              switch (result) {
                case RESULTS.GRANTED:
                  permissionGranted = true
                  // console.log('The permission is granted');
                  break;
              }
            })
          .catch(error => {
            // …
          });
        }
        console.log('-------------------result permissionGranted 1111', permissionGranted)
        if(permissionGranted) {
          this.setState({
            permissionNotGranted: false
          })
          const userId = this.props.user && this.props.user.pk;
          const {profile: allProfiles, navigation, nearbyUsers} = this.props;
          const profile = allProfiles && allProfiles[`${userId}`];
          const latitude = get(profile, 'user.meta_data.live_location_lat', 0);
          const longitude = get(profile, 'user.meta_data.live_location_long', 0);
          console.log('-------------------result android latitude', latitude)
          console.log('-------------------result android longitude', longitude)

          if(!latitude || !longitude) {
            Geolocation.getCurrentPosition(
              async position => {
                const location = JSON.stringify(position);
                if(position && position.coords && position.coords.latitude && position.coords.longitude){
                  await updateCurrentLocation(accessToken, position.coords.latitude.toFixed(4), position.coords.longitude.toFixed(4));
                  // await findNearbyUsers(accessToken, this.state.user_types, this.state.distance, this.state.term);
                }
                this.setState({location});
              },
              error => console.log('Error', JSON.stringify(error)),
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
          }
        } else {
          this.setState({
            permissionNotGranted: true
          })
        }
      }
    }
  }

  searchLocation = text => {
    this.setState({
      searchTerm: text,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
    const accessToken = this.props.accessToken;
    const {
      actions: {findNearbyUsers},
    } = this.props;
    if (accessToken) {
      await findNearbyUsers(accessToken, this.state.user_types, this.state.distance, text);
    }
    }, 500);
  };

  searchLocationOnDistanceChange = value => {
    this.setState({
      distance: value,
    });
    clearTimeout(this.search.searchTimeOut);
    this.search.searchTimeOut = setTimeout(async () => {
    const accessToken = this.props.accessToken;
    const {
      actions: {findNearbyUsers},
    } = this.props;
    if (accessToken) {
      await findNearbyUsers(accessToken, this.state.user_types, value, this.state.searchTerm);
    }
    }, 1000);
  }

  onClose = () => {
    this.setState({permissionNotGranted: false}, () => {
      this.props.navigation.navigate('HomePage', {userId: ''})
    })
  };

  goToSettings = () => {
    this.setState({permissionNotGranted: false}, () => {
      openSettings().catch(() => console.warn('cannot open settings'));
    })
  };

  render() {
  const userId = this.props.user && this.props.user.pk;
  const {profile: allProfiles, navigation, nearbyUsers} = this.props;
  const profile = allProfiles && allProfiles[`${userId}`];
  let nearbyUsersData =  []
  if(nearbyUsers && nearbyUsers.data && nearbyUsers.data.length > 0) {
    nearbyUsersData = nearbyUsers.data
  }
  let i = 1;

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
              latitude: (profile && profile.user && profile.user.meta_data && profile.user.meta_data.live_location_lat) ? profile.user.meta_data.live_location_lat : 0,
              longitude: (profile && profile.user && profile.user.meta_data && profile.user.meta_data.live_location_long) ? profile.user.meta_data.live_location_long : 0,
              latitudeDelta: 0.25,
              longitudeDelta: 0.221,
            }}
          >
            {nearbyUsersData && nearbyUsersData.length > 0 && nearbyUsersData.map((nearByUser, index) => (
              <Marker
                key={index}
                zIndex={i++}
                coordinate = {{
                  latitude: nearByUser.meta_data && nearByUser.meta_data.live_location_lat,
                  longitude: nearByUser.meta_data && nearByUser.meta_data.live_location_long}}
                trackViewChanges={ false }
                onPress={(e) => {e.stopPropagation();
                         navigation.navigate('ProfilePage', {
                          userId: nearByUser.pk,
                        });
                       }}
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
                          userId: nearByUser.pk,
                        })
                      }
                      style={[styles.profileRowImageContainer]}>
                      <Image
                        style={[styles.profileRowImage]}
                        source={{
                          uri:
                            nearByUser.meta_data &&
                            nearByUser.meta_data.user_details &&
                            nearByUser.meta_data.user_details.profile_pic

                        }}
                      />
                    </TouchableOpacity>
                    <View style={styles.locationTextContainer}>
                    {(nearByUser.first_name ||
                        nearByUser.last_name) ? (
                        <Text style={styles.headerText}>
                          { ((`${nearByUser.first_name} ${
                              nearByUser.last_name
                            }`).length > 7) ? 
                          (((`${nearByUser.first_name} ${
                              nearByUser.last_name
                            }`).substring(0,7-3)) + '...') : 
                          `${nearByUser.first_name} ${
                              nearByUser.last_name
                            }` }
                        </Text>
                      ) : (
                        <Text style={styles.headerText}>
                          { ((nearByUser.username).length > 7) ? 
                          (((nearByUser.username).substring(0,7-3)) + '...') : 
                          nearByUser.username }
                        </Text>
                      )}
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
            ))}

            <Marker
              index={9999}
              zIndex={9999}
              trackViewChanges={ false }
              coordinate = {{
                latitude: (profile && profile.user && profile.user.meta_data && profile.user.meta_data.live_location_lat) ? profile.user.meta_data.live_location_lat : 0,
                longitude: (profile && profile.user && profile.user.meta_data && profile.user.meta_data.live_location_long) ? profile.user.meta_data.live_location_long : 0}}
            >
              <View>
                <Image source={require('../../assets/images/current-location.png')} 
                  style={{width: scaleModerate(70), height: scaleModerate(70)}} 
                />
              </View>
            </Marker>

          </MapView>
        </View>

        <View style={styles.searchButtonContainer}>
          <TouchableOpacity
            style={[styles.searchIconContainer]}
            onPress={() => this.searchLocation(this.state.searchTerm)}>
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

        {!!this.state.isLoading && 
          <View style={styles.loaderContainer}>
            <ActivityIndicator animating />
          </View>
        }
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
        {this.state.showFilters && 
          <View style={styles.distanceTextContainer}>
            <Text style={styles.genderText}>Distance (miles)</Text>
          </View>
        }
        {this.state.showFilters && 
          <><View style={styles.sliderContainer}>
            <Slider
              style={{width: '95%', height: scaleModerate(50)}}
              minimumValue={1}
              maximumValue={50}
              step={1}
              value={this.state.distance}
              thumbTintColor="#B88746"
              minimumTrackTintColor="#B88746"
              maximumTrackTintColor="#989BA5"
              onValueChange={ val  => this.searchLocationOnDistanceChange(val) }
            />
          </View>
          <View style={styles.textCon}>
              <Text style={styles.colorPerformit}>
                  {this.state.distance + ' miles'}
              </Text>
          </View>
          </>
        }
        <Modal
          isOpen={this.state.permissionNotGranted}
          onClosed={() => this.onClose()}
          style={[styles.modal]}
          position={'center'}
          backdropPressToClose={false}>
          <View style={styles.modalTextContainer}>
            <Text style={styles.modalText}>Location access is denied. Please go to Settings to change permission</Text>
          </View>
          <TouchableOpacity
            style={styles.okTextContainer}
            onPress={() => this.goToSettings()}>
            <Text style={styles.okText}>Go to Settings</Text>
          </TouchableOpacity>
        </Modal>

      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.Profile.profile,
  user: state.EmailAuth.user,
  accessToken: state.EmailAuth.accessToken,
  nearbyUsers: state.Posts.nearbyUsers,
  isNearbyUsersLoading: state.Posts.isNearbyUsersLoading,
  updateLocationLoading: state.Posts.updateLocationLoading,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    findNearbyUsers: (token, user_types, distance, term) => {
      dispatch(homeActions.findNearbyUsers(token, user_types, distance, term));
    },
    updateCurrentLocation: (token, location_lat, location_long) => {
      dispatch(homeActions.updateCurrentLocation(token, location_lat, location_long));
    },
    userDetails: (userId, token) => {
      dispatch(profileActions.userDetails(userId, token));
    },
  },
});

Location.navigationOptions = {
  header: null,
};

export default withNavigationFocus(connect(
  mapStateToProps,
  mapDispatchToProps,
)(Location));
