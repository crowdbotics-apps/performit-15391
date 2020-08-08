import * as actions from './constants';
const initialState = {
  chat: [],
  chatSuccess: false,
  media: {},
  storeMediaSuccess: false,
  inbox: {
    data: [],
    loading: false,
    success: false,
    failure: false,
  },
};

export default (ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHAT_UPDATE':
      return {
        ...state,
        chat: action.chat,
        chatSuccess: true,
      };
    case actions.STORE_MEDIA_SUCCESS:
      return {
        ...state,
        storeMediaSuccess: true,
        media: action.data,
      };
    case actions.STORE_MEDIA_ERROR:
      return {
        ...state,
        storeMediaSuccess: false,
        media: {},
      };
    default:
      return state;
  }
});
