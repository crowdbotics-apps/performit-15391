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
