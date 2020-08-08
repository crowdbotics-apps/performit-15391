import {get} from 'lodash';
const getUser = (currentUser, pk, profile) => {
  const userProfile = profile && profile[`${pk}`];
  return userProfile;
};

export const combineChat = (chatItem, currentUser, profile) => ({
  ...chatItem,
  users: chatItem.users.map(user => ({
    ...getUser(currentUser, user, profile),
  })),
  messages: chatItem.messages.map(message => ({
    ...message,
    user: getUser(currentUser, message.user, profile),
  })),
  type: chatItem.type,
});

export const combineInbox = (chat, currentUser, profile) => {
  const chatWithUsers = chat.map(chatItem =>
    combineChat(chatItem, currentUser, profile),
  );
  return chatWithUsers;
};
