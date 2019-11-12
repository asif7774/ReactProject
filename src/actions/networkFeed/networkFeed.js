import axios from 'axios';
import { BASE_URL } from '../../config/config';
import { POST_STATUS, NETWORK_USER_FEED, NETWORK_PRODUCT_FEED, GLOBAL_USER_FEED, UPDATE_USERINFO_COLLECTION, UPLOAD_PROGRESS, NETWORK_USER_LIKED_POSTS, SET_POST_COMMENTS, POST_LIKES_COUNT, ADD_POST_COMMENT_STATUS } from '../../config/types';
import { getUserInfo } from '../index';

export const getUserNetworkFeed = (loggedInUserId, userId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/user/${userId}`, { withCredentials: true })
    let userFeed = res.data;
    dispatch(getUserInfoFromPosts(userFeed));
    userFeed = filterPostsByPrivacy(loggedInUserId, userFeed);
    dispatch({ type: NETWORK_USER_FEED, payload: sortPosts(userFeed) })
};

export const getProductNetworkFeed = (loggedInUserId, productId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/product/${productId}`, { withCredentials: true })
    let productFeed = res.data;
    dispatch(getUserInfoFromPosts(productFeed));
    productFeed = filterPostsByPrivacy(loggedInUserId, productFeed);
    dispatch({ type: NETWORK_PRODUCT_FEED, payload: sortPosts(productFeed) })
};

export const getProductFeedUnauthenticated = (productId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/product/${productId}/latest`)
    let productFeed = res.data;
    dispatch({ type: NETWORK_PRODUCT_FEED, payload: productFeed })
};

export const getUserGlobalFeed = (userId, followedProductsIds) => async (dispatch) => {
    let promises = [];
    let productFeed;
    let followedProducts = await axios.get(`${BASE_URL}/api/v1/user/Products/followed`, { withCredentials: true })
    followedProductsIds = followedProducts.data.Items.map(item => item.product_id);

    let userNetworkFeed = await axios.get(`${BASE_URL}/api/v1/feed/user/${userId}`, { withCredentials: true })
    promises.push(userNetworkFeed);
    followedProductsIds.map(productId => {
        productFeed = axios.get(`${BASE_URL}/api/v1/feed/product/${productId}?secondary=true`, { withCredentials: true });
        promises.push(productFeed);
    })
    Promise.all(promises).then((response) => {
        let globalFeed = [];
        response.forEach(item => globalFeed.push(...item.data));
        dispatch(getUserInfoFromPosts(globalFeed));
        let filteredGlobalFeed = removeDuplicatePosts(globalFeed);
        filteredGlobalFeed = filterPostsByPrivacy(userId, filteredGlobalFeed);
        dispatch({ type: GLOBAL_USER_FEED, payload: sortPosts(filteredGlobalFeed) })
    })

};

export const createNewPost = (formData, feedType, productId) => async (dispatch) => {
    const bodyFormData = new FormData();
    let value;
    Object.keys(formData).forEach(field => {

        if (Array.isArray(formData[field])) {
            value = JSON.stringify(formData[field]);
        }
        else {
            value = formData[field];
        }
        bodyFormData.append(field, value);
    });

    dispatch(setPostStatus('creating'));

    let res = await axios.post(`${BASE_URL}/api/v1/feed/post`, bodyFormData,
        {
            headers: {
                'content-type': 'multipart/form-data'
            },
            withCredentials: true,
            onUploadProgress: function (progressEvent) {
                var percent = (progressEvent.loaded / progressEvent.total) * 100;
                dispatch(updateUploadProgress(percent));
            },
        })
    dispatch(setPostStatus('created'));
    dispatch(refreshPosts(feedType, formData.userId, productId))
};

export const removePost = (postId, feedType, userId, productId) => async (dispatch) => {
    await axios.delete(`${BASE_URL}/api/v1/feed/post/${postId}`, { withCredentials: true });
    dispatch(refreshPosts(feedType, userId, productId));
}

export const getLikedPosts = (userId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/user/${userId}/likes`, { withCredentials: true })
    dispatch({ type: NETWORK_USER_LIKED_POSTS, payload: res.data })
};

