import {Dimensions, StyleSheet} from 'react-native';

import {scaleVertical, scaleModerate, scale} from '../../../utils/scale';
const screenSize = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 0,
    minHeight: '90%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'black',
    marginTop: scaleModerate(20),
  },

  headerContainer: {
    backgroundColor: '#111111',
    width: '100%',
    height: scaleModerate(100, 1),
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
    width: '65%',
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
    height: scaleModerate(screenSize.height - 80),
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
    width: '12%',
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

  userMessageBody: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleModerate(5),
  },

  user1MessageParentContainer: {
    width: '100%',
    height: scaleModerate(47),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  user1MessageContainer: {
    maxWidth: '90%',
    height: scaleModerate(47),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderBottomRightRadius: scaleModerate(10),
    borderBottomLeftRadius: scaleModerate(10),
    borderTopRightRadius: scaleModerate(10),
  },

  user2MessageParentContainer: {
    width: '100%',
    height: scaleModerate(47),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  user2MessageContainer: {
    maxWidth: '90%',
    height: scaleModerate(47),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#B88746',
    borderBottomRightRadius: scaleModerate(10),
    borderBottomLeftRadius: scaleModerate(10),
    borderTopLeftRadius: scaleModerate(10),
  },

  messageText: {
    color: '#ffffff',
    fontSize: scaleModerate(13),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
    paddingLeft: scaleModerate(20),
    paddingRight: scaleModerate(20),
  },

  dateText: {
    color: '#707070',
    fontSize: scaleModerate(13),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
  },

  messageUser1ImageContainer: {
    position: 'absolute',
    width: scaleModerate(24),
    height: scaleModerate(24),
    borderRadius: scaleModerate(12),
    borderWidth: scaleModerate(1),
    borderColor: '#707070',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: scaleModerate(10),
    top: scaleModerate(-16),
    zIndex: 99999,
  },

  messageUser2ImageContainer: {
    position: 'absolute',
    width: scaleModerate(24),
    height: scaleModerate(24),
    borderRadius: scaleModerate(12),
    borderWidth: scaleModerate(1),
    borderColor: '#B88746',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    right: scaleModerate(10),
    top: scaleModerate(-16),
    zIndex: 99999,
  },

  messageImage: {
    width: scaleModerate(22),
    height: scaleModerate(22),
    borderRadius: scaleModerate(11),
    backgroundColor: '#111111',
  },

  enterMessageContainer: {
    width: '90%',
    height: '8%',
    minHeight: scaleModerate(90),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'absolute',
    bottom: scaleModerate(-10),
    marginBottom: scaleModerate(15),
    marginLeft: scaleModerate(16),
  },

  commentInputContainer: {
    width: '84%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: scaleVertical(45),
    backgroundColor: '#111111',
    borderRadius: scaleModerate(22),
  },

  commentInput: {
    width: '80%',
    height: scaleVertical(30),
    color: '#989ba5',
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    marginLeft: scaleModerate(18),
  },

  sendMessageContainer: {
    width: scaleModerate(44),
    height: scaleModerate(44),
    borderRadius: scaleModerate(22),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sendMessageImage: {
    width: scaleModerate(44),
    height: scaleModerate(44),
    borderRadius: scaleModerate(22),
  },

  paperClipContainer: {
    width: scaleModerate(19),
    height: scaleModerate(18),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleModerate(10),
  },

  paperClip: {
    width: scaleModerate(19),
    height: scaleModerate(18),
  },

  userDateBody: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scaleModerate(10),
    marginTop: scaleModerate(10),
  },

  user1FileMessageParentContainer: {
    width: '100%',
    height: scaleModerate(240),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: scaleModerate(20),
  },

  user2FileMessageParentContainer: {
    width: '100%',
    height: scaleModerate(240),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: scaleModerate(20),
  },
});
