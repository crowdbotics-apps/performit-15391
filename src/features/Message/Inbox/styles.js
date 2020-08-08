import {Dimensions, StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../../utils/scale';
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

  searchButtonContainer: {
    width: scaleModerate(374),
    height: scaleModerate(46),
    borderRadius: scaleModerate(23),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#111111',
    marginTop: scaleVertical(20),
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

  followHeaderContainer: {
    flex: 0,
    width: '100%',
    height: scaleModerate(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(20),
    marginBottom: scaleModerate(20),
  },

  followersHeaderContainer: {
    flex: 1,
    height: scaleModerate(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeTab: {
    borderBottomWidth: scaleModerate(2),
    borderColor: '#b88746',
  },

  inactiveTab: {
    borderBottomWidth: scaleModerate(0.5),
    borderColor: '#979797',
  },

  followingHeaderContainer: {
    flex: 1,
    height: scaleModerate(46),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeHeaderText: {
    color: '#b88746',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito',
    fontWeight: '600',
  },

  inActiveHeaderText: {
    color: '#ffffff',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito',
    fontWeight: '600',
  },

  followProfileRowContainer: {
    width: '100%',
    height: scaleVertical(42),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: scaleModerate(30),
    marginBottom: scaleModerate(20),
  },

  followProfileRowLeftContainer: {
    width: '100%',
    height: scaleVertical(42),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  followProfileRowRightContainer: {
    flex: 1,
    height: scaleVertical(42),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  profileRowImageParentContainer: {
    width: '18%',
    height: scaleModerate(44),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileRowImageContainer: {
    width: scaleModerate(44),
    height: scaleModerate(44),
    borderRadius: scaleModerate(22),
    borderWidth: scaleModerate(1),
    borderColor: '#707070',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileRowImage: {
    width: scaleModerate(42),
    height: scaleModerate(42),
    borderRadius: scaleModerate(21),
    backgroundColor: '#111111',
  },

  followProfileRowTextContainer: {
    width: '57%',
    height: scaleModerate(42),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  followProfileRowNameContainer: {
    height: scaleModerate(22),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  followProfileRowRoleContainer: {
    height: scaleModerate(16),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  followProfileText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    lineHeight: undefined,
  },

  followProfileSubText: {
    width: '97%',
    color: '#ffffff',
    fontSize: scaleModerate(12),
    fontFamily: 'Nunito',
    fontWeight: 'normal',
  },

  followingButtonContainer: {
    width: scaleModerate(75),
    height: scaleModerate(24),
    borderRadius: scaleModerate(12),
    backgroundColor: '#111111',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  followingButtonText: {
    color: '#ffffff',
    fontSize: scaleModerate(12),
    fontFamily: 'Nunito',
    fontWeight: 'bold',
  },

  followButtonContainer: {
    width: scaleModerate(57),
    height: scaleModerate(24),
    borderRadius: scaleModerate(12),
    backgroundColor: '#b88746',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  followButtonText: {
    color: '#ffffff',
    fontSize: scaleModerate(12),
    fontFamily: 'Nunito',
    fontWeight: 'bold',
  },

  emptyMessageContainer: {
    height: scaleModerate(screenSize.height - 180),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyMessageIcon: {
    width: scaleModerate(292),
    height: scaleModerate(289),
  },

  userStatusRowTextContainer: {
    width: '20%',
    height: scaleModerate(42),
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  userStatusTopRowContainer: {
    width: '100%',
    height: scaleModerate(22),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  userStatusBottomRowContainer: {
    width: '100%',
    height: scaleModerate(16),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  yellowDot: {
    width: scaleModerate(10),
    height: scaleModerate(10),
    borderRadius: scaleModerate(5),
    backgroundColor: '#B88746',
  },

  greenDot: {
    position: 'absolute',
    width: scaleModerate(10),
    height: scaleModerate(10),
    borderRadius: scaleModerate(5),
    backgroundColor: '#51E270',
    right: scaleModerate(14),
    bottom: scaleModerate(5),
  },

  searchedUserProfileRowContainer: {
    flex: 0,
    width: scaleModerate(374),
    height: scaleVertical(42),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: scaleModerate(20),
  },

  searchedUserfollowProfileRowLeftContainer: {
    flex: 3,
    height: scaleVertical(42),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  searchedUserprofileRowImageContainer: {
    width: scaleModerate(44),
    height: scaleModerate(44),
    borderRadius: scaleModerate(22),
    borderWidth: scaleModerate(1),
    borderColor: '#b88746',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchedUserprofileRowImage: {
    width: scaleModerate(42),
    height: scaleModerate(42),
    borderRadius: scaleModerate(21),
    backgroundColor: '#111111',
  },

  searchedUserProfileRowTextContainer: {
    minWidth: scaleModerate(141),
    height: scaleModerate(42),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: scaleModerate(15),
  },

  searchedUserProfileRowNameContainer: {
    height: scaleModerate(22),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchedUserProfileText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    lineHeight: undefined,
  },

  paperClipContainer: {
    width: scaleModerate(16),
    height: scaleModerate(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleModerate(5),
  },

  paperClipImage: {
    width: scaleModerate(16),
    height: scaleModerate(15),
  },
});
