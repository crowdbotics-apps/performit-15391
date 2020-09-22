import {all, takeLatest, put, call} from 'redux-saga/effects';

import {
  CREATE_GROUP_REQUEST,
  CREATE_GROUP_SUCCESS,
  CREATE_GROUP_ERROR,
  SET_DEFAULT_SUCCESS_REQUEST,
  SET_DEFAULT_SUCCESS_SUCCESS,
  SET_DEFAULT_SUCCESS_ERROR
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
    console.dir('----------------------error', error);
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

export default all([
  takeLatest(CREATE_GROUP_REQUEST, handleCreateGroup),
  takeLatest(SET_DEFAULT_SUCCESS_REQUEST, handleSetDefaultSuccess),
]);
