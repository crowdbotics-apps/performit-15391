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
    height: scaleModerate(90, 1),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleModerate(20),
  },

  headerLeftContainer: {
    flex: 1,
    marginLeft: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  headerRightContainer: {
    flex: 1,
    marginLeft: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
    width: scaleModerate(30),
    height: scaleModerate(50),
    marginRight: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  inputDrawer: {
    width: scaleModerate(20),
    height: scaleModerate(14),
    marginLeft: scaleModerate(10),
  },

  searchIconContainer: {
    width: scaleModerate(30),
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  searchIcon: {
    width: scaleModerate(22),
    height: scaleModerate(22),
  },

  performItLogoContainer: {
    width: scaleModerate(30),
    height: scaleModerate(50),
    marginRight: scaleModerate(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  performItLogo: {
    width: scaleModerate(40),
    height: scaleModerate(40),
  },

  messageIconContainer: {
    width: scaleModerate(30),
    height: scaleModerate(50),
    marginRight: scaleModerate(10),
    marginLeft: scaleModerate(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  messageIcon: {
    width: scaleModerate(22),
    height: scaleModerate(20),
  },

  followersView: {
    minWidth: '100%',
    height: scaleModerate(71),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scaleModerate(30),
    marginTop: scaleModerate(20),
  },

  followersContainer: {
    flex: 0,
    minWidth: '100%',
    height: scaleModerate(71),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  followerProfileContainer: {
    width: scaleModerate(60),
    height: scaleModerate(71),
    marginRight: scaleModerate(30),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  profileImageContainer: {
    width: scaleModerate(50),
    height: scaleModerate(50),
    borderRadius: scaleModerate(30),
    borderWidth: scaleModerate(2),
    borderColor: '#707070',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileImage: {
    width: scaleModerate(44),
    height: scaleModerate(44),
    borderRadius: scaleModerate(22),
    backgroundColor: '#111111',
  },

  profileTextContainer: {
    height: scaleModerate(20),
    width: scaleModerate(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    color: '#ffffff',
    fontSize: scaleModerate(16),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
  },

  homeHeaderTabs: {
    width: '100%',
    height: scaleModerate(30),
    marginTop: scaleModerate(30),
    marginBottom: scaleModerate(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeHeaderText: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    lineHeight: undefined,
    letterSpacing: scaleModerate(0.5),
  },

  homeHeaderLine: {
    color: '#B88746',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
    paddingLeft: scaleModerate(10),
    paddingRight: scaleModerate(10),
  },

  headerTabButton: {
    width: scaleModerate(92),
    height: scaleModerate(29),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#B88746',
    borderRadius: scaleModerate(20),
  },

  postParentContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  postProfileContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: scaleModerate(30),
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
    height: scaleModerate(26),
    width: scaleModerate(400),
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

  postImageContainer: {
    marginTop: scaleModerate(10),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: scaleModerate(350),
    width: '100%',
  },

  postImage: {
    width: '100%',
    height: scaleModerate(350),
    backgroundColor: '#111111',
  },

  postStatsParentContainer: {
    width: '100%',
    height: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  postStatsContainer: {
    width: '92%',
    height: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  postStatsLeftContainer: {
    flex: 7,
    height: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  postStatsRightContainer: {
    flex: 3,
    height: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  postStatsRightText: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
  },

  starImage: {
    width: scaleModerate(20),
    height: scaleModerate(20),
    marginRight: scaleModerate(5),
  },

  postStatsLeftTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: scaleModerate(10),
  },

  postStatsLeftText: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Regular',
    lineHeight: undefined,
  },

  commentShareParentContainer: {
    width: '100%',
    height: scaleModerate(25),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  commentShareContainer: {
    width: '92%',
    height: scaleModerate(25),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  commentImage: {
    width: scaleModerate(20),
    height: scaleModerate(20),
    marginRight: scaleModerate(10),
  },

  shareImage: {
    width: scaleModerate(20),
    height: scaleModerate(20),
    marginRight: scaleModerate(10),
  },

  captionParentContainer: {
    width: '100%',
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  captionContainer: {
    width: '92%',
    height: scaleModerate(50),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  captionText: {
    color: '#ffffff',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito',
    lineHeight: undefined,
  },

  commentsParentContainer: {
    width: '100%',
    minHeight: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scaleModerate(10),
  },

  commentsContainer: {
    width: '92%',
    minHeight: scaleModerate(30),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  commentsText: {
    color: '#989BA5',
    fontSize: scaleModerate(14),
    fontFamily: 'Nunito-Light',
    lineHeight: undefined,
  },

  enterCommentContainer: {
    width: '95%',
    height: scaleVertical(70),
    borderRadius: scaleVertical(23),
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: scaleVertical(24),
    overflow: 'hidden',
  },

  commentInput: {
    flex: 0,
    height: scaleVertical(70),
    color: '#989ba5',
    marginLeft: scaleVertical(7),
    fontSize: scaleVertical(16),
    fontFamily: 'Nunito-Regular',
    marginTop: scaleModerate(10),
    // width: '90%'
  },
});
