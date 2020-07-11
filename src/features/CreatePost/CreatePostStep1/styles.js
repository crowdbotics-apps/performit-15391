import {Dimensions, StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../../utils/scale';
const screenSize = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 0,
    height: screenSize.height,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  headerContainer: {
    backgroundColor: 'black',
    width: '100%',
    height: scaleModerate(80, 1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  headerTextContainer: {
    flex: 7,
    marginLeft: scaleModerate(10),
    marginRight: scaleModerate(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    fontWeight: '600',
  },

  headerNextText: {
    color: '#B88746',
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

  bodyContainer: {
    width: '100%',
    height: screenSize.height - scaleModerate(80, 1),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  upperBodyContainer: {
    width: '100%',
    height: '52%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  videoControlsContainer: {
    position: 'absolute',
    width: '90%',
    height: scaleModerate(70, 1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 0,
    left: scaleModerate(20),
    zIndex: 99999,
  },

  videoBarContainer: {
    width: '100%',
    height: scaleModerate(2, 1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  filledVideoBarContainer: {
    height: scaleModerate(2, 1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#B88746',
  },

  flipCameraContainer: {
    width: scaleModerate(24),
    height: scaleModerate(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCamera: {
    width: scaleModerate(24),
    height: scaleModerate(20),
  },

  flashCameraContainer: {
    width: scaleModerate(24),
    height: scaleModerate(24),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flashCamera: {
    width: scaleModerate(15),
    height: scaleModerate(24),
  },

  lowerBodyContainer: {
    width: '100%',
    height: '48%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  redDot: {
    width: scaleModerate(10),
    height: scaleModerate(10),
    borderRadius: scaleModerate(5),
    backgroundColor: 'red',
  },

  timeContainer: {
    width: scaleModerate(90),
    height: scaleModerate(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  recordButtonParentContainer: {
    width: '100%',
    height: '55%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  recordButtonContainer: {
    width: scaleModerate(90),
    height: scaleModerate(90),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  recordButton: {
    width: scaleModerate(90),
    height: scaleModerate(90),
  },

  libraryButtonParentContainer: {
    width: '90%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  libraryButtonContainer: {
    width: scaleModerate(75),
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  libraryButton: {
    width: scaleModerate(75),
    height: '100%',
  },

  bottomTabContainer: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  bottomLeftContainer: {
    width: '50%',
    height: scaleModerate(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomRightContainer: {
    width: '50%',
    height: scaleModerate(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomTabText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
  },

  timeText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
    marginLeft: scaleModerate(8),
  },

  bottomDeleteParentContainer: {
    width: '100%',
    height: '45%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomDeleteContainer: {
    width: scaleModerate(60),
    height: scaleModerate(25),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  leftArrowButton: {
    width: scaleModerate(7),
    height: scaleModerate(10),
  },

  deleteText: {
    color: 'red',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
    marginLeft: scaleModerate(8),
  },

  modal: {
    backgroundColor: '#111111',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scaleModerate(252),
    height: scaleModerate(140),
    borderRadius: scaleModerate(10),
  },

  modalTextContainer: {
    width: scaleModerate(200),
    height: scaleModerate(100),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-SemiBold',
    letterSpacing: scaleModerate(0.5),
    fontWeight: '600',
    textAlign: 'center',
  },

  modalActionContainer: {
    width: scaleModerate(252),
    height: scaleModerate(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: scaleModerate(10),
    borderBottomLeftRadius: scaleModerate(10),
    borderColor: '#979797',
    borderTopWidth: scaleModerate(1),
  },

  discardTextContainer: {
    width: '50%',
    height: scaleModerate(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  keepTextContainer: {
    width: '50%',
    height: scaleModerate(40),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  discardText: {
    color: 'red',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
  },

  keepText: {
    color: '#B88746',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
  },

  upperAudioContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B88746',
  },

  audioMike: {
    width: scaleModerate(240),
    height: scaleModerate(240),
  },

  recordingAudioMike: {
    width: scaleModerate(300),
    height: scaleModerate(300),
  },

  RNCamera: {
    width: '100%',
    height: '100%',
  },
});
