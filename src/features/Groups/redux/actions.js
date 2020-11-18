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

export const editGroup = (token, group_id, group_name, group_description, group_icon) => ({
  type: actions.EDIT_GROUP_REQUEST,
  token,
  group_id,
  group_name,
  group_description,
  group_icon,
});

export const setEditGroupSuccessToDefault = (token) => ({
  type: actions.SET_DEFAULT_EDIT_GROUP_REQUEST,
  token,
});

export const getGroupDetails = (group_id, page, token) => ({
  type: actions.GROUP_DETAILS_REQUEST,
  group_id,
  page,
  token
});

export const joinGroup = (group_id, token) => ({
  type: actions.JOIN_GROUP_REQUEST,
  group_id,
  token,
});

export const getUserGroups = (token) => ({
  type: actions.USER_GROUP_REQUEST,
  token,
});