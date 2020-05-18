import React from 'react';

import {ActivityIndicator, View} from 'react-native';

import {styles} from './style';

// Needs to be updated
// isAnimating prop is used to show/hide indicator
const ActivityIndicatorLoader = ({isAnimating, size = 'large'}) => (
  <View style={styles.container}>
    <ActivityIndicator
      animating={isAnimating}
      color={'#b88746'}
      style={styles.ActivityIndicator}
      size={size}
    />
  </View>
);

export default ActivityIndicatorLoader;
