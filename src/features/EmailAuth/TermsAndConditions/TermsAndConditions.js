import React, {Component} from 'react';
import {
  Image,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  SafeAreaView,
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
        <SafeAreaView style={styles.headerContainer}>
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
        </SafeAreaView>
        <View style={styles.bodyContainer}>
          <Text style={styles.bodyText}>
            These terms and conditions ("Agreement") sets forth the general terms and conditions of your use of the "PERFORMIT" mobile application ("Mobile Application" or "Service") and any of its related products and services (collectively, "Services"). This Agreement is legally binding between you ("User", "you" or "your") and this Mobile Application developer ("Operator", "we", "us" or "our"). By accessing and using the Mobile Application and Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Agreement. If you are entering into this Agreement on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to this Agreement, in which case the terms "User", "you" or "your" shall refer to such entity. If you do not have such authority, or if you do not agree with the terms of this Agreement, you must not accept this Agreement and may not access and use the Mobile Application and Services. You acknowledge that this Agreement is a contract between you and the Operator, even though it is electronic and is not physically signed by you, and it governs your use of the Mobile Application and Services.
          </Text>
        </View>
      </ScrollView>
    );
  }
}

TermsAndConditions.navigationOptions = {
  header: null,
};

export default TermsAndConditions;
