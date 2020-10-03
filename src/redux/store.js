import { combinedReducers } from "./mainReducer";
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { mainSaga } from "./mainSaga";
import {persistStore, persistReducer} from 'redux-persist';
import {AsyncStorage} from 'react-native';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  debounce: 100,
  timeout: 0,
  blacklist: [],
};

/**
 * this app uses React Native Debugger, but it works without it
 */
const persistedReducer = persistReducer(persistConfig, combinedReducers);
const reducerWithLogout = (state, action) => {
  if (action.type === 'logout') {
    state = undefined;
    AsyncStorage.clear();
  }
  return persistedReducer(state, action);
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [sagaMiddleware /** more middlewares if any goes here */];

const store = createStore(
  reducerWithLogout,
  composeEnhancers(applyMiddleware(...middlewares))
);
const persistor = persistStore(store);

sagaMiddleware.run(mainSaga);

export { store, persistor };

