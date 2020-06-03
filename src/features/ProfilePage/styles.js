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

  profileInfoContainer: {
    width: scaleModerate(374),
    minHeight: scaleModerate(100),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: scaleModerate(30),
  },

  profileLeftInfoContainer: {
    width: scaleModerate(270),
    minHeight: scaleModerate(145),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  profileTextContainer: {
    height: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileSubTextContainer: {
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  profileText: {
    color: '#ffffff',
    fontSize: scaleModerate(26),
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    lineHeight: undefined,
  },

  profileSubText: {
    color: '#989BA5',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito',
    fontWeight: 'normal',
  },

  profileStatsContainer: {
    height: scaleModerate(46),
    width: scaleModerate(270),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  profileSingleStatContainer: {
    height: scaleModerate(52),
    minWidth: scaleModerate(62),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginRight: scaleModerate(30),
  },

  profileSingleStatFirstText: {
    color: '#ffffff',
    fontSize: scaleModerate(20),
    fontFamily: 'Nunito',
    lineHeight: undefined,
  },

  profileSingleStatSecondText: {
    color: '#989BA5',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito',
  },

  profileRightInfoContainer: {
    width: scaleModerate(104),
    minHeight: scaleModerate(145),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },

  profileImageContainer: {
    width: scaleModerate(100),
    height: scaleModerate(100),
    borderRadius: scaleModerate(50),
    borderWidth: scaleModerate(1),
    borderColor: '#b88746',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: scaleModerate(86),
    height: scaleModerate(86),
    borderRadius: scaleModerate(43),
    backgroundColor: '#111111',
  },

  profileDescContainer: {
    width: scaleModerate(374),
    minHeight: scaleModerate(50),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  descText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito',
    lineHeight: 24,
  },

  editProfileButtonContainer: {
    width: '95%',
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
    marginTop: scaleVertical(20),
  },

  editProfileButtonText: {
    color: '#ffffff',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Bold',
    fontWeight: '600',
  },

  otherProfileButtonContainer: {
    width: '95%',
    height: scaleModerate(46),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: scaleVertical(20),
  },

  followProfileButtonContainer: {
    width: '45%',
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b88746',
  },

  messageProfileButtonContainer: {
    width: '45%',
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  followProfileButtonText: {
    color: '#ffffff',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Bold',
    fontWeight: '600',
  },

  socialMediaContainer: {
    height: scaleModerate(22),
    width: scaleModerate(193),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: scaleModerate(25),
  },

  singleSocialMediaContainer: {
    width: scaleModerate(10),
    height: scaleModerate(22),
  },

  facebookIcon: {
    width: scaleModerate(12),
    height: scaleModerate(22),
  },

  instagramIcon: {
    width: scaleModerate(22),
    height: scaleModerate(22),
  },

  youtubeIcon: {
    width: scaleModerate(29),
    height: scaleModerate(22),
  },

  profileImagesContainer: {
    width: screenSize.width,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },

  noProfilePostsContainer: {
    width: screenSize.width,
    minHeight: scaleModerate(370),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
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
});
