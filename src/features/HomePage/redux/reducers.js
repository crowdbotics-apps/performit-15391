import * as actions from './constants';

const initialState = {
  userPosts: {},
  userPostsCommentList: {},
  searchTopAccountsList: [],
  searchAccountsList: [],
  searchGroupsList: [],
  searchHashTagsList: [],
  nearbyUsers: [],
  searchDashBoardSuccess: false,
  errors: {
    UserPosts: null,
    UserPostsCommentList: null,
    UserEditPostRank: null,
    UserAddCommentToPost: null,
    serchDashBoardError: null,
    CreatePost: null,
    UpdateLocation: null,
  },
};

export default (HomePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.USER_POSTS_SUCCESS:
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
    case actions.USER_ADD_COMMENT_POST_SUCCESS:
      return {
        ...state,
      };
    case actions.USER_ADD_COMMENT_POST_ERROR:
      return {...state, errors: {UserAddCommentToPost: action.error}};

    case actions.USER_SEARCH_PERFORMIT_SUCCESS:
      if (action.tab === 'top') {
        return {
          ...state,
          searchDashBoardSuccess: true,
          searchTopAccountsList: action.data,
        };
      } else if (action.tab === 'accounts') {
        return {
          ...state,
          searchDashBoardSuccess: true,
          searchAccountsList: action.data,
        };
      } else if (action.tab === 'groups') {
        return {
          ...state,
          searchDashBoardSuccess: true,
          searchGroupsList: action.data,
        };
      } else if (action.tab === 'hashtags') {
        return {
          ...state,
          searchDashBoardSuccess: true,
          searchHashTagsList: action.data,
        };
      } else {
        return {
          ...state,
        };
      }
    case actions.USER_SEARCH_PERFORMIT_ERROR:
      return {
        ...state,
        searchDashBoardSuccess: false,
        errors: {serchDashBoardError: action.error},
      };
    case actions.CREATE_POST_ERROR:
      return {...state, errors: {CreatePost: action.error}};
    case actions.NEARBY_USERS_SUCCESS:
      return {
        ...state,
        nearbyUsers: action.data,
      };
    case actions.UPDATE_LOCATION_ERROR:
      return {...state, errors: {UpdateLocation: action.error}};
    default:
      return state;
  }
});
