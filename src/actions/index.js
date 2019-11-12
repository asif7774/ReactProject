import axios from 'axios'
// import {
//     DUMMY
// } from '../config/types'
import { BASE_URL } from '../config/config'

import * as networkFeedActions from './networkFeed/networkFeed'

export * from './auth/auth'
export * from './product/product'
export * from './company/company'
export { networkFeedActions };

// export const addCompany = (data) => async (dispatch) => {
//     let res = await axios.post(`${BASE_URL}/api/v1/company`,data,{withCredentials:true})
//     dispatch({type: DUMMY, payload : res.data});       
// };

export const getUserInfo = (id, cb) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/user/${id}`, { withCredentials: true })
    if (res.data) {
        dispatch({ type: 'USERINFO', payload: res.data.Item })
    }
};

export const getUserProfileInfo = (userId) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/user/profile/byId/${userId}`, { withCredentials: true })
    dispatch({ type: "USER_PROFILE_INFO", payload: res.data.Item })

}
export const getUserProfileFeed = () => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/user/profile/feed`, { withCredentials: true })
    // console.log(res.data);
    dispatch({ type: 'PROFILE_FEED', payload: res.data })
};

export const getUserNetworkFeed = () => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/network/feed`, { withCredentials: true })
    console.log(res.data);
    dispatch({ type: 'NETWORK_FEED', payload: res.data })
};