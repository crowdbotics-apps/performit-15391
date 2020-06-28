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
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 99999,
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

  enterCommentContainer: {
    width: '95%',
    height: '8%',
    borderRadius: scaleVertical(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: scaleModerate(10),
    marginBottom: scaleModerate(15),
    backgroundColor: '#111111',
  },

  commentInput: {
    flex: 8,
    height: scaleVertical(70),
    color: '#989ba5',
    marginLeft: scaleVertical(7),
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    marginTop: scaleModerate(10),
    // width: '90%'
  },

  postButton: {
    flex: 1,
    width: scaleVertical(30),
    height: scaleVertical(22),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B88746',
    borderRadius: scaleModerate(10),
    marginRight: scaleVertical(10),
  },
});
