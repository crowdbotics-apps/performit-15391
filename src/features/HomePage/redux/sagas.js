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
  USER_ADD_COMMENT_POST_REQUEST,
  USER_ADD_COMMENT_POST_SUCCESS,
  USER_ADD_COMMENT_POST_ERROR,
  USER_SEARCH_PERFORMIT_REQUEST,
  USER_SEARCH_PERFORMIT_SUCCESS,
  USER_SEARCH_PERFORMIT_ERROR,
  CREATE_POST_REQUEST,
  CREATE_POST_SUCCESS,
  CREATE_POST_ERROR,
} from './constants';
import {request} from '../../../utils/http';
import {
  EDIT_PROFILE_ERROR,
  EDIT_PROFILE_SUCCESS,
} from '../../ProfilePage/redux/constants';

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

function sendAddPostComment(postId, comment, token) {
  return request.post(
    '/posts/add-comment/',
    {
      post_id: postId,
      comment,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

function sendSearchDashBoard(tab, term, token) {
  return request.post(
    '/searches/search-dashboard/',
    {
      tab,
      term,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
}

// function sendCreatePost(data, token) {
//   console.log('----------------------data 11111', data);
//   return request.post('/posts/create/', data, {
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Token ${token}`,
//     },
//   });
// }

function sendCreatePost(data, token) {
  console.log('----------------------data 11111', data);
  return request.post('/posts/create/', data, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

function* handleGetUserPosts(action) {
  const {tab, token, userId} = action;
  try {
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

function* handleAddPostComment(action) {
  const {postId, comment, token} = action;
  try {
    const {status, data} = yield call(
      sendAddPostComment,
      postId,
      comment,
      token,
    );

    if (status === 200) {
      yield put({
        type: USER_ADD_COMMENT_POST_SUCCESS,
      });
      yield put({
        type: USER_ADD_COMMENT_POST_SUCCESS,
        data,
        postId,
      });
      yield put({
        type: USER_ADD_COMMENT_POST_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_ADD_COMMENT_POST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_ADD_COMMENT_POST_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleSearchPerformit(action) {
  const {tab, token, term} = action;
  try {
    const {status, data} = yield call(sendSearchDashBoard, tab, term, token);

    if (status === 200) {
      yield put({
        type: USER_SEARCH_PERFORMIT_SUCCESS,
      });
      yield put({
        type: USER_SEARCH_PERFORMIT_SUCCESS,
        data,
        tab,
      });
      yield put({
        type: USER_SEARCH_PERFORMIT_ERROR,
        error: '',
      });
    } else {
      yield put({
        type: USER_SEARCH_PERFORMIT_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    yield put({
      type: USER_SEARCH_PERFORMIT_ERROR,
      error: 'Something went wrong',
    });
  }
}

function* handleCreatePost(action) {
  const {token, content, caption} = action;

  try {
    // const formData = new FormData();
    // Object.keys(content).forEach(key => {
    //   formData.append(key, content[key]);
    // });

    // formData.append('caption', caption);

    console.log('----------------------formData');
    console.log('----------------------token', token);
    const {status, data, success} = yield call(
      sendCreatePost,
      {caption: 'fkjdsjkg'},
      token,
    );

    console.log('----------------------result', data);
    console.log('----------------------status', status);

    if (status === 200) {
      yield put({
        type: CREATE_POST_ERROR,
        error: '',
      });
      if (data && data.success === false) {
        yield put({
          type: CREATE_POST_ERROR,
          error: data.message,
        });
      } else {
        yield put({
          type: CREATE_POST_SUCCESS,
        });
      }

      // you can change the navigate for navigateAndResetStack to go to a protected route
      // NavigationService.navigate('ProfilePage');
    } else {
      yield put({
        type: CREATE_POST_ERROR,
        error: 'Unknown Error',
      });
    }
  } catch (error) {
    console.log('----------------------error', error);
    yield put({
      type: CREATE_POST_ERROR,
      error: 'Not able to create post',
    });
  }
}

export default all([
  takeLatest(USER_POSTS_REQUEST, handleGetUserPosts),
  takeLatest(USER_POSTS_COMMENTS_REQUEST, handleGetUserPostComments),
  takeLatest(USER_EDIT_POST_RANK_REQUEST, handleEditPostRank),
  takeLatest(USER_ADD_POST_VIEW_REQUEST, handleAddPostView),
  takeLatest(USER_ADD_COMMENT_POST_REQUEST, handleAddPostComment),
  takeLatest(USER_SEARCH_PERFORMIT_REQUEST, handleSearchPerformit),
  takeLatest(CREATE_POST_REQUEST, handleCreatePost),
]);
