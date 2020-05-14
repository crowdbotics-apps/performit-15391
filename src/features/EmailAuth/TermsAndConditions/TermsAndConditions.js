import React, {Component} from 'react';
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import {styles} from './styles';
import {scaleModerate} from '../../../utils/scale';

class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {navigation} = this.props;
    return (
      <ScrollView
        contentContainerStyle={styles.screen}
        style={{backgroundColor: 'black'}}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.inputLeftArrowContainer]}
            onPress={() => navigation.goBack()}>
            <View style={[styles.inputLeftArrow]}>
              <Image
                style={[styles.inputLeftArrow]}
                source={require('../../../assets/images/left-arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Terms & Conditions</Text>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyTitleText}>Title goes here</Text>
          <Text style={styles.bodyText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>

          <Text style={styles.bodyTitleText}>Title goes here</Text>
          <Text style={styles.bodyText}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Text>

          <Text style={styles.bodyTitleText}>
            Title goes here for some list points
          </Text>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                Lorem Ipsum is simply dummy.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                industry's standard dummy text ever since the 1500s.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                Type and scrambled it to make a type specimen.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                There are many variations of passages.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                Lorem Ipsum is simply dummy.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                industry's standard dummy text ever since the 1500s.
              </Text>
            </View>
          </View>

          <View style={styles.bulletTextContainer}>
            <View style={styles.bullet} />
            <View style={styles.bodyTextContainer}>
              <Text style={styles.bulletBodyText}>
                Type and scrambled it to make a type specimen.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

TermsAndConditions.navigationOptions = {
  header: null,
};

export default TermsAndConditions;
