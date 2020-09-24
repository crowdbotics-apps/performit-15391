import * as actions from './constants';

const initialState = {
  createGroupSuccess: '',
  editGroupSuccess: '',
  groupDetailsSuccess: '',
  newGroup: {},
  groupsFeed: {},
  errors: {
    CreateGroup: null,
    EditGroup: null,
    GroupDetail: null,
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
        groupDetailsSuccess: '',
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
    default:
      return state;
  }
});
