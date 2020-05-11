import * as actions from "./constants";
import {EMAIL_AUTH_FORGOT_PASSWORD_ERROR} from "./constants";

const initialState = {
  user: null,
  accessToken: null,
  errors: { SignIn: null, SignUp: null, PasswordRecover: null, ForgotPassword: null, ResetPassword: null }
};

export default EmailAuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.EMAIL_AUTH_LOGIN_SUCCESS:
      return { ...state, accessToken: action.accessToken };
    case actions.EMAIL_AUTH_LOGIN_ERROR:
      return { ...state, errors: { SignIn: action.error } };
    case actions.EMAIL_AUTH_PASSWORD_RECOVER_ERROR:
      return { ...state, errors: { PasswordRecover: action.error } };
    case actions.EMAIL_AUTH_FORGOT_PASSWORD_ERROR:
      return { ...state, errors: { ForgotPassword: action.error } };
    case actions.EMAIL_AUTH_RESET_PASSWORD_ERROR:
      return { ...state, errors: { ResetPassword: action.error } };
    case actions.EMAIL_AUTH_SIGNUP_SUCCESS:
      return { ...state, user: action.user };
    case actions.EMAIL_AUTH_SIGNUP_ERROR:
      return { ...state, errors: { SignUp: action.error } };
    case actions.EMAIL_AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
};
