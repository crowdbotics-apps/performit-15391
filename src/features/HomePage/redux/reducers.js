import * as actions from './constants';

const initialState = {
  userPosts: {},
  userPostsCommentList: {},
  errors: {
    UserPosts: null,
    UserPostsCommentList: null,
    UserEditPostRank: null,
  },
};

export default (HomePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.USER_POSTS_SUCCESS:
      console.log('--------------------action', action && action.tab);
      if (action.tab === 'following') {
        return {
          ...state,
          userPosts: {
            ...state.userPosts,
            [`${action.userId}`]: {
              ...state.userPosts[`${action.userId}`],
              postsFollowing: action.posts,
            },
          },
        };
      } else {
        return {
          ...state,
          userPosts: {
            ...state.userPosts,
            [`${action.userId}`]: {
              ...state.userPosts[`${action.userId}`],
              postsTalents: action.posts,
            },
          },
        };
      }
    case actions.USER_POSTS_ERROR:
      return {...state, errors: {UserPosts: action.error}};
    case actions.USER_POSTS_COMMENTS_SUCCESS:
      return {
        ...state,
        userPostsCommentList: {
          ...state.userPostsCommentList,
          [`${action.postId}`]: {
            comments: action.comments,
          },
        },
      };
    case actions.USER_POSTS_COMMENTS_ERROR:
      return {...state, errors: {userPostsCommentList: action.error}};
    case actions.USER_EDIT_POST_RANK_SUCCESS:
      return {
        ...state,
      };
    case actions.USER_EDIT_POST_RANK_ERROR:
      return {...state, errors: {UserEditPostRank: action.error}};
    case actions.USER_ADD_POST_VIEW_SUCCESS:
      return {
        ...state,
      };
    case actions.USER_ADD_POST_VIEW_ERROR:
      return {...state, errors: {UserEditPostRank: action.error}};
    default:
      return state;
  }
});
