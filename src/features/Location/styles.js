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
    marginLeft: scaleModerate(12),
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
    marginBottom: scaleVertical(25),
    overflow: 'hidden',
  },

  bioInputContainer: {
    width: '95%',
    height: scaleVertical(86),
    borderRadius: scaleVertical(23),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#111111',
    marginBottom: scaleVertical(24),
    overflow: 'hidden',
  },

  genderTitle: {
    width: '95%',
    marginLeft: scaleModerate(12),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  genderText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    fontWeight: '600',
  },

  genderBody: {
    width: '95%',
    marginTop: scaleModerate(12),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: scaleModerate(20),
  },

  genderSubBody: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  userTypeBody: {
    width: '95%',
    marginLeft: scaleModerate(12),
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: scaleModerate(20),
  },

  userTypeSubBody: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    minWidth: scaleModerate(130),
    marginBottom: scaleModerate(14),
  },

  radioButtonView: {
    width: scaleModerate(14),
    height: scaleModerate(14),
    borderRadius: scaleModerate(7),
    borderWidth: scaleModerate(1),
    borderColor: '#989ba5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleModerate(12),
  },

  radioButtonFilledColor: {
    borderColor: '#b88746',
  },

  radioButtonFilled: {
    width: scaleModerate(8),
    height: scaleModerate(8),
    borderRadius: scaleModerate(5),
    backgroundColor: '#b88746',
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

  bioInput: {
    flex: 0,
    height: scaleVertical(66),
    backgroundColor: '#111111',
    color: '#989ba5',
    marginLeft: scaleVertical(17),
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    marginTop: scaleModerate(10),
    width: '90%'
  },

  inputEyeImage: {
    flex: 1,
    width: scaleVertical(10),
    height: scaleVertical(5),
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

  imageContainer: {
    width: '100%',
    height: scaleModerate(220, 1),
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  profileImageContainer: {
    width: scaleModerate(122),
    height: scaleModerate(122),
    borderRadius: scaleModerate(61),
    borderWidth: scaleModerate(1),
    borderColor: '#b88746',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: scaleModerate(114),
    height: scaleModerate(114),
    borderRadius: scaleModerate(57),
    backgroundColor: '#111111',
  },

  tncContainer: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleVertical(24),
  },

  tncTextContainer: {
    height: scaleVertical(19),
    borderBottomWidth: scaleVertical(1),
    borderColor: '#b88746',
  },

  tncText: {
    color: '#b88746',
    fontSize: scaleVertical(14),
    fontFamily: 'Nunito-Regular',
  },

  socialConnectEditProfileContainer: {
    width: '100%',
    height: scaleModerate(52),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#111111',
    borderBottomWidth: scaleModerate(2),
  },

  socialConnectEditProfileLeftContainer: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  socialConnectEditProfileRightContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  singleSocialMediaContainer: {
    width: scaleModerate(10),
    height: scaleModerate(22),
    marginLeft: scaleModerate(20),
  },

  facebookIcon: {
    width: scaleModerate(12),
    height: scaleModerate(22),
  },

  socialMediaText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito',
    letterSpacing: scaleModerate(0.5),
    marginLeft: scaleModerate(40),
  },

  rightIconContainer: {
    width: scaleModerate(16),
    height: scaleModerate(16),
    marginRight: scaleModerate(20),
  },

  rightIcon: {
    width: scaleModerate(16),
    height: scaleModerate(16),
  },

  instagramIcon: {
    width: scaleModerate(22),
    height: scaleModerate(22),
  },

  youtubeIcon: {
    width: scaleModerate(28.5),
    height: scaleModerate(22),
  },

  searchButtonContainer: {
    position: 'absolute',
    width: scaleModerate(374),
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#111111',
    left: scaleVertical(20),
    top: scaleVertical(120),
  },

  searchIconContainer: {
    flex: 1,
    width: scaleModerate(22),
    height: scaleModerate(22),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  searchIcon: {
    flex: 1,
    width: scaleModerate(22),
    height: scaleModerate(22),
    marginLeft: scaleModerate(10),
  },

  searchInputContainer: {
    flex: 5,
    height: scaleModerate(46),
    marginRight: scaleModerate(10),
  },

  textInput: {
    height: scaleModerate(46),
    color: '#ffffff',
  },

  userTypeParentBodyContainer: {
    width: '100%',
    backgroundColor: '#111111',
  },

  mapContainer: {
   ...StyleSheet.absoluteFillObject,
   height: screenSize.height - scaleModerate(80, 1),
   width: '100%',
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginTop: scaleModerate(80),
   backgroundColor: '#111111'
 },
 map: {
   ...StyleSheet.absoluteFillObject,
 },

 locationTextContainer: {
    width: scaleModerate(81),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
 },
 profileRowImageContainer: {
    width: scaleModerate(50),
    height: scaleModerate(50),
    borderRadius: scaleModerate(25),
    borderWidth: scaleModerate(1),
    borderColor: '#989BA5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleModerate(10)
  },

  profileRowImage: {
    width: scaleModerate(48),
    height: scaleModerate(48),
    borderRadius: scaleModerate(24),
    backgroundColor: '#111111',
  },

  loaderContainer: {
    position: 'absolute',
    width: scaleModerate(20),
    height: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
  },
});
