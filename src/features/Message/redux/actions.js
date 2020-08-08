import * as actions from '../redux/constants';

export const chatUpdate = chat => ({
  type: 'CHAT_UPDATE',
  chat,
});

export const storeMedia = (userId, token, media) => {
  return {
    type: actions.STORE_MEDIA_REQUEST,
    userId,
    token,
    media,
  };
};
