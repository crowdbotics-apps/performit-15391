import React, {Component} from 'react';
import {Text, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';


const slides = [
  {
    key: 1,
    title: 'Title 1',
    text: 'Description.\nSay something cool',
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Title 2',
    text: 'Other cool stuff',
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Rocket guy',
    text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
    // image: require('./assets/3.jpg'),
    backgroundColor: '#22bcb5',
  }
];



export default class Onboarding extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <AppIntroSlider  slides={slides}/>
    );
  }
}
