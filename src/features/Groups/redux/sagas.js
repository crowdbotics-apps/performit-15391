import {all, takeLatest, put, call} from 'redux-saga/effects';

import {
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_ERROR,
  SET_DEFAULT_SUCCESS_REQUEST,
  SET_DEFAULT_SUCCESS_SUCCESS,
  SET_DEFAULT_SUCCESS_ERROR,
  EDIT_GROUP_REQUEST,
  EDIT_GROUP_SUCCESS,
  EDIT_GROUP_ERROR,
  SET_DEFAULT_EDIT_GROUP_REQUEST,
  SET_DEFAULT_EDIT_GROUP_SUCCESS,
  SET_DEFAULT_EDIT_GROUP_ERROR,
  GROUP_DETAILS_REQUEST,
  GROUP_DETAILS_SUCCESS,
  GROUP_DETAILS_ERROR,
  JOIN_GROUP_REQUEST,
  JOIN_GROUP_SUCCESS,
  JOIN_GROUP_ERROR,
  USER_GROUP_REQUEST,
  USER_GROUP_SUCCESS,
  USER_GROUP_ERROR,
  USER_GROUP_LOADING,
  GROUP_DETAILS_LOADING
} from './constants';
import {request} from '../../../utils/http';

function sendCreateGroup(data, token) {
  console.log('----------------------data 2222', data);
  return request.post('/groups/create/', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function sendEditGroup(data, token) {
  console.log('----------------------data 78787', data);
  return request.post('/groups/edit/', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function sendJoinGroup(data, token) {
  console.log('----------------------data 78787', data);
  return request.post('/groups/joining-request/', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function sendGetGroupDetails(group_id, page, token) {
  return request.post(
    '/groups/',
    {
      group_id,
      page
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendGetUserGroups(token) {
  return request.post(
    '/groups/user-groups/',
    {},
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function* handleCreateGroup(action) {
  const {token, group_name, group_description, group_icon} = action;

  try {
    const formData = new FormData();
    formData.append('group_name', group_name);
    formData.append('group_description', group_description);
    formData.append('group_icon', group_icon);
    group_icon
    console.log('----------------------formData', formData);

    const {status, data, success} = yield call(
      sendCreateGroup,
      formData,
      token,
    );

    if (status === 200) {
      yield put({
        type: CREATE_GROUP_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: CREATE_GROUP_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: CREATE_GROUP_SUCCESS,
          data
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: CREATE_GROUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.dir(error);
    yield dir({
      type: CREATE_GROUP_ERROR,
      error: 'Not able to create group',
    });
  }
}

function* handleSetDefaultSuccess(action) {
  const {token} = action;
  try {
    yield put({
          type: SET_DEFAULT_SUCCESS_SUCCESS,
        });
  } catch (error) {
    yield put({
      type: SET_DEFAULT_SUCCESS_ERROR,
      error: '',
    });
  }
}

function* handleEditGroup(action) {
  const {token, group_id, group_name, group_description, group_icon} = action;

  try {
    const formData = new FormData();
    formData.append('group_id', group_id);
    formData.append('group_name', group_name);
    formData.append('group_description', group_description);
    formData.append('group_icon', group_icon);
    group_icon
    console.log('----------------------formData', formData);

    const {status, data, success} = yield call(
      sendEditGroup,
      formData,
      token,
    );

    if (status === 200) {
      yield put({
        type: EDIT_GROUP_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: EDIT_GROUP_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: EDIT_GROUP_SUCCESS,
          data
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: EDIT_GROUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.dir('----------------------error', error);
    yield dir({
      type: EDIT_GROUP_ERROR,
      error: 'Not able to create group',
    });
  }
}

function* handleSetEditGroupDefaultSuccess(action) {
  const {token} = action;
  try {
    yield put({
          type: SET_DEFAULT_EDIT_GROUP_SUCCESS,
        });
  } catch (error) {
    yield put({
      type: SET_DEFAULT_EDIT_GROUP_ERROR,
      error: '',
    });
  }
}

function* handleGetGroupDetails(action) {
  yield put({
    type: GROUP_DETAILS_LOADING,
  });
  
  const {group_id, page, token} = action;
  try {
    const {status, data} = yield call(sendGetGroupDetails, group_id, page, token);
    console.log('-----------------data 0000-----0000000', data)
    if (status === 200) {
      yield put({
        type: GROUP_DETAILS_SUCCESS,
      });
      yield put({
        type: GROUP_DETAILS_SUCCESS,
        data,
        groupId: group_id,
      });
      yield put({
        type: GROUP_DETAILS_ERROR,
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
        type: GROUP_DETAILS_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: GROUP_DETAILS_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleJoinGroup(action) {
  const {group_id, token} = action;

  try {
    const formData = new FormData();
    formData.append('group_id', group_id);
    console.log('----------------------formData', formData);

    const {status, data, success} = yield call(
      sendJoinGroup,
      formData,
      token,
    );

    if (status === 200) {
      yield put({
        type: JOIN_GROUP_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: JOIN_GROUP_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: JOIN_GROUP_SUCCESS,
          data
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: JOIN_GROUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.dir(error);
    yield put({
      type: JOIN_GROUP_ERROR,
      error: 'Not able to create group',
    });
  }
}

function* handleGetUserGroups(action) {
  yield put({
    type: USER_GROUP_LOADING,
  });

  const {token} = action;
  try {
    const {status, data} = yield call(sendGetUserGroups, token);
    console.log('-----------------data 0000-----0000000', data)
    if (status === 200) {
      yield put({
        type: USER_GROUP_SUCCESS,
      });
      yield put({
        type: USER_GROUP_SUCCESS,
        data,
      });
      yield put({
        type: USER_GROUP_ERROR,
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
        type: USER_GROUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_GROUP_ERROR,
      error: 'Something went wrong',
    });
  }
}

export default all([
  takeLatest(CREATE_GROUP_REQUEST, handleCreateGroup),
  takeLatest(SET_DEFAULT_SUCCESS_REQUEST, handleSetDefaultSuccess),
  takeLatest(EDIT_GROUP_REQUEST, handleEditGroup),
  takeLatest(SET_DEFAULT_EDIT_GROUP_REQUEST, handleSetEditGroupDefaultSuccess),
  takeLatest(GROUP_DETAILS_REQUEST, handleGetGroupDetails),
  takeLatest(JOIN_GROUP_REQUEST, handleJoinGroup),
  takeLatest(USER_GROUP_REQUEST, handleGetUserGroups),
]);