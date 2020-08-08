import {get} from 'lodash';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import moment from 'moment';

import {store} from '../redux/store';
import {isEqual, sortBy} from 'lodash';

export const createUser = async (email, password) => {
  try {
    const userInfo = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    return userInfo.user._user;
  } catch (e) {
    return {};
  }
};

export const login = async (email, password, callback = () => {}) => {
  try {
    const user = get(auth(), '_user');
    console.log(user);
    if (!user) {
      const userInfo = await auth().signInWithEmailAndPassword(email, password);
      callback();
      return userInfo.user._user;
    } else {
      callback();
      return user;
    }
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      const newUser = await createUser(email, password);
      callback();
      return newUser;
    }
    callback();
    console.error(e);
    return {};
  }
};

export const createThreads = async data => {
  const db = firebase.firestore();
  const batch = db.batch();
  data.forEach(doc => {
    var docRef = db.collection('chat').doc();
    batch.set(docRef, doc);
  });
  await batch.commit();
};

export const getRoomId = (users = []) => {
  return sortBy(users, user => user).join('_');
};

export const createThread = async (users = [], type = 'individual') => {
  let thread = get(store.getState(), 'Chat.chat').find(item =>
    isEqual(sortBy(item.users), sortBy(users)),
  );
  if (thread) {
    return thread.id;
  }
  const db = firestore();
  console.log('--------------getRoomId(users)', getRoomId(users));
  const threadByRoomId = await db
    .collection('chat')
    .where('room_id', '==', getRoomId(users));
  console.log('--------------threadByRoomId', threadByRoomId);
  thread = await threadByRoomId.get();
  console.log('--------------thread 11111', thread);

  const threadDoc = get(thread, 'docs[0]', {});
  console.log(
    '--------------threadId exists 11111',
    threadDoc && threadDoc.exists,
  );
  console.log('--------------threadId id 11111', threadDoc && threadDoc.id);

  if (threadDoc && threadDoc.exists && threadDoc.id) {
    return threadDoc.id;
  }

  thread = await db.collection('chat').add({
    users,
    type,
    room_id: getRoomId(users),
    updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
    allMessagesRead: true,
    messages: [],
  });
  console.log('------------thread', thread.id);
  return thread.id;
};

export const simpleDoc = snapshot =>
  snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc._data,
    messages: doc._data.messages.map(message => ({
      ...message,
      createdAt: moment.unix(message.createdAt._seconds).toDate(),
    })),
  }));

export const subscribeToInbox = (id, callback = () => {}) => {
  const db = firestore();
  const chats = db.collection('chat').where('users', 'array-contains', id);
  chats.onSnapshot(
    chatSnapshot => {
      callback(simpleDoc(chatSnapshot));
    },
    err => {
      console.log(`Encountered error: ${err}`);
    },
  );
};

export const updateReadStatus = async (id, callback = () => {}) => {
  console.log('---------coming 090909090');
  const room = firestore()
    .collection('chat')
    .doc(id);

  room
    .update({
      allMessagesRead: true,
    })
    .then(callback)
    .catch(console.dir);
};

export const sendMessage = async (message, id, callback = () => {}) => {
  const room = firestore()
    .collection('chat')
    .doc(id);
  const thread = await room.get();
  const messages = thread._data.messages;
  room
    .update({
      updatedAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
      allMessagesRead: false,
      messages: [
        ...messages,
        {
          ...message,
          createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
        },
      ],
    })
    .then(callback)
    .catch(console.dir);
};

export const sendForwardIndividual = async (message, users, callback) => {
  const threadId = await createThread(users);
  sendMessage(message, threadId, callback);
};

export const sendForwardCommunity = async (message, community_id, callback) => {
  let chat = firestore()
    .collection('chat')
    .where('community_id', '==', community_id);
  let thread = await chat.get();
  const threadId = get(thread, 'docs[0].id', false);
  console.log('threadd iddd', threadId);
  if (threadId) {
    sendMessage(message, threadId, callback);
  } else {
    callback();
  }
};

export const sendForward = async (
  message,
  type = 'individual',
  users,
  community_id,
  callback,
) => {
  if (type === 'individual') {
    const threadId = await createThread(users);
    await sendMessage(message, threadId);
  } else {
    const possibleRooms = await firestore()
      .collection('chat')
      .where('users', 'array-contains', 1)
      .get();
  }
  const room = await possibleRooms.where('users', 'array-contains', 136).get();
  const thread = await room.get();
  console.log('thrrreeadddd', thread);
  const messages = thread._data.messages;
  room
    .update({
      messages: [
        ...messages,
        {
          ...message,
          createdAt: firebase.firestore.Timestamp.fromDate(message.createdAt),
        },
      ],
    })
    .then(console.log)
    .catch(console.dir);
};

export const log = async (...message) => {
  const db = firestore();
  let thread = await db.collection('log').add({
    message: message,
  });
  return thread.id;
};
