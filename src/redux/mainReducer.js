import {combineReducers} from 'redux';

/**
 * You can import more reducers here
 */

//@BlueprintReduxImportInsertion
import EmailAuthReducer from '../features/EmailAuth/redux/reducers';
import ProfilePageReducer from '../features/ProfilePage/redux/reducers';
import HomePageReducer from '../features/HomePage/redux/reducers';
import ChatReducer from '../features/Message/redux/reducers';
import GroupReducer from '../features/Groups/redux/reducers';

export const combinedReducers = combineReducers({
  blank: (state, action) => {
    if (state == null) {
      state = [];
    }
    return state;
  },

  //@BlueprintReduxCombineInsertion
  EmailAuth: EmailAuthReducer,
  Profile: ProfilePageReducer,
  Posts: HomePageReducer,
  Chat: ChatReducer,
  Group: GroupReducer,
});
