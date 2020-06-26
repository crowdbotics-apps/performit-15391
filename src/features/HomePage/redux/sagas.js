import {all, takeLatest, put, call} from 'redux-saga/effects';

import {
  USER_POSTS_REQUEST,
  USER_POSTS_SUCCESS,
  USER_POSTS_ERROR,
  USER_POSTS_COMMENTS_REQUEST,
  USER_POSTS_COMMENTS_SUCCESS,
  USER_POSTS_COMMENTS_ERROR,
  USER_EDIT_POST_RANK_REQUEST,
  USER_EDIT_POST_RANK_SUCCESS,
  USER_EDIT_POST_RANK_ERROR,
  USER_ADD_POST_VIEW_REQUEST,
  USER_ADD_POST_VIEW_SUCCESS,
  USER_ADD_POST_VIEW_ERROR,
} from './constants';
import {request} from '../../../utils/http';

function sendUserPosts(tab, token) {
  return request.post(
    '/dashboards/feed/',
    {
      tab,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendUserPostComments(postId, token) {
  return request.post(
    '/posts/comments-list/',
    {
      post_id: postId,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendEditUserPostRank(postId, rating, token) {
  return request.post(
    '/posts/add-edit-post-rank/',
    {
      post_id: postId,
      rank: rating,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendAddPostView(postId, token) {
  return request.post(
    '/posts/add-post-view/',
    {
      post_id: postId,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function* handleGetUserPosts(action) {
  const {tab, token, userId} = action;
  try {
    console.log('--------------------------tab saga', tab);
    console.log('--------------------------userId saga', userId);
    const {status, data} = yield call(sendUserPosts, tab, token);

    if (status === 200) {
      yield put({
        type: USER_POSTS_SUCCESS,
      });
      yield put({
        type: USER_POSTS_SUCCESS,
        posts: data,
        userId: userId,
        tab,
      });
      yield put({
        type: USER_POSTS_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_POSTS_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_POSTS_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleGetUserPostComments(action) {
  const {postId, token} = action;
  try {
    const {status, data} = yield call(sendUserPostComments, postId, token);

    if (status === 200) {
      yield put({
        type: USER_POSTS_COMMENTS_SUCCESS,
      });
      yield put({
        type: USER_POSTS_COMMENTS_SUCCESS,
        comments: data,
        postId,
      });
      yield put({
        type: USER_POSTS_COMMENTS_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_POSTS_COMMENTS_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_POSTS_COMMENTS_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleEditPostRank(action) {
  const {postId, rating, token} = action;
  console.log('----------------------postId', postId);
  console.log('----------------------rating', rating);
  try {
    const {status, data} = yield call(
      sendEditUserPostRank,
      postId,
      rating,
      token,
    );

    if (status === 200) {
      yield put({
        type: USER_EDIT_POST_RANK_SUCCESS,
      });
      yield put({
        type: USER_EDIT_POST_RANK_SUCCESS,
        data,
        postId,
      });
      yield put({
        type: USER_EDIT_POST_RANK_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_EDIT_POST_RANK_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_EDIT_POST_RANK_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleAddPostView(action) {
  const {postId, token} = action;
  console.log('----------------------postId', postId);
  try {
    const {status, data} = yield call(sendAddPostView, postId, token);

    if (status === 200) {
      yield put({
        type: USER_ADD_POST_VIEW_SUCCESS,
      });
      yield put({
        type: USER_ADD_POST_VIEW_SUCCESS,
        data,
        postId,
      });
      yield put({
        type: USER_ADD_POST_VIEW_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_ADD_POST_VIEW_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_ADD_POST_VIEW_ERROR,
      error: 'Something went wrong',
    });
  }
}

export default all([
  takeLatest(USER_POSTS_REQUEST, handleGetUserPosts),
  takeLatest(USER_POSTS_COMMENTS_REQUEST, handleGetUserPostComments),
  takeLatest(USER_EDIT_POST_RANK_REQUEST, handleEditPostRank),
  takeLatest(USER_ADD_POST_VIEW_REQUEST, handleAddPostView),
]);
