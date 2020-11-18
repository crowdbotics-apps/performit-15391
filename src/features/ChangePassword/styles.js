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
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 5,
    marginLeft: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    width: scaleModerate(30),
    height: scaleModerate(50),
    marginRight: scaleModerate(20),
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

  leftArrowContainer: {
    flex: 1,
    width: scaleModerate(30),
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  leftArrow: {
    flex: 1,
    width: scaleModerate(20),
    height: scaleModerate(14),
    marginLeft: scaleModerate(10),
  },

  inputContainer: {
    width: '95%',
    height: scaleVertical(46),
    borderRadius: scaleVertical(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    marginTop: scaleVertical(24),
    overflow: 'hidden',
  },

  inputEmailImage: {
    flex: 1,
    width: scaleVertical(20),
    height: scaleVertical(22),
    marginLeft: scaleVertical(10),
  },

  signUpInput: {
    flex: 8,
    backgroundColor: '#111111',
    color: '#989ba5',
    marginLeft: scaleVertical(17),
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    // width: '90%'
  },

  inputEyeImage: {
    flex: 1,
    width: scaleVertical(22),
    height: scaleVertical(18),
    marginRight: scaleVertical(10),
  },

  modal: {
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    width: scaleModerate(252),
    height: scaleModerate(140),
    borderRadius: scaleModerate(10),
  },

  modalTextContainer: {
    width: scaleModerate(200),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(40),
  },

  modalText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    fontWeight: '600',
    textAlign: 'center',
  },

  okTextContainer: {
    width: scaleModerate(252),
    height: scaleModerate(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(20),
    borderRadius: scaleModerate(10),
  },

  okText: {
    color: '#B88746',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    textAlign: 'center',
  },

  btnModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },

  btn: {
    backgroundColor: '#111111',
    color: '#ffffff',
  },
});
