import {StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../../utils/scale';

export const styles = StyleSheet.create({
  screen: {
    flex: 0,
    minHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
  },

  headerText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
  },

  bodyTitleText: {
    color: '#ffffff',
    fontFamily: 'Nunito-Bold',
    fontSize: scaleModerate(16),
    lineHeight: scaleModerate(25),
    marginBottom: scaleModerate(10),
  },

  bodyText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
    textAlign: 'justify',
    marginBottom: scaleModerate(20),
  },

  inputLeftArrow: {
    flex: 1,
    width: scaleModerate(20),
    height: scaleModerate(20),
    marginLeft: scaleModerate(10),
  },

  bodyContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: scaleModerate(20),
  },

  bulletTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: scaleModerate(26),
  },

  bullet: {
    width: scaleModerate(5),
    height: scaleModerate(5),
    borderRadius: scaleModerate(2.5),
    backgroundColor: '#b88746',
    marginRight: scaleModerate(4),
    marginTop: scaleModerate(9),
  },

  bulletBodyText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
    textAlign: 'justify',
  },

  bodyTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});
