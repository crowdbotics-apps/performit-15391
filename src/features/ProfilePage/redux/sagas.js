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
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_ERROR,
  EDIT_PROFILE_REQUEST,
  EDIT_PROFILE_SUCCESS,
  EDIT_PROFILE_ERROR,
  INVITE_USER_TO_GROUP_REQUEST,
  INVITE_USER_TO_GROUP_SUCCESS,
  INVITE_USER_TO_GROUP_ERROR,
  GET_NOTIFICATIONS_REQUEST,
  GET_NOTIFICATIONS_SUCCESS,
  GET_NOTIFICATIONS_ERROR,
  READ_NOTIFICATION_REQUEST,
  READ_NOTIFICATION_SUCCESS,
  READ_NOTIFICATION_ERROR,
  ACCEPT_GROUP_JOIN_REQUEST,
  ACCEPT_GROUP_JOIN_SUCCESS,
  ACCEPT_GROUP_JOIN_ERROR,
  ACCEPT_GROUP_INVITE_REQUEST,
  ACCEPT_GROUP_INVITE_SUCCESS,
  ACCEPT_GROUP_INVITE_ERROR,
  PROFILE_USER_DETAIL_LOADING,
  GET_NOTIFICATIONS_LOADING,
  UPDATE_PROFILE_DETAILS_REQUEST
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

