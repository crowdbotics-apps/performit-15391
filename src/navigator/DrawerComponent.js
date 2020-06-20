import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  ImageBackground,
  Text,
} from 'react-native';
import {styles} from '../features/ProfilePage/styles';
import {withNavigation} from 'react-navigation';
import {scaleModerate} from '../utils/scale';
import IconFA5 from 'react-native-vector-icons/FontAwesome5';

class DrawerComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {navigation, user} = this.props;

    return (
      <ScrollView
        contentContainerStyle={{
          flex: 0,
          height: '90%',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          backgroundColor: 'black',
        }}
        style={{backgroundColor: 'black'}}>
        <View
          style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
            <SafeAreaView
              style={{
                width: '100%',
                minHeight: scaleModerate(60),
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: scaleModerate(20),
                borderBottomWidth: scaleModerate(2),
                borderColor: '#111111',
              }}>
              <Text style={styles.drawerText}>{user && user.username}</Text>
            </SafeAreaView>
            <TouchableOpacity
              onPress={() => navigation.navigate('TermsAndConditionsPage')}
              style={{
                width: '100%',
                minHeight: scaleModerate(60),
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View style={[styles.tNcIcon]}>
                <IconFA5 name="file-alt" size={25} color={'#ffffff'} />
              </View>
              <View style={{flex: 5}}>
                <Text style={styles.footerText}>Terms & Conditions</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePasswordPage')}
              style={{
                width: '100%',
                minHeight: scaleModerate(60),
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <View style={[styles.tNcIcon]}>
                <Image
                  source={require('../assets/images/small_lock.png')}
                  resizeMode="contain"
                  style={{width: 20, height: 22, tintColor: '#ffffff'}}
                />
              </View>
              <View style={{flex: 5}}>
                <Text style={styles.footerText}>Change Password</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
              navigation.navigate('SignIn');
            }}
            style={{
              width: '100%',
              minHeight: scaleModerate(60),
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <View style={[styles.logoutIcon]}>
              <Image
                style={[styles.logoutIcon]}
                source={require('../assets/images/logout_icon.png')}
              />
            </View>
            <View style={{flex: 4}}>
              <Text style={styles.footerText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  user: state.EmailAuth.user,
  profile: state.Profile.profile,
});

const mapDispatchToProps = dispatch => ({});

DrawerComponent.navigationOptions = {
  header: null,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(DrawerComponent));
