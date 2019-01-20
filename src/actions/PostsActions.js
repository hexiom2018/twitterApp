import {
  createPost,
  likePost,
  dislikePost,
  addComment,
  latestPosts,
  postsSinceId,
  sharePost,
  addDislikeToComment,
  addLikeToComment,
  getPostComments,
  postsNewerThanId,
  currentPostComments,
  currentPostCommentsCount,
  currentPostCommentsLikesCountAndDislikesCount,
  currentPostLikesCount,
  currentPostOff,
  getCurrentPostCommentsCount,
  getCurrentPostLikesCount,
  searchPostsByTitle,
  subscribeToPosts,
  unsbuscribeFromPosts,
  currentPostShareCount,
  postLikedByUser
} from "../api/PostsService";
import Post from "../model/Post";

export const CREATE_POST_ACTION = "CREATE_POST_ACTION";
export const ADD_COMMENT_TO_POST = "ADD_COMMENT_TO_POST";
export const ADD_LIKE_TO_POST = "ADD_LIKE_TO_POST";
export const ADD_DISLIKE_TO_POST = "ADD_UNLIKE_TO_POST";
export const ADD_LIKE_TO_COMMENT = "ADD_LIKE_TO_COMMENT";
export const ADD_DISLIKE_TO_COMMENT = "ADD_UNLIKE_TO_COMMENT";

export const LATEST_POSTS_ACTION = "LATEST_POSTS_ACTION";
export const POSTS_SINCE_ID_ACTION = "POSTS_SINCE_ID_ACTION";
export const POSTS_NEWER_THAN_ID_ACTION = "POSTS_NEWER_THAN_ID_ACTION";
export const POST_COMMENTS_ACTION = "POST_COMMENTS_ACTION";

export const CURRENT_POST_MOUNT = "CURRENT_POST_MOUNT";
export const CURRENT_POST_UNMOUNT = "CURRENT_POST_UNMOUNT";
export const CURRENT_POST_SHARE_COUNT = "CURRENT_POST_SHARE_COUNT";
export const CURRENT_POST_COMMENT_COUNT = "CURRENT_POST_COMMENT_COUNT";
export const CURRENT_POST_LIKES_COUNT = "CURRENT_POST_LIKES_COUNT";
export const CREATE_POST_STATE_ACTION = 'CREATE_POST_STATE_ACTION';

export const CURRENT_COMMENT_LIKES_DISLIKES_COUNT =
  "CURRENT_COMMENT_LIKES_COUNT";
export const CURRENT_POST_COMMENTS = "CURRENT_POST_COMMENTS";

export const SEARCH_POST_BY_KEYWORD = "SEARCH_POST_BY_KEYWORD";

export const POST_LIKED_BY_USER = "POST_LIKED_BY_USER";

export async function createPostAction(newPost, dispatch) {
  const TIMEOUTID = setTimeout(async () => {
    try {
     
      const result = await createPost(newPost,(progress,state)=>{
        dispatch({ type: CREATE_POST_STATE_ACTION, data: { progress,state } });   
      });
      console.log('createPost() result ',result);
      dispatch({ type: CREATE_POST_ACTION, data: { uploaded: true } });
    } catch (error) {
      console.log('createPost() result error ',error);
      console.error(error);
      dispatch({ type: CREATE_POST_ACTION, error: error.message });
    } finally {
      clearTimeout(TIMEOUTID);
    }
  }, 0);
}

function createPostFromSnapShot(snapshot) {
  let values = snapshot.val();
  console.log('post values',values)
  return new Post(
    snapshot.key,
    values.mediaUrl,
    values.title,
    values.detailsDescription,
    values.privacy,
    values.country,
    values.city,
    values.lat,
    values.lng,
    values.date,
    values.sharesCount,
    values.type,
  );
}

