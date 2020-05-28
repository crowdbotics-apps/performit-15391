import React, {Component} from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  TextInput,
} from 'react-native';
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
            <Text style={styles.headerText}>MariaSm007</Text>
          </View>
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
              onChangeText={value =>
                console.log('-----------search value', value)
              }
            />
          </View>
        </View>

        <View style={styles.followHeaderContainer}>
          <TouchableOpacity style={styles.followersHeaderContainer}>
            <Text style={styles.activeHeaderText}>2359 Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followingHeaderContainer}>
            <Text style={styles.inActiveHeaderText}>134 Following</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image1.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>John Doe</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Singer, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followingButtonContainer}>
              <Text style={styles.followingButtonText}>Following</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image2.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Natasha Williams</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Artist, Rapper</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followingButtonContainer}>
              <Text style={styles.followingButtonText}>Following</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image3.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Dianna Haddad</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Singer, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followingButtonContainer}>
              <Text style={styles.followingButtonText}>Following</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image1.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>John Doe</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Musician</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image2.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Maria Smith</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Singer, Rapper</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image3.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Dianna Haddad</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image1.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>John Doe</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Singer, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image2.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Maria Smith</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Singer, Rapper</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image3.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Dianna Haddad</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Rapper</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image1.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>John Doe</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>Musician</Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image2.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Maria Smith</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Singer, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followProfileRowContainer}>
          <View style={styles.followProfileRowLeftContainer}>
            <View style={[styles.profileRowImage]}>
              <Image
                style={[styles.profileRowImage]}
                source={require('../../assets/images/follow_image3.png')}
              />
            </View>

            <View style={styles.followProfileRowTextContainer}>
              <View style={styles.followProfileRowNameContainer}>
                <Text style={styles.followProfileText}>Dianna Haddad</Text>
              </View>
              <View style={styles.followProfileRowRoleContainer}>
                <Text style={styles.followProfileSubText}>
                  Musician, Singer, Rapper
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.followProfileRowRightContainer}>
            <TouchableOpacity style={styles.followButtonContainer}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
