import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { navReducer } from "../navigation/HomeStackNavigator";
import { SIGN_UP_EMAIL_ACCOUNT } from "../actions/EmailSignInAction";
import {
  CREATE_POST_ACTION,
  ADD_LIKE_TO_POST,
  ADD_LIKE_TO_COMMENT,
  ADD_DISLIKE_TO_POST,
  ADD_DISLIKE_TO_COMMENT,
  ADD_COMMENT_TO_POST,
  POSTS_NEWER_THAN_ID_ACTION,
  LATEST_POSTS_ACTION,
  POSTS_SINCE_ID_ACTION,
  POST_COMMENTS_ACTION,
  CURRENT_COMMENT_LIKES_DISLIKES_COUNT,
  CURRENT_POST_COMMENT_COUNT,
  CURRENT_POST_LIKES_COUNT,
  CURRENT_POST_MOUNT,
  CURRENT_POST_SHARE_COUNT,
  CURRENT_POST_UNMOUNT,
  SEARCH_POST_BY_KEYWORD,
  CURRENT_POST_COMMENTS,
  POST_LIKED_BY_USER,
  CREATE_POST_STATE_ACTION
} from "../actions/PostsActions";
import { SIGNUP_GOOGLE_ACCOUNT } from "../actions/GoogleSignInAction";
import { SIGN_IN_FACEBOOK } from "../actions/FacebookSignInAction";
import { __values } from "../../node_modules/tslib";

function userInfo(
  state = { user: null, userId: 0, signedIn: false, isChecked: false },
  action
) {
  switch (action.type) {
    case SIGN_UP_EMAIL_ACCOUNT:
      return updateUser(state, action);
    case "NO_SIGNED_IN":
      return { signedIn: false, isChecked: true };
    case "SIGNED_IN":
      return { ...updateUser(state, action), signedIn: true, isChecked: true };
    case SIGNUP_GOOGLE_ACCOUNT:
      return updateUser(state, action);
    case SIGN_IN_FACEBOOK:
      return updateUser(state, action);
    case "LOG_OUT":
      return { user: null, userId: 0, signedIn: false, isChecked: false }
    default:
      return state;
  }
}

function updateUser(state, action) {
  if (action.error) {
    return { ...state, error: action.error };
  }
  let user = action.data.user;

  return { ...state, user: action.data.user, userId: user.uid };
}

function createPost(state = {
  postUploaded: false,
}, action) {
  switch (action.type) {
    case CREATE_POST_ACTION:
      if (action.error) {
        return { ...state, error: action.error };
      }
      return { ...state, postUploaded: action.data.uploaded, error: action.error };
    case CREATE_POST_STATE_ACTION:
      return { ...state, progress: action.data.progress, state: action.data.state }
    case 'CREATE_POST_DISMISSED':
      return {}
    default:
      return state;
  }
}

function posts(
  state = {
    comments: new Map(),
    posts: new Map(),
    postsList: [],
    latestUpdate: new Date(),
    loadPostsError: null,
    lastErrorType: "",

  },
  action
) {
  switch (action.type) {
    case ADD_LIKE_TO_POST:
      return { ...state, uploaded: action.data.uploaded, error: action.error };
    case ADD_COMMENT_TO_POST:
      return { ...state, uploaded: action.data.uploaded, error: action.error };
    case ADD_DISLIKE_TO_POST:
      return { ...state, uploaded: action.data.uploaded, error: action.error };
    case ADD_LIKE_TO_COMMENT:
      return { ...state, uploaded: action.data.uploaded, error: action.error };
    case ADD_DISLIKE_TO_COMMENT:
      return { ...state, uploaded: action.data.uploaded, error: action.error };
    case LATEST_POSTS_ACTION:
      let map = mutateMap(action.data.posts, state.posts);

      let list = state.postsList.slice(0, 0, ...action.data.posts);
      return { ...state, posts: map, comments: fillCommentsMap(map), error: action.error, postsList: list };
    case POSTS_SINCE_ID_ACTION:
      return {
        ...state,
        posts: mutateMap(action.data.posts, state.posts),
        error: action.error
      };
    case POSTS_NEWER_THAN_ID_ACTION:
      return { ...state, posts: mutateMap(action.data.posts, state.posts) };
    case POST_COMMENTS_ACTION:
      let postId = action.data.postId;
      let comments = action.data.comments;
      let updatedMap = new Map(state.comments);
      updatedMap.set(postId, comments);

      return { ...state, comments: updatedMap, postId: postId };
    case CURRENT_POST_COMMENTS:
      return {
        ...state,
        comments: mutateCommentMap(
          state.comments,
          action.data.postId,
          action.data.list
        )
      };
    default:
      return state;
  }
}


function fillCommentsMap(map) {
  let comments = new Map();
  map.forEach((__values, key) => {
    comments.set(key, []);
  })
  return comments;
}
function mutateCommentMap(previousMap, postId, list) {
  console.log('updated comments list', list)
  let updatedMap = new Map(previousMap);
  let comments = updatedMap.get(postId);
  comments = comments.splice(0, comments.length).concat(...list)

  updatedMap.set(postId, list);
  return updatedMap;
}

const tmp = {
  postId: undefined,
  post: undefined,
  postLikesCount: undefined,
  postSharesCount: undefined,
  postCommentsCount: undefined,
  comments: undefined
};
function currentPost(
  state = {
    postId: undefined,
    post: undefined,
    postLikesCount: 0,
    postSharesCount: 0,
    postLikedByUser: false
  },
  action
) {
  switch (action.type) {
    case CURRENT_POST_MOUNT:
      return {
        ...state,
        postId: action.data.postId,
        post: action.data.post,
        postSharesCount: action.data.post.sharesCount
      };
    case CURRENT_POST_UNMOUNT:
      return {};
    case CURRENT_POST_SHARE_COUNT:
      const { postSharesCount } = action.data;
      return {
        ...state,
        postSharesCount: postSharesCount,
        lastUpdateShares: action.data.lastUpdate
      };
    case CURRENT_POST_LIKES_COUNT:
      const { postLikesCount } = action.data;
      return {
        ...state,
        postLikesCount: postLikesCount,
        lastUpdateLikes: action.data.lastUpdate
      };
    case POST_LIKED_BY_USER:
      return { ...state, postLikedByUser: action.data };
    default:
      return state;
  }
}

function mutateMap(posts, postsmap) {
  let mutateMap = new Map(postsmap);
  posts.map((post, i) => {
    mutateMap.set(post.postId, post);
  });
  return mutateMap;
}

function searchPosts(
  state = {
    posts: [],
    error: undefined
  },
  action
) {
  if (action.error) {
    return { ...state, error: action.error };
  }
  switch (action.type) {
    case SEARCH_POST_BY_KEYWORD:
      return { ...state, posts: action.data.posts };
    default:
      return state;
  }
}

export default combineReducers({
  nav: navReducer,
  form: formReducer,
  userInfo: userInfo,
  createPost: createPost,
  posts,
  currentPost,
  searchPosts
});