export function loadPostsAction() {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        let list = [];
        const result = await latestPosts();

        result.forEach(childSnap => {
          let values = childSnap.val();
          list.push(createPostFromSnapShot(childSnap));
        });
        dispatch({ type: LATEST_POSTS_ACTION, data: { posts: list } });
      } catch (error) {
        console.error(error);
        dispatch({ type: LATEST_POSTS_ACTION, error: error.message });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function subscribeToPostsAction() {
  return dispatch => {
    setTimeout(() => {
      subscribeToPosts(snapshot => {
        let list = [];
        console.log(' subscribeToPosts() snapshot',snapshot)
        list.push(createPostFromSnapShot(snapshot));

        dispatch({ type: LATEST_POSTS_ACTION, data: { posts: list } });
      });
    }, 0);
  };
}

export function unsbuscribeFromPostsAction() {
  return dispatch => {
    setTimeout(() => {
      unsbuscribeFromPosts();
    }, 0);
  };
}

export function sharePostAction(postId, userId) {
  return dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await sharePost(postId, userId);
      } catch (error) {
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function searchPostsByTitleAction(keyword) {
  return dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        let list = [];

        const result = await searchPostsByTitle(keyword);

        result.forEach(childSnap => {
          list.push(createPostFromSnapShot(childSnap));
        });

        dispatch({ type: SEARCH_POST_BY_KEYWORD, data: { posts: list } });
      } catch (error) {
        console.error(error);
        dispatch({ type: SEARCH_POST_BY_KEYWORD, error: error.message });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function postsSinceIdAction(postId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        let list = [];
        const result = await postsSinceId(postId);
        result.forEach(childSnap => {
          list.push(createPostFromSnapShot(childSnap));
        });
        dispatch({ type: POSTS_SINCE_ID_ACTION, data: { posts: list } });
      } catch (error) {
        console.log(error);
        dispatch({});
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function postsNewerThanIdAction(postId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        let list = [];
        const result = await postsNewerThanId(postId);
        result.forEach(childSnap => {
          list.push(createPostFromSnapShot(childSnap));
        });
        dispatch({ type: POSTS_NEWER_THAN_ID_ACTION, data: { posts: list } });
      } catch (error) {
        console.log(error);
        dispatch({ type: POSTS_NEWER_THAN_ID_ACTION });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function getPostCommentsAction(postId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        let list = [];
        const result = await getPostComments(postId);

        result.forEach(childSnap => {
          childSnap.forEach(snap => {
            let values = snap.val();
            list.push({
              commentId: snap.key,
              userId: values.userId,
              comment: values.comment,
              likesCount: values.likesCount,
              dislikesCount: values.dislikesCount,
              date:values.date,
              name:values.name,
              userPhoto: values.userPhoto, 
            });
          });
        });

        dispatch({
          type: POST_COMMENTS_ACTION,
          data: { comments: list, postId: postId }
        });
      } catch (error) {
        console.error(error);
        dispatch({ type: POST_COMMENTS_ACTION, error: error.message });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function likePostAction(postId, userId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await likePost(postId, userId);
        dispatch({
          type: ADD_LIKE_TO_POST,
          data: { postId, userId, like: true }
        });
      } catch (error) {
        dispatch({
          type: ADD_LIKE_TO_POST,
          data: { postId, userId },
          error: error.message
        });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function dislikePostAction(postId, userId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
        const result = await dislikePost(postId, userId);
        dispatch({
          type: ADD_DISLIKE_TO_POST,
          data: { postId, userId, like: true }
        });
      } catch (error) {
        dispatch({
          type: ADD_DISLIKE_TO_POST,
          data: { postId, userId },
          error: error.message
        });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function addCommentAction(postId, userId, comment) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
      
        const result = await addComment(postId, userId, comment);
        dispatch({ type: ADD_COMMENT_TO_POST, data: { postId, userId } });
      } catch (error) {
        console.error(error);
        dispatch({
          type: ADD_COMMENT_TO_POST,
          data: { postId, userId },
          error: error.message
        });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function likeCommentAction(postId, commentId, userId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
       
        const result = await addLikeToComment(postId, commentId, userId);
        dispatch({
          type: ADD_LIKE_TO_COMMENT,
          data: { postId, userId, like: true }
        });
      } catch (error) {
        dispatch({
          type: ADD_LIKE_TO_COMMENT,
          data: { postId, userId },
          error: error.message
        });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function dislikeCommentAction(postId, commentId, userId) {
  return async dispatch => {
    const TIMEOUTID = setTimeout(async () => {
      try {
       
        const result = await addDislikeToComment(postId, commentId, userId);
        dispatch({
          type: ADD_DISLIKE_TO_COMMENT,
          data: { postId, userId, like: true }
        });
      } catch (error) {
        dispatch({
          type: ADD_DISLIKE_TO_COMMENT,
          data: { postId, userId },
          error: error.message
        });
      } finally {
        clearTimeout(TIMEOUTID);
      }
    }, 0);
  };
}

export function mountCurrentPost(post, postId,userId) {
  return dispatch => {
    dispatch({ type: CURRENT_POST_MOUNT, data: { post, postId } });
    getCurrentPostCommentsCountAction(postId, dispatch);
    getCurrentPostLikesCountAction(postId, dispatch);
    currentPostCommentsAction(dispatch, postId);
    currentPostLikesCountAction(dispatch, postId);
    currentPostShareCountAction(dispatch, postId);
    postLikedByUserAction(postId,userId,dispatch)
  };
}
export function unmountCurrentPost() {
  return dispatch => {
    currentPostOff();
    dispatch({ type: CURRENT_POST_UNMOUNT });
  };
}

function currentPostCommentsAction(dispatch, postId) {
  setTimeout(() => {
    currentPostComments(postId, (childSnapshot, prevChildKey) => {
      
      let list =[]

      childSnapshot.forEach(snap => {
        
          let values = snap.val();
          list.push({
            commentId: snap.key,
            userId: values.userId,
            comment: values.comment,
            likesCount: values.likesCount,
            dislikesCount: values.dislikesCount,
            date:values.date,
            name:values.name,
            userPhoto: values.userPhoto,
          });
        
      });

      
      
      dispatch({ type: CURRENT_POST_COMMENTS, data: { list, postId } });
    });
  }, 0);
}

export function currentPostShareCountAction(dispatch, postId) {
  setTimeout(() => {
    currentPostShareCount(postId, (childSnapshot, prevChildKey) => {
   

      dispatch({
        type: CURRENT_POST_SHARE_COUNT,
        data: {
          postSharesCount: childSnapshot.val().sharesCount,
          lastUpdate: Date()
        }
      });
    });
  }, 0);
}

function currentPostLikesCountAction(dispatch, postId) {
  setTimeout(() => {
    currentPostLikesCount(postId, (childSnapshot, prevChildKey) => {
      
      dispatch({
        type: CURRENT_POST_LIKES_COUNT,
        data: {
          postLikesCount: childSnapshot.numChildren(),
          lastUpdate: Date()
        }
      });
    });
  }, 0);
}

export async function getCurrentPostLikesCountAction(postId, dispatch) {
  const TIMEOUTID = setTimeout(async () => {
    try {
      const result = await getCurrentPostLikesCount(postId);
      dispatch({
        type: CURRENT_POST_LIKES_COUNT,
        data: { postLikesCount: result.numChildren(), lastUpdate: Date() }
      });
    } catch (error) {
      console.log(error);
    } finally {
      clearTimeout(TIMEOUTID);
    }
  }, 0);
}

export async function getCurrentPostCommentsCountAction(postId, dispatch) {
  const TIMEOUTID = setTimeout(async () => {
    try {
      const result = await getCurrentPostCommentsCount(postId);

      dispatch({
        type: CURRENT_POST_COMMENT_COUNT,
        data: { postCommentsCount: result.numChildren(), lastUpdate: Date() }
      });
    } catch (error) {
      console.log(error);
    } finally {
      clearTimeout(TIMEOUTID);
    }
  }, 0);
}

 function postLikedByUserAction(postId,userId,dispatch){
setTimeout(async ()=>{
  try {
    const result =   await postLikedByUser(postId,userId)
    dispatch({type:POST_LIKED_BY_USER,data:result||false})   
  } catch (error) {
    
  }
  
},0)
}