export const getPostLikes = (postId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/post/${postId}/like`, { withCredentials: true })
    dispatch({ type: POST_LIKES_COUNT, payload: { postId, count: res.data.length } })
};

export const likePost = (postId, userId) => async (dispatch) => {
    let res = await axios.put(`${BASE_URL}/api/v1/feed/post/${postId}/like`, {}, { withCredentials: true })
    dispatch(getLikedPosts(userId));
    dispatch(getPostLikes(postId));
};

export const unlikePost = (postId, userId) => async (dispatch) => {
    let res = await axios.put(`${BASE_URL}/api/v1/feed/post/${postId}/unlike`, {}, { withCredentials: true })
    dispatch(getLikedPosts(userId));
    dispatch(getPostLikes(postId));
};

export const getPostComments = (postId) => async (dispatch, getState) => {
    let res = await axios.get(`${BASE_URL}/api/v1/feed/post/${postId}/comment`, { withCredentials: true })
    if (res.data.length > 0) {
        const postId = res.data[0].parent_id;
        const payload = { postId, comments: [...res.data] }

        const { userInfoCollection } = getState().user;
        let uniqueUserIds = [...new Set(res.data.map(item => item.user_id))];
        uniqueUserIds = uniqueUserIds.filter(userId => !userInfoCollection.find(item => item.id === userId));

        let promises = []
        let userInfo;
        uniqueUserIds.map(userId => {
            userInfo = dispatch(getUserInfo(userId));
            promises.push(userInfo);
        })
        Promise.all(promises).then(() => {
            dispatch({ type: SET_POST_COMMENTS, payload })
        })
    }
};

export const addPostComment = (postId, text) => async (dispatch) => {
    dispatch(setAddPostCommentStatus("creating"));
    let res = await axios.post(`${BASE_URL}/api/v1/feed/post/${postId}/comment`, { text }, { withCredentials: true })
    dispatch(setAddPostCommentStatus("created"));
    dispatch(getPostComments(postId));
};

export const deletePostComment = (postId, commentId) => async (dispatch) => {
    let res = await axios.delete(`${BASE_URL}/api/v1/feed/post/${postId}/comment/${commentId}`, { withCredentials: true })
    dispatch({ type: NETWORK_USER_FEED, payload: res.data });
};

const sortPosts = (posts) => {
    return posts.sort((a, b) => { return (new Date(a.added) > new Date(b.added) ? -1 : 1) })
}

const removeDuplicatePosts = (feed) => {
    let filteredFeed = [];
    feed.forEach(item => { if (!filteredFeed.find(x => x.id === item.id)) { filteredFeed.push(item) } })
    return filteredFeed;
}

const filterPostsByPrivacy = (loggedInUserId, feed) => {
    return feed.filter(post => post.visibility === "public" || post.user_id === loggedInUserId)
}

const getUserInfoFromPosts = (data) => async (dispatch) => {
    let uniqueUserIds = [...new Set(data.map(item => item.user_id))];
    let promises = []
    let userInfo;
    uniqueUserIds.map(userId => {
        userInfo = axios.get(`${BASE_URL}/api/v1/user/${userId}`, { withCredentials: true })
        promises.push(userInfo);
    })
    Promise.all(promises).then((response) => {
        let userInfoCollection = [];
        response.forEach(item => {
            if (item.data.Item) {
                userInfoCollection.push(item.data.Item)
            }
        });
        dispatch({ type: UPDATE_USERINFO_COLLECTION, payload: userInfoCollection })
    })
}

export const setPostStatus = (status) => {
    return {
        type: POST_STATUS,
        payload: status
    }
}

const setAddPostCommentStatus = (status) => {
    return {
        type: ADD_POST_COMMENT_STATUS,
        payload: status
    }
}

const refreshPosts = (feedType, userId, productId) => async (dispatch) => {
    switch (feedType) {
        case "user":
            dispatch(getUserNetworkFeed(userId, userId));
            break;
        case "product":
            dispatch(getProductNetworkFeed(userId, productId));
            break;
        case "global":
            dispatch(getUserGlobalFeed(userId));
            break;
        default:
            break;
    }
}

const updateUploadProgress = (percent) => {
    return {
        type: UPLOAD_PROGRESS,
        payload: percent
    }
}
