import {all, takeLatest, put, call} from 'redux-saga/effects';
import * as NavigationService from '../../../navigator/NavigationService';

import {
  PROFILE_USER_DETAIL_REQUEST,
  PROFILE_USER_DETAIL_SUCCESS,
  PROFILE_USER_DETAIL_ERROR,
  PROFILE_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
  PROFILE_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
  PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR,
  PROFILE_FOLLOWING_CONNECTIONS_LIST_REQUEST,
  PROFILE_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
  PROFILE_FOLLOWING_CONNECTIONS_LIST_ERROR,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_ERROR,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_ERROR,
  PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
  PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
  PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR,
  PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_REQUEST,
  PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
  PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_ERROR,
} from './constants';
import {request} from '../../../utils/http';

function sendUserDetails(user_id, token) {
  return request.post(
    '/users-detail/',
    {
      user_id,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendGetConnectionsList(user_id, tab_type, page, token) {
  return request.post(
    '/connections/list/',
    {
      user_id,
      tab_type,
      page,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendGetSearchConnectionsList(user_id, tab_type, page, token, term) {
  return request.post(
    '/connections/search-user/',
    {
      user_id,
      tab_type,
      page,
      term,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendFollowUser(user_id, token) {
  return request.post(
    '/connections/follow/',
    {
      user_id,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendUnfollowUser(user_id, token) {
  return request.post(
    '/connections/unfollow/',
    {
      user_id,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function* handleGetUserDetails(action) {
  const {userId, token} = action;
  try {
    const {status, data} = yield call(sendUserDetails, userId, token);

    if (status === 200) {
      yield put({
        type: PROFILE_USER_DETAIL_SUCCESS,
      });
      yield put({
        type: PROFILE_USER_DETAIL_SUCCESS,
        profile: data && data.data,
        userId: userId,
      });
      yield put({
        type: PROFILE_USER_DETAIL_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: PROFILE_USER_DETAIL_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: PROFILE_USER_DETAIL_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetFollowersConnectionsList(action) {
  const {userId, page, token} = action;
  try {
    const {status, data} = yield call(
      sendGetConnectionsList,
      userId,
      'follower',
      page,
      token,
    );

    if (status === 200) {
      yield put({
        type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
      });
      yield put({
        type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
        connectionsList: data,
        userId,
      });
      yield put({
        type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetFollowingConnectionsList(action) {
  const {userId, page, token} = action;
  try {
    const {status, data} = yield call(
      sendGetConnectionsList,
      userId,
      'following',
      page,
      token,
    );

    if (status === 200) {
      yield put({
        type: PROFILE_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
      });
      yield put({
        type: PROFILE_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
        connectionsList: data,
        userId,
      });
      yield put({
        type: PROFILE_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: PROFILE_FOLLOWING_CONNECTIONS_LIST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: PROFILE_FOLLOWING_CONNECTIONS_LIST_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleFollowUser(action) {
  const {userId, user, metaData, token, loggedInUser, origin} = action;
  try {
    const {status, data} = yield call(sendFollowUser, userId, token);

    if (status === 200) {
      yield put({
        type: FOLLOW_USER_SUCCESS,
        userId,
        user,
        meta_data: metaData,
        loggedInUser,
        origin,
      });
      yield put({
        type: FOLLOW_USER_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: FOLLOW_USER_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: FOLLOW_USER_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleUnfollowUser(action) {
  const {userId, token, loggedInUser, origin} = action;
  try {
    const {status, data} = yield call(sendUnfollowUser, userId, token);

    if (status === 200) {
      yield put({
        type: UNFOLLOW_USER_SUCCESS,
        userId,
        loggedInUser,
        origin,
      });
      yield put({
        type: UNFOLLOW_USER_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: UNFOLLOW_USER_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    if (error && error.response) {
      const {data} = error && error.response;
    }
    yield put({
      type: UNFOLLOW_USER_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetSearchFollowersConnectionsList(action) {
  const {userId, page, token, term} = action;
  try {
    const {status, data} = yield call(
      sendGetSearchConnectionsList,
      userId,
      'follower',
      page,
      token,
      term,
    );

    if (status === 200) {
      yield put({
        type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
      });
      yield put({
        type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_SUCCESS,
        connectionsList: data,
        userId,
      });
      yield put({
        type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetSearchFollowingConnectionsList(action) {
  const {userId, page, token, term} = action;
  try {
    const {status, data} = yield call(
      sendGetSearchConnectionsList,
      userId,
      'following',
      page,
      token,
      term,
    );

    if (status === 200) {
      yield put({
        type: PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
      });
      yield put({
        type: PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_SUCCESS,
        connectionsList: data,
        userId,
      });
      yield put({
        type: PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_ERROR,
        error: '',
      });
      // if (data.origin === 'signup') {
      //   // you can change the navigate for navigateAndResetStack to go to a protected route
      //   NavigationService.navigate('Profile');
      // } else {
      //   NavigationService.navigate('ResetPassword', {data});
      // }
    } else {
      yield put({
        type: PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_ERROR,
      error: 'Something went wrong',
    });
  }
}

export default all([
  takeLatest(PROFILE_USER_DETAIL_REQUEST, handleGetUserDetails),
  takeLatest(
    PROFILE_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
    handleGetFollowersConnectionsList,
  ),
  takeLatest(
    PROFILE_FOLLOWING_CONNECTIONS_LIST_REQUEST,
    handleGetFollowingConnectionsList,
  ),
  takeLatest(FOLLOW_USER_REQUEST, handleFollowUser),
  takeLatest(UNFOLLOW_USER_REQUEST, handleUnfollowUser),
  takeLatest(
    PROFILE_SEARCH_FOLLOWERS_CONNECTIONS_LIST_REQUEST,
    handleGetSearchFollowersConnectionsList,
  ),
  takeLatest(
    PROFILE_SEARCH_FOLLOWING_CONNECTIONS_LIST_REQUEST,
    handleGetSearchFollowingConnectionsList,
  ),
]);
