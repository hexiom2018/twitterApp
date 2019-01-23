import Expo from "expo";
import firebase from "./Firebase";

const storageRef = firebase
  .storage()
  .ref()
  .child("postsMedia");
const postsRef = firebase
  .database()
  .ref()
  .child("posts");
const postsLikesRef = firebase
  .database()
  .ref()
  .child("posts_likes");
const postsCommentsRef = firebase
  .database()
  .ref()
  .child("posts_comments");
export async function createPost(newPost, progressCallback) {
  try {
    console.log("createPost() newPost ", newPost);
    const {
      city,
      country,
      title,
      detailsDescription,
      lat,
      lng,
      date,
      mediaPicker: { uri, type }
    } = newPost;
    const privacy = newPost.public ? "public" : "private";
    const postId = postsRef.push();
    const contentType = newPost.type;

    const metadata = {
      contentType: type
    };

    const uriArr = uri.split(".");

    const response = await fetch(uri);
    const blob = await response.blob();

    let uploadTask = storageRef
      .child(`${postId.key}.${uriArr[uriArr.length - 1]}`)
      .put(blob, metadata);
    console.log("createPost() blob loaded ", blob.length);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              progressCallback(progress, "pause");
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              progressCallback(progress, "running");
              break;
            default:
              progressCallback(progress, "finished");
              break;
          }
        },
        error => {
          console.error(error);
          reject(error);
        },
        async () => {
          try {
            const downloadURI = await uploadTask.snapshot.ref.getDownloadURL();
            console.log("post data", postId.key);

            const result = await postsRef.child(postId.key).set({
              title: title,
              mediaUrl: downloadURI,
              detailsDescription: detailsDescription,
              privacy: privacy,
              country: country,
              city: city,
              lat: lat,
              lng: lng,
              date: date,
              type: type
            });

            console.log("createPost() saved to database ");
            resolve(result);
          } catch (error) {
            console.error(error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export function subscribeToPosts(callback) {
  postsRef
    .orderByChild("privacy")
    .equalTo("public")
    .limitToLast(1)
    .on("child_added", callback);
}

export function unsbuscribeFromPosts() {
  postsRef.off();
}

export async function latestPosts() {
  try {
    return postsRef
      .orderByChild("privacy")
      .equalTo("public")
      .limitToLast(100)
      .once("value");
  } catch (error) {
    return error;
  }
}

export async function searchPostsByTitle(keyword) {
  try {
    return postsRef
      .orderByChild("title")
      .startAt(keyword)
      .endAt(`${keyword}\uf8ff`)
      .once("value");
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function getPostComments(postId) {
  try {
    const result = await postsCommentsRef
      .orderByKey()
      .equalTo(postId)
      .once("value");

    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function postsNewerThanId(lastId) {
  try {
    const result = postsRef
      .orderByKey()
      .endAt(lastId)
      .limitToLast(10)
      .once("value");
  } catch (error) {
    return error;
  }
}

export function currentPostLikesCount(postId, callback) {
  postsLikesRef
    .orderByKey()
    .equalTo(postId)
    .on("child_changed", callback);
}

export function currentPostShareCount(postId, callback) {
  postsRef
    .orderByKey()
    .equalTo(postId)
    .on("child_changed", callback);
}

export function currentPostCommentsCount(postId, callback) {
  postsCommentsRef
    .orderByKey()
    .equalTo(postId)
    .on("child_changed", callback);
}

export function currentPostCommentsLikesCountAndDislikesCount(
  postId,
  callback
) {
  postsCommentsRef
    .orderByKey()
    .equalTo(postId)
    .limitToLast(1)
    .on("child_changed", callback);
}

export function currentPostComments(postId, callback) {
  console.log("currentPostComments() params", postId);
  postsCommentsRef
    .orderByKey()
    .equalTo(postId)
    .limitToLast(1)
    .on("child_changed", callback);
}

//get data when mount postDetails
export async function getCurrentPostLikesCount(postId) {
  return postsLikesRef
    .orderByKey()
    .equalTo(postId)
    .once("value");
}

export async function getCurrentPostCommentsCount(postId) {
  return postsCommentsRef
    .orderByKey()
    .equalTo(postId)
    .once("value");
}

export function currentPostOff() {
  postsRef.off("value");
  postsLikesRef.off("value");
  postsCommentsRef.off("value");
}

export async function postsSinceId(sinceId) {
  try {
    const result = postsRef
      .orderByKey()
      .startAt(sinceId)
      .limitToLast(100)
      .once("value");
  } catch (error) {
    return error;
  }
}

export async function sharePost(postId, userId) {
  try {
    return postsRef.child(postId).transaction(post => {
      if (post) {
        if (!post.shares) {
          post.shares = [];
          post.sharesCount = 0;
        }
        if (!post.shares[userId]) {
          post.shares[userId] = true;
          post.sharesCount += 1;
        }
      }
      return post;
    });
  } catch (error) {
    return error;
  }
}

export async function likePost(postId, userId) {
  try {
    console.log("dislikepost", postId, userId);
    postsLikesRef.child(`${postId}/${userId}`).set(true);
  } catch (error) {
    return error;
  }
}
export async function dislikePost(postId, userId) {
  try {
    console.log("dislikepost", postId, userId);
    postsLikesRef.child(`${postId}/${userId}`).set(false);
  } catch (error) {
    return error;
  }
}

export async function postLikedByUser(postId, userId) {
  return postsLikesRef
    .child(`${postId}/${userId}`)
    .once("value")
    .then(snapshot => {
      console.log("postLikedByUser() ", snapshot);
      return snapshot.val();
    });
}

export async function addComment(postId, userId, comment) {
  try {
    comment.likesCount = 0;
    comment.dislikesCount = 0;
    comment.likes = [];
    comment.dislikes = [];
    const newComment = {
      comment,
      likesCount: 0,
      dislikesCount: 0,
      likes: [],
      dislikes: []
    };
    const result = await postsCommentsRef
      .child(postId)
      .push()
      .set({
        userId,
        comment,
        likesCount: 0,
        dislikesCount: 0,
        likes: [],
        date: new Date().toISOString(),
        dislikes: [],
        name:firebase.auth().currentUser.displayName || '',
        userPhoto:firebase.auth().currentUser.photoURL || ''
      });
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}
export async function addLikeToComment(postId, commentId, userId) {
  try {
    return postsCommentsRef
      .child(postId)
      .child(commentId)
      .transaction(comment => {
        if (comment) {
          if (!comment.likes) {
            comment.likes = [];
          }

          if (!comment.dislikes) {
            comment.dislikes = [];
          }

          if (!comment.likes[userId]) {
            comment.likes[userId] = true;
            comment.likesCount += 1;
          }
          if (comment.dislikes[userId]) {
            delete comment.dislikes[userId];
            comment.dislikesCount -= 1;
          }
        }
        return comment;
      });
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function addDislikeToComment(postId, commentId, userId) {
  try {
    return postsCommentsRef
      .child(postId)
      .child(commentId)
      .transaction(comment => {
        if (comment) {
          if (!comment.likes) {
            comment.likes = [];
          }
          if (!comment.dislikes) {
            comment.dislikes = [];
          }
          if (comment.likes[userId]) {
            delete comment.likes[userId];
            comment.likesCount -= 1;
          }
          if (!comment.dislikes[userId]) {
            comment.dislikes[userId] = true;
            comment.dislikesCount += 1;
          }
        }
        return comment;
      });
  } catch (error) {
    console.log(error);
    return error;
  }
}
