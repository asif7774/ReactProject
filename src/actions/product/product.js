import axios from 'axios'
import {
    DUMMY,
    ALL_PRODUCTS,
    SINGLE_PRODUCT_INFO,
    SINGLE_PRODUCT_SUPPLIER,
    SINGLE_PRODUCT_ACTIVITY,
    SINGLE_PRODUCT_APPLICATION,
    SINGLE_PRODUCT_RAW_MATERIALS,
    FOLLOWED_PRODUCTS,
    RECOMMENDED_PRODUCTS,
    POTENTIAL_CUSTOMERS

} from '../../config/types'
import { BASE_URL } from '../../config/config'


export const addProduct = (data) => async (dispatch) => {
    let res = await axios.post(`${BASE_URL}/api/v1/product`, data, { withCredentials: true })
    dispatch({ type: DUMMY, payload: res.data });
};

export const getAllProducts = () => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/products/all`, { withCredentials: true })
    dispatch({ type: ALL_PRODUCTS, payload: res.data });
};

export const deleteProduct = (id, cb) => async (dispatch) => {
    let res = await axios.delete(`${BASE_URL}/api/v1/product/${id}`, { withCredentials: true })
    cb();
    dispatch({ type: DUMMY, payload: res.data });
};
export const followProduct = (id, name, cb) => async (dispatch) => {
    let res = await axios.post(`${BASE_URL}/api/v1/product/follow`, { productId: id, productName: name }, { withCredentials: true })
    cb();
    dispatch({ type: DUMMY, payload: res.data });
};
export const unfollowProduct = (id, name, cb) => async (dispatch) => {
    let res = await axios.post(`${BASE_URL}/api/v1/product/unfollow`, { productId: id, productName: name }, { withCredentials: true })
    cb();
    dispatch({ type: DUMMY, payload: res.data });
};
export const addStream = (type, parentProductId, childProductId) => async (dispatch) => {
    let data = {
        type,
        parentProductId,
        childProductId
    }
    let res = await axios.post(`${BASE_URL}/api/v1/product/add/stream`, data, { withCredentials: true })
    dispatch({ type: DUMMY, payload: res.data });
};

export const addRawMaterial = (productId, productName, rawId, rawName) => async (dispatch) => {
    // let data = {
    //     type,
    //     parentProductId,
    //     childProductId
    // }
    // let res = await axios.post(`${BASE_URL}/api/v1/product/add/stream`, data, { withCredentials: true })
    // dispatch({ type: DUMMY, payload: res.data });
    alert("jooj")
};

export const getProductActivity = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/activity/${id}`, { withCredentials: true })
    dispatch({ type: SINGLE_PRODUCT_ACTIVITY, payload: res.data });
};

export const getProductInfo = (id, cb) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/${id}`, { withCredentials: true })
    // console.log(res.data);
    dispatch({ type: SINGLE_PRODUCT_INFO, payload: res.data })
};

export const getProductSupplier = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/supplier/${id}`, { withCredentials: true })
    // console.log(res.data);
    dispatch({ type: SINGLE_PRODUCT_SUPPLIER, payload: res.data });
};

export const getProductApplication = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/application/${id}`, { withCredentials: true })
    // console.log(res.data);
    dispatch({ type: SINGLE_PRODUCT_APPLICATION, payload: res.data });
};

export const getProductRawMaterial = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/rawMaterial/${id}`, { withCredentials: true })
    // console.log(res.data);
    dispatch({ type: SINGLE_PRODUCT_RAW_MATERIALS, payload: res.data });
};

export const getFollowedProducts = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/user/Products/followed`, { withCredentials: true })
    dispatch({ type: FOLLOWED_PRODUCTS, payload: res.data });
};

export const addSupplier = (id, type) => async (dispatch) => {
    let data = {
        productId: id,
        type
    }
    let res = await axios.post(`${BASE_URL}/api/v1/product/supplier`, data, { withCredentials: true })
    dispatch({ type: 'DUMMY', payload: res.data });
};

export const getRecommendedProducts = () => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/recommended/all`, { withCredentials: true })
    console.log(res.data);
    dispatch({ type: RECOMMENDED_PRODUCTS, payload: res.data });
};

export const getPotentialCustomers = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/product/potentialCustomers/${id}`, { withCredentials: true })
    console.log(res.data);
    dispatch({ type: POTENTIAL_CUSTOMERS, payload: res.data });
};
