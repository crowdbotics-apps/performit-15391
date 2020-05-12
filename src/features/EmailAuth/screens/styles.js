import {StyleSheet} from 'react-native';

import {scaleVertical, scale, scaleModerate} from '../../../utils/scale';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },

  signUpScreen: {
    flex: 0,
    minHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  inputContainer: {
    width: '95%',
    height: scaleVertical(46),
    borderRadius: scaleVertical(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    marginBottom: scaleVertical(24),
    overflow: 'hidden',
  },

  signUpButtonContainer: {
    width: '95%',
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
    marginBottom: scaleVertical(24),
    marginTop: scaleVertical(3),
  },

  signUpButtonText: {
    color: '#ffffff',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Bold',
  },

  tncContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleVertical(24),
  },

  tncText1: {
    color: '#ffffff',
    fontSize: scaleVertical(14),
    fontFamily: 'Nunito-Regular',
  },

  tncText2Container: {
    height: scaleVertical(19),
    borderBottomWidth: scaleVertical(1),
    borderColor: '#b88746',
  },

  tncText2: {
    color: '#b88746',
    fontSize: scaleVertical(14),
    fontFamily: 'Nunito-Regular',
  },

  inputEmailImage: {
    flex: 1,
    width: scaleVertical(20),
    height: scaleVertical(22),
    marginLeft: scaleVertical(10),
  },

  inputEyeImage: {
    flex: 1,
    width: scaleVertical(22),
    height: scaleVertical(18),
    marginRight: scaleVertical(10),
  },

  inputUserNameImage: {
    flex: 1,
    width: scaleVertical(22),
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

  input: {
    backgroundColor: 'white',
    marginLeft: scale(10),
    marginRight: scale(10),
    marginTop: scaleVertical(5),
    marginBottom: scaleVertical(5),
    borderRadius: 12,
    borderColor: '#E5E5E5',
  },

  actionButon: {
    backgroundColor: '#ED6854',
    borderWidth: 0,
    marginLeft: scale(10),
    marginRight: scale(10),
    paddingTop: scaleVertical(15),
    paddingBottom: scaleVertical(15),
    marginTop: scaleVertical(10),
    marginBottom: scaleVertical(10),
    borderRadius: 12,
  },

  imageContainer: {
    backgroundColor: 'black',
    height: scaleModerate(290, 1),
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: scaleVertical(15),
  },

  imageBackground: {
    marginBottom: scale(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  titleTextContainer: {
    paddingTop: scaleVertical(20),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: scaleVertical(34),
    fontFamily: 'Nunito-Bold',
  },

  image: {
    resizeMode: 'cover',
  },

  textRow: {
    textAlign: 'center',
    color: 'black',
  },

  boldText: {
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: scaleVertical(24),
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 14,
    marginTop: 27.5,
    alignSelf: 'center',
    borderColor: '#ED6854',
    borderWidth: 2,
    padding: 15,
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#989ba5',
    borderWidth: 0,
  },

  forgetPasswordDescContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleVertical(24),
  },

  forgetPasswordDescText: {
    color: '#ffffff',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },

  forgetPassTitleTextContainer: {
    paddingTop: scaleVertical(50),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  underlineStyleBase: {
    width: scaleModerate(56),
    height: scaleModerate(56),
    borderRadius: scaleModerate(28),
    color: '#ffffff',
    fontSize: scaleVertical(32),
    fontFamily: 'Audiowide-Regular',
    marginTop: scaleVertical(6),
  },

  underlineStyleHighLighted: {
    borderColor: '#c08637',
  },
});
