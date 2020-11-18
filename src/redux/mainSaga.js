import {all, takeEvery, take} from 'redux-saga/effects';

//@BlueprintReduxSagaImportInsertion
import EmailAuthSaga from '../features/EmailAuth/redux/sagas';
import ProfilePageSaga from '../features/ProfilePage/redux/sagas';
import HomePageSaga from '../features/HomePage/redux/sagas';
import MessagePageSaga from '../features/Message/redux/sagas';
import GroupSaga from '../features/Groups/redux/sagas';

function* helloSaga() {
  console.log('Hello from saga!');
}

export function* mainSaga() {
  yield all([
    takeEvery('TEST/ALO', helloSaga),
    // other sagas go here

    //@BlueprintReduxSagaMainInsertion
    EmailAuthSaga,
    ProfilePageSaga,
    HomePageSaga,
    MessagePageSaga,
    GroupSaga,
  ]);
}
