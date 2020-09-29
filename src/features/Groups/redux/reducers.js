import * as actions from './constants';

const initialState = {
  createGroupSuccess: '',
  editGroupSuccess: '',
  groupDetailsSuccess: '',
  userGroupSuccess: '',
  newGroup: {},
  groupsFeed: {},
  userGroups: {},
  userGroupLoading: false,
  errors: {
    CreateGroup: null,
    EditGroup: null,
    GroupDetail: null,
    UserGroups: null
  },
};

export default (GroupReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.CREATE_GROUP_ERROR:
      return {...state, errors: {CreateGroup: action.error}};
    case actions.CREATE_GROUP_SUCCESS:
      return {
          ...state,
          createGroupSuccess: 'success',
          newGroup: action.data,
        };
    case actions.SET_DEFAULT_SUCCESS_SUCCESS:
      return {...state, 
        newGroup: {},
        createGroupSuccess: ''};
    case actions.EDIT_GROUP_ERROR:
      return {...state, errors: {EditGroup: action.error}};
    case actions.EDIT_GROUP_SUCCESS:
      return {
          ...state,
          editGroupSuccess: 'success',
          newGroup: action.data,
        };
    case actions.SET_DEFAULT_EDIT_GROUP_SUCCESS:
      return {...state,
        editGroupSuccess: ''};
    case actions.GROUP_DETAILS_SUCCESS:
      return {
        ...state,
        groupsFeed: {
          ...state.groupsFeed,
          [`${action.groupId}`]: action.data
          ,
        },
        groupDetailsSuccess: 'success',
      };
    case actions.GROUP_DETAILS_ERROR:
      return {...state, errors: {GroupDetail: action.error}};
    case actions.JOIN_GROUP_ERROR:
      return {...state, errors: {JoinGroup: action.error}};
    case actions.JOIN_GROUP_SUCCESS:
      return {
          ...state,
          joinGroupSuccess: 'success',
        };
    case actions.USER_GROUP_LOADING:
      return {
        ...state,
        userGroupLoading: true,
      }; 
    case actions.USER_GROUP_SUCCESS:
      return {
        ...state,
        userGroups: action.data,
        userGroupSuccess: 'success',
        userGroupLoading: false
      }; 
    case actions.USER_GROUP_ERROR:
      return {...state,
        userGroupLoading: false,
        errors: {UserGroups: action.error}};
    default:
      return state;
  }
});
