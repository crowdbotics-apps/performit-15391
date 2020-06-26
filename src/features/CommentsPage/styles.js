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

  postParentContainer: {
    width: '100%',
    marginTop: scaleModerate(20),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  postProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginLeft: scaleModerate(30),
  },

  postProfileImage: {
    width: scaleModerate(26),
    height: scaleModerate(26),
    borderRadius: scaleModerate(12),
    backgroundColor: '#111111',
  },

  postProfileTextContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: scaleModerate(10),
  },

  postProfileText: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
  },
});
