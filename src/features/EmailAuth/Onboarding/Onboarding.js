import React, {Component} from 'react';
import {Text, View, ImageBackground, TouchableOpacity} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import styles from './styles';

const slides = [
  {
    key: 1,
    title: 'Share Your Talents',
    text: (
      <Text>
          Show off your talents and share! Join{' '}
          <Text style={{fontWeight: 'bold', color: '#B88746'}}>PERFORMIT</Text>{' '}
          and share your talents through videos and audio files with your own network.
      </Text>
    ),
    backgroundColor: '#000000',
    image: require('./assets/intro.png'),
  },
  {
    key: 2,
    title: 'Voting',
    text:
      'Vote and review content posted by other users. \n',
    backgroundColor: '#000000',
    image: require('./assets/intro-2.png'),
  },
  {
    key: 3,
    title: 'Find Nearby Talents',
    text:
      'Increase your network and build communities by finding nearby users to collaborate with.',
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
