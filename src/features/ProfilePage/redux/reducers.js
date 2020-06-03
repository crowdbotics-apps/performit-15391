import * as actions from './constants';
import {get, cloneDeep} from 'lodash';

const initialState = {
  profile: null,
  errors: {
    UserDetail: null,
    FollowersConnectionsList: null,
    FollowingConnectionsList: null,
    FollowUser: null,
    UnfollowUser: null,
    SearchFollowersConnectionsList: null,
    SearchFollowingConnectionsList: null,
  },
};

export default (ProfilePageReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.PROFILE_USER_DETAIL_SUCCESS:
      return {
        ...state,
        profile: {...state.profile, [`${action.userId}`]: action.profile},
      };
    case actions.PROFILE_USER_DETAIL_ERROR:
      return {...state, errors: {UserDetail: action.error}};
    case actions.PROFILE_FOLLOWERS_CONNECTIONS_LIST_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          [`${action.userId}`]: {
            ...state.profile[`${action.userId}`],
            followersConnectionsList: action.connectionsList,
          },
        },
      };
    case actions.PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR:
      return {...state, errors: {FollowersConnectionsList: action.error}};
    case actions.PROFILE_FOLLOWING_CONNECTIONS_LIST_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          [`${action.userId}`]: {
            ...state.profile[`${action.userId}`],
            followingConnectionsList: action.connectionsList,
          },
        },
      };
    case actions.PROFILE_FOLLOWING_CONNECTIONS_LIST_ERROR:
      return {...state, errors: {FollowingConnectionsList: action.error}};
    case actions.FOLLOW_USER_SUCCESS:
      const loggedInUserId = action.loggedInUser && action.loggedInUser.pk;
      const newFollowingData = get(
        state.profile[`${loggedInUserId}`],
        'followingConnectionsList.data',
        [],
      );
      newFollowingData.push({
        following: action.user,
        meta_data: action.meta_data,
      });
      const followersData = get(
        state.profile[`${loggedInUserId}`],
        'followersConnectionsList.data',
        [],
      );
      const newFollowersData = [];
      followersData.forEach(follower => {
        if (follower.follower && follower.follower.pk === action.userId) {
          let newFollowerData = cloneDeep(follower);
          newFollowerData.meta_data.is_following = true;
          newFollowersData.push(newFollowerData);
        } else {
          newFollowersData.push(follower);
        }
      });
      if (action.origin === 'search') {
        const newSearchFollowingData = get(
          state.profile[`${loggedInUserId}`],
          'searchFollowingConnectionsList.data',
          [],
        );
        newSearchFollowingData.push({
          following: action.user,
          meta_data: action.meta_data,
        });
        const searchFollowersData = get(
          state.profile[`${loggedInUserId}`],
          'searchFollowersConnectionsList.data',
          [],
        );
        const newSearchFollowersData = [];
        searchFollowersData.forEach(follower => {
          if (follower.follower && follower.follower.pk === action.userId) {
            let newSearchFollowerData = cloneDeep(follower);
            newSearchFollowerData.meta_data.is_following = true;
            newSearchFollowersData.push(newSearchFollowerData);
          } else {
            newSearchFollowersData.push(follower);
          }
        });

        return {
          ...state,
          profile: {
            ...state.profile,
            [`${loggedInUserId}`]: {
              ...state.profile[`${loggedInUserId}`],
              followingConnectionsList: {
                ...state.profile[`${loggedInUserId}`].followingConnectionsList,
                total:
                  state.profile[`${loggedInUserId}`].followingConnectionsList
                    .total + 1,
                data: newFollowingData,
              },
              followersConnectionsList: {
                ...state.profile[`${loggedInUserId}`].followersConnectionsList,
                data: newFollowersData,
              },
              searchFollowersConnectionsList: {
                ...state.profile[`${loggedInUserId}`]
                  .searchFollowersConnectionsList,
                data: newSearchFollowersData,
              },
              searchFollowingConnectionsList: {
                ...state.profile[`${loggedInUserId}`]
                  .searchFollowingConnectionsList,
                total:
                  state.profile[`${loggedInUserId}`]
                    .searchFollowingConnectionsList.total + 1,
                data: newSearchFollowingData,
              },
            },
          },
        };
      }

      return {
        ...state,
        profile: {
          ...state.profile,
          [`${loggedInUserId}`]: {
            ...state.profile[`${loggedInUserId}`],
            followingConnectionsList: {
              ...state.profile[`${loggedInUserId}`].followingConnectionsList,
              total:
                state.profile[`${loggedInUserId}`].followingConnectionsList
                  .total + 1,
              data: newFollowingData,
            },
            followersConnectionsList: {
              ...state.profile[`${loggedInUserId}`].followersConnectionsList,
              data: newFollowersData,
            },
          },
        },
      };
    case actions.FOLLOW_USER_ERROR:
      return {...state, errors: {FollowUser: action.error}};
    case actions.UNFOLLOW_USER_SUCCESS:
      const loggedInUserId_unfollow =
        action.loggedInUser && action.loggedInUser.pk;
      const followingData = get(
        state.profile[`${loggedInUserId_unfollow}`],
        'followingConnectionsList.data',
        [],
      );
      const data = [];
      followingData &&
        followingData.length > 0 &&
        followingData.forEach(item => {
          if (item.following && item.following.pk !== action.userId) {
            data.push(item);
          }
        });

      const followersData2 = get(
        state && state.profile[`${loggedInUserId_unfollow}`],
        'followersConnectionsList.data',
        [],
      );
      const newFollowersData2 = cloneDeep(followersData2);
      newFollowersData2.forEach(follower => {
        if (follower.follower && follower.follower.pk === action.userId) {
          follower.meta_data.is_following = false;
        }
      });

      if (action.origin === 'search') {
        const searchFollowingData = get(
          state.profile[`${loggedInUserId_unfollow}`],
          'searchFollowingConnectionsList.data',
          [],
        );
        const searchData = [];
        searchFollowingData &&
          searchFollowingData.length > 0 &&
          searchFollowingData.forEach(item => {
            if (item.following && item.following.pk !== action.userId) {
              searchData.push(item);
            }
          });

        const searchFollowersData2 = get(
          state && state.profile[`${loggedInUserId_unfollow}`],
          'searchFollowersConnectionsList.data',
          [],
        );
        const newSearchFollowersData2 = cloneDeep(searchFollowersData2);
        newSearchFollowersData2.forEach(follower => {
          if (follower.follower && follower.follower.pk === action.userId) {
            follower.meta_data.is_following = false;
          }
        });

        return {
          ...state,
          profile: {
            ...state.profile,
            [`${loggedInUserId_unfollow}`]: {
              ...state.profile[`${loggedInUserId_unfollow}`],
              followingConnectionsList: {
                ...state.profile[`${loggedInUserId_unfollow}`]
                  .followingConnectionsList,
                total:
                  state.profile[`${loggedInUserId_unfollow}`]
                    .followingConnectionsList.total - 1,
                data: data,
              },
              followersConnectionsList: {
                ...state.profile[`${loggedInUserId_unfollow}`]
                  .followersConnectionsList,
                data: newFollowersData2,
              },
              searchFollowingConnectionsList: {
                ...state.profile[`${loggedInUserId_unfollow}`]
                  .searchFollowingConnectionsList,
                total:
                  state.profile[`${loggedInUserId_unfollow}`]
                    .searchFollowingConnectionsList.total - 1,
                data: searchData,
              },
              searchFollowersConnectionsList: {
                ...state.profile[`${loggedInUserId_unfollow}`]
                  .searchFollowersConnectionsList,
                data: newSearchFollowersData2,
              },
            },
          },
        };
      }

      return {
        ...state,
        profile: {
          ...state.profile,
          [`${loggedInUserId_unfollow}`]: {
            ...state.profile[`${loggedInUserId_unfollow}`],
            followingConnectionsList: {
              ...state.profile[`${loggedInUserId_unfollow}`]
                .followingConnectionsList,
              total:
                state.profile[`${loggedInUserId_unfollow}`]
                  .followingConnectionsList.total - 1,
              data: data,
            },
            followersConnectionsList: {
              ...state.profile[`${loggedInUserId_unfollow}`]
                .followersConnectionsList,
              data: newFollowersData2,
            },
          },
        },
      };
    case actions.UNFOLLOW_USER_ERROR:
      return {...state, errors: {UnfollowUser: action.error}};
    case actions.PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          [`${action.userId}`]: {
            ...state.profile[`${action.userId}`],
            searchFollowersConnectionsList: action.connectionsList,
          },
        },
      };
    case actions.PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR:
      return {...state, errors: {SearchFollowersConnectionsList: action.error}};
    case actions.PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          [`${action.userId}`]: {
            ...state.profile[`${action.userId}`],
            searchFollowingConnectionsList: action.connectionsList,
          },
        },
      };
    case actions.PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_ERROR:
      return {...state, errors: {SearchFollowingConnectionsList: action.error}};
    default:
      return state;
  }
});
