import {all, takeLatest, put, call} from 'redux-saga/effects';

import {
  STORE_MEDIA_REQUEST,
  STORE_MEDIA_SUCCESS,
  STORE_MEDIA_ERROR,
} from './constants';
import {request} from '../../../utils/http';

function sendStoreMedia(data, token) {
  return request.post('/chats/store-media/', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`,
    },
  });
}

function* handleStoreMedia(action) {
  const {userId, token, media} = action;

  try {
    const formData = new FormData();
    Object.keys(media).forEach(key => {
      formData.append(key, media[key]);
    });

    formData.append('user_id', userId);
    const {status, data, success} = yield call(sendStoreMedia, formData, token);

    if (status === 200) {
      yield put({
        type: STORE_MEDIA_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: STORE_MEDIA_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: STORE_MEDIA_SUCCESS,
          data,
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: STORE_MEDIA_SUCCESS,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.dir(error);
    yield put({
      type: STORE_MEDIA_ERROR,
      error: 'Not able to store media',
    });
  }
}

export default all([takeLatest(STORE_MEDIA_REQUEST, handleStoreMedia)]);
