import { BASE_URL } from '../../config/config'
import {
    SINGLE_COMPANY_INFO
} from '../../config/types'
import axios from 'axios'

export const getCompanyInfo = (id) => async (dispatch) => {
    let res = await axios.get(`${BASE_URL}/api/v1/company/${id}`, { withCredentials: true })
    dispatch({ type: SINGLE_COMPANY_INFO, payload: res.data });
};