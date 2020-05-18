import React from 'react';
import {View} from 'react-native';

import ActivityIndicatorLoader from './index';

const ActivityIndicatorLoaderPage = ({isAnimating, size}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <ActivityIndicatorLoader isAnimating={isAnimating} size={size} />
  </View>
);

export default ActivityIndicatorLoaderPage;
