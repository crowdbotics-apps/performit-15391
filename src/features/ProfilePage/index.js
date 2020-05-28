import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Text, Button} from 'react-native-ui-kitten';
import {styles} from './styles';

export default class App extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    // write code here
  }

  render() {
    const {navigation} = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>MariaSm007</Text>
          </View>
          <TouchableOpacity
            style={[styles.inputDrawerContainer]}
            onPress={() => navigation.goBack()}>
            <View style={[styles.inputDrawer]}>
              <Image
                style={[styles.inputDrawer]}
                source={require('../../assets/images/drawer_icon.png')}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfoContainer}>
          <View style={styles.profileLeftInfoContainer}>
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileText}>Maria Smith</Text>
            </View>
            <View style={styles.profileSubTextContainer}>
              <Text style={styles.profileSubText}>
                Musician, Singer, Rapper
              </Text>
            </View>
            <View style={styles.profileStatsContainer}>
              <View style={styles.profileSingleStatContainer}>
                <Text style={styles.profileSingleStatFirstText}>12</Text>
                <Text style={styles.profileSingleStatSecondText}>Posts</Text>
              </View>
              <View style={styles.profileSingleStatContainer}>
                <Text style={styles.profileSingleStatFirstText}>+2k</Text>
                <Text style={styles.profileSingleStatSecondText}>
                  Followers
                </Text>
              </View>
              <View style={styles.profileSingleStatContainer}>
                <Text style={styles.profileSingleStatFirstText}>143</Text>
                <Text style={styles.profileSingleStatSecondText}>
                  Following
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.profileRightInfoContainer}>
            <View style={[styles.profileImage]}>
              <Image
                style={[styles.profileImage]}
                source={require('../../assets/images/profile_image.png')}
              />
            </View>
          </View>
        </View>

        <View style={styles.profileDescContainer}>
          <Text style={styles.descText}>
            It is a long fact that a reader will be distracted by the readable
            content of a page when
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButtonContainer}
          onPress={() => {
            console.log('-------------edit profile');
          }}>
          <Text style={styles.editProfileButtonText}>EDIT PROFILE</Text>
        </TouchableOpacity>

        <View style={styles.socialMediaContainer}>
          <TouchableOpacity style={styles.singleSocialMediaContainer}>
            <Image
              style={[styles.facebookIcon]}
              source={require('../../assets/images/facebook.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.singleSocialMediaContainer}>
            <Image
              style={[styles.instagramIcon]}
              source={require('../../assets/images/instagram.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.singleSocialMediaContainer}>
            <Image
              style={[styles.youtubeIcon]}
              source={require('../../assets/images/youtube.png')}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileImagesContainer}>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image1.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image2.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image3.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image4.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image5.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image6.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image7.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image8.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileSingleImageConatiner}>
            <Image
              style={[styles.profileSingleImage]}
              source={require('../../assets/images/ex_image9.png')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}
