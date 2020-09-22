import * as actions from './constants';

export const createGroup = (token, group_name, group_description, group_icon) => ({
  type: actions.CREATE_GROUP_REQUEST,
  token,
  group_name,
  group_description,
  group_icon,
});

export const setSuccessToDefault = (token) => ({
  type: actions.SET_DEFAULT_SUCCESS_REQUEST,
  token,
});