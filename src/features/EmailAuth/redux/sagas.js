import {all, takeLatest, put, call} from 'redux-saga/effects';
import * as NavigationService from '../../../navigator/NavigationService';

import {
  EMAIL_AUTH_LOGIN_REQUEST,
  EMAIL_AUTH_LOGIN_ERROR,
  EMAIL_AUTH_SIGNUP_REQUEST,
  EMAIL_AUTH_PASSWORD_RECOVER_REQUEST,
  EMAIL_AUTH_FORGOT_PASSWORD_REQUEST,
  EMAIL_AUTH_RESET_PASSWORD_REQUEST,
  EMAIL_AUTH_CONFIRM_CODE_REQUEST,
  EMAIL_AUTH_LOGIN_SUCCESS,
  EMAIL_AUTH_SIGNUP_ERROR,
  EMAIL_AUTH_SIGNUP_SUCCESS,
  EMAIL_AUTH_PASSWORD_RECOVER_SUCCESS,
  EMAIL_AUTH_PASSWORD_RECOVER_ERROR,
  EMAIL_AUTH_FORGOT_PASSWORD_SUCCESS,
  EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
  EMAIL_AUTH_RESET_PASSWORD_SUCCESS,
  EMAIL_AUTH_RESET_PASSWORD_ERROR,
  EMAIL_AUTH_CONFIRM_CODE_SUCCESS,
  EMAIL_AUTH_CONFIRM_CODE_ERROR,
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

function sendForgotPassword(data) {
  //There is no reset password endpoint in backend, it's just a fake url
  return request.post('/send-forgot-password-code/', data);
}

function sendResetPassword(password, token) {
  //There is no reset password endpoint in backend, it's just a fake url
  return request.post(
    '/reset-password/',
    {
      password,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendConfirmCode(data) {
  return request.post('/confirm-code/', data);
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

      yield put({
        type: EMAIL_AUTH_LOGIN_ERROR,
        error: '',
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
    const {data} = error && error.response;
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
    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_SIGNUP_SUCCESS,
        // user: data,
      });
      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ConfirmCode', {user, origin: 'signup'});
    } else {
      yield put({
        type: EMAIL_AUTH_SIGNUP_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: EMAIL_AUTH_SIGNUP_ERROR,
      error: 'Something went wrong',
    });
    if (error && error.response) {
      const {data} = error.response;
      if (data && data.message) {
        if (data.message.email && data.message.email.length > 0) {
          yield put({
            type: EMAIL_AUTH_SIGNUP_ERROR,
            error: data.message.email[0],
          });
          return;
        }
        if (data.message.phone_number && data.message.phone_number.length > 0) {
          yield put({
            type: EMAIL_AUTH_SIGNUP_ERROR,
            error: data.message.phone_number[0],
          });
          return;
        }
        if (data.message.username && data.message.username.length > 0) {
          yield put({
            type: EMAIL_AUTH_SIGNUP_ERROR,
            error: data.message.username[0],
          });
          return;
        }
      }
    }

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
  const {data} = action;
  try {
    const {status} = yield call(sendForgotPassword, data);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_FORGOT_PASSWORD_SUCCESS,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('ConfirmCode', {
        user: data,
        origin: 'forgotpass',
      });
    } else {
      yield put({
        type: EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    const {data} = error && error.response;
    if (data && data.message) {
      yield put({
        type: EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
        error: data.message,
      });
      return;
    }
    yield put({
      type: EMAIL_AUTH_FORGOT_PASSWORD_ERROR,
      error: "Can't recover password with provided email",
    });
  }
}

function* handleResetPassword(action) {
  const {password, token} = action;
  try {
    const {status} = yield call(sendResetPassword, password, token);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_RESET_PASSWORD_SUCCESS,
      });

      // you can change the navigate for navigateAndResetStack to go to a protected route
      NavigationService.navigate('SignIn');
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

function* handleConfirmCode(action) {
  const {data} = action;
  try {
    const {status, data: backendData} = yield call(sendConfirmCode, data);

    if (status === 200) {
      yield put({
        type: EMAIL_AUTH_CONFIRM_CODE_SUCCESS,
      });
      yield put({
        type: EMAIL_AUTH_LOGIN_SUCCESS,
        accessToken: backendData.user && backendData.user.key,
        user: backendData.user && backendData.user.user,
      });
      if (data.origin === 'signup') {
        // you can change the navigate for navigateAndResetStack to go to a protected route
        NavigationService.navigate('ProtectedRoute');
      } else {
        NavigationService.navigate('ResetPassword', {data});
      }
    } else {
      yield put({
        type: EMAIL_AUTH_CONFIRM_CODE_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: EMAIL_AUTH_CONFIRM_CODE_ERROR,
      error: 'Invalid verification code provided.',
    });
  }
}

export default all([
  takeLatest(EMAIL_AUTH_LOGIN_REQUEST, handleLogin),
  takeLatest(EMAIL_AUTH_SIGNUP_REQUEST, handleSignUp),
  takeLatest(EMAIL_AUTH_PASSWORD_RECOVER_REQUEST, handlePasswordRecovery),
  takeLatest(EMAIL_AUTH_FORGOT_PASSWORD_REQUEST, handleForgotPassword),
  takeLatest(EMAIL_AUTH_RESET_PASSWORD_REQUEST, handleResetPassword),
  takeLatest(EMAIL_AUTH_CONFIRM_CODE_REQUEST, handleConfirmCode),
]);
