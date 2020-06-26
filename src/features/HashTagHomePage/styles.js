import {Dimensions, StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../utils/scale';
const screenSize = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 0,
    minHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  headerContainer: {
    backgroundColor: '#111111',
    width: '100%',
    height: scaleModerate(80, 1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 7,
    marginLeft: scaleModerate(10),
  },

  headerText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    fontWeight: '600',
  },

  inputDrawerContainer: {
    flex: 1,
    width: scaleModerate(20),
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  inputDrawer: {
    flex: 1,
    width: scaleModerate(20),
    height: scaleModerate(14),
    marginLeft: scaleModerate(10),
  },

  profileImagesContainer: {
    width: screenSize.width,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: scaleModerate(20),
  },

  profileSingleImage: {
    width: scaleModerate(137),
    height: scaleModerate(137),
  },

  profileSingleImageConatiner: {
    width: scaleModerate(137),
    height: scaleModerate(137),
    borderWidth: scaleModerate(1),
    borderColor: 'black',
  },
});
