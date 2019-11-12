import {
    NETWORK_USER_FEED,
    NETWORK_PRODUCT_FEED,
    POST_STATUS,
    GLOBAL_USER_FEED,
    UPLOAD_PROGRESS,
    NETWORK_USER_LIKED_POSTS,
    SET_POST_COMMENTS,
    POST_LIKES_COUNT,
    ADD_POST_COMMENT_STATUS
} from '../../config/types'

export default function (state = { uploadProgress: 0, postCommentsCollection: {} }, action) {
    switch (action.type) {
        case NETWORK_USER_FEED:
            return { ...state, userFeed: action.payload }
        case NETWORK_PRODUCT_FEED:
            return { ...state, productFeed: action.payload }
        case GLOBAL_USER_FEED:
            return { ...state, globalFeed: action.payload }
        case POST_STATUS:
            return { ...state, postStatus: action.payload }
        case UPLOAD_PROGRESS:
            return { ...state, uploadProgress: action.payload }
        case NETWORK_USER_LIKED_POSTS:
            return { ...state, likedPosts: action.payload }
        case SET_POST_COMMENTS:
            const postCommentsCollection = updatePostCommentsCollection(state, action);
            return { ...state, postCommentsCollection }
        case POST_LIKES_COUNT:
            return { ...state, postLikeCount: action.payload }
        case ADD_POST_COMMENT_STATUS:
            return { ...state, addPostCommentStatus: action.payload }

        default:
            return state;
    }

}
const updatePostCommentsCollection = (state, action) => {
    //if postcomments exists then update else insert a new object
    const postCommentsCollection = { ...state.postCommentsCollection };
    const postId = action.payload.postId;
    postCommentsCollection[postId] = action.payload.comments;
    console.log("postCommentsCollection", postCommentsCollection);

    return postCommentsCollection;
}
