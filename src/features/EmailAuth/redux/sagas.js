import {all, takeLatest, put, call} from 'redux-saga/effects';
import * as NavigationService from '../../../navigator/NavigationService';

import {
  EMAIL_AUTH_LOGIN_REQUEST,
  EMAIL_AUTH_LOGIN_ERROR,
  EMAIL_AUTH_SIGNUP_REQUEST,
  EMAIL_AUTH_PASSWORD_RECOVER_REQUEST,
  EMAIL_AUTH_FORGOT_PASSWORD_REQUEST,
  EMAIL_AUTH_RESET_PASSWORD_REQUEST,
  EMAIL_AUTH_LOGIN_SUCCESS,
  EMAIL_AUTH_SIGNUP_ERROR,
  EMAIL_AUTH_SIGNUP_SUCCESS,
  EMAIL_AUTH_PASSWORD_RECOVER_SUCCESS,
  EMAIL_AUTH_PASSWORD_RECOVER_ERROR,
  EMAIL_AUTH_FORGOT_PASSWORD_SUCCESS,
  EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
  EMAIL_AUTH_RESET_PASSWORD_SUCCESS,
  EMAIL_AUTH_RESET_PASSWORD_ERROR,
} from './constants';
import {request} from '../../../utils/http';

function sendLogin({username, password}) {
  return request.post('/rest-auth/login/', {
    username: username,
    password,
  });
}

function sendSignUp(user) {
  return request.post('/sign-up/', user);
}

function sendPasswordRecovery(email) {
  // https://performit-15391.botics.co/sign-up/
  //There is no reset password endpoint in backend, it's just a fake url
  return request.post('/api/v1/password-reset/', {
    email,
  });
}

function sendForgotPassword(email) {
  //There is no reset password endpoint in backend, it's just a fake url
  return request.post('/send-forgot-password-code/', {
    email,
  });
}

function sendResetPassword(password) {
  //There is no reset password endpoint in backend, it's just a fake url
  return request.post('/send-forgot-password-code/', {
    password,
  });
}

function* handleLogin(action) {
  const {
    user: {username, password},
  } = action;
  try {
    const {status, data} = yield call(sendLogin, {username, password});

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_LOGIN_SUCCESS,
        accessToken: data.key,
        user: data.user,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ProtectedRoute');
    } else {
      yield put({
        type: EMAIL_AUTH_LOGIN_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    // todo add errors with similar structure in backend
    console.dir(error)
    yield put({
      type: EMAIL_AUTH_LOGIN_ERROR,
      error: "Can't sign in with provided credentials",
    });
  }
}

function* handleSignUp(action) {
  const {user} = action;
  try {
    const {status, data} = yield call(sendSignUp, user);
    console.log(status, data);
    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_SIGNUP_SUCCESS,
        // user: data,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ForgotPassword');
    } else {
      yield put({
        type: EMAIL_AUTH_SIGNUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.dir(error)
    // todo add errors with similar structure in backend
    yield put({
      type: EMAIL_AUTH_SIGNUP_ERROR,
      error: "Can't sign up with provided credentials",
    });
  }
}

function* handlePasswordRecovery(action) {
  const {email} = action;

  try {
    const {status} = yield call(sendPasswordRecovery, email);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_PASSWORD_RECOVER_SUCCESS,
        email,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ConfirmationRequired');
    } else {
      yield put({
        type: EMAIL_AUTH_PASSWORD_RECOVER_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: EMAIL_AUTH_PASSWORD_RECOVER_ERROR,
      error: "Can't recover password with provided email",
    });
  }
}

function* handleForgotPassword(action) {
  const {email} = action;

  try {
    const {status} = yield call(sendForgotPassword, email);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_FORGOT_PASSWORD_SUCCESS,
        email,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ConfirmationRequired');
    } else {
      yield put({
        type: EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
      error: "Can't recover password with provided email",
    });
  }
}

function* handleResetPassword(action) {
  const {password} = action;

  try {
    const {status} = yield call(sendResetPassword, email);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_RESET_PASSWORD_SUCCESS,
        email,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ConfirmationRequired');
    } else {
      yield put({
        type: EMAIL_AUTH_RESET_PASSWORD_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: EMAIL_AUTH_RESET_PASSWORD_ERROR,
      error: "Can't recover password with provided email",
    });
  }
}

export default all([
  takeLatest(EMAIL_AUTH_LOGIN_REQUEST, handleLogin),
  takeLatest(EMAIL_AUTH_SIGNUP_REQUEST, handleSignUp),
  takeLatest(EMAIL_AUTH_PASSWORD_RECOVER_REQUEST, handlePasswordRecovery),
  takeLatest(EMAIL_AUTH_FORGOT_PASSWORD_REQUEST, handleForgotPassword),
  takeLatest(EMAIL_AUTH_RESET_PASSWORD_REQUEST, handleResetPassword),
]);
