import * as actions from './constants';

export const userPosts = (tab, token, userId) => ({
  type: actions.USER_POSTS_REQUEST,
  tab,
  token,
  userId,
});

export const addEditPostRank = (postId, rating, token) => ({
  type: actions.USER_EDIT_POST_RANK_REQUEST,
  postId,
  rating,
  token,
});

export const addPostView = (postId, token) => ({
  type: actions.USER_ADD_POST_VIEW_REQUEST,
  postId,
  token,
});

export const fetchCommentsForPost = (postId, token) => ({
  type: actions.USER_POSTS_COMMENTS_REQUEST,
  postId,
  token,
});

export const addCommentToPost = (postId, comment, token) => ({
  type: actions.USER_ADD_COMMENT_POST_REQUEST,
  postId,
  comment,
  token,
});

export const searchDashboard = (tab, page, token, term) => ({
  type: actions.USER_SEARCH_PERFORMIT_REQUEST,
  tab,
  page,
  token,
  term,
});

export const createPost = (token, content, caption) => ({
  type: actions.CREATE_POST_REQUEST,
  token,
  content,
  caption,
});

export const findNearbyUsers = (token, user_types, distance, term) => ({
  type: actions.NEARBY_USERS_REQUEST,
  token,
  user_types,
  distance,
  term
});

export const updateCurrentLocation = (token, location_lat, location_long) => ({
  type: actions.UPDATE_LOCATION_REQUEST,
  token,
  location_lat,
  location_long
});