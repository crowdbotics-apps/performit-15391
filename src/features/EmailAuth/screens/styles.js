import {StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../../utils/scale';

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
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
    marginBottom: scaleModerate(24),
  },

  signUpButtonContainer: {
    width: '95%',
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
    marginBottom: scaleModerate(24),
    marginTop: scaleModerate(3),
  },

  signUpButtonText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Bold',
  },

  tncContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleModerate(24),
  },

  tncText1: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
  },

  tncText2Container: {
    height: scaleModerate(17),
    borderBottomWidth: scaleModerate(1),
    borderColor: '#b88746',
  },

  tncText2: {
    color: '#b88746',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
  },

  inputEmailImage: {
    flex: 1,
    width: scaleModerate(20),
    height: scaleModerate(22),
    marginLeft: scaleModerate(10),
  },

  inputEyeImage: {
    flex: 1,
    width: scaleModerate(22),
    height: scaleModerate(18),
    marginRight: scaleModerate(10),
  },

  inputUserNameImage: {
    flex: 1,
    width: scaleModerate(22),
    height: scaleModerate(22),
    marginLeft: scaleModerate(10),
  },

  signUpInput: {
    flex: 9,
    backgroundColor: '#111111',
    color: '#989ba5',
    marginLeft: scaleModerate(17),
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
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
    resizeMode: 'cover',
    marginBottom: scale(10),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  titleTextContainer: {
    paddingTop: scaleModerate(20),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  titleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: scaleModerate(34),
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
});
