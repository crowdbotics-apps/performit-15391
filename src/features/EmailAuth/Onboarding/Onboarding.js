import React, {Component} from 'react';
import {Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import styles from './styles';

const slides = [
  {
    key: 1,
    title: 'Capture Your Talent',
    text: (
      <Text>
        Make your talents shine! Join{' '}
        <Text style={{fontWeight: 'bold', color: '#B88746'}}>Performit</Text>{' '}
        and create your friends network to share your talent using videos and
        audios.
      </Text>
    ),
    backgroundColor: '#000000',
    image: require('./assets/intro.png'),
  },
  {
    key: 2,
    title: 'Vote Posts',
    text:
      'Vote friends posts and also get voted for your post in order to know how much you are really talented!',
    backgroundColor: '#000000',
    image: require('./assets/intro-2.png'),
  },
  {
    key: 3,
    title: 'Find Nearby Talent',
    text:
      'Increase your friends network by finding nearbry freind who already showing thier talent on Performit',
    image: require('./assets/intro-3.png'),
    backgroundColor: '#000000',
  },
];

export default class Onboarding extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    slide: 0,
  };

  renderItem = ({item, index}) => {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={item.image}
          style={styles['introImage' + (index + 1)]}
          resizeMode="cover"
        />
        <View style={styles.body}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  renderEmpty = () => {
    return <></>;
  };

  render() {
    return (
      <>
        <AppIntroSlider
          slides={slides}
          onSlideChange={i => {
            this.setState({slide: i});
          }}
          renderItem={this.renderItem}
          renderNextButton={this.renderEmpty}
          renderDoneButton={this.renderEmpty}
          dotStyle={{width: 0, height: 0}}
          activeDotStyle={{width: 0, height: 0}}
          renderPagination={this.renderEmpty}
        />
        <View pointerEvents="box-none" style={styles.absolute}>
          <View pointerEvents="auto" style={styles.buttonContainer}>
            <View style={styles.circleBG} />
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SignUp');
              }}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  {this.state.slide === 2 ? 'JOIN' : 'SKIP'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.paginationContainer}>
            <View
              style={[
                styles.pagination,
                this.state.slide === 0 && styles.paginationActive,
              ]}
            />
            <View
              style={[
                styles.pagination,
                this.state.slide === 1 && styles.paginationActive,
              ]}
            />
            <View
              style={[
                styles.pagination,
                this.state.slide === 2 && styles.paginationActive,
              ]}
            />
          </View>
        </View>
      </>
    );
  }
}