function updateUserDetails(user, token) {
  return request.post(
    '/connect-social-media/',
    user,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendGetConnectionsList(user_id, tab_type, page, token, group_id) {
  if(group_id){
    return request.post(
      '/connections/list/',
      {
        user_id,
        tab_type,
        page,
        group_id
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
  } else {
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
}

function sendGetSearchConnectionsList(user_id, tab_type, page, token, term, group_id) {
  if(group_id){
    return request.post(
      '/connections/search-user/',
      {
        user_id,
        tab_type,
        page,
        term,
        group_id
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    );
  } else {
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

function sendInviteUserToGroup(user_id, group_id, token) {
  return request.post(
    '/groups/invite/',
    {
      user_id,
      group_id
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

function sendChangePassword(token, current_password, password) {
  return request.post(
    '/change-password/',
    {
      current_password,
      password,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendEditProfile(data, token) {
  return request.post('/edit-profile/', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function sendGetNotifications(token) {
  return request.post('/notifications/', {}, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function sendReadNotification(notification_id, token) {
  return request.post('/notifications/read/', {notification_id}, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

function sendAcceptGroupJoin(request_id, token) {
  return request.post('/groups/accept-joining-request/', {request_id}, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

function sendAcceptGroupInvite(invite_id, token) {
  return request.post('/groups/accept-invite/', {invite_id}, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

function* handleUpdateProfileDetails(action) {
  yield put({
    type: PROFILE_USER_DETAIL_LOADING,
  });

  const {userId,user, token} = action;
  try {
    const {status, data} = yield call(updateUserDetails, user, token);
    if (status === 200) {
      yield put({
        type: PROFILE_USER_DETAIL_SUCCESS,
      });
      yield put({
        type: PROFILE_USER_DETAIL_SUCCESS,
        profile: {user_details : data && data.data},
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

function* handleGetUserDetails(action) {
  yield put({
    type: PROFILE_USER_DETAIL_LOADING,
  });

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
  const {userId, page, token, group_id} = action;
  try {
    const {status, data} = yield call(
      sendGetConnectionsList,
      userId,
      'follower',
      page,
      token,
      group_id
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
    console.log('followers connection list')
    console.dir(error)
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
    console.log('following connection list')
    console.dir(error)
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
    console.dir(error)
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
    console.dir(error)
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
  const {userId, page, token, term, group_id} = action;
  try {
    const {status, data} = yield call(
      sendGetSearchConnectionsList,
      userId,
      'follower',
      page,
      token,
      term,
      group_id
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

function* handleChangePassword(action) {
  const {token, current_password, password} = action;
  try {
    const {status, data, success} = yield call(
      sendChangePassword,
      token,
      current_password,
      password,
    );

    if (status === 200) {
      yield put({
        type: CHANGE_PASSWORD_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: CHANGE_PASSWORD_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: CHANGE_PASSWORD_SUCCESS,
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: CHANGE_PASSWORD_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: CHANGE_PASSWORD_ERROR,
      error: "Can't recover password with provided email",
    });
  }
}

function* handleEditProfile(action) {
  const {token, user, userTypes} = action;

  try {
    const formData = new FormData();
    Object.keys(user).forEach(key => {
      formData.append(key, user[key]);
    });

    userTypes &&
      userTypes.length &&
      userTypes.forEach(userType => {
        formData.append('user_types', userType);
      });

    // console.log('--------------------------------------formData 111111', formData)
    const {status, data, success} = yield call(
      sendEditProfile,
      formData,
      token,
    );

    if (status === 200) {
      yield put({
        type: EDIT_PROFILE_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: EDIT_PROFILE_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: EDIT_PROFILE_SUCCESS,
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: EDIT_PROFILE_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // console.dir(error)
    yield put({
      type: EDIT_PROFILE_ERROR,
      error: 'Not able to update user profile',
    });
  }
}

function* handleInviteUserToGroup(action) {
  const {userId, groupId, token} = action;
  try {
    const {status, data} = yield call(sendInviteUserToGroup, userId, groupId, token);

    if (status === 200) {
      yield put({
        type: INVITE_USER_TO_GROUP_SUCCESS,
        userId
      });
      yield put({
        type: INVITE_USER_TO_GROUP_ERROR,
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
        type: INVITE_USER_TO_GROUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: INVITE_USER_TO_GROUP_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetNotifications(action) {
  yield put({
    type: GET_NOTIFICATIONS_LOADING
  });

  const {token} = action;
  try {
    const {status, data} = yield call(sendGetNotifications, token);
    if (status === 200) {
      yield put({
        type: GET_NOTIFICATIONS_SUCCESS,
        data
      });
      yield put({
        type: GET_NOTIFICATIONS_ERROR,
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
        type: GET_NOTIFICATIONS_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // console.dir(error)
    yield put({
      type: GET_NOTIFICATIONS_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handlReadNotification(action) {
  const {notification_id, token} = action;
  try {
    const {status, data} = yield call(sendReadNotification, notification_id, token);
    if (status === 200) {
      yield put({
        type: READ_NOTIFICATION_SUCCESS,
        notification_id
      });
      yield put({
        type: READ_NOTIFICATION_ERROR,
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
        type: READ_NOTIFICATION_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // console.dir(error)
    yield put({
      type: READ_NOTIFICATION_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleAcceptGroupJoin(action) {
  const {request_id, token} = action;
  try {
    const {status, data} = yield call(sendAcceptGroupJoin, request_id, token);
    if (status === 200) {
      yield put({
        type: ACCEPT_GROUP_JOIN_SUCCESS,
      });
      yield put({
        type: ACCEPT_GROUP_JOIN_ERROR,
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
        type: ACCEPT_GROUP_JOIN_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // console.dir(error)
    yield put({
      type: ACCEPT_GROUP_JOIN_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleAcceptGroupInvite(action) {
  const {invite_id, token} = action;
  try {
    const {status, data} = yield call(sendAcceptGroupInvite, invite_id, token);
    // console.log('--------------------------data invite', data)
    if (status === 200) {
      yield put({
        type: ACCEPT_GROUP_INVITE_SUCCESS,
      });
      yield put({
        type: ACCEPT_GROUP_INVITE_ERROR,
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
        type: ACCEPT_GROUP_INVITE_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // console.dir(error)
    yield put({
      type: ACCEPT_GROUP_INVITE_ERROR,
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
  takeLatest(CHANGE_PASSWORD_REQUEST, handleChangePassword),
  takeLatest(EDIT_PROFILE_REQUEST, handleEditProfile),
  takeLatest(INVITE_USER_TO_GROUP_REQUEST, handleInviteUserToGroup),
  takeLatest(GET_NOTIFICATIONS_REQUEST, handleGetNotifications),
  takeLatest(READ_NOTIFICATION_REQUEST, handlReadNotification),
  takeLatest(ACCEPT_GROUP_JOIN_REQUEST, handleAcceptGroupJoin),
  takeLatest(ACCEPT_GROUP_INVITE_REQUEST, handleAcceptGroupInvite),
  takeLatest(UPDATE_PROFILE_DETAILS_REQUEST, handleUpdateProfileDetails),
]);
