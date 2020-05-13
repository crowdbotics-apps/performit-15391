import * as actions from './constants';

export const signUp = user => ({
  type: actions.EMAIL_AUTH_SIGNUP_REQUEST,
  user,
});

export const login = user => ({
  type: actions.EMAIL_AUTH_LOGIN_REQUEST,
  user,
});

export const logout = _ => ({
  type: actions.EMAIL_AUTH_LOGOUT,
});

// export const resetPassword = email => ({
//   type: actions.EMAIL_AUTH_PASSWORD_RECOVER_REQUEST,
//   email,
// });

export const forgotPassword = data => ({
  type: actions.EMAIL_AUTH_FORGOT_PASSWORD_REQUEST,
  data,
});

export const resetPassword = (password, token) => ({
  type: actions.EMAIL_AUTH_RESET_PASSWORD_REQUEST,
  password,
  token,
});

export const confirmCode = data => ({
  type: actions.EMAIL_AUTH_CONFIRM_CODE_REQUEST,
  data,
});

export const resendCode = data => ({
  type: actions.EMAIL_AUTH_RESEND_CODE_REQUEST,
  data,
});
