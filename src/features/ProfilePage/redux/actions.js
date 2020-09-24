import * as actions from './constants';

export const userDetails = (userId, token) => ({
  type: actions.PROFILE_USER_DETAIL_REQUEST,
  userId,
  token,
});

export const followersConnectionsList = (userId, page, token, group_id) => ({
  type: actions.PROFILE_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
  userId,
  page,
  token,
  group_id
});

export const followingConnectionsList = (userId, page, token) => ({
  type: actions.PROFILE_FOLLOWING_CONNECTIONS_LIST_REQUEST,
  userId,
  page,
  token,
});

export const followUser = (
  userId,
  user,
  metaData,
  token,
  loggedInUser,
  origin,
) => ({
  type: actions.FOLLOW_USER_REQUEST,
  userId,
  user,
  metaData,
  token,
  loggedInUser,
  origin,
});

export const unFollowUser = (userId, token, loggedInUser, origin) => ({
  type: actions.UNFOLLOW_USER_REQUEST,
  userId,
  token,
  loggedInUser,
  origin,
});

export const searchFollowersConnectionsList = (userId, page, token, term, group_id) => ({
  type: actions.PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
  userId,
  page,
  token,
  term,
  group_id
});

export const searchFollowingConnectionsList = (userId, page, token, term) => ({
  type: actions.PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_REQUEST,
  userId,
  page,
  token,
  term,
});

export const changePassword = (token, current_password, password) => ({
  type: actions.CHANGE_PASSWORD_REQUEST,
  token,
  current_password,
  password,
});

export const editProfile = (token, user, userTypes) => ({
  type: actions.EDIT_PROFILE_REQUEST,
  token,
  user,
  userTypes,
});

export const inviteUserToGroup = (
  userId,
  groupId,
  token
) => ({
  type: actions.INVITE_USER_TO_GROUP_REQUEST,
  userId,
  groupId,
  token,
});
