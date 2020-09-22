import * as actions from './constants';

const initialState = {
  createGroupSuccess: '',
  newGroup: {},
  errors: {
    CreateGroup: null,
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
    default:
      return state;
  }
});
